"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function signIn(email: string, password: string) {
  const supabase = await createServerClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    // Enforce email verification
    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut()
      return { 
        error: "Please verify your email first! We sent you a confirmation link.",
        code: "EMAIL_NOT_VERIFIED"
      }
    }

    // Log successful login
    if (data.user) {
      console.log(`[v0] User ${data.user.email} logged in successfully`)
      
      // Update last login time
      await supabase
        .from("users")
        .update({ 
          last_login: new Date().toISOString(),
          login_count: supabase.rpc('increment', { row_id: data.user.id })
        })
        .eq("email", data.user.email)
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const password2 = formData.get("password2")
  const deviceFingerprint = formData.get("deviceFingerprint")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }
  if (!password2 || password.toString() !== password2.toString()) {
    return { error: "Passwords do not match" }
  }

  const supabase = await createServerClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  try {
    // Check if user already exists in Supabase Auth
    const { data: existingAuthUser } = await supabase.auth.admin.listUsers()
    const userExists = existingAuthUser.users.some((user: any) => user.email === email.toString())
    
    if (userExists) {
      return { error: "Email already registered", code: "EMAIL_EXISTS" as any }
    }

    // Build redirect URL
    const headersList = await headers()
    const siteUrlCookie = headersList.get("cookie")?.match(/(?:^|;\s*)SITE_URL=([^;]+)/)?.[1]
    const decodedSiteUrl = siteUrlCookie ? decodeURIComponent(siteUrlCookie) : undefined
    
    // Get admin setting for site_url as fallback
    let adminSiteUrl = ""
    try {
      const { data: settings } = await supabase.from("admin_settings").select("setting_key, setting_value")
      const map = (settings || []).reduce((acc: Record<string, string>, s: any) => {
        acc[s.setting_key] = s.setting_value
        return acc
      }, {} as Record<string, string>)
      adminSiteUrl = map["site_url"] || ""
    } catch (e) {
      console.warn("[v0] Failed to get admin site_url setting:", e)
    }
    
    const redirectBase = decodedSiteUrl || adminSiteUrl || "http://localhost:3000"

    // Create user in Supabase Auth with enhanced options
    const { error: signUpError, data } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo: `${redirectBase}/auth/callback`,
        data: {
          email: email.toString(),
          registration_source: "web",
          device_fingerprint: deviceFingerprint?.toString() || null,
        }
      },
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    // Create user record in our users table
    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert({
        email: data.user.email,
        supabase_id: data.user.id,
        device_fingerprint: deviceFingerprint?.toString() || null,
        registration_ip: "127.0.0.1", // Simplified for now
        last_ip: "127.0.0.1",
        is_admin: email.toString() === "ysnyuki2321@outlook.jp", // Dev admin default
        auth_provider: "email",
        is_verified: false,
        subscription_type: "free",
        storage_used: 0,
        storage_limit: 2 * 1024 * 1024 * 1024, // 2GB in bytes
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verification_sent_at: new Date().toISOString(),
        verification_attempts: 0
      })

      if (insertError) {
        console.error("[v0] Failed to insert user record:", insertError)
        // Don't fail the registration if user table insert fails
      }

      console.log(`[v0] User ${data.user.email} registered successfully`)
    }

    // Optional auto-verify for testing if enabled in admin settings
    try {
      const { data: settings } = await supabase.from("admin_settings").select("setting_key, setting_value")
      const map = (settings || []).reduce((acc: Record<string, string>, s: any) => {
        acc[s.setting_key] = s.setting_value
        return acc
      }, {} as Record<string, string>)
      if (map["auth_auto_verify"] === "true" && data.user?.email) {
        await supabase.from("users").update({ 
          is_verified: true, 
          supabase_id: data.user.id 
        }).eq("email", data.user.email)
      }
    } catch (e) {
      console.warn("[v0] Failed to auto-verify user:", e)
    }

    return { 
      success: "Check your email to confirm your account. If you don't see it, check your spam folder.",
      userId: data.user?.id 
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function resendVerificationEmail(email: string) {
  const supabase = await createServerClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  try {
    // Check if user exists and is not verified
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("is_verified, verification_attempts, email_verification_sent_at")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      return { error: "User not found" }
    }

    if (userData.is_verified) {
      return { error: "Email is already verified" }
    }

    // Rate limiting: max 3 attempts per hour
    const lastSent = userData.email_verification_sent_at ? new Date(userData.email_verification_sent_at) : null
    const now = new Date()
    const hoursSinceLastSent = lastSent ? (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60) : 24

    if (hoursSinceLastSent < 1 && userData.verification_attempts >= 3) {
      return { error: "Too many verification attempts. Please wait 1 hour before trying again." }
    }

    // Resend verification email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      return { error: error.message }
    }

    // Update verification attempts
    await supabase
      .from("users")
      .update({
        email_verification_sent_at: new Date().toISOString(),
        verification_attempts: userData.verification_attempts + 1
      })
      .eq("email", email)

    return { 
      success: "Verification email sent! Please check your inbox and spam folder." 
    }
  } catch (error) {
    console.error("Resend verification error:", error)
    return { error: "Failed to send verification email. Please try again." }
  }
}

export async function forgotPassword(email: string) {
  const supabase = await createServerClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  try {
    // Check if user exists
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email, password_reset_attempts, password_reset_sent_at")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      // Don't reveal if user exists or not for security
      return { success: "If an account with this email exists, you will receive a password reset link." }
    }

    // Rate limiting: max 3 attempts per hour
    const lastSent = userData.password_reset_sent_at ? new Date(userData.password_reset_sent_at) : null
    const now = new Date()
    const hoursSinceLastSent = lastSent ? (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60) : 24

    if (hoursSinceLastSent < 1 && userData.password_reset_attempts >= 3) {
      return { error: "Too many password reset attempts. Please wait 1 hour before trying again." }
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    })

    if (error) {
      return { error: error.message }
    }

    // Update reset attempts
    await supabase
      .from("users")
      .update({
        password_reset_sent_at: new Date().toISOString(),
        password_reset_attempts: (userData.password_reset_attempts || 0) + 1
      })
      .eq("email", email)

    return { 
      success: "Password reset email sent! Please check your inbox and spam folder." 
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    return { error: "Failed to send password reset email. Please try again." }
  }
}

export async function signOut() {
  const supabase = await createServerClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  redirect("/auth/login")
}

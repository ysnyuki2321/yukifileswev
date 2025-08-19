"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkAntiClone, logUserActivity, checkRateLimit, logRateLimitAttempt } from "@/lib/services/anti-clone"
import { headers } from "next/headers"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const deviceFingerprint = formData.get("deviceFingerprint")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  try {
    // No duplicate email check on login. We allow users with existing accounts to sign in.

    const headersList = headers()
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "127.0.0.1"
    const userAgent = headersList.get("user-agent") || ""

    // Rate limit login attempts per IP: 10 per hour
    const rate = await checkRateLimit({ ip, email: email.toString() }, "login", 10, 60 * 60)
    if (!rate.allowed) {
      return { error: `Too many login attempts. Try again in ${Math.ceil(rate.resetSeconds / 60)} minutes.` }
    }

    // Parse device fingerprint if provided
    let fingerprintObj = null
    if (deviceFingerprint) {
      try {
        fingerprintObj = JSON.parse(deviceFingerprint.toString())
      } catch (e) {
        console.log("[v0] Failed to parse device fingerprint")
      }
    }

    // Anti-clone check for login
    if (fingerprintObj) {
      const antiCloneResult = await checkAntiClone(email.toString(), fingerprintObj, "login")

      if (!antiCloneResult.allowed) {
        console.log(`[v0] Login blocked for ${email}: ${antiCloneResult.reason}`)
        return { error: `Access denied: ${antiCloneResult.reason}` }
      }
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Enforce email verification
    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut()
      return { error: "Please verify your email first! We sent you a confirmation link." }
    }

    // Log attempt regardless of success to enforce RL
    await logRateLimitAttempt(ip, userAgent, deviceFingerprint?.toString() || null, "login")

    // Log successful login
    if (data.user) {
      const { data: userData } = await supabase.from("users").select("id").eq("email", data.user.email).single()
      if (userData) {
        await logUserActivity(userData.id, "login", { fingerprint: fingerprintObj })
      }
      console.log(`[v0] User ${data.user.email} logged in successfully`)
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

  const supabase = createServerClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  try {
    const headersList = headers()
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "127.0.0.1"
    const userAgent = headersList.get("user-agent") || ""

    // Rate limit registration attempts per IP: 10 per hour
    const rate = await checkRateLimit({ ip, email: email.toString() }, "register", 10, 60 * 60)
    if (!rate.allowed) {
      return { error: `Too many registrations from your IP. Try again in ${Math.ceil(rate.resetSeconds / 60)} minutes.` }
    }

    // Parse device fingerprint
    let fingerprintObj = null
    if (deviceFingerprint) {
      try {
        fingerprintObj = JSON.parse(deviceFingerprint.toString())
      } catch (e) {
        console.log("[v0] Failed to parse device fingerprint")
      }
    }

    // Anti-clone check for registration
    if (fingerprintObj) {
      const antiCloneResult = await checkAntiClone(email.toString(), fingerprintObj, "register")

      if (!antiCloneResult.allowed) {
        console.log(`[v0] Registration blocked for ${email}: ${antiCloneResult.reason}`)
        return {
          error: `Registration denied: ${antiCloneResult.reason}. Please contact support if you believe this is an error.`,
        }
      }
    }

    // Prevent duplicate email in our users table for clearer UX code
    const { data: existing } = await supabase.from("users").select("id").eq("email", email.toString()).maybeSingle()
    if (existing) {
      return { error: "Email already registered", code: "EMAIL_EXISTS" as any }
    }

    // Build redirect URL: prefer admin setting if available via cookie set by middleware
    const siteUrlCookie = headersList.get("cookie")?.match(/(?:^|;\s*)SITE_URL=([^;]+)/)?.[1]
    const decodedSiteUrl = siteUrlCookie ? decodeURIComponent(siteUrlCookie) : undefined
    const redirectBase = decodedSiteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const { error, data } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo: `${redirectBase}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Create user record with anti-clone data
    if (data.user) {
      await supabase.from("users").insert({
        email: data.user.email,
        device_fingerprint: deviceFingerprint?.toString(),
        registration_ip: ip,
        last_ip: ip,
        is_admin: email.toString() === "ysnyuki2321@outlook.jp", // Dev admin default
        auth_provider: "email",
        is_verified: false,
      })

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
        await supabase.from("users").update({ is_verified: true, supabase_id: data.user.id }).eq("email", data.user.email)
      }
    } catch {}

    // Log attempt for rate limiting window
    await logRateLimitAttempt(ip, userAgent, deviceFingerprint?.toString() || null, "register")

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = createServerClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  redirect("/auth/login")
}

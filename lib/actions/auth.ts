"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkAntiClone, logUserActivity } from "@/lib/services/anti-clone"
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
  const deviceFingerprint = formData.get("deviceFingerprint")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  try {
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

    const { error, data } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Create user record with anti-clone data
    if (data.user) {
      const headersList = headers()
      const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "127.0.0.1"

      await supabase.from("users").insert({
        email: data.user.email,
        device_fingerprint: deviceFingerprint?.toString(),
        registration_ip: ip,
        last_ip: ip,
        is_admin: email.toString() === "ysnyuki2321@outlook.jp", // Set admin for default user
      })

      console.log(`[v0] User ${data.user.email} registered successfully`)
    }

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

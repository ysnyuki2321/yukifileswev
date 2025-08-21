import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getAdminSettings, readSetting } from "@/lib/services/settings"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.redirect(`${origin}/auth/login?error=Database connection failed`)
    }

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${origin}/auth/login?error=Authentication failed`)
      }
    } catch (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(`${origin}/auth/login?error=Authentication failed`)
    }
  }

  // Get user info
  const supabase = await createServerClient()
  if (!supabase) {
    return NextResponse.redirect(`${origin}/auth/login?error=Database connection failed`)
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.redirect(`${origin}/auth/login?error=User not found`)
  }

  // Check if user exists in database
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single()

  if (!existingUser) {
    // Create new user
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subscription_type: "free",
      subscription_expires_at: null,
      quota_used: 0,
      quota_limit: 1024 * 1024 * 1024, // 1GB
      password_hash: null,
      is_admin: false,
      is_active: true,
    })

    if (insertError) {
      console.error("Error creating user:", insertError)
      return NextResponse.redirect(`${origin}/auth/login?error=Failed to create user`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}


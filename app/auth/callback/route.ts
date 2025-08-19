import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// Handles Supabase email confirmation / magic link callback
// Updates our `users` table with verification status and Supabase user id
export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.redirect(new URL("/auth/login?error=supabase_not_configured", request.url))
  }

  // Exchange the auth code for a session if present
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const tokenHash = url.searchParams.get("token_hash")
  const type = url.searchParams.get("type")

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url))
      }
    }

    // Get the current user after session exchange
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser()

    if (getUserError || !user) {
      return NextResponse.redirect(new URL("/auth/login?error=cannot_get_user", request.url))
    }

    // Mark as verified in our own users table and sync identifiers
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "127.0.0.1"

    await supabase
      .from("users")
      .update({
        is_active: true,
        // new columns added via migration 02
        is_verified: true,
        supabase_id: user.id,
        auth_provider: user.app_metadata?.provider || (type ?? "email"),
        last_ip: ip,
      })
      .eq("email", user.email)

    // After verification, send user to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (e) {
    return NextResponse.redirect(new URL("/auth/login?error=verification_failed", request.url))
  }
}


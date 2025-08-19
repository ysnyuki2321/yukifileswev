import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const supabase = createServerClient()
  if (!supabase) {
    redirect("/auth/login")
  }

  // Check debug mode first - if enabled, return mock admin data
  try {
    const { data: settings } = await supabase.from("admin_settings").select("setting_key, setting_value")
    const map = (settings || []).reduce((acc: Record<string, string>, s: any) => {
      acc[s.setting_key] = s.setting_value
      return acc
    }, {} as Record<string, string>)
    
    if (map["debug_mode"] === "true") {
      console.log("[v0] Debug mode enabled - bypassing admin check")
      return {
        user: { email: "debug@example.com", id: "debug-user-id" },
        userData: {
          id: "debug-user-id",
          email: "debug@example.com",
          is_admin: true,
          is_verified: true,
          is_active: true
        }
      }
    }
  } catch (e) {
    console.warn("[v0] Failed to check debug mode in admin middleware:", e)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

  if (!userData || !userData.is_admin) {
    redirect("/dashboard")
  }

  return { user, userData }
}

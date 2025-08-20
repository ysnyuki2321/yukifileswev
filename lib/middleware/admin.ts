import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { isDebugModeEnabled, getDebugUser } from "@/lib/services/debug-user"

export async function requireAdmin() {
  const supabase = createServerClient()
  if (!supabase) {
    redirect("/auth/login")
  }

  // Check debug mode first - if enabled, return debug admin data
  const debugMode = await isDebugModeEnabled()
  if (debugMode) {
    console.log("[v0] Debug mode enabled - bypassing admin check")
    const debugUser = getDebugUser()
    return {
      user: { email: debugUser.email, id: debugUser.id },
      userData: debugUser
    }
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

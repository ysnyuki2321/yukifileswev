import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { isDebugModeEnabled, getMockUserData } from "@/lib/services/debug-context"

export async function requireAdmin() {
  const supabase = createServerClient()

  // Check debug mode first
  const debugMode = await isDebugModeEnabled()
  
  if (debugMode) {
    console.log("[v0] Debug mode enabled - bypassing admin checks")
    return {
      userData: getMockUserData(),
      isAdmin: true
    }
  }

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single()

  if (!userData?.is_admin) {
    redirect("/dashboard")
  }

  return { userData, isAdmin: true }
}

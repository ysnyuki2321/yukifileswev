import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const supabase = createServerClient()
  if (!supabase) {
    redirect("/auth/login")
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

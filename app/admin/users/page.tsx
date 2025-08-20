import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import UsersManagement from "@/components/admin/users-management"
import { isDebugModeEnabled } from "@/lib/services/debug-context"

export default async function AdminUsersPage() {
  const supabase = await createServerClient()
  
  // Check debug mode first
  const debugMode = await isDebugModeEnabled()
  
  if (!debugMode && !supabase) {
    redirect("/auth/login")
  }

  let users: any[] = []
  
  if (debugMode) {
    // Mock users for debug mode
    users = [
      {
        id: "debug-user-1",
        email: "debug@yukifiles.com",
        subscription_type: "paid",
        is_admin: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        storage_used: 1024 * 1024 * 500, // 500MB
        storage_limit: 1024 * 1024 * 1024 * 5 // 5GB
      }
    ]
  } else {
    // Get users from database
    const { data: usersData } = await supabase!.from("users").select("*").order("created_at", { ascending: false })
    users = usersData || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <UsersManagement users={users} />
      </div>
    </div>
  )
}

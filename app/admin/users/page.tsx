import { requireAdmin } from "@/lib/middleware/admin"
import { createServerClient } from "@/lib/supabase/server"
import AdminLayout from "@/components/admin/admin-layout"
import UsersManagement from "@/components/admin/users-management"

export default async function AdminUsersPage() {
  const { userData } = await requireAdmin()
  const supabase = createServerClient()!

  // Get all users with pagination
  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false }).limit(50)

  return (
    <AdminLayout userData={userData}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Manage user accounts and subscriptions</p>
        </div>

        <UsersManagement users={users || []} />
      </div>
    </AdminLayout>
  )
}

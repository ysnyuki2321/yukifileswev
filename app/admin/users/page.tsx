import { requireAdmin } from "@/lib/middleware/admin"
import { createServerClient } from "@/lib/supabase/server"
import AdminLayout from "@/components/admin/admin-layout"
import UsersManagement from "@/components/admin/users-management"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const { userData } = await requireAdmin()
  const supabase = await createServerClient()

  return (
    <AdminLayout userData={userData}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Manage user accounts and subscriptions</p>
        </div>
        <UsersManagement />
      </div>
    </AdminLayout>
  )
}

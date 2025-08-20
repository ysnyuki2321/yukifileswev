import { requireAdmin } from "@/lib/middleware/admin"
import { createServerClient } from "@/lib/supabase/server"
import AdminLayout from "@/components/admin/admin-layout"
import AdminSettings from "@/components/admin/admin-settings"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const { userData } = await requireAdmin()
  const supabase = await createServerClient()

  return (
    <AdminLayout userData={userData}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          <p className="text-gray-400">Configure system-wide settings</p>
        </div>
        <AdminSettings />
      </div>
    </AdminLayout>
  )
}

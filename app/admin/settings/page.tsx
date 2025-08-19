import { requireAdmin } from "@/lib/middleware/admin"
import { createServerClient } from "@/lib/supabase/server"
import AdminLayout from "@/components/admin/admin-layout"
import AdminSettings from "@/components/admin/admin-settings"

export default async function AdminSettingsPage() {
  const { userData } = await requireAdmin()
  const supabase = createServerClient()!

  // Get current settings
  const { data: settings } = await supabase.from("admin_settings").select("*")

  const settingsMap =
    settings?.reduce(
      (acc, setting) => {
        acc[setting.setting_key] = setting.setting_value
        return acc
      },
      {} as Record<string, string>,
    ) || {}

  return (
    <AdminLayout userData={userData}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
          <p className="text-gray-400">Configure payment methods and system parameters</p>
        </div>

        <AdminSettings settings={settingsMap} />
      </div>
    </AdminLayout>
  )
}

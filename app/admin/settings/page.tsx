import { createServerClient } from "@/lib/supabase/server"
import AdminSettings from "@/components/admin/admin-settings"
import { isDebugModeEnabled } from "@/lib/services/debug-context"
import { requireAdmin } from "@/lib/middleware/admin"

// Helper function to get the current site URL
function getCurrentSiteUrl(): string {
  // Try to get from environment variable first
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // Try to get from Vercel URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Fallback to localhost for development
  return "http://localhost:3000"
}

export default async function AdminSettingsPage() {
  // Enforce admin access
  await requireAdmin()
  const supabase = await createServerClient()

  let settings: Record<string, string> = {}
  
  if (await isDebugModeEnabled()) {
    // Mock settings for debug mode
    settings = {
      brand_name: "YukiFiles",
      debug_mode: "true",
      auth_auto_verify: "false",
      site_url: getCurrentSiteUrl()
    }
  } else {
    // Get settings from database
    const { data: adminSettings } = await supabase!.from("admin_settings").select("setting_key, setting_value")
    settings = (adminSettings || []).reduce((acc: Record<string, string>, s: any) => {
      acc[s.setting_key] = s.setting_value
      return acc
    }, {} as Record<string, string>)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <AdminSettings settings={settings} />
      </div>
    </div>
  )
}

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminSettings from "@/components/admin/admin-settings"
import { isDebugModeEnabled } from "@/lib/services/debug-context"

export default async function AdminSettingsPage() {
  const supabase = await createServerClient()
  
  // Check debug mode first
  const debugMode = await isDebugModeEnabled()
  
  if (!debugMode && !supabase) {
    redirect("/auth/login")
  }

  let settings: Record<string, string> = {}
  
  if (debugMode) {
    // Mock settings for debug mode
    settings = {
      brand_name: "YukiFiles",
      debug_mode: "true",
      auth_auto_verify: "false",
      site_url: "http://localhost:3000"
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

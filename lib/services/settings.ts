import { createServerClient } from "@/lib/supabase/server"

export type AdminSettingsMap = Record<string, string>

export async function getAdminSettings() {
  const supabase = await createServerClient()
  if (!supabase) return {}
  
  const { data } = await supabase.from("admin_settings").select("setting_key, setting_value")
  
  if (!data) return {}
  
  const settings: { [key: string]: string } = {}
  data.forEach((row: any) => {
    settings[row.setting_key] = row.setting_value
  })
  
  return settings
}

export function readSetting(settings: AdminSettingsMap, key: string, fallback = ""): string {
  return settings[key] ?? fallback
}


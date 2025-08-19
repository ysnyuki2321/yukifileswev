import { createServerClient } from "@/lib/supabase/server"

export type AdminSettingsMap = Record<string, string>

export async function getAdminSettingsMap(): Promise<AdminSettingsMap> {
  const supabase = createServerClient()
  if (!supabase) return {}
  const { data } = await supabase.from("admin_settings").select("setting_key, setting_value")
  const map: AdminSettingsMap = {}
  for (const row of data || []) {
    map[(row as any).setting_key] = (row as any).setting_value
  }
  return map
}

export function readSetting(settings: AdminSettingsMap, key: string, fallback = ""): string {
  return settings[key] ?? fallback
}


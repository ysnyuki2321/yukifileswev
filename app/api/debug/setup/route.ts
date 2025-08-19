import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  try {
    // Set debug mode and auto verify to true by default
    await supabase.from("admin_settings").upsert([
      { setting_key: "debug_mode", setting_value: "true" },
      { setting_key: "auth_auto_verify", setting_value: "true" },
      { setting_key: "site_url", setting_value: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000" },
    ])

    return NextResponse.json({ 
      success: true, 
      message: "Debug mode and auto verify enabled",
      siteUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    })
  } catch (error) {
    console.error("Debug setup error:", error)
    return NextResponse.json({ error: "Failed to set debug settings" }, { status: 500 })
  }
}
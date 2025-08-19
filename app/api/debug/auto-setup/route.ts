import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  try {
    // Auto-enable debug mode and auto verify
    await supabase.from("admin_settings").upsert([
      { setting_key: "debug_mode", setting_value: "true" },
      { setting_key: "auth_auto_verify", setting_value: "true" },
      { setting_key: "site_url", setting_value: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000" },
      { setting_key: "brand_name", setting_value: "YukiFiles" },
      { setting_key: "primary_gradient", setting_value: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
      { setting_key: "accent_glow", setting_value: "rgba(139, 92, 246, 0.3)" },
      { setting_key: "card_bg", setting_value: "linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(30, 0, 50, 0.4) 50%, rgba(0, 20, 40, 0.6) 100%)" },
    ])

    return NextResponse.json({ 
      success: true, 
      message: "Debug mode automatically enabled!",
      siteUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
      debugMode: true,
      autoVerify: true
    })
  } catch (error) {
    console.error("Auto debug setup error:", error)
    return NextResponse.json({ error: "Failed to enable debug mode" }, { status: 500 })
  }
}
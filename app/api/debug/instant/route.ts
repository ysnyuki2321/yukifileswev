import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Create direct Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Force enable debug mode with all settings
    await supabase.from("admin_settings").upsert([
      { setting_key: "debug_mode", setting_value: "true" },
      { setting_key: "auth_auto_verify", setting_value: "true" },
      { setting_key: "site_url", setting_value: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000" },
      { setting_key: "brand_name", setting_value: "YukiFiles" },
      { setting_key: "primary_gradient", setting_value: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
      { setting_key: "accent_glow", setting_value: "rgba(139, 92, 246, 0.3)" },
      { setting_key: "card_bg", setting_value: "linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(30, 0, 50, 0.4) 50%, rgba(0, 20, 40, 0.6) 100%)" },
      { setting_key: "free_quota_gb", setting_value: "2" },
      { setting_key: "paid_quota_gb", setting_value: "5" },
    ])

    return NextResponse.json({ 
      success: true, 
      message: "Debug mode INSTANTLY enabled!",
      debugMode: true,
      autoVerify: true,
      redirect: "/dashboard"
    })
  } catch (error) {
    console.error("Instant debug error:", error)
    return NextResponse.json({ 
      success: false,
      error: "Failed to enable debug mode",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
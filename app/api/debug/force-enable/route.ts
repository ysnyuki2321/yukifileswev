import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Create direct Supabase client without middleware
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Force enable debug mode
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
      message: "Debug mode FORCE enabled!",
      siteUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
      debugMode: true,
      autoVerify: true,
      note: "Refresh the page and try accessing /dashboard directly"
    })
  } catch (error) {
    console.error("Force debug setup error:", error)
    return NextResponse.json({ 
      error: "Failed to force enable debug mode",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Force enable debug mode
    const { error } = await supabase.from("admin_settings").upsert([
      { setting_key: "debug_mode", setting_value: "true" },
      { setting_key: "site_url", setting_value: getCurrentSiteUrl() },
      { setting_key: "auth_auto_verify", setting_value: "true" },
      { setting_key: "brand_name", setting_value: "YukiFiles" },
    ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Debug mode and auto verify force enabled",
      siteUrl: getCurrentSiteUrl(),
      debugMode: true,
      autoVerify: true
    })
  } catch (error) {
    console.error("Force enable debug error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
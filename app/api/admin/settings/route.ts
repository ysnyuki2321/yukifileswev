import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminData } = await supabase.from("users").select("is_admin").eq("email", user.email).single()

    if (!adminData?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const settings = await request.json()

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("admin_settings").upsert([
        { setting_key: key, setting_value: String(value) }
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin settings save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

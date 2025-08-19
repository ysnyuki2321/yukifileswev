import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient()
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

    const { userId, action } = await request.json()

    let updateData: any = {}

    switch (action) {
      case "toggle_active":
        const { data: currentUser } = await supabase.from("users").select("is_active").eq("id", userId).single()
        updateData = { is_active: !currentUser?.is_active }
        break
      case "make_admin":
        updateData = { is_admin: true }
        break
      case "remove_admin":
        updateData = { is_admin: false }
        break
      case "upgrade_premium":
        updateData = { subscription_type: "paid", quota_limit: 5368709120 }
        break
      case "downgrade_free":
        updateData = { subscription_type: "free", quota_limit: 2147483648 }
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const { error } = await supabase.from("users").update(updateData).eq("id", userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin user action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

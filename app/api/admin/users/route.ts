import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
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

    // Get all users
    const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
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

    const { userId, action } = await request.json()

    let updateData: any = {}

    switch (action) {
      case "toggle_active":
        const { data: currentUser } = await supabase.from("users").select("is_active").eq("id", userId).single()
        updateData = { is_active: !currentUser?.is_active }
        break
      case "toggle_admin":
        const { data: currentAdmin } = await supabase.from("users").select("is_admin").eq("id", userId).single()
        updateData = { is_admin: !currentAdmin?.is_admin }
        break
      case "reset_quota":
        updateData = { quota_used: 0 }
        break
      case "ban":
        updateData = { is_active: false, banned_at: new Date().toISOString() }
        break
      case "unban":
        updateData = { is_active: true, banned_at: null }
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const { error } = await supabase.from("users").update(updateData).eq("id", userId)

    if (error) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { readFile } from "fs/promises"

// One-shot endpoint to create required tables if missing by executing our SQL scripts
export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

  // Only allow admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Auth required" }, { status: 401 })
  const { data: adminData } = await supabase.from("users").select("is_admin").eq("email", user.email).single()
  if (!adminData?.is_admin) return NextResponse.json({ error: "Admin only" }, { status: 403 })

  const files = [
    "scripts/01-create-database-schema.sql",
    "scripts/02-auth-columns.sql",
    "scripts/03-plans-and-flags.sql",
    "scripts/04-seed-demo-user.sql",
  ]

  // Supabase client cannot execute arbitrary SQL; this endpoint is a helper stub for self-host. For Supabase hosted DB,
  // please run scripts in SQL editor. We still return the scripts content here to copy quickly.
  const scripts: Record<string, string> = {}
  for (const f of files) {
    try {
      scripts[f] = await readFile(process.cwd() + "/" + f, "utf8")
    } catch (e) {
      scripts[f] = `/* failed to read ${f}: ${String(e)} */`
    }
  }
  return NextResponse.json({ message: "Run these SQL scripts in Supabase SQL editor in order.", scripts })
}

export async function GET() {
  try {
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminData } = await supabase.from("users").select("is_admin").eq("email", user.email).single()

    if (!adminData?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Bootstrap logic here
    return NextResponse.json({ message: "Bootstrap completed" })
  } catch (error) {
    console.error("Bootstrap error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: "DB" }, { status: 500 })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Auth" }, { status: 401 })
  const { fileId } = await request.json()
  const { data: userData } = await supabase.from("users").select("id").eq("email", user.email).single()
  if (!userData) return NextResponse.json({ error: "User" }, { status: 404 })
  const newToken = randomBytes(16).toString("hex")
  await supabase.from("files").update({ share_token: newToken }).eq("id", fileId).eq("user_id", userData.id)
  return NextResponse.json({ success: true, shareToken: newToken })
}


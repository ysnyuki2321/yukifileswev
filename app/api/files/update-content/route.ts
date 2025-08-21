import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import zlib from "zlib"

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

    const { fileId, content, fileName } = await request.json()

    if (!fileId || content === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user data
    const { data: userData } = await supabase.from("users").select("id").eq("email", user.email).single()
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get file data to verify ownership
    const { data: fileData } = await supabase.from("files").select("*").eq("id", fileId).eq("user_id", userData.id).single()
    if (!fileData) {
      return NextResponse.json({ error: "File not found or access denied" }, { status: 404 })
    }

    // Update file content on disk
    const filePath = join(process.cwd(), "storage", "files", userData.id, fileData.stored_name)
    const contentBuffer = Buffer.from(content, 'utf8')
    const gzippedContent = zlib.gzipSync(contentBuffer)
    
    await writeFile(filePath, gzippedContent)

    // Update file metadata in database
    const { error: updateError } = await supabase.from("files").update({
      file_size: contentBuffer.length,
      updated_at: new Date().toISOString(),
      ...(fileName && fileName !== fileData.original_name && { original_name: fileName })
    }).eq("id", fileId)

    if (updateError) {
      console.error("Database update error:", updateError)
      return NextResponse.json({ error: "Failed to update file metadata" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "File updated successfully" })
  } catch (error) {
    console.error("File update error:", error)
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 })
  }
}
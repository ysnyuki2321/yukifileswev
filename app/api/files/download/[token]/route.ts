import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { readFile } from "fs/promises"
import { join } from "path"
import zlib from "zlib"

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { token } = params

    // Get file data
    const { data: fileData } = await supabase.from("files").select("*").eq("share_token", token).single()

    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if file is public or user owns it
    if (!fileData.is_public) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || fileData.user_id !== user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    // Read file from disk (stored gzipped). Decompress to serve original bytes
    const filePath = join(process.cwd(), "storage", "files", fileData.user_id, fileData.stored_name)
    const gzBuffer = await readFile(filePath)
    const fileBuffer = zlib.gunzipSync(gzBuffer)

    // Update download count
    await supabase
      .from("files")
      .update({ download_count: fileData.download_count + 1 })
      .eq("id", fileData.id)

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": fileData.mime_type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileData.original_name}"`,
        "Content-Length": fileData.file_size.toString(),
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}

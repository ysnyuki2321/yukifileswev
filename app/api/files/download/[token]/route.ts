import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { readFile } from "fs/promises"
import { join } from "path"
import zlib from "zlib"

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get file data
    const { data: fileData } = await supabase.from("files").select("*").eq("share_token", token).single()

    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if file is private and user owns it
    if (!fileData.is_public) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || fileData.user_id !== user.id) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
      }
    }

    // Read file from disk (stored gzipped). Decompress to serve original bytes
    const filePath = join(process.cwd(), "storage", "files", fileData.user_id, fileData.stored_name)

    try {
      const gzippedData = await readFile(filePath)
      const originalData = zlib.gunzipSync(gzippedData)

      // Update download count
      await supabase.from("files").update({ 
        download_count: (fileData.download_count || 0) + 1,
        last_downloaded_at: new Date().toISOString()
      }).eq("id", fileData.id)

      return new NextResponse(originalData, {
        headers: {
          "Content-Type": fileData.mime_type || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${fileData.original_name}"`,
          "Content-Length": originalData.length.toString(),
        },
      })
    } catch (fileError) {
      console.error("File read error:", fileError)
      return NextResponse.json({ error: "File not accessible" }, { status: 500 })
    }
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}

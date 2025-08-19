import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomBytes, createHash } from "crypto"
import zlib from "zlib"
import { resolvePlanFromUserRow } from "@/lib/services/plans"

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check plan-based upload size limits
    const { data: planRow } = await supabase.from("users").select("*").eq("email", user.email).single()
    const plan = resolvePlanFromUserRow(planRow)
    if (plan.uploadLimitBytes && file.size > plan.uploadLimitBytes) {
      return NextResponse.json({ error: `Upload limit is ${(plan.uploadLimitBytes / (1024*1024)).toFixed(0)}MB for your plan.` }, { status: 400 })
    }

    // Get user data and check quota
    const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check quota
    if (userData.quota_used + file.size > userData.quota_limit) {
      const remainingGB = ((userData.quota_limit - userData.quota_used) / (1024 * 1024 * 1024)).toFixed(2)
      return NextResponse.json({ error: `Quota exceeded. You have ${remainingGB} GB remaining.` }, { status: 400 })
    }

    // Generate file hash for deduplication
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileHash = createHash("sha256").update(buffer).digest("hex")

    // Check if file already exists for this user
    const { data: existingFile } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", userData.id)
      .eq("file_hash", fileHash)
      .single()

    if (existingFile) {
      return NextResponse.json({ error: "File already exists in your storage" }, { status: 400 })
    }

    // Generate unique filename and share token
    const fileExtension = file.name.split(".").pop() || ""
    const storedName = `${randomBytes(16).toString("hex")}.${fileExtension}`
    const shareToken = randomBytes(16).toString("hex")

    // Create user directory if it doesn't exist
    const userDir = join(process.cwd(), "storage", "files", userData.id)
    await mkdir(userDir, { recursive: true })

    // Save file to disk (compressed tar.gz like approach: gzip the content).
    // We store compressed bytes but account quota as original size per spec.
    const filePath = join(userDir, `${storedName}.gz`)
    const gzipped = zlib.gzipSync(buffer)
    await writeFile(filePath, gzipped)

    // Save file record to database
    const { error: dbError } = await supabase.from("files").insert({
      user_id: userData.id,
      original_name: file.name,
      stored_name: `${storedName}.gz`,
      file_size: file.size,
      mime_type: file.type,
      file_hash: fileHash,
      share_token: shareToken,
      is_public: true,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save file record" }, { status: 500 })
    }

    // Update user quota
    await supabase
      .from("users")
      .update({ quota_used: userData.quota_used + file.size })
      .eq("id", userData.id)

    return NextResponse.json({ success: true, shareToken })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

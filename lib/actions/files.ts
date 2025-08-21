"use server"

import { createServerClient } from "@/lib/supabase/server"
import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { randomBytes, createHash } from "crypto"
import zlib from "zlib"
import { resolvePlanFromUserRow } from "@/lib/services/plans"

export async function uploadFile(formData: FormData) {
  const supabase = await createServerClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Authentication required" }
  }

  const file = formData.get("file") as File
  if (!file) {
    return { error: "No file provided" }
  }

  // Check file size (100MB limit)
  if (file.size > 100 * 1024 * 1024) {
    return { error: "File size exceeds 100MB limit" }
  }

  try {
    // Get user data and check quota
    const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

    if (!userData) {
      return { error: "User not found" }
    }

    // Check quota
    if (userData.quota_used + file.size > userData.quota_limit) {
      const remainingGB = ((userData.quota_limit - userData.quota_used) / (1024 * 1024 * 1024)).toFixed(2)
      return { error: `Quota exceeded. You have ${remainingGB} GB remaining.` }
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
      return { error: "File already exists in your storage" }
    }

    // Generate unique filename and share token
    const fileExtension = file.name.split(".").pop() || ""
    const storedName = `${randomBytes(16).toString("hex")}.${fileExtension}`
    const shareToken = randomBytes(16).toString("hex")

    // Create user directory if it doesn't exist
    const userDir = join(process.cwd(), "storage", "files", userData.id)
    await mkdir(userDir, { recursive: true })

    // Save file to disk
    const filePath = join(userDir, storedName)
    await writeFile(filePath, buffer)

    // Save file record to database
    const { error: dbError } = await supabase.from("files").insert({
      user_id: userData.id,
      original_name: file.name,
      stored_name: storedName,
      file_size: file.size,
      mime_type: file.type,
      file_hash: fileHash,
      share_token: shareToken,
      is_public: true,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return { error: "Failed to save file record" }
    }

    // Update user quota
    await supabase
      .from("users")
      .update({ quota_used: userData.quota_used + file.size })
      .eq("id", userData.id)

    return { success: true, shareToken }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Upload failed" }
  }
}

export async function deleteFile(fileId: string) {
  const supabase = await createServerClient()
  if (!supabase) {
    return { error: "Database connection failed" }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Authentication required" }
  }

  try {
    // Get user data
    const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

    if (!userData) {
      return { error: "User not found" }
    }

    // Get file data
    const { data: fileData } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .eq("user_id", userData.id)
      .single()

    if (!fileData) {
      return { error: "File not found" }
    }

    // Delete physical file from disk (best-effort)
    try {
      const filePath = join(process.cwd(), "storage", "files", userData.id, fileData.stored_name)
      await unlink(filePath)
    } catch {}

    // Delete file from database
    const { error: dbError } = await supabase.from("files").delete().eq("id", fileId).eq("user_id", userData.id)

    if (dbError) {
      return { error: "Failed to delete file record" }
    }

    // Update user quota
    await supabase
      .from("users")
      .update({ quota_used: Math.max(0, userData.quota_used - fileData.file_size) })
      .eq("id", userData.id)

    return { success: true }
  } catch (error) {
    console.error("Delete error:", error)
    return { error: "Delete failed" }
  }
}

export async function renameFile(fileId: string, newName: string) {
  const supabase = await createServerClient()
  if (!supabase) return { error: "Database connection failed" }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Authentication required" }
  try {
    const { data: userData } = await supabase.from("users").select("id").eq("email", user.email).single()
    if (!userData) return { error: "User not found" }
    await supabase.from("files").update({ original_name: newName }).eq("id", fileId).eq("user_id", userData.id)
    return { success: true }
  } catch (e) {
    return { error: "Rename failed" }
  }
}

export async function toggleFilePublic(fileId: string, makePublic: boolean) {
  const supabase = await createServerClient()
  if (!supabase) return { error: "Database connection failed" }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Authentication required" }
  try {
    const { data: userData } = await supabase.from("users").select("id").eq("email", user.email).single()
    if (!userData) return { error: "User not found" }
    await supabase.from("files").update({ is_public: makePublic }).eq("id", fileId).eq("user_id", userData.id)
    return { success: true }
  } catch (e) {
    return { error: "Update failed" }
  }
}

export async function regenerateShareToken(fileId: string) {
  const supabase = await createServerClient()
  if (!supabase) return { error: "Database connection failed" }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Authentication required" }
  try {
    const { data: userData } = await supabase.from("users").select("id").eq("email", user.email).single()
    if (!userData) return { error: "User not found" }
    const newToken = randomBytes(16).toString("hex")
    await supabase.from("files").update({ share_token: newToken }).eq("id", fileId).eq("user_id", userData.id)
    return { success: true, shareToken: newToken }
  } catch (e) {
    return { error: "Regenerate failed" }
  }
}

export async function getUserFiles() {
  const supabase = await createServerClient()
  if (!supabase) {
    return { files: [] }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { files: [] }
  }

  try {
    // Get user data
    const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

    if (!userData) {
      return { files: [] }
    }

    // Get user files
    const { data: files } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false })

    return { files: files || [] }
  } catch (error) {
    console.error("Get files error:", error)
    return { files: [] }
  }
}

import { NextResponse } from "next/server"
import { getDebugFiles } from "@/lib/services/debug-user"

export async function GET() {
  try {
    const files = getDebugFiles()
    return NextResponse.json({ files })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load debug files" }, { status: 500 })
  }
}


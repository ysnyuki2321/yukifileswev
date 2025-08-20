import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()
    
    if (!supabase) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Supabase not configured",
          details: "Missing environment variables"
        }, 
        { status: 503 }
      )
    }

    // Test the connection by making a simple query
    const { error } = await supabase.from("users").select("count", { count: "exact", head: true })
    
    if (error) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Database connection failed",
          details: error.message
        }, 
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        status: "healthy", 
        message: "Database connected successfully",
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      { 
        status: "error", 
        message: "Health check failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
}
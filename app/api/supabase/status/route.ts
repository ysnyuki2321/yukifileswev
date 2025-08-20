import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    if (!supabase) {
      return NextResponse.json({
        connected: false,
        emailConfigured: false,
        authEnabled: false,
        error: "Supabase client not available"
      })
    }

    // Test database connection
    let connected = false
    let authEnabled = false
    let emailConfigured = false
    let error = null

    try {
      // Test basic connection by querying a simple table
      const { data, error: dbError } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (dbError) {
        // If users table doesn't exist, try a different approach
        const { error: healthError } = await supabase.auth.getUser()
        if (healthError && healthError.message.includes('JWT')) {
          // This means auth is working but no user is logged in
          connected = true
          authEnabled = true
        } else {
          error = dbError.message
        }
      } else {
        connected = true
        authEnabled = true
      }
    } catch (e) {
      error = "Failed to connect to database"
    }

    // Check email configuration by testing auth settings
    if (connected && authEnabled) {
      try {
        // Try to get auth settings (this will fail if email is not configured)
        const { data: authSettings, error: authError } = await supabase.auth.admin.listUsers()
        
        if (!authError) {
          emailConfigured = true
        } else {
          // Check if it's specifically an email configuration error
          if (authError.message.includes('email') || authError.message.includes('SMTP')) {
            emailConfigured = false
          } else {
            // Other auth errors might not be related to email
            emailConfigured = true
          }
        }
      } catch (e) {
        // If we can't check auth settings, assume email is not configured
        emailConfigured = false
      }
    }

    return NextResponse.json({
      connected,
      emailConfigured,
      authEnabled,
      error
    })

  } catch (error) {
    console.error("Supabase status check error:", error)
    return NextResponse.json({
      connected: false,
      emailConfigured: false,
      authEnabled: false,
      error: "Internal server error"
    }, { status: 500 })
  }
}
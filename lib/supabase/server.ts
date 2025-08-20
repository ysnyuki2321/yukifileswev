import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { isDebugModeEnabled, getMockSession } from "@/lib/services/debug-context"

export async function createServerClient() {
  const cookieStore = cookies()

  // Check debug mode first
  const debugMode = await isDebugModeEnabled()

  // If debug mode is enabled, return null to bypass all database operations
  if (debugMode) {
    return null
  }

  // Return real Supabase client
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Ignore errors in server components
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 })
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  )
}

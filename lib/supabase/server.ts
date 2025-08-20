import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { isDebugModeEnabled, getMockSession } from "@/lib/services/debug-context"

export function createServerClient() {
  const cookieStore = cookies()

  // Check debug mode first
  const checkDebugMode = async () => {
    try {
      return await isDebugModeEnabled()
    } catch {
      return false
    }
  }

  const debugMode = checkDebugMode()

  // If debug mode is enabled, return a mock client
  if (debugMode) {
    return {
      auth: {
        getUser: async () => ({
          data: { user: getMockSession().user },
          error: null
        }),
        getSession: async () => ({
          data: { session: getMockSession() },
          error: null
        }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({
          data: { user: getMockSession().user, session: getMockSession() },
          error: null
        }),
        signUp: async () => ({
          data: { user: getMockSession().user, session: getMockSession() },
          error: null
        })
      },
      from: (table: string) => ({
        select: (columns: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => ({ data: null, error: null }),
            then: (callback: any) => Promise.resolve({ data: null, error: null })
          }),
          then: (callback: any) => Promise.resolve({ data: [], error: null })
        }),
        insert: async (data: any) => ({ data, error: null }),
        update: async (data: any) => ({ data, error: null }),
        delete: async () => ({ data: null, error: null }),
        upsert: async (data: any) => ({ data, error: null })
      }),
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: any) => ({ data: { path }, error: null }),
          download: async (path: string) => ({ data: null, error: null }),
          remove: async (paths: string[]) => ({ data: null, error: null })
        })
      }
    } as any
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

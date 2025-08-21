import { createClient } from "@supabase/supabase-js"

// Global debug state
let debugModeCache: boolean | null = null
let debugModeCacheTime = 0
const CACHE_DURATION = 30000 // 30 seconds

export async function isDebugModeEnabled(): Promise<boolean> {
  // Check cache first
  const now = Date.now()
  if (debugModeCache !== null && (now - debugModeCacheTime) < CACHE_DURATION) {
    return debugModeCache
  }

  try {
    // In production, never enable debug by default
    const isProd = process.env.NODE_ENV === 'production'
    // If Supabase env missing:
    // - In dev: default to true to ease local development
    // - In prod: default to false to avoid accidental bypass
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      debugModeCache = isProd ? false : true
      debugModeCacheTime = now
      return debugModeCache
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data: settings } = await supabase
      .from("admin_settings")
      .select("setting_key, setting_value")
      .eq("setting_key", "debug_mode")
      .single()

    const isDebug = settings?.setting_value === "true" && !isProd
    
    // Update cache
    debugModeCache = isDebug
    debugModeCacheTime = now
    
    return isDebug
  } catch (error) {
    console.warn("[Debug] Failed to check debug mode:", error)
    // Fail-closed in production, fail-open in dev
    debugModeCache = process.env.NODE_ENV === 'production' ? false : true
    debugModeCacheTime = now
    return true
  }
}

export function clearDebugCache() {
  debugModeCache = null
  debugModeCacheTime = 0
}

// Mock user data for debug mode
export function getMockUser() {
  return {
    id: "debug-user-123",
    email: "debug@yukifiles.com",
    email_confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {
      provider: "email",
      providers: ["email"]
    },
    user_metadata: {},
    identities: [],
    phone: null,
    confirmation_sent_at: null,
    recovery_sent_at: null,
    email_change_sent_at: null,
    new_email: null,
    invited_at: null,
    action_link: null,
    last_sign_in_at: new Date().toISOString(),
    phone_confirmed_at: null,
    email_change_confirm_status: 0,
    banned_until: null,
    reauthentication_sent_at: null,
    reauthentication_confirm_status: 0
  }
}

// Mock user data from users table
export function getMockUserData() {
  return {
    id: "debug-user-123",
    email: "debug@yukifiles.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subscription_type: "paid",
    subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    quota_used: 1024 * 1024 * 500, // 500MB used
    quota_limit: 1024 * 1024 * 1024 * 5, // 5GB limit
    password_hash: null,
    twofa_secret: null,
    is_verified: true,
    supabase_id: "debug-user-123",
    auth_provider: "email",
    is_admin: true,
    device_fingerprint: "debug-fingerprint",
    last_ip: "127.0.0.1",
    registration_ip: "127.0.0.1",
    is_active: true
  }
}

// Mock session data
export function getMockSession() {
  return {
    access_token: "debug-access-token",
    refresh_token: "debug-refresh-token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: getMockUser()
  }
}
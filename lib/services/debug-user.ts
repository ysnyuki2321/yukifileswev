import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Removed server import to avoid client component issues

export interface DebugUser {
  id: string
  email: string
  quota_used: number
  quota_limit: number
  files_count: number
  subscription_type: "free" | "paid"
  is_admin: boolean
  is_verified: boolean
  is_active: boolean
  created_at: string
  last_login: string
}

export interface DebugFile {
  id: string
  original_name: string
  file_size: number
  share_token: string
  created_at: string
  is_public: boolean
  user_id: string
}

export interface DebugTransaction {
  id: string
  user_id: string
  payment_method: "paypal" | "crypto"
  payment_id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  created_at: string
  completed_at?: string
}

export function getDebugUser(): DebugUser {
  return {
    id: "debug-user-123",
    email: "debug@yukifiles.com",
    quota_used: 1.5 * 1024 * 1024 * 1024, // 1.5GB
    quota_limit: 5 * 1024 * 1024 * 1024, // 5GB
    files_count: 23,
    subscription_type: "paid",
    is_admin: true,
    is_verified: true,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    last_login: new Date().toISOString()
  }
}

export function getDebugFiles(): DebugFile[] {
  return [
    {
      id: "debug-file-1",
      original_name: "presentation.pdf",
      file_size: 2.5 * 1024 * 1024, // 2.5MB
      share_token: "debug-share-1",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: true,
      user_id: "debug-user-123"
    },
    {
      id: "debug-file-2",
      original_name: "screenshot.png",
      file_size: 1.2 * 1024 * 1024, // 1.2MB
      share_token: "debug-share-2",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: false,
      user_id: "debug-user-123"
    },
    {
      id: "debug-file-3",
      original_name: "document.docx",
      file_size: 500 * 1024, // 500KB
      share_token: "debug-share-3",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: true,
      user_id: "debug-user-123"
    },
    {
      id: "debug-file-4",
      original_name: "video.mp4",
      file_size: 50 * 1024 * 1024, // 50MB
      share_token: "debug-share-4",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: false,
      user_id: "debug-user-123"
    }
  ]
}

export function getDebugTransactions(): DebugTransaction[] {
  return [
    {
      id: "debug-transaction-1",
      user_id: "debug-user-123",
      payment_method: "paypal",
      payment_id: "PAY-123456789",
      amount: 1.00,
      currency: "USD",
      status: "completed",
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "debug-transaction-2",
      user_id: "debug-user-123",
      payment_method: "crypto",
      payment_id: "BTC-987654321",
      amount: 0.001,
      currency: "BTC",
      status: "pending",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
}

export function getDebugStats() {
  return {
    totalUsers: 156,
    totalFiles: 892,
    totalTransactions: 45,
    pendingTransactions: 3,
    suspiciousIPs: 12,
    totalStorageUsed: 2.3 * 1024 * 1024 * 1024 * 1024, // 2.3TB
    recentUsers: [
      { email: "user1@example.com", created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { email: "user2@example.com", created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { email: "user3@example.com", created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
    ],
    recentTransactions: [
      { id: "tx-1", amount: 1.00, status: "completed", created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { id: "tx-2", amount: 0.001, status: "pending", created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ]
  }
}

export async function isDebugModeEnabled(): Promise<boolean> {
  const supabase = createServerClient()
  if (!supabase) return false
  
  try {
    const { data: settings } = await supabase.from("admin_settings").select("setting_key, setting_value")
    const map = (settings || []).reduce((acc: Record<string, string>, s: any) => {
      acc[s.setting_key] = s.setting_value
      return acc
    }, {} as Record<string, string>)
    
    return map["debug_mode"] === "true"
  } catch (e) {
    return false
  }
}

export async function createDebugUser() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No-op for debug
        }
      }
    }
  )
  
  // Debug user creation logic here
  return supabase
}
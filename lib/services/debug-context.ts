// Mock data for demo mode without Supabase
export interface MockUserData {
  id: string
  email: string
  subscription_type: "free" | "paid"
  quota_used: number
  quota_limit: number
  is_admin: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export function getMockUserData(): MockUserData {
  return {
    id: "demo-user-123",
    email: "demo@yukifiles.com",
    subscription_type: "paid",
    quota_used: 1024 * 1024 * 1024 * 2.5, // 2.5GB
    quota_limit: 1024 * 1024 * 1024 * 50,  // 50GB
    is_admin: true,
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

export function getMockFiles() {
  return [
    {
      id: "file-1",
      original_name: "project-proposal.pdf",
      file_size: 2547893,
      mime_type: "application/pdf",
      share_token: "demo-token-1",
      created_at: new Date().toISOString()
    },
    {
      id: "file-2", 
      original_name: "presentation.pptx",
      file_size: 5892103,
      mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      share_token: "demo-token-2",
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "file-3",
      original_name: "team-photo.jpg", 
      file_size: 1234567,
      mime_type: "image/jpeg",
      share_token: "demo-token-3",
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ]
}

export function getMockActivity() {
  return [
    {
      id: "1",
      type: "upload",
      fileName: "project-proposal.pdf",
      timestamp: new Date().toISOString(),
      fileType: "document"
    },
    {
      id: "2", 
      type: "share",
      fileName: "presentation.pptx",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      fileType: "presentation"
    },
    {
      id: "3",
      type: "download", 
      fileName: "team-photo.jpg",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      fileType: "image"
    }
  ]
}

// Debug mode functions
export async function isDebugModeEnabled(): Promise<boolean> {
  // Always return true for demo mode
  return true
}

export function clearDebugCache() {
  // No-op for demo mode
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
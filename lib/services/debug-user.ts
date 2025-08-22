// Mock user service for demo mode
export interface MockUser {
  id: string
  email: string
  email_confirmed_at: string
  created_at: string
  updated_at: string
  aud: string
  role: string
  app_metadata: {
    provider: string
    providers: string[]
  }
  user_metadata: Record<string, any>
  identities: any[]
  phone: string | null
  confirmation_sent_at: string | null
  recovery_sent_at: string | null
  email_change_sent_at: string | null
  new_email: string | null
  invited_at: string | null
  action_link: string | null
  last_sign_in_at: string
  phone_confirmed_at: string | null
  email_change_confirm_status: number
  banned_until: string | null
  reauthentication_sent_at: string | null
  reauthentication_confirm_status: number
}

export function getMockUser(): MockUser {
  return {
    id: "demo-user-123",
    email: "demo@yukifiles.com",
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

export function getMockSession() {
  return {
    access_token: "demo-access-token",
    refresh_token: "demo-refresh-token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: getMockUser()
  }
}

export function getDebugStats() {
  return {
    totalUsers: 1250,
    totalFiles: 8473,
    totalTransactions: 2341,
    pendingTransactions: 23,
    suspiciousIPs: 7,
    totalStorageUsed: 2.5 * 1024 * 1024 * 1024, // 2.5 GB
    recentUsers: [
      { id: '1', email: 'user1@example.com', created_at: new Date().toISOString() },
      { id: '2', email: 'user2@example.com', created_at: new Date().toISOString() },
      { id: '3', email: 'user3@example.com', created_at: new Date().toISOString() }
    ],
    recentTransactions: [
      { id: '1', amount: 29.99, status: 'completed', created_at: new Date().toISOString() },
      { id: '2', amount: 19.99, status: 'pending', created_at: new Date().toISOString() },
      { id: '3', amount: 49.99, status: 'completed', created_at: new Date().toISOString() }
    ]
  }
}
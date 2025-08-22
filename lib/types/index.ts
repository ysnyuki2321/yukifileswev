// Database Types
export interface User {
  id: string
  email: string
  supabase_id?: string
  subscription_type: 'free' | 'pro' | 'developer' | 'team' | 'enterprise'
  storage_used: number
  storage_limit: number
  quota_used: number
  quota_limit: number
  is_admin: boolean
  is_active: boolean
  is_verified: boolean
  banned_at?: string
  plan?: string
  created_at: string
  updated_at: string
  verification_attempts?: number
  password_reset_attempts?: number
  last_verification_sent?: string
  last_password_reset_sent?: string
}

export interface FileRecord {
  id: string
  user_id: string
  original_name: string
  stored_name: string
  file_size: number
  mime_type?: string
  file_hash: string
  share_token: string
  is_public: boolean
  download_count?: number
  last_downloaded_at?: string
  created_at: string
  updated_at?: string
}

export interface AdminSetting {
  id: string
  setting_key: string
  setting_value: string
  created_at: string
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  password2: string
}

export interface AuthResult {
  error?: string
  success?: string
  code?: string
}

// Payment Types
export interface PayPalConfig {
  clientId: string
  clientSecret: string
  environment: 'sandbox' | 'production'
}

export interface CryptoConfig {
  btc_address?: string
  ltc_address?: string
  eth_address?: string
}

export interface PaymentResult {
  orderId?: string
  approvalUrl?: string
  success?: boolean
  transactionId?: string
  walletAddress?: string
  amount?: number
  currency?: string
}

// File Management Types
export interface FileItem {
  id: string
  name: string
  size: number
  type: string
  mimeType?: string
  content?: string
  path: string
  isStarred?: boolean
  lastModified: Date
  shareToken?: string
  isPublic?: boolean
  downloadCount?: number
}

export interface UploadResult {
  success: boolean
  shareToken?: string
  error?: string
}

// Validation Types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface FormValidationRules<T> {
  [K in keyof T]: (value: T[K]) => ValidationResult;
}

// Anti-Clone Types
export interface IPInfo {
  vpn: boolean
  proxy: boolean
  residential: boolean
  country?: string
  city?: string
}

export interface AntiCloneResult {
  allowed: boolean
  reason?: string
  riskScore: number
}

// Rate Limiting Types
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetSeconds: number
}

// Component Props Types
export interface FileManagerProps {
  userData: User
  initialFiles: FileRecord[]
  showHeader?: boolean
}

export interface SupabaseStatus {
  connected: boolean
  emailConfigured: boolean
  authEnabled: boolean
  error?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success?: boolean
  error?: string
  data?: T
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
  environment: string
  database: {
    status: 'connected' | 'disconnected' | 'error'
    latency?: number
  }
  supabase: SupabaseStatus
}

// Debug Types
export interface DebugUser {
  id: string
  email: string
  name?: string
  avatar?: string
  plan: string
  isAdmin: boolean
}

// Utility Types
export type Theme = 'light' | 'dark' | 'system'
export type PlanName = 'free' | 'pro' | 'developer' | 'team' | 'enterprise'
export type FileAction = 'download' | 'share' | 'edit' | 'delete' | 'star' | 'rename'
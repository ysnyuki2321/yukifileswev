/**
 * YukiFiles V2.0 - Comprehensive Demo Architecture
 * 
 * This file defines the complete demo system architecture that provides
 * a full-featured experience while being easily convertible to production.
 */

// ====================================================================
// DEMO SYSTEM TYPES
// ====================================================================

export interface DemoUser {
  id: string
  name: string
  email: string
  avatar: string
  role: 'user' | 'admin' | 'premium'
  subscription: 'free' | 'pro' | 'enterprise'
  joinDate: Date
  storageUsed: number
  storageLimit: number
}

export interface DemoFile {
  id: string
  name: string
  type: 'file' | 'folder'
  mimeType: string
  size: number
  content?: string
  thumbnail?: string
  url?: string
  parentId: string | null
  path: string[]
  isStarred: boolean
  isShared: boolean
  isPublic: boolean
  shareToken?: string
  shareSettings: DemoShareSettings
  metadata: DemoFileMetadata
  createdAt: Date
  updatedAt: Date
  lastAccessedAt: Date
  downloadCount: number
  viewCount: number
  tags: string[]
  description?: string
}

export interface DemoShareSettings {
  isEnabled: boolean
  token: string
  url: string
  expiresAt?: Date
  maxDownloads?: number
  currentDownloads: number
  password?: string
  allowDownload: boolean
  allowView: boolean
  allowComment: boolean
  analytics: DemoShareAnalytics
}

export interface DemoShareAnalytics {
  totalViews: number
  totalDownloads: number
  uniqueVisitors: number
  countries: string[]
  devices: string[]
  referrers: string[]
  dailyStats: { date: string; views: number; downloads: number }[]
}

export interface DemoFileMetadata {
  version: number
  checksum: string
  encoding?: string
  language?: string
  author?: string
  software?: string
  camera?: string
  location?: { lat: number; lng: number }
  duration?: number // for video/audio
  dimensions?: { width: number; height: number } // for images/videos
  pages?: number // for PDFs
  wordCount?: number // for documents
}

// ====================================================================
// DEMO EXPERIENCE FLOW
// ====================================================================

export interface DemoStep {
  id: string
  title: string
  description: string
  component: string
  duration: number
  isCompleted: boolean
  isOptional: boolean
  prerequisites: string[]
  learningObjectives: string[]
  actions: DemoAction[]
}

export interface DemoAction {
  id: string
  type: 'click' | 'upload' | 'share' | 'organize' | 'collaborate'
  target: string
  description: string
  expectedResult: string
  tooltip: string
  highlight: boolean
}

export interface DemoScenario {
  id: string
  title: string
  description: string
  icon: string
  estimatedTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'file-management' | 'collaboration' | 'sharing' | 'organization'
  steps: DemoStep[]
  sampleFiles: DemoFile[]
  expectedOutcome: string
}

// ====================================================================
// DEMO SYSTEM STATE
// ====================================================================

export interface DemoSystemState {
  isActive: boolean
  currentScenario: string | null
  currentStep: string | null
  progress: number
  user: DemoUser
  files: DemoFile[]
  sharedLinks: DemoShareSettings[]
  collaborators: DemoUser[]
  activities: DemoActivity[]
  analytics: DemoAnalytics
  preferences: DemoPreferences
}

export interface DemoActivity {
  id: string
  type: 'upload' | 'download' | 'share' | 'view' | 'edit' | 'delete' | 'organize'
  userId: string
  userName: string
  userAvatar: string
  fileId: string
  fileName: string
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface DemoAnalytics {
  totalFiles: number
  totalStorage: number
  totalShares: number
  totalViews: number
  totalDownloads: number
  popularFiles: DemoFile[]
  recentActivity: DemoActivity[]
  storageBreakdown: { type: string; size: number; percentage: number }[]
  sharePerformance: { period: string; shares: number; views: number }[]
}

export interface DemoPreferences {
  theme: 'light' | 'dark' | 'system'
  layout: 'grid' | 'list' | 'kanban'
  sortBy: 'name' | 'date' | 'size' | 'type'
  sortOrder: 'asc' | 'desc'
  showThumbnails: boolean
  showMetadata: boolean
  autoPlay: boolean
  notifications: {
    shares: boolean
    uploads: boolean
    collaborations: boolean
    storage: boolean
  }
}

// ====================================================================
// DEMO CONFIGURATION
// ====================================================================

export const DEMO_CONFIG = {
  // System settings
  SESSION_DURATION: 30 * 60 * 1000, // 30 minutes
  AUTO_SAVE_INTERVAL: 5 * 1000, // 5 seconds
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB for demo
  MAX_FILES: 1000,
  STORAGE_LIMIT: 2 * 1024 * 1024 * 1024, // 2GB for demo
  
  // Feature flags
  FEATURES: {
    REAL_UPLOAD: true,
    REAL_SHARING: true,
    REAL_COLLABORATION: true,
    ANALYTICS: true,
    NOTIFICATIONS: true,
    MOBILE_APP: true,
    AI_FEATURES: true,
    ADMIN_FEATURES: true
  },
  
  // Demo scenarios
  SCENARIOS: [
    'personal-file-management',
    'team-collaboration',
    'client-file-sharing',
    'project-organization',
    'media-management',
    'document-workflow'
  ] as const,
  
  // Performance settings
  PERFORMANCE: {
    LAZY_LOADING: true,
    VIRTUAL_SCROLLING: true,
    IMAGE_OPTIMIZATION: true,
    CACHING: true,
    PREFETCHING: true
  }
} as const

// ====================================================================
// DEMO UTILITIES
// ====================================================================

export class DemoSystem {
  private state: DemoSystemState
  private subscribers: Set<(state: DemoSystemState) => void> = new Set()
  private sessionId: string
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.state = this.initializeState()
    this.startSession()
  }
  
  // State management
  subscribe(callback: (state: DemoSystemState) => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }
  
  private notify() {
    this.subscribers.forEach(callback => callback(this.state))
  }
  
  // Session management
  private generateSessionId(): string {
    return `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  private startSession() {
    console.log(`🎪 YukiFiles Demo Session Started: ${this.sessionId}`)
    this.trackActivity('session_start', 'system', 'Demo session initiated')
  }
  
  // File operations
  async uploadFile(file: File): Promise<DemoFile> {
    const demoFile = await this.createDemoFile(file)
    this.state.files.push(demoFile)
    this.trackActivity('upload', demoFile.id, `Uploaded ${file.name}`)
    this.notify()
    return demoFile
  }
  
  async shareFile(fileId: string, settings: Partial<DemoShareSettings>): Promise<DemoShareSettings> {
    const file = this.state.files.find(f => f.id === fileId)
    if (!file) throw new Error('File not found')
    
    const shareSettings: DemoShareSettings = {
      isEnabled: true,
      token: this.generateShareToken(),
      url: '',
      currentDownloads: 0,
      allowDownload: true,
      allowView: true,
      allowComment: false,
      analytics: {
        totalViews: 0,
        totalDownloads: 0,
        uniqueVisitors: 0,
        countries: [],
        devices: [],
        referrers: [],
        dailyStats: []
      },
      ...settings
    }
    
    shareSettings.url = `${window.location.origin}/share/${shareSettings.token}`
    file.shareSettings = shareSettings
    file.isShared = true
    
    this.trackActivity('share', fileId, `Shared ${file.name}`)
    this.notify()
    return shareSettings
  }
  
  // Analytics
  private trackActivity(type: string, targetId: string, description: string) {
    const activity: DemoActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      userId: this.state.user.id,
      userName: this.state.user.name,
      userAvatar: this.state.user.avatar,
      fileId: targetId,
      fileName: '',
      description,
      timestamp: new Date()
    }
    
    this.state.activities.unshift(activity)
    if (this.state.activities.length > 100) {
      this.state.activities = this.state.activities.slice(0, 100)
    }
  }
  
  // Helper methods
  private async createDemoFile(file: File): Promise<DemoFile> {
    const content = await this.readFileContent(file)
    const thumbnail = await this.generateThumbnail(file)
    
    return {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: 'file',
      mimeType: file.type,
      size: file.size,
      content,
      thumbnail,
      parentId: null,
      path: [],
      isStarred: false,
      isShared: false,
      isPublic: false,
      shareSettings: {} as DemoShareSettings,
      metadata: await this.extractMetadata(file),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
      downloadCount: 0,
      viewCount: 0,
      tags: [],
    }
  }
  
  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }
  
  private async generateThumbnail(file: File): Promise<string | undefined> {
    if (file.type.startsWith('image/')) {
      return this.readFileContent(file)
    }
    return undefined
  }
  
  private async extractMetadata(file: File): Promise<DemoFileMetadata> {
    return {
      version: 1,
      checksum: await this.calculateChecksum(file),
      encoding: 'utf-8',
      author: 'Demo User',
      software: 'YukiFiles Demo'
    }
  }
  
  private async calculateChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  
  private generateShareToken(): string {
    return Math.random().toString(36).substr(2, 12) + 
           Math.random().toString(36).substr(2, 12)
  }
  
  private initializeState(): DemoSystemState {
    return {
      isActive: true,
      currentScenario: null,
      currentStep: null,
      progress: 0,
      user: {
        id: 'demo_user',
        name: 'Demo User',
        email: 'demo@yukifiles.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        role: 'premium',
        subscription: 'pro',
        joinDate: new Date(),
        storageUsed: 0,
        storageLimit: DEMO_CONFIG.STORAGE_LIMIT
      },
      files: [],
      sharedLinks: [],
      collaborators: [],
      activities: [],
      analytics: {
        totalFiles: 0,
        totalStorage: 0,
        totalShares: 0,
        totalViews: 0,
        totalDownloads: 0,
        popularFiles: [],
        recentActivity: [],
        storageBreakdown: [],
        sharePerformance: []
      },
      preferences: {
        theme: 'dark',
        layout: 'grid',
        sortBy: 'date',
        sortOrder: 'desc',
        showThumbnails: true,
        showMetadata: true,
        autoPlay: false,
        notifications: {
          shares: true,
          uploads: true,
          collaborations: true,
          storage: true
        }
      }
    }
  }
}

export default DemoSystem
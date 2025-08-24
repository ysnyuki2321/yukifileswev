import { DemoFile, DemoUser, DemoFolder, DemoShareLink, DemoUserAction, DemoAnalytics } from './demo-architecture'

export class DemoBackend {
  private users: Map<string, DemoUser> = new Map()
  private files: Map<string, DemoFile> = new Map()
  private folders: Map<string, DemoFolder> = new Map()
  private shareLinks: Map<string, DemoShareLink> = new Map()
  private userActions: DemoUserAction[] = []
  private analytics: DemoAnalytics

  constructor() {
    this.initializeDemoData()
    // Only load from storage in browser environment
    if (typeof window !== 'undefined') {
      this.loadFromStorage()
    }
  }

  // ===== USER MANAGEMENT =====
  async createUser(email: string, password: string, name: string): Promise<DemoUser> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const user: DemoUser = {
      id: userId,
      email,
      name,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      storageUsed: 0,
      storageLimit: 1024 * 1024 * 100, // 100MB demo limit
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true
      }
    }

    this.users.set(userId, user)
    this.saveToStorage()
    this.trackAction(userId, 'user_created', `User ${name} created account`)
    
    return user
  }

  async authenticateUser(email: string, password: string): Promise<DemoUser | null> {
    // Demo authentication - accept any password for demo@yukifiles.com
    if (email === 'demo@yukifiles.com') {
      let user = Array.from(this.users.values()).find(u => u.email === email)
      
      if (!user) {
        user = await this.createUser(email, password, 'Demo User')
      }
      
      user.lastLoginAt = new Date()
      this.users.set(user.id, user)
      this.saveToStorage()
      this.trackAction(user.id, 'user_login', 'User logged in')
      
      return user
    }
    
    return null
  }

  async getUser(userId: string): Promise<DemoUser | null> {
    return this.users.get(userId) || null
  }

  // ===== FILE OPERATIONS =====
  async uploadFile(userId: string, file: File, parentId?: string): Promise<DemoFile> {
    const user = await this.getUser(userId)
    if (!user) throw new Error('User not found')

    // Check storage limit
    if (user.storageUsed + file.size > user.storageLimit) {
      throw new Error('Storage limit exceeded')
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const demoFile: DemoFile = {
      id: fileId,
      name: file.name,
      type: 'file',
      mimeType: file.type,
      size: file.size,
      content: await this.readFileAsDataURL(file),
      thumbnail: await this.generateThumbnail(file),
      parentId: parentId || null,
      path: this.buildFilePath(parentId, file.name),
      isStarred: false,
      isShared: false,
      isPublic: false,
      shareSettings: {},
      metadata: {
        version: 1,
        checksum: await this.calculateChecksum(file),
        software: 'YukiFiles Demo'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
      downloadCount: 0,
      viewCount: 0,
      tags: this.extractTags(file.name),
      description: `Uploaded by ${user.name}`,
      uploadedBy: userId
    }

    this.files.set(fileId, demoFile)
    
    // Update user storage
    user.storageUsed += file.size
    this.users.set(userId, user)
    
    this.saveToStorage()
    this.trackAction(userId, 'file_uploaded', `Uploaded ${file.name}`)
    
    return demoFile
  }

  async createFolder(userId: string, name: string, parentId?: string): Promise<DemoFolder> {
    const user = await this.getUser(userId)
    if (!user) throw new Error('User not found')

    const folderId = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const folder: DemoFolder = {
      id: folderId,
      name,
      type: 'folder',
      parentId: parentId || null,
      path: this.buildFilePath(parentId, name),
      isStarred: false,
      isShared: false,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
      createdBy: userId,
      itemCount: 0,
      size: 0
    }

    this.folders.set(folderId, folder)
    this.saveToStorage()
    this.trackAction(userId, 'folder_created', `Created folder ${name}`)
    
    return folder
  }

  async deleteFile(userId: string, fileId: string): Promise<boolean> {
    const file = this.files.get(fileId)
    if (!file || file.uploadedBy !== userId) return false

    const user = await this.getUser(userId)
    if (user) {
      user.storageUsed -= file.size
      this.users.set(userId, user)
    }

    this.files.delete(fileId)
    this.saveToStorage()
    this.trackAction(userId, 'file_deleted', `Deleted ${file.name}`)
    
    return true
  }

  async deleteFolder(userId: string, folderId: string): Promise<boolean> {
    const folder = this.folders.get(folderId)
    if (!folder || folder.createdBy !== userId) return false

    // Delete all files in folder
    for (const [fileId, file] of this.files.entries()) {
      if (file.parentId === folderId) {
        await this.deleteFile(userId, fileId)
      }
    }

    this.folders.delete(folderId)
    this.saveToStorage()
    this.trackAction(userId, 'folder_deleted', `Deleted folder ${folder.name}`)
    
    return true
  }

  // ===== SHARING SYSTEM =====
  async createShareLink(userId: string, fileId: string, settings: any): Promise<DemoShareLink> {
    const file = this.files.get(fileId)
    if (!file || file.uploadedBy !== userId) throw new Error('File not found or access denied')

    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const shareLink: DemoShareLink = {
      id: shareId,
      fileId,
      createdBy: userId,
      token: shareId,
      password: settings.password || null,
      expiresAt: settings.expiresIn ? this.calculateExpiry(settings.expiresIn) : null,
      maxDownloads: settings.maxDownloads || null,
      downloadCount: 0,
      viewCount: 0,
      isActive: true,
      createdAt: new Date(),
      settings: {
        allowDownload: settings.allowDownload !== false,
        allowPreview: settings.allowPreview !== false,
        requireEmail: settings.requireEmail || false,
        notifyOnAccess: settings.notifyOnAccess || false
      }
    }

    this.shareLinks.set(shareId, shareLink)
    
    // Update file sharing status
    file.isShared = true
    file.shareSettings = shareLink.settings
    this.files.set(fileId, file)
    
    this.saveToStorage()
    this.trackAction(userId, 'share_created', `Shared ${file.name}`)
    
    return shareLink
  }

  async accessSharedFile(token: string, password?: string): Promise<DemoFile | null> {
    const shareLink = this.shareLinks.get(token)
    if (!shareLink || !shareLink.isActive) return null

    // Check password
    if (shareLink.password && shareLink.password !== password) {
      return null
    }

    // Check expiration
    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      return null
    }

    // Check download limit
    if (shareLink.maxDownloads && shareLink.downloadCount >= shareLink.maxDownloads) {
      return null
    }

    const file = this.files.get(shareLink.fileId)
    if (!file) return null

    // Update analytics
    shareLink.viewCount++
    this.shareLinks.set(token, shareLink)
    
    this.trackAction('anonymous', 'share_accessed', `Accessed shared file ${file.name}`)
    this.saveToStorage()
    
    return file
  }

  // ===== SEARCH & FILTERING =====
  async searchFiles(userId: string, query: string): Promise<DemoFile[]> {
    const userFiles = Array.from(this.files.values()).filter(f => f.uploadedBy === userId)
    
    return userFiles.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      file.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  async getFilesByFolder(userId: string, folderId?: string): Promise<DemoFile[]> {
    return Array.from(this.files.values()).filter(f => 
      f.uploadedBy === userId && f.parentId === folderId
    )
  }

  async getFoldersByParent(userId: string, parentId?: string): Promise<DemoFolder[]> {
    return Array.from(this.folders.values()).filter(f => 
      f.createdBy === userId && f.parentId === parentId
    )
  }

  // ===== ANALYTICS & TRACKING =====
  private trackAction(userId: string, action: string, description: string): void {
    const userAction: DemoUserAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      description,
      timestamp: new Date(),
      metadata: {}
    }

    this.userActions.push(userAction)
    
    // Keep only last 1000 actions
    if (this.userActions.length > 1000) {
      this.userActions = this.userActions.slice(-1000)
    }
  }

  async getUserAnalytics(userId: string): Promise<any> {
    const userFiles = Array.from(this.files.values()).filter(f => f.uploadedBy === userId)
    const userFolders = Array.from(this.folders.values()).filter(f => f.createdBy === userId)
    const userShares = Array.from(this.shareLinks.values()).filter(s => s.createdBy === userId)

    return {
      totalFiles: userFiles.length,
      totalFolders: userFolders.length,
      totalShares: userShares.length,
      storageUsed: userFiles.reduce((sum, f) => sum + f.size, 0),
      fileTypes: this.getFileTypeDistribution(userFiles),
      recentActivity: this.userActions
        .filter(a => a.userId === userId)
        .slice(-10)
        .reverse()
    }
  }

  // ===== UTILITY FUNCTIONS =====
  private async readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  private async generateThumbnail(file: File): Promise<string | undefined> {
    if (file.type.startsWith('image/')) {
      return await this.readFileAsDataURL(file)
    }
    return undefined
  }

  private async calculateChecksum(file: File): Promise<string> {
    // Simple demo checksum
    return `${file.name}_${file.size}_${file.lastModified}`
  }

  private extractTags(filename: string): string[] {
    const tags: string[] = []
    const ext = filename.split('.').pop()?.toLowerCase()
    
    if (ext) {
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) tags.push('image')
      if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) tags.push('video')
      if (['mp3', 'wav', 'flac'].includes(ext)) tags.push('audio')
      if (['pdf', 'doc', 'docx'].includes(ext)) tags.push('document')
      if (['zip', 'rar', '7z'].includes(ext)) tags.push('archive')
    }
    
    return tags
  }

  private buildFilePath(parentId: string | null, name: string): string[] {
    if (!parentId) return [name]
    
    const parent = this.folders.get(parentId)
    if (parent) {
      return [...parent.path, name]
    }
    
    return [name]
  }

  private calculateExpiry(expiresIn: string): Date {
    const now = new Date()
    switch (expiresIn) {
      case '1d': return new Date(now.getTime() + 24 * 60 * 60 * 1000)
      case '7d': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      case '30d': return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      default: return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    }
  }

  private getFileTypeDistribution(files: DemoFile[]): Record<string, number> {
    const distribution: Record<string, number> = {}
    files.forEach(file => {
      const type = file.mimeType.split('/')[0]
      distribution[type] = (distribution[type] || 0) + 1
    })
    return distribution
  }

  // ===== STORAGE PERSISTENCE =====
  private saveToStorage(): void {
    // Only save to localStorage in browser environment
    if (typeof window === 'undefined') return
    
    try {
      const data = {
        users: Array.from(this.users.entries()),
        files: Array.from(this.files.entries()),
        folders: Array.from(this.folders.entries()),
        shareLinks: Array.from(this.shareLinks.entries()),
        userActions: this.userActions
      }
      localStorage.setItem('yukifiles_demo_data', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save demo data to localStorage:', error)
    }
  }

  private loadFromStorage(): void {
    // Only load from localStorage in browser environment
    if (typeof window === 'undefined') return
    
    try {
      const data = localStorage.getItem('yukifiles_demo_data')
      if (data) {
        const parsed = JSON.parse(data)
        
        if (parsed.users) this.users = new Map(parsed.users)
        if (parsed.files) this.files = new Map(parsed.files)
        if (parsed.folders) this.folders = new Map(parsed.folders)
        if (parsed.shareLinks) this.shareLinks = new Map(parsed.shareLinks)
        if (parsed.userActions) this.userActions = parsed.userActions
      }
    } catch (error) {
      console.warn('Failed to load demo data from localStorage:', error)
    }
  }

  private initializeDemoData(): void {
    // Create demo user if none exists
    if (this.users.size === 0) {
      this.createUser('demo@yukifiles.com', 'demo123', 'Demo User')
    }
  }
}

// Export singleton instance
export const demoBackend = new DemoBackend()
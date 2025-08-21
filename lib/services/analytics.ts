import { createServerClient } from "@/lib/supabase/server"

export interface AnalyticsEvent {
  id?: string
  user_id?: string
  file_id?: string
  event_type: 'file_upload' | 'file_download' | 'file_view' | 'file_share' | 'user_register' | 'user_login'
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at?: string
}

export interface AnalyticsStats {
  totalFiles: number
  totalDownloads: number
  totalViews: number
  totalUsers: number
  storageUsed: number
  popularFiles: Array<{
    id: string
    name: string
    downloads: number
    views: number
  }>
  userActivity: Array<{
    date: string
    uploads: number
    downloads: number
    registrations: number
  }>
}

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const supabase = await createServerClient()
    if (!supabase) return

    const { error } = await supabase.from("analytics_events").insert({
      user_id: event.user_id,
      file_id: event.file_id,
      event_type: event.event_type,
      metadata: event.metadata || {},
      ip_address: event.ip_address,
      user_agent: event.user_agent,
      created_at: new Date().toISOString()
    })

    if (error) {
      console.error("Analytics tracking error:", error)
    }
  } catch (error) {
    console.error("Failed to track analytics event:", error)
  }
}

export async function getAnalyticsStats(timeframe: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<AnalyticsStats | null> {
  try {
    const supabase = await createServerClient()
    if (!supabase) return null

    const now = new Date()
    const startDate = new Date()
    
    switch (timeframe) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get basic stats
    const [
      { data: files },
      { data: users },
      { data: events }
    ] = await Promise.all([
      supabase.from("files").select("id, file_size"),
      supabase.from("users").select("id"),
      supabase.from("analytics_events").select("*").gte("created_at", startDate.toISOString())
    ])

    const totalFiles = files?.length || 0
    const totalUsers = users?.length || 0
    const storageUsed = files?.reduce((sum, file) => sum + (file.file_size || 0), 0) || 0

    const downloadEvents = events?.filter(e => e.event_type === 'file_download') || []
    const viewEvents = events?.filter(e => e.event_type === 'file_view') || []
    
    const totalDownloads = downloadEvents.length
    const totalViews = viewEvents.length

    // Get popular files
    const fileStats = new Map<string, { downloads: number, views: number }>()
    
    downloadEvents.forEach(event => {
      if (event.file_id) {
        const stats = fileStats.get(event.file_id) || { downloads: 0, views: 0 }
        stats.downloads++
        fileStats.set(event.file_id, stats)
      }
    })

    viewEvents.forEach(event => {
      if (event.file_id) {
        const stats = fileStats.get(event.file_id) || { downloads: 0, views: 0 }
        stats.views++
        fileStats.set(event.file_id, stats)
      }
    })

    const popularFiles = await Promise.all(
      Array.from(fileStats.entries())
        .sort(([,a], [,b]) => (b.downloads + b.views) - (a.downloads + a.views))
        .slice(0, 10)
        .map(async ([fileId, stats]) => {
          const { data: fileData } = await supabase.from("files").select("original_name").eq("id", fileId).single()
          return {
            id: fileId,
            name: fileData?.original_name || 'Unknown',
            downloads: stats.downloads,
            views: stats.views
          }
        })
    )

    // Get user activity by day
    const activityMap = new Map<string, { uploads: number, downloads: number, registrations: number }>()
    
    events?.forEach(event => {
      const date = new Date(event.created_at).toISOString().split('T')[0]
      const activity = activityMap.get(date) || { uploads: 0, downloads: 0, registrations: 0 }
      
      switch (event.event_type) {
        case 'file_upload':
          activity.uploads++
          break
        case 'file_download':
          activity.downloads++
          break
        case 'user_register':
          activity.registrations++
          break
      }
      
      activityMap.set(date, activity)
    })

    const userActivity = Array.from(activityMap.entries())
      .map(([date, activity]) => ({ date, ...activity }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return {
      totalFiles,
      totalDownloads,
      totalViews,
      totalUsers,
      storageUsed,
      popularFiles,
      userActivity
    }
  } catch (error) {
    console.error("Failed to get analytics stats:", error)
    return null
  }
}

export async function trackFileDownload(fileId: string, userId?: string, ipAddress?: string): Promise<void> {
  await trackEvent({
    user_id: userId,
    file_id: fileId,
    event_type: 'file_download',
    ip_address: ipAddress,
    metadata: { timestamp: new Date().toISOString() }
  })
}

export async function trackFileView(fileId: string, userId?: string, ipAddress?: string): Promise<void> {
  await trackEvent({
    user_id: userId,
    file_id: fileId,
    event_type: 'file_view',
    ip_address: ipAddress,
    metadata: { timestamp: new Date().toISOString() }
  })
}

export async function trackFileUpload(fileId: string, userId: string, fileSize: number, mimeType?: string): Promise<void> {
  await trackEvent({
    user_id: userId,
    file_id: fileId,
    event_type: 'file_upload',
    metadata: { 
      file_size: fileSize,
      mime_type: mimeType,
      timestamp: new Date().toISOString()
    }
  })
}
"use client"

import React from "react"
import ProfessionalCharts from "@/components/dashboard/ProfessionalCharts"
import ActivityFeed, { ActivityItem } from "@/components/dashboard/ActivityFeed"
import RecentFiles from "@/components/dashboard/RecentFiles"
import { EnhancedFileManager } from "@/components/file-manager/enhanced-file-manager"

interface EnhancedDemoManagerProps {
  userData: any
  recentFiles: any[]
  recentActivity: ActivityItem[]
}

export function EnhancedDemoManager({ userData, recentFiles, recentActivity }: EnhancedDemoManagerProps) {
  // Map demo recent files to FileItem shape expected by EnhancedFileManager
  const mappedFiles = (recentFiles || []).map((fileItem: any) => ({
    id: fileItem.id,
    name: fileItem.original_name || fileItem.name || 'untitled.txt',
    type: fileItem.mime_type || 'application/octet-stream',
    size: fileItem.file_size || fileItem.size || 0,
    lastModified: new Date(fileItem.created_at || Date.now()),
    isFolder: false,
    content: fileItem.content || '',
    thumbnail: fileItem.thumbnail,
    isStarred: Boolean(fileItem.is_starred || fileItem.isStarred),
    isShared: Boolean(fileItem.is_public || fileItem.isShared),
    owner: fileItem.owner,
    path: '/'
  }))

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ProfessionalCharts isPremium={userData?.subscription_type === "paid"} isDemoMode={true} />
          <ActivityFeed activities={recentActivity} />
        </div>
        <div className="order-first lg:order-last">
          <RecentFiles files={recentFiles} />
        </div>
      </div>
      {/* In demo, we only show a summary. Full file manager available at /files */}
    </div>
  )
}
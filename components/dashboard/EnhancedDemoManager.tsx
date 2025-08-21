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
  const mappedFiles = recentFiles.map((f: any) => ({
    id: f.id,
    name: f.original_name || f.name || 'untitled.txt',
    type: f.mime_type || 'application/octet-stream',
    size: f.file_size || f.size || 0,
    lastModified: new Date(f.created_at || Date.now()),
    isFolder: false,
    content: f.content || '',
    thumbnail: f.thumbnail,
    isStarred: Boolean(f.is_starred || f.isStarred),
    isShared: Boolean(f.is_public || f.isShared),
    owner: f.owner,
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
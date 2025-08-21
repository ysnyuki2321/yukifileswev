"use client"

import React from "react"
import QuickActions from "@/components/dashboard/QuickActions"
import ActivityFeed, { type ActivityItem } from "@/components/dashboard/ActivityFeed"
import RecentFiles, { type RecentFileItem } from "@/components/dashboard/RecentFiles"
// File manager is available on its own page now

interface EnhancedDemoManagerProps {
  userData: any
  recentFiles: RecentFileItem[]
  recentActivity: ActivityItem[]
}

export function EnhancedDemoManager({ userData, recentFiles, recentActivity }: EnhancedDemoManagerProps) {
  // Keep recent files in dashboard only; full manager moved to /files

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <QuickActions isPremium={userData?.subscription_type === "paid"} />
          <ActivityFeed activities={recentActivity} />
        </div>
        <div className="order-first lg:order-last">
          <RecentFiles files={recentFiles} />
        </div>
      </div>

      {/* Link to full File Manager page */}
      <div className="flex justify-end">
        <a href="/files" className="text-sm text-purple-300 hover:text-white underline">Open full File Manager →</a>
      </div>
    </div>
  )
}
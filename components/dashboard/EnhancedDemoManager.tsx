"use client"

import React from "react"
import QuickActions from "@/components/dashboard/QuickActions"
import ActivityFeed, { ActivityItem } from "@/components/dashboard/ActivityFeed"
import RecentFiles from "@/components/dashboard/RecentFiles"
import { DemoFileManager } from "@/components/dashboard/DemoFileManager"

interface EnhancedDemoManagerProps {
  userData: any
  recentFiles: any[]
  recentActivity: ActivityItem[]
}

export function EnhancedDemoManager({ userData, recentFiles, recentActivity }: EnhancedDemoManagerProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <QuickActions isPremium={userData?.subscription_type === "paid"} />
          <ActivityFeed activities={recentActivity} />
        </div>
        <div className="order-first lg:order-last">
          <RecentFiles files={recentFiles} />
        </div>
      </div>
      {/* Demo File Manager */}
      <DemoFileManager />
    </div>
  )
}
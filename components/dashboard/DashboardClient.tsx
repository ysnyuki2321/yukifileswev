"use client"

import { useState, useEffect, Suspense } from "react"
import { createClientComponentClient } from "@supabase/ssr"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProfessionalCharts from "@/components/dashboard/ProfessionalCharts"
import ActivityFeed from "@/components/dashboard/ActivityFeed"
import { ActivityItem } from "@/components/dashboard/ActivityFeed"
import RecentFiles from "@/components/dashboard/RecentFiles"
import AIToolsDemo from "@/components/dashboard/AIToolsDemo"
import CollaborationDemo from "@/components/dashboard/CollaborationDemo"
import PaymentDemo from "@/components/dashboard/PaymentDemo"
import DiskManagementDemo from "@/components/dashboard/DiskManagementDemo"
import { EnhancedDemoManager } from "@/components/dashboard/EnhancedDemoManager"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"
import { getMockUserData } from "@/lib/services/debug-context"
import { PageSkeleton } from "@/components/ui/loading-skeleton"
import { useSearchParams } from "next/navigation"

export default function DashboardClient() {
  const searchParams = useSearchParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [recentFiles, setRecentFiles] = useState<any[]>([])
  const [filesCount, setFilesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const isDemoMode = searchParams?.get('demo') === 'true'

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      if (isDemoMode) {
        setUser({ email: "demo@yukifiles.com", id: "demo-user-123" })
        setUserData(getMockUserData())
        try {
          const res = await fetch('/api/debug/files', { cache: 'no-store' })
          const data = await res.json()
          const dbg = Array.isArray(data.files) ? data.files : []
          setRecentFiles(dbg.slice(0, 8))
          setFilesCount(dbg.length)
        } catch (e) {
          console.error('Failed to load demo files:', e)
          setRecentFiles([])
          setFilesCount(0)
        }
      } else {
        try {
          const supabase = createClientComponentClient()
          const { data: { user: authUser } } = await supabase.auth.getUser()
          if (!authUser) {
            window.location.href = "/auth/login"
            return
          }
          setUser(authUser)
          const { data: userDataResult } = await supabase
            .from("users")
            .select("*")
            .eq("email", authUser.email)
            .single()
          setUserData(userDataResult)
          const { data: filesData } = await supabase
            .from("files")
            .select("id, original_name, file_size, share_token, created_at")
            .eq("user_id", userDataResult?.id)
            .order("created_at", { ascending: false })
          setRecentFiles(filesData?.slice(0, 8) || [])
          setFilesCount(filesData?.length || 0)
        } catch (error) {
          console.error("Error loading dashboard data:", error)
        }
      }

      setLoading(false)
    }

    loadData()
  }, [isDemoMode])

  const brandName = "YukiFiles"

  const recentActivity: ActivityItem[] = [
    { id: '1', type: 'upload', fileName: 'document.pdf', timestamp: '2 hours ago', fileType: 'document' },
    { id: '2', type: 'share', fileName: 'presentation.pptx', timestamp: '1 day ago', fileType: 'presentation' },
    { id: '3', type: 'download', fileName: 'image.jpg', timestamp: '3 days ago', fileType: 'image' }
  ]

  if (loading) return <PageSkeleton />
  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="flex">
        <Sidebar 
          isAdmin={Boolean(userData?.is_admin)}
          brandName={brandName}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={isDemoMode ? "overview" : undefined}
        />
        <div className="flex-1 min-w-0">
          <Topbar 
            userEmail={user.email!}
            isPremium={userData?.subscription_type === "paid"}
            brandName={brandName}
            isDemoMode={isDemoMode}
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="container mx-auto px-4 py-6">
            <div className="space-y-8">
              <DashboardHeader 
                userData={userData}
                filesCount={filesCount}
                recentActivity={recentActivity}
              />
              {isDemoMode ? (
                <EnhancedDemoManager 
                  userData={userData}
                  recentFiles={recentFiles}
                  recentActivity={recentActivity}
                />
              ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    <ProfessionalCharts isPremium={userData?.subscription_type === "paid"} isDemoMode={isDemoMode} />
                    <ActivityFeed activities={recentActivity} />
                  </div>
                  <div className="order-first lg:order-last">
                    <RecentFiles files={recentFiles} />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}


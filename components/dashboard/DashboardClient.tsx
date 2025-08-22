"use client"

import { useState, useEffect, Suspense } from "react"
import "@/lib/utils/yuki-j-safe-mode"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProfessionalCharts from "@/components/dashboard/ProfessionalCharts"
import ActivityFeed from "@/components/dashboard/ActivityFeed"
type ActivityItem = any
import RecentFiles from "@/components/dashboard/RecentFiles"
import AIToolsDemo from "@/components/dashboard/AIToolsDemo"
import CollaborationDemo from "@/components/dashboard/CollaborationDemo"
import PaymentDemo from "@/components/dashboard/PaymentDemo"
import DiskManagementDemo from "@/components/dashboard/DiskManagementDemo"
import { SafeDemoWrapper } from "@/components/dashboard/SafeDemoWrapper"
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
  const activeTab = searchParams?.get('tab') || 'dashboard'

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      if (isDemoMode) {
        setUser({ email: "demo@yukifiles.com", id: "demo-user-123" })
        setUserData(getMockUserData())
        
        // Use beautiful mock data instead of API calls
        const mockFiles = [
          {
            id: 'demo-1',
            original_name: 'project-proposal.pdf',
            name: 'project-proposal.pdf',
            mime_type: 'application/pdf',
            file_size: 2547893,
            size: 2547893,
            created_at: new Date().toISOString(),
            content: 'Mock PDF content',
            thumbnail: null,
            is_starred: false,
            isStarred: false,
            is_public: true,
            isShared: true,
            owner: 'demo@yukifiles.com'
          },
          {
            id: 'demo-2',
            original_name: 'app.tsx',
            name: 'app.tsx',
            mime_type: 'text/tsx',
            file_size: 1520,
            size: 1520,
            created_at: new Date().toISOString(),
            content: 'import React from "react"\nexport default function App() {\n  return <div>Hello YukiFiles</div>\n}',
            thumbnail: null,
            is_starred: true,
            isStarred: true,
            is_public: false,
            isShared: false,
            owner: 'demo@yukifiles.com'
          },
          {
            id: 'demo-3',
            original_name: 'Beautiful_Landscape.jpg',
            name: 'Beautiful_Landscape.jpg',
            mime_type: 'image/jpeg',
            file_size: 3247891,
            size: 3247891,
            created_at: new Date().toISOString(),
            content: 'https://cdn.discordapp.com/attachments/1234567890/demo-image.jpg',
            thumbnail: 'https://cdn.discordapp.com/attachments/1234567890/demo-thumb.jpg',
            is_starred: false,
            isStarred: false,
            is_public: true,
            isShared: true,
            owner: 'demo@yukifiles.com'
          }
        ]
        
        setRecentFiles(mockFiles)
        setFilesCount(mockFiles.length)
      } else {
        // For non-demo mode, use simple mock data too (no Supabase to prevent j error)
        const authUser = { email: "user@yukifiles.com", id: "user-123" }
        setUser(authUser)
        setUserData(getMockUserData())
        setRecentFiles([])
        setFilesCount(0)
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
    <JErrorShield maxRetries={3}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <div className="flex">
          <JErrorShield>
            <Sidebar 
              isAdmin={Boolean(userData?.is_admin)}
              brandName={brandName}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              activeTab={isDemoMode ? "overview" : undefined}
            />
          </JErrorShield>
          <div className="flex-1 min-w-0">
            <JErrorShield>
              <Topbar 
                userEmail={user.email!}
                isPremium={userData?.subscription_type === "paid"}
                brandName={brandName}
                isDemoMode={isDemoMode}
                onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            </JErrorShield>
            <main className="container mx-auto px-4 py-6">
              <div className="space-y-8">
                <JErrorShield>
                  <DashboardHeader 
                    userData={userData}
                    filesCount={filesCount}
                    recentActivity={recentActivity}
                  />
                </JErrorShield>
                {isDemoMode ? (
                  <div className="space-y-6">
                    {activeTab === 'dashboard' && (
                      <JErrorShield>
                        <EnhancedDemoManager 
                          userData={userData}
                          recentFiles={recentFiles}
                          recentActivity={recentActivity}
                        />
                      </JErrorShield>
                    )}
                    {activeTab === 'analytics' && (
                      <JErrorShield>
                        <SafeDemoWrapper fallbackTitle="Loading Analytics...">
                          <ProfessionalCharts isPremium={userData?.subscription_type === "paid"} isDemoMode={true} />
                        </SafeDemoWrapper>
                      </JErrorShield>
                    )}
                    {activeTab === 'ai' && (
                      <JErrorShield>
                        <SafeDemoWrapper fallbackTitle="Loading AI Tools...">
                          <AIToolsDemo isDemoMode={true} />
                        </SafeDemoWrapper>
                      </JErrorShield>
                    )}
                    {activeTab === 'collaboration' && (
                      <JErrorShield>
                        <SafeDemoWrapper fallbackTitle="Loading Collaboration...">
                          <CollaborationDemo isDemoMode={true} />
                        </SafeDemoWrapper>
                      </JErrorShield>
                    )}
                    {activeTab === 'pricing' && (
                      <JErrorShield>
                        <SafeDemoWrapper fallbackTitle="Loading Payment System...">
                          <PaymentDemo isDemoMode={true} />
                        </SafeDemoWrapper>
                      </JErrorShield>
                    )}
                    {activeTab === 'admin' && userData?.is_admin && (
                      <JErrorShield>
                        <SafeDemoWrapper fallbackTitle="Loading Infrastructure...">
                          <DiskManagementDemo isDemoMode={true} />
                        </SafeDemoWrapper>
                      </JErrorShield>
                    )}
                  </div>
                ) : (
                  <JErrorShield>
                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="lg:col-span-2 space-y-6">
                        <ProfessionalCharts isPremium={userData?.subscription_type === "paid"} isDemoMode={isDemoMode} />
                        <ActivityFeed activities={recentActivity} />
                      </div>
                      <div className="order-first lg:order-last">
                        <RecentFiles files={recentFiles} />
                      </div>
                    </div>
                  </JErrorShield>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </JErrorShield>
  )
}


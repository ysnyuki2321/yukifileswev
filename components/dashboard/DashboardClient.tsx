"use client"

import { useState, useEffect, Suspense } from "react"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProfessionalCharts from "@/components/dashboard/ProfessionalCharts"
import ActivityFeed from "@/components/dashboard/ActivityFeed"
import RecentFiles from "@/components/dashboard/RecentFiles"
import AIToolsDemo from "@/components/dashboard/AIToolsDemo"
import CollaborationDemo from "@/components/dashboard/CollaborationDemo"
import PaymentDemo from "@/components/dashboard/PaymentDemo"
import DiskManagementDemo from "@/components/dashboard/DiskManagementDemo"
import { AdminDemo } from "@/components/dashboard/AdminDemo"
import { SettingsDemo } from "@/components/dashboard/SettingsDemo"
import { UltimateFileManagerDemo } from "@/components/demo/UltimateFileManagerDemo"
import { SimpleErrorScreen } from "@/components/ui/simple-error-screen"
import Sidebar from "@/components/dashboard/Sidebar"
import { MobileSidebar } from "@/components/dashboard/MobileSidebar"
import Topbar from "@/components/dashboard/Topbar"
import { getMockUserData } from "@/lib/services/debug-context"
import { PageSkeleton } from "@/components/ui/loading-skeleton"
import { useSearchParams } from "next/navigation"
import React, { Component, ErrorInfo, ReactNode } from "react"

// Simple Error Boundary for Dashboard Components
class DashboardErrorBoundary extends Component<
  { children: ReactNode; fallbackTitle?: string },
  { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null }
> {
  constructor(props: { children: ReactNode; fallbackTitle?: string }) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard Error:', error)
    console.error('Error Info:', errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <SimpleErrorScreen 
          error={this.state.error || undefined}
          errorInfo={this.state.errorInfo || undefined}
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      )
    }

    return this.props.children
  }
}

export default function DashboardClient() {
  const searchParams = useSearchParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [recentFiles, setRecentFiles] = useState<any[]>([])
  const [filesCount, setFilesCount] = useState(0)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const isDemoMode = searchParams?.get('demo') === 'true'
  const activeTab = searchParams?.get('tab') || 'dashboard'

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        if (isDemoMode) {
          setUser({ email: "demo@yukifiles.com", id: "demo-user-123" })
          const mockData = getMockUserData()
          // Ensure admin access in demo mode
          mockData.is_admin = true
          mockData.subscription_type = "paid"
          setUserData(mockData)
          
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
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com'
            },
            {
              id: 'demo-2',
              original_name: 'presentation.pptx',
              name: 'presentation.pptx',
              mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              file_size: 5892103,
              size: 5892103,
              created_at: new Date(Date.now() - 86400000).toISOString(),
              content: 'Mock PowerPoint content',
              thumbnail: null,
              is_starred: true,
              isStarred: true,
              is_public: true,
              isShared: true,
              owner: 'demo@yukifiles.com'
            },
            {
              id: 'demo-3',
              original_name: 'team-photo.jpg',
              name: 'team-photo.jpg',
              mime_type: 'image/jpeg',
              file_size: 1234567,
              size: 1234567,
              created_at: new Date(Date.now() - 172800000).toISOString(),
              content: 'Mock image content',
              thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzFFMUUyRSIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSIjNkM3Mjg1Ii8+CjxwYXRoIGQ9Ik0xNiAyMEMyMC40MTgzIDIwIDI0IDIzLjU4MTcgMjQgMjhIMTZWMjBaIiBmaWxsPSIjOEI1Q0Y2Ii8+Cjwvc3ZnPgo=',
              is_starred: false,
              isStarred: false,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com'
            }
          ]
          
          const mockActivity = [
            { id: '1', type: 'upload', fileName: 'project-proposal.pdf', timestamp: new Date().toISOString() },
            { id: '2', type: 'share', fileName: 'presentation.pptx', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: '3', type: 'download', fileName: 'team-photo.jpg', timestamp: new Date(Date.now() - 7200000).toISOString() }
          ]
          
          setRecentFiles(mockFiles)
          setFilesCount(mockFiles.length)
          setRecentActivity(mockActivity)
        } else {
          // Regular mode - would load from API
          setUser({ email: "user@example.com", id: "user-123" })
          setUserData({ 
            id: "user-123",
            email: "user@example.com",
            subscription_type: "free",
            quota_used: 0,
            quota_limit: 2000000000,
            is_admin: false
          })
          setRecentFiles([])
          setFilesCount(0)
          setRecentActivity([])
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isDemoMode])

  if (loading) {
    return <PageSkeleton />
  }

  const renderTabContent = () => {
    if (!isDemoMode) {
      return (
        <div className="space-y-6">
          <DashboardHeader 
            userData={userData}
            filesCount={filesCount}
            recentActivity={recentActivity}
          />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <ProfessionalCharts isPremium={userData?.subscription_type === "paid"} isDemoMode={false} />
              <ActivityFeed activities={recentActivity || []} />
            </div>
            <div className="order-first lg:order-last">
              <RecentFiles files={recentFiles || []} />
            </div>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardHeader 
              userData={userData}
              filesCount={filesCount}
              recentActivity={recentActivity}
              isDemoMode={isDemoMode}
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <ProfessionalCharts isPremium={userData?.subscription_type === "paid"} isDemoMode={isDemoMode} />
                <ActivityFeed activities={recentActivity || []} />
              </div>
              <div className="order-first lg:order-last">
                <RecentFiles files={recentFiles || []} />
              </div>
            </div>
          </div>
        )
      
      case 'filemanager':
        return <UltimateFileManagerDemo />
        
      case 'analytics':
        return <ProfessionalCharts isPremium={userData?.subscription_type === "paid"} isDemoMode={true} />
        
      case 'ai':
        return <AIToolsDemo isDemoMode={true} />
        
      case 'collaboration':
        return <CollaborationDemo isDemoMode={true} />
        
      case 'pricing':
        return <PaymentDemo isDemoMode={true} />
        
      case 'admin':
        return <AdminDemo />
        
      case 'settings':
        return <SettingsDemo />
        
      case 'infrastructure':
        return userData?.is_admin ? <DiskManagementDemo isDemoMode={true} /> : null
        
      default:
        return (
          <div className="space-y-6">
            <DashboardHeader 
              userData={userData}
              filesCount={filesCount}
              recentActivity={recentActivity}
              isDemoMode={isDemoMode}
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <ProfessionalCharts isPremium={userData?.subscription_type === "paid"} isDemoMode={isDemoMode} />
                <ActivityFeed activities={recentActivity || []} />
              </div>
              <div className="order-first lg:order-last">
                <RecentFiles files={recentFiles || []} />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col">
            <Sidebar 
              isAdmin={userData?.is_admin} 
              activeTab={activeTab}
            />
          </div>

          {/* Mobile Sidebar */}
          <MobileSidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isAdmin={userData?.is_admin}
            activeTab={activeTab}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar 
              user={user}
              userData={userData}
              isDemoMode={isDemoMode}
              onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto px-4 py-6 max-w-7xl">
                <Suspense fallback={<PageSkeleton />}>
                  {renderTabContent()}
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      </div>
    </DashboardErrorBoundary>
  )
}


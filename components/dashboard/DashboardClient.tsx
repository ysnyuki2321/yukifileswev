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
import { Topbar } from "@/components/dashboard/Topbar"
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
            // Folders
            {
              id: 'folder-1',
              original_name: 'Documents',
              name: 'Documents',
              mime_type: 'folder',
              file_size: 0,
              size: 0,
              created_at: new Date('2024-01-15T10:30:00Z').toISOString(),
              content: '',
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'folder',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },
            {
              id: 'folder-2',
              original_name: 'Media',
              name: 'Media',
              mime_type: 'folder',
              file_size: 0,
              size: 0,
              created_at: new Date('2024-01-15T11:00:00Z').toISOString(),
              content: '',
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'folder',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },
            {
              id: 'folder-3',
              original_name: 'Projects',
              name: 'Projects',
              mime_type: 'folder',
              file_size: 0,
              size: 0,
              created_at: new Date('2024-01-15T12:00:00Z').toISOString(),
              content: '',
              thumbnail: null,
              is_starred: true,
              isStarred: true,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'folder',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },
            {
              id: 'folder-4',
              original_name: 'Demo Test Folder',
              name: 'Demo Test Folder',
              mime_type: 'folder',
              file_size: 0,
              size: 0,
              created_at: new Date('2024-01-15T13:00:00Z').toISOString(),
              content: '',
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: true,
              isShared: true,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'folder',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },
            {
              id: 'folder-4',
              original_name: 'Code Examples',
              name: 'Code Examples',
              mime_type: 'folder',
              file_size: 0,
              size: 0,
              created_at: new Date('2024-01-15T13:00:00Z').toISOString(),
              content: '',
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: true,
              isShared: true,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'folder',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },

            // Code Files in Code Examples folder
            {
              id: 'code-1',
              original_name: 'app.js',
              name: 'app.js',
              mime_type: 'application/javascript',
              file_size: 15360,
              size: 15360,
              created_at: new Date('2024-01-15T16:00:00Z').toISOString(),
              content: `// YukiFiles Demo App
import React from 'react';

function App() {
  return (
    <div className="app">
      <h1>Welcome to YukiFiles</h1>
      <p>This is a demo file manager application.</p>
    </div>
  );
}

export default App;`,
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'code',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },
            {
              id: 'code-2',
              original_name: 'styles.css',
              name: 'styles.css',
              mime_type: 'text/css',
              file_size: 8192,
              size: 8192,
              created_at: new Date('2024-01-15T16:30:00Z').toISOString(),
              content: `/* YukiFiles Demo Styles */
.app {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Inter', sans-serif;
}

.app h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
}

.app p {
  font-size: 1.2rem;
  opacity: 0.9;
  text-align: center;
}`,
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'code',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },
            {
              id: 'code-3',
              original_name: 'index.html',
              name: 'index.html',
              mime_type: 'text/html',
              file_size: 2048,
              size: 2048,
              created_at: new Date('2024-01-15T17:00:00Z').toISOString(),
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YukiFiles Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="root"></div>
    <script src="app.js"></script>
</body>
</html>`,
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'code',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },
            {
              id: 'code-4',
              original_name: 'package.json',
              name: 'package.json',
              mime_type: 'application/json',
              file_size: 1024,
              size: 1024,
              created_at: new Date('2024-01-15T17:30:00Z').toISOString(),
              content: `{
  "name": "yukifiles-demo",
  "version": "1.0.0",
  "description": "A demo file manager application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "nodemon": "^2.0.0"
  }
}`,
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'code',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },

            // Discord Audio
            {
              id: 'audio-1',
              original_name: 'NAKISO - Track.mp3',
              name: 'NAKISO - Track.mp3',
              mime_type: 'audio/mpeg',
              file_size: 5242880,
              size: 5242880,
              created_at: new Date('2024-01-15T13:00:00Z').toISOString(),
              content: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408373313759219722/NAKISO_-_.mp3?ex=68a9815c&is=68a82fdc&hm=f33af4367697c580038c23e870ddbe03680cdfb1ca0686e9692b243ca935a260&',
              thumbnail: null,
              is_starred: true,
              isStarred: true,
              is_public: true,
              isShared: true,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'audio',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: 'NAKISO',
              album: 'Demo Album',
              albumArt: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159531212472340/9a158cfef15faa3a2bb0d910d5bace0f.jpg?ex=68aa0bc2&is=68a8ba42&hm=7b8e6a548ea63488dd4df70f6b7730de231d365166deedc7f0d102cc116a4056&'
            },

            // Discord Image
            {
              id: 'image-1',
              original_name: 'demo-image.jpg',
              name: 'demo-image.jpg',
              mime_type: 'image/jpeg',
              file_size: 2097152,
              size: 2097152,
              created_at: new Date('2024-01-15T14:00:00Z').toISOString(),
              content: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159531212472340/9a158cfef15faa3a2bb0d910d5bace0f.jpg?ex=68aa0bc2&is=68a8ba42&hm=7b8e6a548ea63488dd4df70f6b7730de231d365166deedc7f0d102cc116a4056&',
              thumbnail: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159531212472340/9a158cfef15faa3a2bb0d910d5bace0f.jpg?ex=68aa0bc2&is=68a8ba42&hm=7b8e6a548ea63488dd4df70f6b7730de231d365166deedc7f0d102cc116a4056&',
              is_starred: false,
              isStarred: false,
              is_public: true,
              isShared: true,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'image',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },

            // Discord Video
            {
              id: 'video-1',
              original_name: 'demo-video.mp4',
              name: 'demo-video.mp4',
              mime_type: 'video/mp4',
              file_size: 15728640,
              size: 15728640,
              created_at: new Date('2024-01-15T15:00:00Z').toISOString(),
              content: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159523310538844/83cb90295730d846323a14bbd13dc777.mp4?ex=68aa0bc0&is=68a8ba40&hm=b9eed69866daa68598b5aeed80fe56ba5cb6219c54385995fbb4d4998e1cd8af&',
              thumbnail: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159523310538844/83cb90295730d846323a14bbd13dc777.mp4?ex=68aa0bc0&is=68a8ba40&hm=b9eed69866daa68598b5aeed80fe56ba5cb6219c54385995fbb4d4998e1cd8af&',
              is_starred: true,
              isStarred: true,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com',
              hasPassword: true,
              inArchive: false,
              category: 'video',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },

            // Text Files
            {
              id: 'text-1',
              original_name: 'README.md',
              name: 'README.md',
              mime_type: 'text/markdown',
              file_size: 2048,
              size: 2048,
              created_at: new Date('2024-01-15T17:00:00Z').toISOString(),
              content: `# YukiFiles Demo

## Features
- File management
- Media preview
- Sharing capabilities
- Security features

## Getting Started
1. Upload files
2. Organize in folders
3. Share with others

Created: ${new Date().toLocaleDateString()}`,
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: true,
              isShared: true,
              owner: 'demo@yukifiles.com',
              hasPassword: false,
              inArchive: false,
              category: 'text',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
            },

            // Database Files
            {
              id: 'db-1',
              original_name: 'users.db',
              name: 'users.db',
              mime_type: 'application/x-sqlite3',
              file_size: 1048576,
              size: 1048576,
              created_at: new Date('2024-01-15T18:00:00Z').toISOString(),
              content: '',
              thumbnail: null,
              is_starred: false,
              isStarred: false,
              is_public: false,
              isShared: false,
              owner: 'demo@yukifiles.com',
              hasPassword: true,
              inArchive: false,
              category: 'database',
              encryptedName: null,
              accessLimits: null,
              expiresAt: null,
              artist: null,
              album: null,
              albumArt: null
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


import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import QuickActions from "@/components/dashboard/QuickActions"
import ActivityFeed from "@/components/dashboard/ActivityFeed"
import RecentFiles from "@/components/dashboard/RecentFiles"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"
import { isDebugModeEnabled, getMockUserData } from "@/lib/services/debug-context"
import { getDebugFiles } from "@/lib/services/debug-user"
import { PageSkeleton } from "@/components/ui/loading-skeleton"
import { Suspense } from "react"

export default async function DashboardPage() {
  const supabase = await createServerClient()
  
  // Check debug mode first
  const debugMode = await isDebugModeEnabled()
  let user = null
  let userData = null
  let recentFiles: any[] = []
  let filesCount = 0
  
  if (debugMode) {
    console.log("[v0] Debug mode enabled - using mock data for dashboard")
    user = { email: "debug@yukifiles.com", id: "debug-user-123" }
    userData = getMockUserData()
    recentFiles = getDebugFiles().slice(0, 8)
    filesCount = getDebugFiles().length
  } else {
    if (!supabase) {
      redirect("/auth/login")
    }

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      redirect("/auth/login")
    }
    
    user = authUser
    const { data: userDataResult } = await supabase.from("users").select("*").eq("email", user.email).single()
    userData = userDataResult

    // Get files count and recent files
    const { data: filesData } = await supabase
      .from("files")
      .select("id, original_name, file_size, share_token, created_at")
      .eq("user_id", userData?.id)
      .order("created_at", { ascending: false })
    
    recentFiles = filesData?.slice(0, 8) || []
    filesCount = filesData?.length || 0
  }

  // Get brand name from admin settings
  let brandName = "YukiFiles"
  if (!debugMode && supabase) {
    const { data: adminSettings } = await supabase.from("admin_settings").select("setting_key, setting_value")
    const settingsMap = (adminSettings || []).reduce((acc: Record<string, string>, s: any) => {
      acc[s.setting_key] = s.setting_value
      return acc
    }, {} as Record<string, string>)
    brandName = settingsMap["brand_name"] || "YukiFiles"
  }

  // Mock recent activity for now
  const recentActivity = [
    {
      id: "1",
      type: "upload" as const,
      fileName: "document.pdf",
      timestamp: new Date().toISOString()
    },
    {
      id: "2", 
      type: "share" as const,
      fileName: "image.jpg",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "3",
      type: "download" as const,
      fileName: "video.mp4",
      timestamp: new Date(Date.now() - 7200000).toISOString()
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="flex">
        <Sidebar isAdmin={Boolean(userData?.is_admin)} brandName={brandName} />
        <div className="flex-1 min-w-0">
          <Topbar userEmail={user.email!} isPremium={userData?.subscription_type === "paid"} brandName={brandName} />
          <main className="container mx-auto px-4 py-6">
            <Suspense fallback={<PageSkeleton />}>
              <div className="space-y-8">
                <DashboardHeader 
                  userData={userData}
                  filesCount={filesCount}
                  recentActivity={recentActivity}
                />
                
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    <QuickActions isPremium={userData?.subscription_type === "paid"} />
                    <ActivityFeed activities={recentActivity} />
                  </div>
                  <div>
                    <RecentFiles files={recentFiles} />
                  </div>
                </div>
              </div>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

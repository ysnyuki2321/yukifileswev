import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ThemeProvider } from "@/components/theme/theme-provider"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ActivityFeed from "@/components/dashboard/ActivityFeed"
import QuickActions from "@/components/dashboard/QuickActions"
import RecentFiles, { type RecentFileItem } from "@/components/dashboard/RecentFiles"
import { isDebugModeEnabled, getDebugUser, getDebugFiles } from "@/lib/services/debug-user"

export default async function DashboardPage() {
  const supabase = createServerClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  // Check debug mode - if enabled, use debug user data
  const debugMode = await isDebugModeEnabled()
  let user = null
  let userData = null
  let recentFiles: RecentFileItem[] = []
  
  if (debugMode) {
    console.log("[v0] Debug mode enabled - using debug user data")
    user = { email: "debug@yukifiles.com", id: "debug-user-123" }
    userData = getDebugUser()
    recentFiles = getDebugFiles().slice(0, 8) as RecentFileItem[]
  } else {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      redirect("/auth/login")
    }
    
    user = authUser
    // Get user data from our custom users table
    const { data: userDataResult } = await supabase.from("users").select("*").eq("email", user.email).single()
    userData = userDataResult

    // Fetch recent files
    const { data: recentFilesData } = await supabase
      .from("files")
      .select("id, original_name, file_size, share_token, created_at")
      .eq("user_id", userData?.id)
      .order("created_at", { ascending: false })
      .limit(8)
    
    recentFiles = (recentFilesData as RecentFileItem[]) || []
  }



  const quotaUsedGB = userData ? (userData.quota_used / (1024 * 1024 * 1024)).toFixed(2) : "0.00"
  const quotaLimitGB = userData ? (userData.quota_limit / (1024 * 1024 * 1024)).toFixed(0) : "2"
  const quotaPercentage = userData ? Math.min((userData.quota_used / userData.quota_limit) * 100, 100) : 0

  const filesCount = userData?.files_count ?? 0
  const isPremium = userData?.subscription_type === "paid"
  
  // Branding from settings
  const { data: adminSettings } = await supabase.from("admin_settings").select("setting_key, setting_value")
  const brandName = adminSettings?.reduce((acc: Record<string,string>, s: any) => { acc[s.setting_key] = s.setting_value; return acc }, {} as Record<string,string>)["brand_name"] || "YukiFiles"

  // Mock activity data for debug mode
  const mockActivities = debugMode ? [
    {
      id: "1",
      type: "upload" as const,
      fileName: "presentation.pdf",
      fileType: "document" as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2", 
      type: "share" as const,
      fileName: "screenshot.png",
      fileType: "image" as const,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      type: "download" as const,
      fileName: "document.docx",
      fileType: "document" as const,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ] : []



  return (
    <ThemeProvider subscriptionType={userData?.subscription_type || "free"}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <div className="flex">
          <Sidebar isAdmin={Boolean(userData?.is_admin)} brandName={brandName} />
          <div className="flex-1 min-w-0">
            <Topbar userEmail={user.email!} isPremium={isPremium} brandName={brandName} />
            <main className="container mx-auto px-4 py-6 space-y-8">
              {/* Dashboard Header */}
              <DashboardHeader
                userEmail={user.email!}
                isPremium={isPremium}
                filesCount={filesCount}
                quotaUsedGB={quotaUsedGB}
                quotaLimitGB={quotaLimitGB}
                quotaPercentage={quotaPercentage}
              />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column - Quick Actions & Recent Files */}
                <div className="xl:col-span-2 space-y-8">
                  <QuickActions isPremium={isPremium} />
                  <RecentFiles files={recentFiles} />
                </div>

                {/* Right Column - Activity Feed */}
                <div className="space-y-8">
                  <ActivityFeed activities={mockActivities} />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

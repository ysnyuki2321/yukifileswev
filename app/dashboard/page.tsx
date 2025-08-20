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

export default async function DashboardPage() {
  const supabase = await createServerClient()
  
  // Check debug mode first
  const debugMode = await isDebugModeEnabled()
  let user = null
  let userData = null
  let recentFiles: any[] = []
  
  if (debugMode) {
    console.log("[v0] Debug mode enabled - using mock data for dashboard")
    user = { email: "debug@yukifiles.com", id: "debug-user-123" }
    userData = getMockUserData()
    recentFiles = getDebugFiles().slice(0, 8)
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

    const { data: recentFilesData } = await supabase
      .from("files")
      .select("id, original_name, file_size, share_token, created_at")
      .eq("user_id", userData?.id)
      .order("created_at", { ascending: false })
      .limit(8)
    
    recentFiles = recentFilesData || []
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="flex">
        <Sidebar isAdmin={Boolean(userData?.is_admin)} brandName={brandName} />
        <div className="flex-1 min-w-0">
          <Topbar userEmail={user.email!} isPremium={userData?.subscription_type === "paid"} brandName={brandName} />
          <main className="container mx-auto px-4 py-6">
            <div className="space-y-8">
              <DashboardHeader userData={userData} />
              
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <QuickActions />
                  <ActivityFeed />
                </div>
                <div>
                  <RecentFiles files={recentFiles} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

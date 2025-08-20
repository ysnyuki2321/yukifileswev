import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { PremiumButton } from "@/components/ui/premium-button"
import { PremiumText } from "@/components/ui/premium-text"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"
import StatCard from "@/components/dashboard/StatCard"
import AreaChart from "@/components/dashboard/AreaChart"
import RecentActivity from "@/components/dashboard/RecentActivity"
import RecentFiles, { type RecentFileItem } from "@/components/dashboard/RecentFiles"
import UploadZone from "@/components/file-manager/upload-zone"
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

  // Simple example metrics
  const filesCount = userData?.files_count ?? undefined
  const isPremium = userData?.subscription_type === "paid"
  const areaData = Array.from({ length: 7 }).map((_, i) => ({ label: `D${i + 1}`, value: Math.max(0, (filesCount || 0) - (6 - i)) }))
  // Branding from settings
  const { data: adminSettings } = await supabase.from("admin_settings").select("setting_key, setting_value")
  const brandName = adminSettings?.reduce((acc: Record<string,string>, s: any) => { acc[s.setting_key] = s.setting_value; return acc }, {} as Record<string,string>)["brand_name"] || "YukiFiles"



  return (
    <ThemeProvider subscriptionType={userData?.subscription_type || "free"}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <div className="flex">
          <Sidebar isAdmin={Boolean(userData?.is_admin)} brandName={brandName} />
          <div className="flex-1 min-w-0">
            <Topbar userEmail={user.email!} isPremium={isPremium} brandName={brandName} />
            <main className="container mx-auto px-4 py-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Storage Used" value={`${quotaUsedGB} GB`} subtext={`of ${quotaLimitGB} GB`} />
                <StatCard title="Usage" value={`${quotaPercentage.toFixed(0)}%`} />
                <StatCard title="Files" value={String(filesCount ?? 0)} />
                <StatCard title="Plan" value={isPremium ? "Premium" : "Free"} accentClassName={isPremium ? "gradient-text" : ""} />
              </div>

              {/* Chart + Quick Upload */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2 bg-black/40 border-purple-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <PremiumText className="text-lg font-semibold">Uploads (7 days)</PremiumText>
                    </div>
                    <AreaChart data={areaData} />
                  </CardContent>
                </Card>
                <UploadZone />
              </div>

              {/* Recent Files */}
              <RecentFiles files={recentFiles} />

              {/* Premium CTA */}
              {!isPremium && (
                <Card className="bg-black/40 border-purple-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold gradient-text">Upgrade to Premium</h3>
                      <p className="text-gray-400">Get 5GB storage and premium UI for just $1/month</p>
                      <PremiumButton size="lg" className="px-8">Upgrade Now</PremiumButton>
                    </div>
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Upload, Files, Settings } from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { PremiumCard } from "@/components/ui/premium-card"
import { PremiumButton } from "@/components/ui/premium-button"
import { PremiumText } from "@/components/ui/premium-text"

export default async function DashboardPage() {
  const supabase = createServerClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user data from our custom users table
  const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

  const quotaUsedGB = userData ? (userData.quota_used / (1024 * 1024 * 1024)).toFixed(2) : "0.00"
  const quotaLimitGB = userData ? (userData.quota_limit / (1024 * 1024 * 1024)).toFixed(0) : "2"
  const quotaPercentage = userData ? (userData.quota_used / userData.quota_limit) * 100 : 0

  return (
    <ThemeProvider subscriptionType={userData?.subscription_type || "free"}>
      <div className="min-h-screen page-transition">
        {/* Header */}
        <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg premium-glow"></div>
                <PremiumText className="text-2xl font-bold">YukiFiles</PremiumText>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {user.email}</span>
                {userData?.is_admin && (
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-1 rounded text-xs font-bold">
                    ADMIN
                  </span>
                )}
                {userData?.subscription_type === "paid" && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded text-xs font-bold premium-glow">
                    PREMIUM
                  </span>
                )}
                <form action={signOut}>
                  <Button type="submit" variant="ghost" className="text-gray-300 hover:text-white">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Storage Usage */}
            <PremiumCard className="premium-float">
              <CardHeader>
                <CardTitle className="text-white">Storage Usage</CardTitle>
                <CardDescription className="text-gray-400">
                  {quotaUsedGB} GB of {quotaLimitGB} GB used
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      userData?.subscription_type === "paid"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gray-500"
                    }`}
                    style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {userData?.subscription_type === "paid" ? (
                    <PremiumText className="font-semibold">Premium Account</PremiumText>
                  ) : (
                    "Free Account"
                  )}
                </p>
              </CardContent>
            </PremiumCard>

            {/* Quick Upload */}
            <PremiumCard className="premium-float">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Quick Upload
                </CardTitle>
                <CardDescription className="text-gray-400">Upload files instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <PremiumButton className="w-full">Choose Files</PremiumButton>
              </CardContent>
            </PremiumCard>

            {/* File Manager */}
            <PremiumCard className="premium-float">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Files className="w-5 h-5 mr-2" />
                  File Manager
                </CardTitle>
                <CardDescription className="text-gray-400">Manage your uploaded files</CardDescription>
              </CardHeader>
              <CardContent>
                <PremiumButton variant="outline" className="w-full" premium={false}>
                  View Files
                </PremiumButton>
              </CardContent>
            </PremiumCard>

            {/* Settings */}
            {userData?.is_admin && (
              <PremiumCard className="premium-border premium-pulse">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Admin Panel
                  </CardTitle>
                  <CardDescription className="text-gray-400">System administration</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold">
                    Admin Dashboard
                  </Button>
                </CardContent>
              </PremiumCard>
            )}
          </div>

          {/* Recent Activity */}
          <PremiumCard className="mt-8">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">Your latest file uploads and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                <Files className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Upload your first file to get started!</p>
              </div>
            </CardContent>
          </PremiumCard>

          {/* Premium Upgrade CTA for Free Users */}
          {userData?.subscription_type === "free" && (
            <PremiumCard className="mt-8 premium-border premium-pulse" premium={false}>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold gradient-text">Upgrade to Premium</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Get 5GB storage, premium UI themes, and advanced features for just $1/month
                  </p>
                  <PremiumButton size="lg" className="px-8">
                    Upgrade Now
                  </PremiumButton>
                </div>
              </CardContent>
            </PremiumCard>
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}

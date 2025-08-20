import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserFiles } from "@/lib/actions/files"
import FileManagerClient from "@/components/file-manager/file-manager-client"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"
import { isDebugModeEnabled, getDebugUser, getDebugFiles } from "@/lib/services/debug-user"

export default async function FilesPage() {
  const supabase = createServerClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  // Check debug mode - if enabled, use debug user data
  const debugMode = await isDebugModeEnabled()
  let user = null
  let userData = null
  let files = []
  
  if (debugMode) {
    console.log("[v0] Debug mode enabled - using debug data for files page")
    user = { email: "debug@yukifiles.com", id: "debug-user-123" }
    userData = getDebugUser()
    files = getDebugFiles()
  } else {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      redirect("/auth/login")
    }
    
    user = authUser
    // Get user data and files
    const { data: userDataResult } = await supabase.from("users").select("*").eq("email", user.email).single()
    userData = userDataResult
    const { files: userFiles } = await getUserFiles()
    files = userFiles
  }
  const { data: adminSettings } = await supabase.from("admin_settings").select("setting_key, setting_value")
  const brandName = (adminSettings || []).reduce((acc: Record<string, string>, s: any) => {
    acc[s.setting_key] = s.setting_value
    return acc
  }, {} as Record<string, string>)["brand_name"] || "YukiFiles"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="flex">
        <Sidebar isAdmin={Boolean(userData?.is_admin)} brandName={brandName} />
        <div className="flex-1 min-w-0">
          <Topbar userEmail={user.email!} isPremium={userData?.subscription_type === "paid"} brandName={brandName} />
          <main className="container mx-auto px-4 py-6">
            <FileManagerClient userData={userData} initialFiles={files} showHeader={false} />
          </main>
        </div>
      </div>
    </div>
  )
}
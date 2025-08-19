import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserFiles } from "@/lib/actions/files"
import FileManagerClient from "@/components/file-manager/file-manager-client"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"

export default async function FilesPage() {
  const supabase = createServerClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  // Check debug mode - if enabled, create mock user data
  let user = null
  let userData = null
  let files = []
  
  try {
    const { data: settings } = await supabase.from("admin_settings").select("setting_key, setting_value")
    const map = (settings || []).reduce((acc: Record<string, string>, s: any) => {
      acc[s.setting_key] = s.setting_value
      return acc
    }, {} as Record<string, string>)
    
    if (map["debug_mode"] === "true") {
      console.log("[v0] Debug mode enabled - using mock data for files page")
      user = { email: "debug@example.com", id: "debug-user-id" }
      userData = {
        id: "debug-user-id",
        email: "debug@example.com",
        quota_used: 1024 * 1024 * 1024, // 1GB
        quota_limit: 2 * 1024 * 1024 * 1024, // 2GB
        files_count: 15,
        subscription_type: "free",
        is_admin: true,
        is_verified: true,
        is_active: true
      }
      // Mock files data
      files = [
        {
          id: "debug-file-1",
          original_name: "debug-document.pdf",
          file_size: 1024 * 1024, // 1MB
          share_token: "debug-token-1",
          created_at: new Date().toISOString(),
          is_public: true
        },
        {
          id: "debug-file-2", 
          original_name: "debug-image.jpg",
          file_size: 2 * 1024 * 1024, // 2MB
          share_token: "debug-token-2",
          created_at: new Date().toISOString(),
          is_public: false
        }
      ]
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
  } catch (e) {
    console.warn("[v0] Failed to check debug mode:", e)
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
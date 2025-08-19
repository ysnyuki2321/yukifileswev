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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user data and files
  const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()
  const { files } = await getUserFiles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="flex">
        <Sidebar isAdmin={Boolean(userData?.is_admin)} />
        <div className="flex-1 min-w-0">
          <Topbar userEmail={user.email!} isPremium={userData?.subscription_type === "paid"} />
          <main className="container mx-auto px-4 py-6">
            <FileManagerClient userData={userData} initialFiles={files} showHeader={false} />
          </main>
        </div>
      </div>
    </div>
  )
}

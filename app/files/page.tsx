import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserFiles } from "@/lib/actions/files"
import FileManagerClient from "@/components/file-manager/file-manager-client"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FileManagerClient userData={userData} initialFiles={files} />
    </div>
  )
}

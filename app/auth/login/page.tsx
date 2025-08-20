import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "@/components/auth/login-form"

export default async function LoginPage() {
  const supabase = await createServerClient()

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      redirect("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

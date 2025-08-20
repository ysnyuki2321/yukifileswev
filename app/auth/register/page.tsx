import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import RegisterForm from "@/components/auth/register-form"

export default async function RegisterPage() {
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
        <RegisterForm />
      </div>
    </div>
  )
}

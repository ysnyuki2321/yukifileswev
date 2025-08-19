import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CheckoutClient from "@/components/payment/checkout-client"

export default async function CheckoutPage() {
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

  // Get user data
  const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

  if (!userData) {
    redirect("/auth/login")
  }

  // Check if already premium
  if (userData.subscription_type === "paid") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <CheckoutClient userData={userData} />
    </div>
  )
}

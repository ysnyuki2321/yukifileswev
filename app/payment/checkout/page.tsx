import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Bitcoin, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"

export default async function CheckoutPage() {
  const supabase = await createServerClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("email", user.email).single()

  if (!userData) {
    redirect("/auth/login")
  }

  // If user is already premium, redirect to dashboard
  if (userData.subscription_type === "paid") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg premium-glow"></div>
              <span className="text-2xl font-bold text-white">YukiFiles</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:text-purple-300">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Upgrade to Premium</h1>
            <p className="text-xl text-gray-300">Choose your preferred payment method</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PayPal Option */}
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">PayPal</CardTitle>
                <CardDescription className="text-gray-400">Secure payment with PayPal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">$1.00</div>
                  <p className="text-gray-400">per month</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">5GB Storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Advanced Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Priority Support</span>
                  </div>
                </div>
                <Link href="/api/payment/paypal/create">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Pay with PayPal
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Crypto Option */}
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bitcoin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Cryptocurrency</CardTitle>
                <CardDescription className="text-gray-400">Pay with Bitcoin, Ethereum, or Litecoin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">$1.00</div>
                  <p className="text-gray-400">per month (USD equivalent)</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">5GB Storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Advanced Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Priority Support</span>
                  </div>
                </div>
                <Link href="/api/payment/crypto/create">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Pay with Crypto
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Back to Dashboard */}
          <div className="text-center mt-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

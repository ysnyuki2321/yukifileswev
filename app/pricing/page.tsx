import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"

export default async function PricingPage() {
  const supabase = createServerClient()
  let user = null
  let userData = null

  if (supabase) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    if (user) {
      const { data } = await supabase.from("users").select("*").eq("email", user.email).single()
      userData = data
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg premium-glow"></div>
              <span className="text-2xl font-bold text-white">YukiFiles</span>
            </Link>
            <div className="space-x-4">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-purple-300">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-white hover:text-purple-300">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Simple, Transparent
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start free with 2GB storage. Upgrade to premium for more space and advanced features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-black/40 backdrop-blur-lg border-gray-600 relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Free</CardTitle>
              <CardDescription className="text-gray-400">Perfect for getting started</CardDescription>
              <div className="py-4">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">2GB Storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">File Sharing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Basic Security</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">100MB Max File Size</span>
                </div>
              </div>

              <div className="pt-4">
                {userData?.subscription_type === "free" || !user ? (
                  <Link href={user ? "/dashboard" : "/auth/register"}>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      {user ? "Current Plan" : "Get Started"}
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full bg-gray-700 text-gray-400">
                    Current Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Premium</CardTitle>
              <CardDescription className="text-gray-400">For power users and professionals</CardDescription>
              <div className="py-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  $1
                </span>
                <span className="text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">5GB Storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Unlimited File Sharing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Advanced Security</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">100MB Max File Size</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Premium UI Theme</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Priority Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Global CDN</span>
                </div>
              </div>

              <div className="pt-4">
                {userData?.subscription_type === "paid" ? (
                  <Button disabled className="w-full bg-purple-600 text-white">
                    Current Plan
                  </Button>
                ) : (
                  <Link href={user ? "/payment/checkout" : "/auth/register"}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      {user ? "Upgrade Now" : "Get Started"}
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Premium?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">More Storage</h3>
              <p className="text-gray-400">Get 5GB of storage space - 2.5x more than the free plan</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium UI</h3>
              <p className="text-gray-400">Beautiful gradient themes and enhanced user experience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Priority Support</h3>
              <p className="text-gray-400">Get faster support and priority assistance when you need it</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Zap, Shield, Globe, Code2, Users, Crown, Sparkles, Star, CheckCircle, Rocket } from "lucide-react"
import Link from "next/link"
import { RainbowGradient } from "@/components/ui/rainbow-gradient"
import { PricingCard } from "@/components/pricing/pricing-card"

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

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "2GB Storage",
        "File Sharing",
        "Basic Security",
        "100MB Max File Size",
        "Standard Support"
      ],
      color: "gray",
      gradient: "from-gray-400 to-gray-600",
      icon: <Star className="w-6 h-6 text-white" />,
    },
    {
      name: "Pro",
      price: "$1",
      description: "For power users and professionals",
      features: [
        "5GB Storage",
        "Unlimited File Sharing",
        "Advanced Security",
        "500MB Max File Size",
        "Premium UI Theme",
        "Priority Support",
        "Global CDN"
      ],
      color: "blue",
      gradient: "from-blue-400 to-cyan-500",
      icon: <Zap className="w-6 h-6 text-white" />,
      popular: true,
    },
    {
      name: "Developer",
      price: "$5",
      description: "For developers and creators",
      features: [
        "8GB Storage",
        "API Access",
        "End-to-End Encryption",
        "1GB Max File Size",
        "Code Editor Integration",
        "Advanced Analytics",
        "Custom Branding",
        "Webhook Support"
      ],
      color: "purple",
      gradient: "from-purple-400 to-pink-500",
      icon: <Code2 className="w-6 h-6 text-white" />,
    },
    {
      name: "Team",
      price: "$10",
      description: "For teams and collaboration",
      features: [
        "10GB Storage",
        "Team Management",
        "4K Video Support",
        "Advanced Permissions",
        "Team Analytics",
        "Collaborative Workspace",
        "SSO Integration",
        "24/7 Support"
      ],
      color: "green",
      gradient: "from-green-400 to-emerald-500",
      icon: <Users className="w-6 h-6 text-white" />,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited Storage",
        "Custom Limits & SLA",
        "Dedicated Infrastructure",
        "Advanced Security",
        "Custom Integrations",
        "Dedicated Support",
        "Compliance Features",
        "On-Premise Option"
      ],
      color: "orange",
      gradient: "from-orange-400 to-red-500",
      icon: <Crown className="w-6 h-6 text-white" />,
      enterprise: true,
    },
  ]

  return (
    <RainbowGradient className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Choose Your Plan</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6">
            Simple, Transparent
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start free with 2GB storage. Upgrade to premium for more space, advanced features, and beautiful themes.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              userSubscription={userData?.subscription_type}
              isLoggedIn={!!user}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Why Choose Premium?</h2>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Get more storage, advanced features, and beautiful themes to enhance your file sharing experience.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">More Storage</h3>
              <p className="text-gray-400">Get up to unlimited storage space with enterprise plans</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Advanced Security</h3>
              <p className="text-gray-400">End-to-end encryption and advanced security features</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Global CDN</h3>
              <p className="text-gray-400">Lightning-fast downloads from locations worldwide</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Priority Support</h3>
              <p className="text-gray-400">Get faster support and priority assistance when you need it</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who trust YukiFiles for their file sharing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={user ? "/dashboard" : "/auth/register"}>
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4">
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </RainbowGradient>
  )
}

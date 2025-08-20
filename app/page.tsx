import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
// Link was already imported above
import { Button } from "@/components/ui/button"
import { Upload, Shield, Zap, Globe, PlayCircle, Star, Code2, Users } from "lucide-react"
import Link from "next/link"
import { ConnectionStatus } from "@/components/ui/connection-status"
import { RainbowGradient } from "@/components/ui/rainbow-gradient"

export default async function HomePage() {
  const supabase = createServerClient()

  // Only redirect if Supabase is properly configured and user is authenticated
  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // If user is logged in, redirect to dashboard
      if (user) {
        redirect("/dashboard")
      }
    } catch (error) {
      // If there's an error with Supabase, continue to show home page
      console.warn("Supabase connection error, showing home page:", error)
    }
  }

  return (
    <RainbowGradient className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">YukiFiles</span>
          </div>
          <div className="space-x-4">
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
          </div>
        </nav>
      </header>

      {/* Connection Status */}
      <div className="container mx-auto px-4 mb-8">
        <ConnectionStatus />
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Share Files
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Instantly
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload, share, and manage your files with our secure, fast, and beautiful file sharing platform. Get 2GB
            free storage with premium features available.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4"
              >
                Start Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-4 bg-transparent"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Plan Experience CTA */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mt-10">
            {[
              { name: "Free", slug: "free", desc: "2GB, 200MB/upload, 720p", icon: <PlayCircle className="w-5 h-5" /> },
              { name: "Pro", slug: "pro", desc: "5GB, 500MB/upload, 1080p", icon: <Star className="w-5 h-5" /> },
              { name: "Developer", slug: "developer", desc: "8GB, API, E2E, Editor", icon: <Code2 className="w-5 h-5" /> },
              { name: "Team", slug: "team", desc: "10GB, 2160p, best UI", icon: <Users className="w-5 h-5" /> },
              { name: "Enterprise", slug: "enterprise", desc: "Custom limits & SLA", icon: <Shield className="w-5 h-5" /> },
            ].map((p) => (
              <div key={p.slug} className="bg-black/30 rounded-xl border border-purple-500/20 p-4 text-left hover:border-purple-400/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{p.name}</span>
                  <span className="text-purple-300 text-xs">{p.desc}</span>
                </div>
                <Link href={`/pricing?demo=${p.slug}`}>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Experience {p.name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Upload</h3>
              <p className="text-gray-400">Upload files instantly with our optimized infrastructure</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure</h3>
              <p className="text-gray-400">Advanced security with anti-clone protection</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Download speeds that will amaze you</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Global CDN</h3>
              <p className="text-gray-400">Files served from locations worldwide</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 YukiFiles. All rights reserved.</p>
        </div>
      </footer>
    </RainbowGradient>
  )
}

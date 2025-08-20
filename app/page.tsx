import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
// Link was already imported above
import { Button } from "@/components/ui/button"
import { Upload, Shield, Zap, Globe, PlayCircle, Star, Code2, Users } from "lucide-react"
import Link from "next/link"
import { isDebugModeEnabled } from "@/lib/services/debug-context"

export default async function HomePage() {
  const supabase = createServerClient()

  // Check debug mode first
  const debugMode = await isDebugModeEnabled()
  
  if (supabase && !debugMode) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If user is logged in, redirect to dashboard
    if (user) {
      redirect("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg premium-glow"></div>
            <span className="text-2xl font-bold text-white">YukiFiles</span>
          </div>
          <div className="space-x-4">
            {debugMode ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Debug Dashboard
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
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Share Files <span className="gradient-text">Beautifully</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload, share, and manage your files with a modern, premium experience. Get 2GB free; upgrade anytime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {debugMode ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4"
                >
                  Enter Debug Mode
                </Button>
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Pricing Snapshot */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mt-10 max-w-3xl mx-auto">
            <div className="bg-black/30 rounded-xl border border-purple-500/20 p-6 text-left premium-glow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-xl">Free</span>
                <span className="text-purple-300 text-sm">2GB storage</span>
              </div>
              <div className="text-4xl font-bold text-white mb-4">$0</div>
              <ul className="text-gray-300 space-y-1 mb-4 text-sm">
                <li>• 2GB total</li>
                <li>• Share links</li>
                <li>• Basic security</li>
              </ul>
              {debugMode ? (
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Debug Mode</Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Get Started</Button>
                </Link>
              )}
            </div>
            <div className="bg-black/30 rounded-xl border border-purple-500/40 p-6 text-left premium-glow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-xl">Premium</span>
                <span className="text-purple-300 text-sm">5GB storage</span>
              </div>
              <div className="text-4xl font-bold gradient-text mb-4">$1<span className="text-white text-lg">/mo</span></div>
              <ul className="text-gray-300 space-y-1 mb-4 text-sm">
                <li>• 5GB total</li>
                <li>• Advanced features</li>
                <li>• Priority support</li>
              </ul>
              {debugMode ? (
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Debug Mode</Button>
                </Link>
              ) : (
                <Link href="/pricing">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Upgrade Now</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 premium-glow">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Upload</h3>
              <p className="text-gray-400">Upload files instantly with our optimized infrastructure</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 premium-glow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure</h3>
              <p className="text-gray-400">Advanced security with anti-clone protection</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 premium-glow">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Download speeds that will amaze you</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 premium-glow">
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
    </div>
  )
}

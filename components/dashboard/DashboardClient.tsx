"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function DashboardClient() {
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get('demo') === 'true'
  const activeTab = searchParams.get('tab') || 'dashboard'
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simple mock data loading
    setTimeout(() => {
      setUser({
        email: isDemoMode ? "demo@yukifiles.com" : "user@yukifiles.com",
        id: isDemoMode ? "demo-123" : "user-123",
        name: isDemoMode ? "Demo User" : "User"
      })
      setLoading(false)
    }, 100)
  }, [isDemoMode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Please login</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="flex">
        {/* Simple Sidebar */}
        <div className="w-64 bg-black/40 backdrop-blur-lg border-r border-purple-500/20 p-4">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">✨</span>
            </div>
            <span className="text-white font-semibold">YukiFiles</span>
          </div>
          
          <nav className="space-y-2">
            <div className="text-purple-400 text-sm font-medium mb-4">NAVIGATION</div>
            <a 
              href={`/dashboard${isDemoMode ? '?demo=true' : ''}`}
              className={`block px-3 py-2 rounded transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-purple-500/20 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              📊 Dashboard
            </a>
            <a 
              href={`/dashboard${isDemoMode ? '?demo=true&tab=analytics' : ''}`}
              className={`block px-3 py-2 rounded transition-colors ${
                activeTab === 'analytics' 
                  ? 'bg-purple-500/20 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              📈 Analytics
            </a>
            <a 
              href={`/dashboard${isDemoMode ? '?demo=true&tab=ai' : ''}`}
              className={`block px-3 py-2 rounded transition-colors ${
                activeTab === 'ai' 
                  ? 'bg-purple-500/20 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              🤖 AI Tools
            </a>
            <a 
              href={`/dashboard${isDemoMode ? '?demo=true&tab=collaboration' : ''}`}
              className={`block px-3 py-2 rounded transition-colors ${
                activeTab === 'collaboration' 
                  ? 'bg-purple-500/20 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              👥 Collaboration
            </a>
            <a 
              href={`/dashboard${isDemoMode ? '?demo=true&tab=pricing' : ''}`}
              className={`block px-3 py-2 rounded transition-colors ${
                activeTab === 'pricing' 
                  ? 'bg-purple-500/20 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              💳 Pricing
            </a>
            <a 
              href={`/dashboard${isDemoMode ? '?demo=true&tab=admin' : ''}`}
              className={`block px-3 py-2 rounded transition-colors ${
                activeTab === 'admin' 
                  ? 'bg-purple-500/20 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              ⚙️ Admin
            </a>
            <a 
              href="/files"
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded transition-colors"
            >
              📁 Files
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Simple Topbar */}
          <div className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'analytics' && 'Analytics'}
                  {activeTab === 'ai' && 'AI Tools'}
                  {activeTab === 'collaboration' && 'Collaboration'}
                  {activeTab === 'pricing' && 'Pricing'}
                  {activeTab === 'admin' && 'Admin'}
                </h1>
                <p className="text-gray-400 text-sm">
                  Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {isDemoMode && (
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                    Demo Mode
                  </span>
                )}
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">
                    {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <main className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋
                  </h2>
                  <p className="text-gray-300">
                    Welcome back to your file management dashboard
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-400 text-sm font-medium">Total Files</p>
                        <p className="text-2xl font-bold text-white">0</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-purple-400 text-xl">📁</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-400 text-sm font-medium">Storage Used</p>
                        <p className="text-2xl font-bold text-white">0 GB</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400 text-xl">💾</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 text-sm font-medium">Shared Links</p>
                        <p className="text-2xl font-bold text-white">0</p>
                      </div>
                      <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-green-400 text-xl">🔗</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-400 text-sm font-medium">Downloads</p>
                        <p className="text-2xl font-bold text-white">0</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-yellow-400 text-xl">⬇️</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a 
                      href="/files"
                      className="p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg hover:bg-purple-600/20 transition-colors group"
                    >
                      <div className="text-purple-400 text-2xl mb-2">📤</div>
                      <h4 className="text-white font-medium group-hover:text-purple-300">Upload Files</h4>
                      <p className="text-gray-400 text-sm">Upload and manage your files</p>
                    </a>
                    
                    <a 
                      href="/files"
                      className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg hover:bg-blue-600/20 transition-colors group"
                    >
                      <div className="text-blue-400 text-2xl mb-2">🔗</div>
                      <h4 className="text-white font-medium group-hover:text-blue-300">Create Share Link</h4>
                      <p className="text-gray-400 text-sm">Generate secure sharing links</p>
                    </a>
                    
                    <a 
                      href="/files"
                      className="p-4 bg-green-600/10 border border-green-500/30 rounded-lg hover:bg-green-600/20 transition-colors group"
                    >
                      <div className="text-green-400 text-2xl mb-2">📊</div>
                      <h4 className="text-white font-medium group-hover:text-green-300">View Analytics</h4>
                      <p className="text-gray-400 text-sm">Track file performance</p>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">📈 Analytics</h2>
                <p className="text-gray-300">Analytics dashboard coming soon...</p>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">🤖 AI Tools</h2>
                <p className="text-gray-300">AI-powered tools coming soon...</p>
              </div>
            )}

            {activeTab === 'collaboration' && (
              <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">👥 Collaboration</h2>
                <p className="text-gray-300">Real-time collaboration features coming soon...</p>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">💳 Pricing</h2>
                <p className="text-gray-300">Pricing and billing management coming soon...</p>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="bg-black/40 backdrop-blur-lg border border-purple-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">⚙️ Admin</h2>
                <p className="text-gray-300">Administrative tools coming soon...</p>
              </div>
            )}

            {/* Demo Mode Notice */}
            {isDemoMode && (
              <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">ℹ️</span>
                  </div>
                  <div>
                    <h3 className="text-purple-300 font-medium mb-2">🎯 Demo Mode Active</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      You're viewing YukiFiles in demo mode. All data is simulated and no real files are stored.
                      This demonstrates the platform's capabilities without requiring account setup.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href="/auth/register" 
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
                      >
                        Create Account
                      </a>
                      <a 
                        href="/auth/login" 
                        className="px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/10 text-sm rounded transition-colors"
                      >
                        Sign In
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}


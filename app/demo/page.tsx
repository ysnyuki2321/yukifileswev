"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    // Simple redirect to dashboard with demo mode
    const timer = setTimeout(() => {
      router.push('/dashboard?demo=true')
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen theme-premium flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 premium-float">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to YukiFiles Demo</h1>
          <p className="text-gray-300">Experience the full power of our platform</p>
        </div>
        
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to demo dashboard...</p>
        
        <div className="mt-8 text-sm text-gray-400">
          <p>Loading all features...</p>
        </div>
      </div>
    </div>
  )
}
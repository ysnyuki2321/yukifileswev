"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function InstantDebugPage() {
  const router = useRouter()

  useEffect(() => {
    const enableAndRedirect = async () => {
      try {
        // Call instant debug API
        await fetch("/api/debug/instant")
        
        // Immediately redirect to dashboard
        router.push("/dashboard")
      } catch (e) {
        console.error("Debug error:", e)
        // Still redirect even if API fails
        router.push("/dashboard")
      }
    }

    enableAndRedirect()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-2xl">⚡</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Instant Debug Mode</h1>
        <p className="text-gray-400">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
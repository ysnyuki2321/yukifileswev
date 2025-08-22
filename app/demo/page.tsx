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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to demo dashboard...</p>
      </div>
    </div>
  )
}
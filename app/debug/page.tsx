"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"

export default function DebugPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const router = useRouter()

  useEffect(() => {
    const enableDebug = async () => {
      try {
        // Call force enable API
        const response = await fetch("/api/debug/force-enable")
        const data = await response.json()
        
        if (data.success) {
          setStatus("success")
          // Wait 1 second then redirect
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        } else {
          setStatus("error")
        }
      } catch (e) {
        setStatus("error")
      }
    }

    enableDebug()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-white">Enabling Debug Mode...</h1>
            <p className="text-gray-400">Setting up test environment</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
            <h1 className="text-2xl font-bold text-white">Debug Mode Enabled!</h1>
            <p className="text-gray-400">Redirecting to dashboard...</p>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-400 text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Error</h1>
            <p className="text-gray-400">Failed to enable debug mode</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"

export default function ForceDebugPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const forceEnableDebug = async () => {
      try {
        const response = await fetch("/api/debug/force-enable")
        const data = await response.json()
        
        if (data.success) {
          setStatus("success")
          setMessage("Debug mode FORCE enabled! Refresh and try /dashboard")
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to force enable debug mode")
        }
      } catch (e) {
        setStatus("error")
        setMessage("Network error - please try again")
      }
    }

    forceEnableDebug()
  }, [])

  const retry = () => {
    setStatus("loading")
    setMessage("")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">Force Debug Setup</h1>
          
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
              <p className="text-gray-300">Force enabling debug mode...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <p className="text-green-300 font-medium">{message}</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>✅ Debug mode: FORCE ENABLED</p>
                <p>✅ Auto verify: ON</p>
                <p>✅ Auth bypass: ON</p>
              </div>
            </div>
          )}
          
          {status === "error" && (
            <div className="space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              <p className="text-red-300 font-medium">{message}</p>
              <button
                onClick={retry}
                className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}
        </div>

        {status === "success" && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Next Steps:</h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => window.location.href = "/dashboard"}
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => window.location.href = "/files"}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Go to File Manager
              </button>
              <button 
                onClick={() => window.location.href = "/admin"}
                className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Go to Admin Panel
              </button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>Force debug bypasses all middleware checks</p>
          <p>Use this if normal debug setup fails</p>
        </div>
      </div>
    </div>
  )
}
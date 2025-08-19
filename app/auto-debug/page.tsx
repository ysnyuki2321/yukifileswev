"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function AutoDebugPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const enableDebug = async () => {
      try {
        const response = await fetch("/api/debug/auto-setup")
        const data = await response.json()
        
        if (data.success) {
          setStatus("success")
          setMessage("Debug mode enabled successfully! You can now access all pages without login.")
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to enable debug mode")
        }
      } catch (e) {
        setStatus("error")
        setMessage("Network error - please try again")
      }
    }

    enableDebug()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">Auto Debug Setup</h1>
          
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
              <p className="text-gray-300">Enabling debug mode...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <p className="text-green-300 font-medium">{message}</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>✅ Debug mode: ON</p>
                <p>✅ Auto verify: ON</p>
                <p>✅ Auth bypass: ON</p>
              </div>
            </div>
          )}
          
          {status === "error" && (
            <div className="space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              <p className="text-red-300 font-medium">{message}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Quick Access Links:</h3>
          <div className="grid grid-cols-1 gap-2">
            <a 
              href="/dashboard" 
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Dashboard
            </a>
            <a 
              href="/files" 
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              File Manager
            </a>
            <a 
              href="/admin" 
              className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Admin Panel
            </a>
            <a 
              href="/admin/settings" 
              className="p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              Admin Settings
            </a>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>Debug mode bypasses all authentication requirements</p>
          <p>Perfect for testing UI on Vercel deployment</p>
        </div>
      </div>
    </div>
  )
}
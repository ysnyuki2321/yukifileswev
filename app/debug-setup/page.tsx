"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Loader2, Zap, Settings, TestTube } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function DebugSetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [result, setResult] = useState<any>(null)

  const enableDebug = async () => {
    setStatus("loading")
    try {
      const response = await fetch("/api/debug/setup")
      const data = await response.json()
      
      if (data.success) {
        setStatus("success")
        setResult(data)
      } else {
        setStatus("error")
        setResult(data)
      }
    } catch (error) {
      setStatus("error")
      setResult({ error: "Failed to enable debug mode" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TestTube className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Debug Mode Setup</h1>
          <p className="text-xl text-gray-300">
            Enable debug mode to bypass authentication and test all features
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Debug Setup Card */}
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Debug Configuration</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure debug mode settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Bypass authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Mock user data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Auto-verify emails</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Disable anti-fraud</span>
                </div>
              </div>

              <Button 
                onClick={enableDebug}
                disabled={status === "loading"}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enabling Debug Mode...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Enable Debug Mode
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Status</CardTitle>
              <CardDescription className="text-gray-400">
                Current debug mode status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {status === "idle" && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Click "Enable Debug Mode" to start</p>
                </div>
              )}

              {status === "loading" && (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-400">Enabling debug mode...</p>
                </div>
              )}

              {status === "success" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Debug Mode Enabled!</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Debug Mode:</span>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Auto Verify:</span>
                      <Badge className="bg-green-500">Enabled</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link href="/dashboard">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/files">
                      <Button variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/10">
                        Test File Manager
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-white font-medium">Error</span>
                  </div>
                  <p className="text-red-400 text-sm">
                    {result?.error || "Failed to enable debug mode"}
                  </p>
                  <Button 
                    onClick={enableDebug}
                    variant="outline"
                    className="w-full border-red-500 text-red-300 hover:bg-red-500/10"
                  >
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <Link href="/enable-debug">
              <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
                Quick Enable
              </Button>
            </Link>
            <Link href="/instant-debug">
              <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
                Instant Debug
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
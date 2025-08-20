"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  Mail, 
  TestTube, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Sparkles,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { SupabaseStatus } from "@/components/ui/supabase-status"
import { resendVerificationEmail, forgotPassword } from "@/lib/actions/auth"

export default function SupabaseDebugPage() {
  const [testEmail, setTestEmail] = useState("")
  const [isTestingEmail, setIsTestingEmail] = useState(false)
  const [testResult, setTestResult] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleTestEmail = async (type: "verification" | "reset") => {
    if (!testEmail) {
      setTestResult({ type: "error", message: "Please enter an email address" })
      return
    }

    setIsTestingEmail(true)
    setTestResult({ type: null, message: "" })

    try {
      let result
      if (type === "verification") {
        result = await resendVerificationEmail(testEmail)
      } else {
        result = await forgotPassword(testEmail)
      }

      if (result.success) {
        setTestResult({ type: "success", message: result.success })
      } else {
        setTestResult({ type: "error", message: result.error || "Failed to send email" })
      }
    } catch (error) {
      setTestResult({ type: "error", message: "An unexpected error occurred" })
    } finally {
      setIsTestingEmail(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="inline-flex items-center text-purple-300 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Supabase Debug</span>
          </div>
        </div>

        {/* Status Overview */}
        <SupabaseStatus />

        {/* Email Testing */}
        <Card className="bg-black/40 backdrop-blur-lg border-gray-700/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TestTube className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-lg text-white">Email Testing</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Test email functionality with verification and password reset emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="testEmail" className="text-sm font-medium text-gray-300">
                Test Email Address
              </Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="Enter email to test"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>

            {/* Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() => handleTestEmail("verification")}
                disabled={isTestingEmail || !testEmail}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                {isTestingEmail ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Test Verification Email
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleTestEmail("reset")}
                disabled={isTestingEmail || !testEmail}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                {isTestingEmail ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Test Password Reset
                  </>
                )}
              </Button>
            </div>

            {/* Test Result */}
            {testResult.type && (
              <div className={`p-3 rounded-lg text-sm ${
                testResult.type === "success" 
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                <div className="flex items-center space-x-2">
                  {testResult.type === "success" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {testResult.type === "success" ? "Success" : "Error"}
                  </span>
                </div>
                <p className="mt-1 text-xs">{testResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Guide */}
        <Card className="bg-black/40 backdrop-blur-lg border-gray-700/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-yellow-400" />
              <CardTitle className="text-lg text-white">Configuration Guide</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Step-by-step guide to configure Supabase for email verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Environment Variables */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white">Environment Variables</h4>
                <div className="bg-black/30 p-3 rounded-lg border border-gray-700/50">
                  <code className="text-xs text-gray-300 font-mono">
                    NEXT_PUBLIC_SUPABASE_URL=your_project_url<br/>
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key<br/>
                    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
                  </code>
                </div>
              </div>

              {/* Email Configuration */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white">Email Setup</h4>
                <div className="space-y-2 text-xs text-gray-400">
                  <p>1. Go to Supabase Dashboard</p>
                  <p>2. Navigate to Authentication → Email Templates</p>
                  <p>3. Configure SMTP settings or use built-in service</p>
                  <p>4. Test email delivery</p>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Troubleshooting</span>
              </div>
              <div className="mt-2 space-y-1 text-xs text-yellow-300">
                <p>• Check spam folder for test emails</p>
                <p>• Verify environment variables are set correctly</p>
                <p>• Ensure Supabase project is active and not paused</p>
                <p>• Check email service configuration in Supabase Dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/auth/login">
            <Card className="bg-black/40 backdrop-blur-lg border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Test Login</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/auth/register">
            <Card className="bg-black/40 backdrop-blur-lg border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Test Registration</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/auth/forgot-password">
            <Card className="bg-black/40 backdrop-blur-lg border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Test Password Reset</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
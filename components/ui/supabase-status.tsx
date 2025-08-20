"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Settings,
  Globe,
  Shield,
  Zap
} from "lucide-react"

interface SupabaseStatusProps {
  className?: string
}

export function SupabaseStatus({ className }: SupabaseStatusProps) {
  const [status, setStatus] = useState<{
    connected: boolean
    emailConfigured: boolean
    authEnabled: boolean
    url: string | null
    error: string | null
  }>({
    connected: false,
    emailConfigured: false,
    authEnabled: false,
    url: null,
    error: null
  })
  const [isLoading, setIsLoading] = useState(true)

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        setStatus({
          connected: false,
          emailConfigured: false,
          authEnabled: false,
          url: null,
          error: "Missing environment variables"
        })
        return
      }

      // Test connection
      const response = await fetch('/api/supabase/status')
      const data = await response.json()

      setStatus({
        connected: data.connected,
        emailConfigured: data.emailConfigured,
        authEnabled: data.authEnabled,
        url: supabaseUrl,
        error: data.error
      })
    } catch (error) {
      setStatus({
        connected: false,
        emailConfigured: false,
        authEnabled: false,
        url: null,
        error: "Failed to check status"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="w-4 h-4 animate-spin" />
    if (status.connected) return <CheckCircle className="w-4 h-4 text-green-400" />
    return <XCircle className="w-4 h-4 text-red-400" />
  }

  const getStatusColor = () => {
    if (isLoading) return "bg-gray-500"
    if (status.connected) return "bg-green-500"
    return "bg-red-500"
  }

  return (
    <Card className={`bg-black/40 backdrop-blur-lg border-gray-700/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-lg text-white">Supabase Status</CardTitle>
          </div>
          <Button
            onClick={checkStatus}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription className="text-gray-400">
          Check your Supabase configuration and email settings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <p className="text-sm font-medium text-white">Database Connection</p>
              <p className="text-xs text-gray-400">
                {status.url ? new URL(status.url).hostname : "Not configured"}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {isLoading ? "Checking..." : status.connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* Email Configuration */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
          <div className="flex items-center space-x-3">
            <Mail className={`w-4 h-4 ${status.emailConfigured ? 'text-green-400' : 'text-yellow-400'}`} />
            <div>
              <p className="text-sm font-medium text-white">Email Service</p>
              <p className="text-xs text-gray-400">
                {status.emailConfigured ? "Configured" : "Not configured"}
              </p>
            </div>
          </div>
          <Badge className={status.emailConfigured ? "bg-green-500" : "bg-yellow-500"}>
            {status.emailConfigured ? "Ready" : "Setup Required"}
          </Badge>
        </div>

        {/* Auth Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
          <div className="flex items-center space-x-3">
            <Shield className={`w-4 h-4 ${status.authEnabled ? 'text-green-400' : 'text-red-400'}`} />
            <div>
              <p className="text-sm font-medium text-white">Authentication</p>
              <p className="text-xs text-gray-400">
                {status.authEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <Badge className={status.authEnabled ? "bg-green-500" : "bg-red-500"}>
            {status.authEnabled ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Error Display */}
        {status.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Error</span>
            </div>
            <p className="mt-1 text-xs text-red-300">{status.error}</p>
          </div>
        )}

        {/* Configuration Guide */}
        {!status.connected && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="font-medium">Configuration Required</span>
            </div>
            <div className="mt-2 space-y-2 text-xs text-blue-300">
              <p>1. Set up Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200">supabase.com</a></p>
              <p>2. Add environment variables to your .env.local:</p>
              <code className="block bg-black/30 p-2 rounded text-xs font-mono">
                NEXT_PUBLIC_SUPABASE_URL=your_project_url<br/>
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key<br/>
                SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
              </code>
              <p>3. Configure email settings in Supabase Dashboard</p>
            </div>
          </div>
        )}

        {/* Email Setup Guide */}
        {status.connected && !status.emailConfigured && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Email Setup Required</span>
            </div>
            <div className="mt-2 space-y-2 text-xs text-yellow-300">
              <p>1. Go to Supabase Dashboard → Authentication → Email Templates</p>
              <p>2. Configure SMTP settings or use Supabase's built-in email service</p>
              <p>3. Test email delivery in the Authentication settings</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {status.connected && status.emailConfigured && status.authEnabled && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="font-medium">All Systems Ready</span>
            </div>
            <p className="mt-1 text-xs text-green-300">
              Your Supabase configuration is complete. Email verification should work properly.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
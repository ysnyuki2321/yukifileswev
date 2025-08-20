"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Settings, Database } from "lucide-react"

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        setStatus('connected')
      } else {
        setStatus('disconnected')
      }
    } catch (error) {
      setStatus('disconnected')
    }
  }

  if (status === 'checking') {
    return (
      <Card className={`bg-black/40 border-purple-500/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Checking connection...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'connected') {
    return (
      <Card className={`bg-black/40 border-green-500/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-400">Database connected</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-black/40 border-red-500/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Connection Issue</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Unable to connect to the database. This may be due to missing environment variables or network issues.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          <p>To fix this issue:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Check your Supabase environment variables</li>
            <li>Ensure your database is running</li>
            <li>Verify network connectivity</li>
          </ul>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSetup(!showSetup)}
            className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
          >
            <Settings className="w-4 h-4 mr-2" />
            Setup Guide
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkConnection}
            className="border-blue-500 text-blue-300 hover:bg-blue-500/10"
          >
            <Database className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>

        {showSetup && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-sm">
            <h4 className="font-medium text-white mb-2">Environment Variables Required:</h4>
            <div className="space-y-2 font-mono text-xs">
              <div>
                <span className="text-purple-400">NEXT_PUBLIC_SUPABASE_URL=</span>
                <span className="text-gray-400">your-supabase-project-url</span>
              </div>
              <div>
                <span className="text-purple-400">NEXT_PUBLIC_SUPABASE_ANON_KEY=</span>
                <span className="text-gray-400">your-supabase-anon-key</span>
              </div>
            </div>
            <p className="text-gray-400 mt-3">
              Add these to your <code className="bg-gray-700 px-1 rounded">.env.local</code> file and restart the development server.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
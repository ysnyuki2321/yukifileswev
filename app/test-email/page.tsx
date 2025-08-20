"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestEmailPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("test123456")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testSignUp = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setResult({ type: "error", message: error.message, data: error })
      } else {
        setResult({ type: "success", message: "Signup successful!", data })
      }
    } catch (e) {
      setResult({ type: "error", message: `Exception: ${e}`, data: e })
    } finally {
      setLoading(false)
    }
  }

  const testSignIn = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setResult({ type: "error", message: error.message, data: error })
      } else {
        setResult({ type: "success", message: "Signin successful!", data })
      }
    } catch (e) {
      setResult({ type: "error", message: `Exception: ${e}`, data: e })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Email Test Page</h1>
          <p className="text-xl text-gray-300">
            Test Supabase authentication and email verification
          </p>
        </div>

        {/* Test Form */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Test Credentials</CardTitle>
            <CardDescription className="text-gray-400">
              Test signup and signin with these credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/30 border-gray-600 text-white"
                placeholder="test@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/30 border-gray-600 text-white"
                placeholder="test123456"
              />
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={testSignUp}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Test Sign Up
                  </>
                )}
              </Button>
              <Button
                onClick={testSignIn}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Test Sign In
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                {result.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span>Test Result</span>
                <Badge variant={result.type === "success" ? "default" : "destructive"}>
                  {result.type === "success" ? "Success" : "Error"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Message:</h4>
                  <p className="text-gray-300">{result.message}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Data:</h4>
                  <pre className="bg-black/30 p-4 rounded-lg text-sm text-gray-300 overflow-auto max-h-64">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Environment Info */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Environment Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Origin:</span>
                <span className="text-white">{typeof window !== 'undefined' ? window.location.origin : 'Server'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Supabase URL:</span>
                <span className="text-white">{process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Redirect URL:</span>
                <span className="text-white">{typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'Server'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
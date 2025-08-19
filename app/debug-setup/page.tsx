"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DebugSetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("test123456")

  const setupDebug = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/setup", { method: "POST" })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (e) {
      setResult(`Error: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      setResult("Testing login...")
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setResult(`Login Error: ${error.message}`)
      } else {
        setResult(`Login Success! User: ${data.user?.email}, Confirmed: ${data.user?.email_confirmed_at}`)
      }
    } catch (e) {
      setResult(`Exception: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    setLoading(true)
    try {
      setResult("Testing signup...")
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setResult(`Signup Error: ${error.message}`)
      } else {
        setResult(`Signup Success! Check email: ${data.user?.email}`)
      }
    } catch (e) {
      setResult(`Exception: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-white text-center">Debug Setup & Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Setup</h2>
            <button
              onClick={setupDebug}
              disabled={loading}
              className="w-full p-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium"
            >
              {loading ? "Setting up..." : "Enable Debug Mode & Auto Verify"}
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Test Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-black/30 border border-gray-700 rounded-lg text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black/30 border border-gray-700 rounded-lg text-white"
            />
            <div className="space-y-2">
              <button
                onClick={testSignUp}
                disabled={loading}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg"
              >
                Test Sign Up
              </button>
              <button
                onClick={testLogin}
                disabled={loading}
                className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg"
              >
                Test Sign In
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-black/30 border border-gray-700 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Result:</h3>
            <pre className="text-white text-sm whitespace-pre-wrap overflow-auto max-h-96">{result}</pre>
          </div>
        )}

        <div className="text-gray-400 text-sm space-y-2">
          <p>Current origin: {window.location.origin}</p>
          <p>Vercel URL: {process.env.NEXT_PUBLIC_VERCEL_URL || "Not set"}</p>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"}</p>
          <p>Redirect URL: {window.location.origin}/auth/callback</p>
        </div>
      </div>
    </div>
  )
}
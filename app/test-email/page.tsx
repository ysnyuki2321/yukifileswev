"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState("")

  const testSignUp = async () => {
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
        setResult(`Error: ${error.message}`)
      } else {
        setResult(`Success! Check email: ${data.user?.email}`)
      }
    } catch (e) {
      setResult(`Exception: ${e}`)
    }
  }

  const testSignIn = async () => {
    try {
      setResult("Testing signin...")
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setResult(`Error: ${error.message}`)
      } else {
        setResult(`Success! User: ${data.user?.email}, Confirmed: ${data.user?.email_confirmed_at}`)
      }
    } catch (e) {
      setResult(`Exception: ${e}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">Email Verification Test</h1>
        
        <div className="space-y-4">
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
        </div>

        <div className="space-y-2">
          <button
            onClick={testSignUp}
            className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Test Sign Up
          </button>
          <button
            onClick={testSignIn}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Test Sign In
          </button>
        </div>

        {result && (
          <div className="p-4 bg-black/30 border border-gray-700 rounded-lg">
            <pre className="text-white text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}

        <div className="text-gray-400 text-sm">
          <p>Current origin: {window.location.origin}</p>
          <p>Redirect URL: {window.location.origin}/auth/callback</p>
        </div>
      </div>
    </div>
  )
}
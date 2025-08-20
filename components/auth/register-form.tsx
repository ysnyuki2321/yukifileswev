"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Shield, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/actions/auth"
import { useDeviceFingerprint } from "@/components/device-fingerprint"

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Creating account...
        </>
      ) : (
        "Create Account"
      )}
    </Button>
  )
}

export default function RegisterForm() {
  const [state, formAction] = useActionState(signUp, null)
  const fingerprint = useDeviceFingerprint()
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const handleSubmit = (formData: FormData) => {
    if (fingerprint) {
      formData.append("deviceFingerprint", JSON.stringify(fingerprint))
    }
    formAction(formData)
  }

  return (
    <div className="w-full max-w-md">
      {/* Back to home */}
      <Link href="/" className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">YukiFiles</span>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-purple-300" />
          </div>
          <CardTitle className="text-2xl font-semibold text-white">Create account</CardTitle>
          <CardDescription className="text-gray-400 text-lg">Get started with 2GB free storage</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {state?.error && (
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{state.error}</p>
              </div>
            )}

            {state?.success && (
              <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg animate-in slide-in-from-top-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-400 text-sm">{state.success}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="pl-9 bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>
                {state?.code === "EMAIL_EXISTS" && (
                  <p className="text-xs text-red-400 animate-in slide-in-from-top-1">This email is already registered. Try logging in instead.</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="pl-9 pr-10 bg-black/30 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Minimum 6 characters</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="password2" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    id="password2"
                    name="password2"
                    type={showPassword2 ? "text" : "password"}
                    required
                    minLength={6}
                    className="pl-9 pr-10 bg-black/30 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                    onChange={(e) => {
                      const p1 = (document.getElementById("password") as HTMLInputElement | null)?.value || ""
                      const p2 = e.currentTarget.value
                      e.currentTarget.setCustomValidity(p1 !== p2 ? "Passwords do not match" : "")
                    }}
                  />
                  <button
                    type="button"
                    aria-label={showPassword2 ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword2((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Security Protection Active</span>
              </div>
              <p className="mt-1 text-xs text-blue-300">
                We use advanced anti-fraud protection to prevent multiple accounts. VPN/Proxy usage may be restricted.
              </p>
            </div>

            <SubmitButton disabled={!fingerprint} />

            <div className="text-center text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

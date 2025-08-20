"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signIn } from "@/lib/actions/auth"
import { useDeviceFingerprint } from "@/components/device-fingerprint"

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg font-medium rounded-lg h-[60px] transition-all duration-200 transform hover:scale-[1.02]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)
  const fingerprint = useDeviceFingerprint()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      setIsLoading(true)
      router.push("/dashboard")
    }
  }, [state, router])

  const handleSubmit = (formData: FormData) => {
    if (fingerprint) {
      formData.append("deviceFingerprint", JSON.stringify(fingerprint))
    }
    formAction(formData)
  }

  return (
    <div className="w-full max-w-md">
      {/* Back to home */}
      <Link href="/" className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">YukiFiles</span>
          </div>
          <CardTitle className="text-3xl font-semibold text-white">Welcome back</CardTitle>
          <CardDescription className="text-gray-400 text-lg">Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg animate-in slide-in-from-top-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>{state.error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 pl-10 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="bg-black/20 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 pl-10 pr-10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {/* Optional 2FA code */}
              <div className="space-y-2">
                <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-300">
                  2FA Code (if enabled)
                </label>
                <Input
                  id="twoFactorCode"
                  name="twoFactorCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="123456"
                  className="bg-black/20 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                />
              </div>
            </div>

            <SubmitButton disabled={!fingerprint || isLoading} />

            <p className="text-xs text-gray-400 text-center">Use your email and password to sign in.</p>

            <div className="text-center text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Shield, Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/actions/auth"
import { useDeviceFingerprint } from "@/components/device-fingerprint"
import { useState } from "react"

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
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleSubmit = (formData: FormData) => {
    if (fingerprint) {
      formData.append("deviceFingerprint", JSON.stringify(fingerprint))
    }
    formAction(formData)
  }

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 6) strength += 1
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const strength = checkPasswordStrength(e.target.value)
    setPasswordStrength(strength)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 3) return "Fair"
    return "Strong"
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
          <CardTitle className="text-3xl font-semibold text-white">Create account</CardTitle>
          <CardDescription className="text-gray-400 text-lg">Get started with 2GB free storage</CardDescription>
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

            {state?.success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg animate-in slide-in-from-top-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{state.success}</span>
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
                {state?.code === "EMAIL_EXISTS" && (
                  <p className="text-xs text-red-400 animate-in slide-in-from-top-2">This email is already registered. Try logging in instead.</p>
                )}
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
                    minLength={6}
                    onChange={handlePasswordChange}
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
                {passwordStrength > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Password strength:</span>
                      <span className={`${getPasswordStrengthColor().replace('bg-', 'text-')}`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500">Minimum 6 characters</p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-lg text-sm">
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
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

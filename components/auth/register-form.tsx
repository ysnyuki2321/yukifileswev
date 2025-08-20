"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Shield, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle, AlertCircle, Zap, Star } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/actions/auth"
import { useDeviceFingerprint } from "@/components/device-fingerprint"

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-purple-500/25"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Creating account...
        </>
      ) : (
        <>
          <Zap className="w-5 h-5 mr-2" />
          Create Account
        </>
      )}
    </Button>
  )
}

export default function RegisterForm() {
  const [state, formAction] = useActionState(signUp, null)
  const fingerprint = useDeviceFingerprint()
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleSubmit = (formData: FormData) => {
    if (fingerprint) {
      formData.append("deviceFingerprint", JSON.stringify(fingerprint))
    }
    formAction(formData)
  }

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500"
    if (passwordStrength <= 50) return "bg-orange-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return "Weak"
    if (passwordStrength <= 50) return "Fair"
    if (passwordStrength <= 75) return "Good"
    return "Strong"
  }

  return (
    <div className="w-full max-w-md">
      {/* Back to home */}
      <Link href="/" className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-2xl hover:border-purple-500/30 transition-all duration-300">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">YukiFiles</span>
          </div>
          
          {/* Enhanced Icon with Animation */}
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={`w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
              isHovered ? 'scale-110 shadow-lg shadow-purple-500/25' : ''
            }`}>
              <Shield className={`w-10 h-10 text-purple-300 transition-all duration-300 ${
                isHovered ? 'scale-110' : ''
              }`} />
            </div>
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className={`absolute top-2 left-2 w-2 h-2 bg-purple-400 rounded-full transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`} />
              <div className={`absolute top-4 right-4 w-1.5 h-1.5 bg-pink-400 rounded-full transition-all duration-500 delay-100 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`} />
              <div className={`absolute bottom-2 left-4 w-1 h-1 bg-blue-400 rounded-full transition-all duration-500 delay-200 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`} />
            </div>
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
                    className="pl-9 bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-600"
                  />
                </div>
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
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                    onChange={(e) => checkPasswordStrength(e.target.value)}
                    className="pl-9 pr-9 bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength <= 25 ? 'text-red-400' :
                      passwordStrength <= 50 ? 'text-orange-400' :
                      passwordStrength <= 75 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className={`flex items-center ${passwordStrength >= 25 ? 'text-green-400' : 'text-gray-500'}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      8+ characters
                    </span>
                    <span className={`flex items-center ${/[a-z]/.test((document.getElementById('password') as HTMLInputElement)?.value || '') ? 'text-green-400' : 'text-gray-500'}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Lowercase
                    </span>
                    <span className={`flex items-center ${/[A-Z]/.test((document.getElementById('password') as HTMLInputElement)?.value || '') ? 'text-green-400' : 'text-gray-500'}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Uppercase
                    </span>
                    <span className={`flex items-center ${/[0-9]/.test((document.getElementById('password') as HTMLInputElement)?.value || '') ? 'text-green-400' : 'text-gray-500'}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Number
                    </span>
                  </div>
                </div>
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
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    className="pl-9 pr-9 bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-purple-500 bg-black/30 border-gray-600 rounded focus:ring-purple-500/20 focus:ring-2 mt-0.5"
                  />
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    I agree to the{" "}
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                      Privacy Policy
                    </Link>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-500 bg-black/30 border-gray-600 rounded focus:ring-purple-500/20 focus:ring-2 mt-0.5"
                  />
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Send me product updates and security notifications
                  </div>
                </label>
              </div>
            </div>

            <SubmitButton disabled={false} />

            {/* Enhanced Security Protection Notice */}
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm hover:bg-green-500/15 transition-colors">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Security Protection Active</span>
                <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
              </div>
              <p className="mt-1 text-xs text-green-300">
                Advanced anti-fraud protection and device fingerprinting enabled.
              </p>
            </div>

            {/* Social Registration Options */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-gray-400">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="bg-black/30 border-gray-600 text-gray-300 hover:bg-gray-800/30 hover:border-gray-500 transition-all duration-200">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="bg-black/30 border-gray-600 text-gray-300 hover:bg-gray-800/30 hover:border-gray-500 transition-all duration-200">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Twitter
              </Button>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 underline font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Sparkles, Zap, CheckCircle, AlertCircle, Shield } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
    } catch (error) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/auth/login" className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          <Card className="w-full bg-black/40 backdrop-blur-lg border-green-500/20 shadow-2xl hover:border-green-500/30 transition-all duration-300">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <Logo size="lg" variant="glow" showText={true} />
              </div>
              
              <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              
              <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
              <CardDescription className="text-gray-400">
                We've sent a password reset link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Reset Link Sent</span>
                  <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                </div>
                <p className="mt-1 text-xs text-green-300">
                  The reset link will expire in 1 hour for security reasons.
                </p>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-400 text-sm">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-purple-400 hover:text-purple-300 underline font-medium transition-colors"
                  >
                    try again
                  </button>
                </p>
                
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full bg-black/30 border-gray-600 text-gray-300 hover:bg-gray-800/30 hover:border-gray-500 transition-all duration-200">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/auth/login" className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <Card className="w-full bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-2xl hover:border-purple-500/30 transition-all duration-300">
                      <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <Logo size="lg" variant="glow" showText={true} />
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
                <Mail className={`w-10 h-10 text-purple-300 transition-all duration-300 ${
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
            
            <CardTitle className="text-2xl text-white">Forgot Password?</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 hover:border-gray-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-purple-500/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg text-sm hover:bg-blue-500/15 transition-colors">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Secure Reset</span>
                  <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                </div>
                <p className="mt-1 text-xs text-blue-300">
                  Reset links are encrypted and expire automatically for your security.
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 underline font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { resendVerificationEmail } from "@/lib/actions/auth"
import { useToastHelpers } from "@/components/ui/toast"

interface EmailVerificationNoticeProps {
  email: string
  onClose?: () => void
}

export function EmailVerificationNotice({ email, onClose }: EmailVerificationNoticeProps) {
  const [isResending, setIsResending] = useState(false)
  const [isResent, setIsResent] = useState(false)
  const toast = useToastHelpers()

  const handleResend = async () => {
    setIsResending(true)
    try {
      const result = await resendVerificationEmail(email)
      if (result.success) {
        toast.success("Email sent!", result.success)
        setIsResent(true)
        setTimeout(() => setIsResent(false), 5000)
      } else {
        toast.error("Failed to send email", result.error || "Please try again later")
      }
    } catch (error) {
      toast.error("Error", "An unexpected error occurred")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md premium-card shadow-2xl">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-purple-400" />
        </div>
        <CardTitle className="text-xl font-bold text-white">Verify Your Email</CardTitle>
        <CardDescription className="text-gray-400">
          We've sent a verification link to <span className="text-purple-300 font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="font-medium mb-1">Check your inbox and spam folder</p>
              <p className="text-gray-400">Click the verification link in the email to activate your account</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleResend}
            disabled={isResending}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Resend Email
              </>
            )}
          </Button>
          
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800/30"
            >
              Close
            </Button>
          )}
        </div>

        {isResent && (
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Verification email sent successfully!</span>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          Didn't receive the email? Check your spam folder or try resending
        </div>
      </CardContent>
    </Card>
  )
}
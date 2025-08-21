"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Sparkles, Info, Code } from "lucide-react"
import Link from "next/link"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.setState({ error, errorInfo })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  const [showDetails, setShowDetails] = useState(false)
  const [errorInfo, setErrorInfo] = useState<{
    message: string
    stack?: string
    componentStack?: string
    errorBoundary?: string
  } | null>(null)

  useEffect(() => {
    if (error) {
      // Enhanced error analysis
      const errorAnalysis = {
        message: error.message,
        stack: error.stack,
        componentStack: '',
        errorBoundary: error.name
      }

      // Detect specific error types
      if (error.message.includes("Cannot access") && error.message.includes("before initialization")) {
        errorAnalysis.message = `Variable Access Error: ${error.message}`
        errorAnalysis.componentStack = "This error occurs when a variable is used before it's declared. Check for hoisting issues in React components."
      } else if (error.message.includes("is not a function")) {
        errorAnalysis.message = `Function Error: ${error.message}`
        errorAnalysis.componentStack = "This error occurs when trying to call something that isn't a function. Check for undefined imports or method calls."
      } else if (error.message.includes("Cannot read properties")) {
        errorAnalysis.message = `Property Access Error: ${error.message}`
        errorAnalysis.componentStack = "This error occurs when trying to access properties of undefined/null. Check for proper null checks."
      }

      setErrorInfo(errorAnalysis)
    }
  }, [error])

  const copyErrorDetails = () => {
    const errorText = `
YukiFiles Error Report
=====================
Time: ${new Date().toISOString()}
Error: ${errorInfo?.message}
Stack: ${errorInfo?.stack}
Component: ${errorInfo?.componentStack}
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
    `.trim()
    
    navigator.clipboard.writeText(errorText)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-black/40 via-red-950/30 to-black/40 backdrop-blur-lg border border-red-500/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-white mb-2">Something went wrong</CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            We encountered an unexpected error in YukiFiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Summary */}
          {errorInfo && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-300 font-semibold mb-2">Error Summary</p>
                  <p className="text-red-200 text-sm leading-relaxed">{errorInfo.message}</p>
                  
                  {errorInfo.componentStack && (
                    <div className="mt-3 p-3 bg-red-500/5 rounded border border-red-500/10">
                      <p className="text-red-300 text-xs font-medium mb-1">Likely Cause:</p>
                      <p className="text-red-200/80 text-xs">{errorInfo.componentStack}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                >
                  {showDetails ? 'Hide' : 'Show'} Technical Details
                </Button>
                <Button
                  onClick={copyErrorDetails}
                  size="sm"
                  variant="outline"
                  className="border-orange-500/30 text-orange-300 hover:bg-orange-500/20"
                >
                  Copy Error Report
                </Button>
              </div>
            </div>
          )}

          {/* Technical Details */}
          {showDetails && errorInfo && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Technical Details
              </h4>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs font-medium mb-1">Error Stack:</p>
                  <pre className="bg-black/50 rounded p-3 text-red-300 text-xs overflow-x-auto max-h-32">
                    {errorInfo.stack || 'No stack trace available'}
                  </pre>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 font-medium">Error Type:</p>
                    <p className="text-white">{errorInfo.errorBoundary}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Timestamp:</p>
                    <p className="text-white">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={resetError} 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/20">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard?demo=true">
                <Button variant="outline" className="w-full border-green-500/30 text-green-300 hover:bg-green-500/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Demo Mode
                </Button>
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 font-semibold mb-2">Need Help?</p>
                <p className="text-blue-200/80 text-sm mb-3">
                  If this error persists, please contact our support team with the error report.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-300">
                    Contact Support
                  </Button>
                  <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-300">
                    Check Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    console.error("Error caught by useErrorHandler:", error)
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}
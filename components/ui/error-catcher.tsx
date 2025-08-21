"use client"

import React from "react"

interface ErrorCatcherProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface ErrorCatcherState {
  hasError: boolean
  error?: Error
}

export class ErrorCatcher extends React.Component<ErrorCatcherProps, ErrorCatcherState> {
  constructor(props: ErrorCatcherProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorCatcherState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorCatcher caught an error:", error, errorInfo)
    
    // Log specific v initialization errors
    if (error.message.includes("Cannot access") && error.message.includes("before initialization")) {
      console.error("V initialization error details:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} reset={this.reset} />
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-lg border border-red-500/20 rounded-lg p-6 max-w-md">
            <h2 className="text-red-400 font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-300 text-sm mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={this.reset}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
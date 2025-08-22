"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string
}

export class SimpleErrorScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.group('🚨 YukiFiles Error')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    console.error('Component:', errorInfo.componentStack)
    console.groupEnd()
  }

  render() {
    if (this.state.hasError) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full mx-auto">
            <div className="bg-gradient-to-br from-red-950/80 via-slate-900/95 to-red-950/80 border border-red-500/30 rounded-xl shadow-2xl p-6 text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Title */}
              <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
              <p className="text-gray-400 text-sm mb-4">YukiFiles encountered an error</p>
              
              {/* Error Details */}
              <div className="bg-black/30 rounded-lg p-3 mb-4 text-left">
                <p className="text-red-300 text-xs font-mono">
                  {this.state.error?.message}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  ID: {this.state.errorId}
                </p>
              </div>
              
              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Refresh Page
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.location.href = '/dashboard'}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 text-sm"
                  >
                    Dashboard
                  </Button>
                  
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify({
                        id: this.state.errorId,
                        error: this.state.error?.message,
                        url: window.location.href
                      }, null, 2))
                    }}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 text-sm"
                  >
                    Copy Error
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
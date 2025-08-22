"use client"

import React, { Component, ReactNode, ErrorInfo } from 'react'

interface JErrorShieldState {
  hasJError: boolean
  errorDetails: {
    message: string
    stack?: string
    componentStack?: string
  } | null
  retryCount: number
}

interface JErrorShieldProps {
  children: ReactNode
  maxRetries?: number
  fallback?: ReactNode
}

export class JErrorShield extends Component<JErrorShieldProps, JErrorShieldState> {
  private retryTimeout: NodeJS.Timeout | null = null

  constructor(props: JErrorShieldProps) {
    super(props)
    this.state = {
      hasJError: false,
      errorDetails: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<JErrorShieldState> {
    // Check if this is the j initialization error
    const isJError = error.message && 
      (error.message.includes('Cannot access') && error.message.includes('before initialization')) ||
      error.message.includes('j is not defined') ||
      error.message.includes('j is not a function')

    if (isJError) {
      console.error('🛡️ J-ERROR-SHIELD: Caught j initialization error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })

      return {
        hasJError: true,
        errorDetails: {
          message: error.message,
          stack: error.stack
        }
      }
    }

    // If not a j error, let it bubble up
    throw error
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🛡️ J-ERROR-SHIELD: Component caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount
    })
  }

  handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3
    
    if (this.state.retryCount < maxRetries) {
      console.log(`🔄 J-ERROR-SHIELD: Retrying (${this.state.retryCount + 1}/${maxRetries})...`)
      
      this.setState(prevState => ({
        hasJError: false,
        errorDetails: null,
        retryCount: prevState.retryCount + 1
      }))

      // Clear any potential j variables
      if (typeof window !== 'undefined') {
               // @ts-expect-error - Accessing global j variable
       if ('j' in window) {
         // @ts-expect-error - Deleting global j variable
         delete window.j
        }
      }
    } else {
      console.error('🚨 J-ERROR-SHIELD: Max retries reached, showing fallback')
    }
  }

  handleReset = () => {
    this.setState({
      hasJError: false,
      errorDetails: null,
      retryCount: 0
    })
  }

  render() {
    if (this.state.hasJError) {
      const { retryCount } = this.state
      const maxRetries = this.props.maxRetries || 3
      const canRetry = retryCount < maxRetries

      return this.props.fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-lg border border-red-500/30 rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">
                Initialization Error
              </h2>
              
              <p className="text-gray-300 text-sm mb-6">
                A JavaScript initialization conflict occurred. This is usually temporary and can be resolved by refreshing.
              </p>

              <div className="space-y-3">
                {canRetry ? (
                  <button
                    onClick={this.handleRetry}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Try Again ({retryCount}/{maxRetries})
                  </button>
                ) : (
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Refresh Page
                  </button>
                )}
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Go Home
                </button>
              </div>

              <details className="mt-4 text-left">
                <summary className="text-gray-400 text-xs cursor-pointer hover:text-gray-300">
                  Technical Details
                </summary>
                <pre className="mt-2 p-2 bg-gray-900 rounded text-xs text-gray-400 overflow-auto max-h-32">
                  {this.state.errorDetails?.message}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
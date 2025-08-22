"use client"

import React, { Component, ReactNode } from 'react'

interface JErrorGuardState {
  hasError: boolean
  error: Error | null
}

interface JErrorGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export class JErrorGuard extends Component<JErrorGuardProps, JErrorGuardState> {
  constructor(props: JErrorGuardProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): JErrorGuardState {
    // Check if this is the specific j initialization error
    if (error.message && error.message.includes('Cannot access') && error.message.includes('before initialization')) {
      console.error('🔍 J INITIALIZATION ERROR CAUGHT:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    }
    
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🛡️ JErrorGuard caught error:', error, errorInfo)
    
    // Log detailed information about j-related errors
    if (error.message && error.message.includes('Cannot access') && error.message.includes('before initialization')) {
      console.error('🔍 DETAILED J ERROR ANALYSIS:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        possibleCauses: [
          'Variable hoisting conflict',
          'Temporal Dead Zone (TDZ) violation',
          'Circular import dependency',
          'Minified code variable collision',
          'Build artifact conflict'
        ]
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h3 className="text-red-400 font-semibold mb-2">⚠️ Component Error Detected</h3>
          <p className="text-gray-300 text-sm mb-2">
            A JavaScript initialization error occurred. This is usually caused by variable hoisting conflicts.
          </p>
          <details className="text-xs text-gray-400">
            <summary className="cursor-pointer hover:text-gray-300">Technical Details</summary>
            <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto">
              {this.state.error?.message}
            </pre>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
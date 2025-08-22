"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, RefreshCw, Copy, ChevronDown, ChevronUp,
  Bug, Code, FileText, Search, Zap, Shield, Database,
  X, ExternalLink, Download, Eye, Settings
} from "lucide-react"

interface Props {
  children: ReactNode
  fallbackTitle?: string
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showFullStack: boolean
  errorId: string
  timestamp: string
}

export class AdvancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showFullStack: false,
      errorId: '',
      timestamp: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const timestamp = new Date().toISOString()
    
    return {
      hasError: true,
      error,
      errorId,
      timestamp
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Advanced error analysis
    this.analyzeError(error, errorInfo)
  }

  analyzeError = (error: Error, errorInfo: ErrorInfo) => {
    const analysis = {
      errorType: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      // Specific analysis for undefined length errors
      isLengthError: error.message.includes("Cannot read properties of undefined (reading 'length')"),
      possibleCauses: this.getPossibleCauses(error.message),
      suggestedFixes: this.getSuggestedFixes(error.message)
    }

    console.group('🚨 Advanced Error Analysis')
    console.error('Error Details:', analysis)
    console.error('Component Stack:', errorInfo.componentStack)
    console.error('Error Stack:', error.stack)
    console.groupEnd()

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Send analysis to error tracking
    }
  }

  getPossibleCauses = (message: string): string[] => {
    if (message.includes("Cannot read properties of undefined (reading 'length')")) {
      return [
        "Array variable is undefined or null",
        "API response không return expected array",
        "State variable chưa được initialize",
        "Props không được pass correctly",
        "Async data chưa load xong",
        "Component mounting trước data ready",
        "Old component conflicts với new component",
        "Race condition trong state updates"
      ]
    }
    
    if (message.includes("Cannot read properties of undefined")) {
      return [
        "Object property access on undefined/null",
        "Destructuring assignment from undefined",
        "Missing null checks",
        "Async data loading issues"
      ]
    }

    return ["Unknown error type - needs investigation"]
  }

  getSuggestedFixes = (message: string): string[] => {
    if (message.includes("Cannot read properties of undefined (reading 'length')")) {
      return [
        "Add null check: (array || []).length",
        "Use optional chaining: array?.length || 0", 
        "Initialize with empty array: useState([])",
        "Add loading state check",
        "Wrap with conditional rendering",
        "Check component props validation",
        "Remove conflicting old components",
        "Add error boundary around component"
      ]
    }

    return ["Add proper null checks and error handling"]
  }

  getErrorSeverity = (error: Error): 'low' | 'medium' | 'high' | 'critical' => {
    if (error.message.includes('length')) return 'high'
    if (error.message.includes('undefined')) return 'medium'
    if (error.message.includes('TypeError')) return 'high'
    return 'medium'
  }

  copyErrorDetails = () => {
    const errorDetails = {
      id: this.state.errorId,
      timestamp: this.state.timestamp,
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
  }

  downloadErrorLog = () => {
    const errorLog = {
      errorId: this.state.errorId,
      timestamp: this.state.timestamp,
      error: {
        name: this.state.error?.name,
        message: this.state.error?.message,
        stack: this.state.error?.stack
      },
      componentStack: this.state.errorInfo?.componentStack,
      analysis: {
        possibleCauses: this.getPossibleCauses(this.state.error?.message || ''),
        suggestedFixes: this.getSuggestedFixes(this.state.error?.message || '')
      },
      environment: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: this.state.timestamp
      }
    }

    const blob = new Blob([JSON.stringify(errorLog, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yukifiles-error-${this.state.errorId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  render() {
    if (this.state.hasError) {
      const severity = this.getErrorSeverity(this.state.error!)
      const isLengthError = this.state.error?.message.includes("Cannot read properties of undefined (reading 'length')")

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="max-w-4xl w-full"
          >
            <Card className="bg-gradient-to-br from-red-950/50 via-slate-900/90 to-red-950/50 border-red-500/30 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl mb-2">
                      🚨 Application Error Detected
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        severity === 'critical' ? 'bg-red-600' :
                        severity === 'high' ? 'bg-orange-600' :
                        severity === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
                      } text-white`}>
                        {severity.toUpperCase()} SEVERITY
                      </Badge>
                      <Badge className="bg-gray-600 text-white">
                        ID: {this.state.errorId}
                      </Badge>
                      <Badge className="bg-purple-600 text-white">
                        {this.state.timestamp}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error Summary */}
                <div className="bg-black/40 rounded-lg p-4 border border-red-500/20">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Bug className="w-5 h-5 text-red-400" />
                    Error Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 font-medium min-w-[80px]">Type:</span>
                      <span className="text-white">{this.state.error?.name}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 font-medium min-w-[80px]">Message:</span>
                      <span className="text-white font-mono text-sm bg-black/30 px-2 py-1 rounded">
                        {this.state.error?.message}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 font-medium min-w-[80px]">Location:</span>
                      <span className="text-gray-300 text-sm">{window.location.pathname}</span>
                    </div>
                  </div>
                </div>

                {/* Specific Analysis for Length Errors */}
                {isLengthError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4"
                  >
                    <h3 className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Length Error Analysis
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-black/30 rounded p-3">
                        <h4 className="text-white font-medium mb-2">🎯 Most Likely Causes:</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Array variable is undefined (files, activities, notifications)</li>
                          <li>• Component mounting before data is loaded</li>
                          <li>• Old component conflicts với new components</li>
                          <li>• Props không được passed correctly từ parent</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black/30 rounded p-3">
                        <h4 className="text-white font-medium mb-2">🔧 Immediate Fixes:</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Replace: array.length → (array || []).length</li>
                          <li>• Replace: array.map() → (array || []).map()</li>
                          <li>• Add: if (!array) return null</li>
                          <li>• Check: Component props validation</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Possible Causes */}
                <div className="bg-black/40 rounded-lg p-4 border border-yellow-500/20">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Search className="w-5 h-5 text-yellow-400" />
                    Possible Causes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {this.getPossibleCauses(this.state.error?.message || '').map((cause, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-black/30 rounded">
                        <span className="text-yellow-400 font-bold text-xs mt-1">{index + 1}</span>
                        <span className="text-gray-300 text-sm">{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Fixes */}
                <div className="bg-black/40 rounded-lg p-4 border border-green-500/20">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    Suggested Fixes
                  </h3>
                  <div className="space-y-2">
                    {this.getSuggestedFixes(this.state.error?.message || '').map((fix, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-black/30 rounded">
                        <span className="text-green-400 font-bold text-xs mt-1">✓</span>
                        <span className="text-gray-300 text-sm">{fix}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                  <button
                    onClick={() => this.setState({ showFullStack: !this.state.showFullStack })}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-400" />
                      Technical Details
                    </h3>
                    {this.state.showFullStack ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {this.state.showFullStack && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3"
                      >
                        <div>
                          <h4 className="text-white font-medium mb-2">Error Stack:</h4>
                          <pre className="bg-black/50 p-3 rounded text-xs text-gray-300 overflow-x-auto max-h-32 overflow-y-auto">
                            {this.state.error?.stack}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-medium mb-2">Component Stack:</h4>
                          <pre className="bg-black/50 p-3 rounded text-xs text-gray-300 overflow-x-auto max-h-32 overflow-y-auto">
                            {this.state.errorInfo?.componentStack}
                          </pre>
                        </div>

                        <div>
                          <h4 className="text-white font-medium mb-2">Environment:</h4>
                          <div className="bg-black/50 p-3 rounded text-xs text-gray-300 space-y-1">
                            <div>URL: {window.location.href}</div>
                            <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
                            <div>User Agent: {navigator.userAgent}</div>
                            <div>Timestamp: {this.state.timestamp}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                  
                  <Button
                    onClick={this.copyErrorDetails}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Error Details
                  </Button>
                  
                  <Button
                    onClick={this.downloadErrorLog}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Log
                  </Button>
                  
                  <Button
                    onClick={() => window.history.back()}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Go Back
                  </Button>
                </div>

                {/* Quick Debug Info */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Quick Debug Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="text-white font-medium mb-2">Component State:</h4>
                      <div className="bg-black/30 p-2 rounded text-xs text-gray-300">
                        <div>Error ID: {this.state.errorId}</div>
                        <div>Has Error: {this.state.hasError ? 'Yes' : 'No'}</div>
                        <div>Show Stack: {this.state.showFullStack ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Browser Info:</h4>
                      <div className="bg-black/30 p-2 rounded text-xs text-gray-300">
                        <div>Mobile: {window.innerWidth < 768 ? 'Yes' : 'No'}</div>
                        <div>Online: {navigator.onLine ? 'Yes' : 'No'}</div>
                        <div>Cookies: {navigator.cookieEnabled ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
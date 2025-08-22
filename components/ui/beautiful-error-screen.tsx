"use client"

import React, { Component, ErrorInfo, ReactNode, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, RefreshCw, Copy, ChevronDown, ChevronUp,
  Bug, Code, FileText, Search, Zap, Shield, Database,
  X, ExternalLink, Download, Eye, Settings, Home,
  ArrowLeft, Smartphone, Monitor, Globe, Clock
} from "lucide-react"

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  timestamp: string
}

export class BeautifulErrorScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
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

    // Advanced error logging
    console.group('🚨 YukiFiles Error Analysis')
    console.error('Error ID:', this.state.errorId)
    console.error('Timestamp:', this.state.timestamp)
    console.error('Error:', error)
    console.error('Component Stack:', errorInfo.componentStack)
    console.groupEnd()
  }

  copyErrorInfo = () => {
    const errorInfo = {
      id: this.state.errorId,
      timestamp: this.state.timestamp,
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    navigator.clipboard.writeText(JSON.stringify(errorInfo, null, 2))
  }

  render() {
    if (this.state.hasError) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const isLengthError = this.state.error?.message.includes("Cannot read properties of undefined (reading 'length')")

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 flex items-center justify-center p-4 mobile-viewport-fix">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl mx-auto"
          >
            {/* Mobile Layout */}
            {isMobile ? (
              <Card className="bg-gradient-to-br from-red-950/80 via-slate-900/95 to-red-950/80 border-red-500/30 shadow-2xl mobile-container">
                <CardContent className="p-4 text-center space-y-4">
                  {/* Mobile Header */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto"
                  >
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h1>
                    <p className="text-gray-400 text-sm">We're sorry for the inconvenience</p>
                  </motion.div>

                  {/* Error Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-black/30 rounded-lg p-3 text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Bug className="w-4 h-4 text-red-400" />
                      <span className="text-white font-medium text-sm">Error Details</span>
                    </div>
                    <p className="text-red-300 text-xs font-mono bg-black/30 p-2 rounded">
                      {this.state.error?.message}
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                      <div>ID: {this.state.errorId}</div>
                      <div>Time: {new Date(this.state.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </motion.div>

                  {/* Length Error Specific Help */}
                  {isLengthError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 font-medium text-sm">Data Loading Issue</span>
                      </div>
                      <p className="text-gray-300 text-xs">
                        This usually happens when data is still loading. Please try refreshing the page.
                      </p>
                    </motion.div>
                  )}

                  {/* Mobile Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <Button
                      onClick={() => window.location.reload()}
                      className="w-full bg-purple-600 hover:bg-purple-700 touch-manipulation"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Page
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.location.href = '/dashboard'}
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 touch-manipulation"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                      </Button>
                      
                      <Button
                        onClick={this.copyErrorInfo}
                        variant="outline"
                        className="flex-1 border-gray-600 text-gray-300 touch-manipulation"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            ) : (
              /* Desktop Layout */
              <Card className="bg-gradient-to-br from-red-950/50 via-slate-900/90 to-red-950/50 border-red-500/30 shadow-2xl">
                <CardContent className="p-8 space-y-6">
                  {/* Desktop Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <AlertTriangle className="w-10 h-10 text-red-400" />
                    </motion.div>
                    
                    <h1 className="text-3xl font-bold text-white mb-2">Application Error</h1>
                    <p className="text-gray-400">Something went wrong in YukiFiles</p>
                    
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <Badge className="bg-red-600 text-white">HIGH SEVERITY</Badge>
                      <Badge className="bg-gray-600 text-white">ID: {this.state.errorId}</Badge>
                    </div>
                  </motion.div>

                  {/* Error Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-black/40 rounded-lg p-6 border border-red-500/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Bug className="w-6 h-6 text-red-400" />
                      <h2 className="text-white font-semibold text-lg">Error Summary</h2>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-red-400 font-medium">Type:</span>
                          <p className="text-white">{this.state.error?.name}</p>
                        </div>
                        <div>
                          <span className="text-red-400 font-medium">Location:</span>
                          <p className="text-gray-300">{window.location.pathname}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-red-400 font-medium">Message:</span>
                        <p className="text-white font-mono text-sm bg-black/30 p-3 rounded mt-1">
                          {this.state.error?.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Length Error Analysis */}
                  {isLengthError && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Database className="w-6 h-6 text-orange-400" />
                        <h2 className="text-orange-400 font-semibold text-lg">Length Error Analysis</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-white font-medium mb-3">🎯 Root Cause:</h3>
                          <div className="space-y-2">
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                Variable <code className="text-orange-400">'j'</code> is undefined in minified code
                              </p>
                            </div>
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                Likely caused by array/object not being initialized
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-white font-medium mb-3">🔧 Quick Fix:</h3>
                          <div className="space-y-2">
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                Refresh page để reload data
                              </p>
                            </div>
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                Check network connection
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Desktop Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-3"
                  >
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Page
                    </Button>
                    
                    <Button
                      onClick={() => window.location.href = '/dashboard'}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Go to Dashboard
                    </Button>
                    
                    <Button
                      onClick={() => window.history.back()}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Go Back
                    </Button>
                    
                    <Button
                      onClick={this.copyErrorInfo}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Error Details
                    </Button>
                  </motion.div>

                  {/* Environment Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-5 h-5 text-blue-400" />
                      <h3 className="text-blue-400 font-medium">Environment Info</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-black/30 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          {isMobile ? <Smartphone className="w-4 h-4 text-blue-400" /> : <Monitor className="w-4 h-4 text-blue-400" />}
                          <span className="text-white font-medium">Device</span>
                        </div>
                        <p className="text-gray-300">{isMobile ? 'Mobile' : 'Desktop'}</p>
                        <p className="text-gray-400 text-xs">{window.innerWidth}x{window.innerHeight}</p>
                      </div>
                      
                      <div className="bg-black/30 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-medium">Connection</span>
                        </div>
                        <p className="text-gray-300">{navigator.onLine ? 'Online' : 'Offline'}</p>
                        <p className="text-gray-400 text-xs">Cookies: {navigator.cookieEnabled ? 'Yes' : 'No'}</p>
                      </div>
                      
                      <div className="bg-black/30 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-medium">Time</span>
                        </div>
                        <p className="text-gray-300">{new Date().toLocaleTimeString()}</p>
                        <p className="text-gray-400 text-xs">ID: {this.state.errorId.slice(-8)}</p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            ) : (
              /* Desktop Layout - More detailed */
              <Card className="bg-gradient-to-br from-red-950/50 via-slate-900/90 to-red-950/50 border-red-500/30 shadow-2xl">
                <CardContent className="p-8 space-y-8">
                  {/* Desktop Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <AlertTriangle className="w-12 h-12 text-red-400" />
                    </motion.div>
                    
                    <h1 className="text-4xl font-bold text-white mb-3">Application Error</h1>
                    <p className="text-gray-400 text-lg">YukiFiles encountered an unexpected error</p>
                    
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <Badge className="bg-red-600 text-white px-3 py-1">HIGH SEVERITY</Badge>
                      <Badge className="bg-gray-600 text-white px-3 py-1">
                        ID: {this.state.errorId}
                      </Badge>
                      <Badge className="bg-purple-600 text-white px-3 py-1">
                        {new Date(this.state.timestamp).toLocaleString()}
                      </Badge>
                    </div>
                  </motion.div>

                  {/* Error Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-black/40 rounded-lg p-6 border border-red-500/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Bug className="w-6 h-6 text-red-400" />
                      <h2 className="text-white font-semibold text-xl">Error Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-red-400 font-medium">Error Type:</span>
                        <p className="text-white text-lg">{this.state.error?.name}</p>
                      </div>
                      <div>
                        <span className="text-red-400 font-medium">Location:</span>
                        <p className="text-gray-300">{window.location.href}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <span className="text-red-400 font-medium">Message:</span>
                      <p className="text-white font-mono text-sm bg-black/30 p-4 rounded mt-2">
                        {this.state.error?.message}
                      </p>
                    </div>
                  </motion.div>

                  {/* Length Error Analysis - Desktop */}
                  {isLengthError && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Database className="w-6 h-6 text-orange-400" />
                        <h2 className="text-orange-400 font-semibold text-xl">Length Error Analysis</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-white font-medium mb-3">🎯 Most Likely Causes:</h3>
                          <div className="space-y-2">
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                <code className="text-orange-400">'j'</code> variable in minified code is undefined
                              </p>
                            </div>
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                Array/object not initialized before access
                              </p>
                            </div>
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                Component mounting before data loads
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-white font-medium mb-3">🔧 Recommended Actions:</h3>
                          <div className="space-y-2">
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                ✓ Refresh page để reload data
                              </p>
                            </div>
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                ✓ Check network connection
                              </p>
                            </div>
                            <div className="bg-black/30 rounded p-3">
                              <p className="text-gray-300 text-sm">
                                ✓ Try accessing different page first
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Desktop Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-purple-600 hover:bg-purple-700 px-6"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Refresh Page
                    </Button>
                    
                    <Button
                      onClick={() => window.location.href = '/dashboard'}
                      variant="outline"
                      className="border-gray-600 text-gray-300 px-6"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      Go to Dashboard
                    </Button>
                    
                    <Button
                      onClick={() => window.history.back()}
                      variant="outline"
                      className="border-gray-600 text-gray-300 px-6"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Go Back
                    </Button>
                    
                    <Button
                      onClick={this.copyErrorInfo}
                      variant="outline"
                      className="border-gray-600 text-gray-300 px-6"
                    >
                      <Copy className="w-5 h-5 mr-2" />
                      Copy Error Details
                    </Button>
                  </motion.div>

                  {/* Environment Details - Desktop Only */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="w-6 h-6 text-blue-400" />
                      <h2 className="text-blue-400 font-semibold text-xl">Environment Information</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-black/30 rounded p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-medium">Display</span>
                        </div>
                        <p className="text-gray-300">{window.innerWidth} x {window.innerHeight}</p>
                        <p className="text-gray-400 text-sm">Desktop viewport</p>
                      </div>
                      
                      <div className="bg-black/30 rounded p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-medium">Network</span>
                        </div>
                        <p className="text-gray-300">{navigator.onLine ? 'Connected' : 'Disconnected'}</p>
                        <p className="text-gray-400 text-sm">Cookies: {navigator.cookieEnabled ? 'Enabled' : 'Disabled'}</p>
                      </div>
                      
                      <div className="bg-black/30 rounded p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-medium">Timestamp</span>
                        </div>
                        <p className="text-gray-300">{new Date().toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">Error ID: {this.state.errorId.slice(-8)}</p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
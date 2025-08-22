'use client'

import React, { useState } from 'react'
import { AlertTriangle, RefreshCw, Home, Copy, ChevronDown, ChevronUp, Download, Sparkles, Shield, Zap } from 'lucide-react'

interface SimpleErrorScreenProps {
  error?: Error
  errorInfo?: { componentStack?: string }
  resetError?: () => void
}

export function SimpleErrorScreen({ 
  error, 
  errorInfo,
  resetError 
}: SimpleErrorScreenProps) {
  const [showFullLog, setShowFullLog] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const fullErrorLog = {
    id: errorId,
    timestamp: new Date().toISOString(),
    error: error?.message || 'Unknown error',
    stack: error?.stack || 'No stack trace available',
    componentStack: errorInfo?.componentStack || 'No component stack available',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
  }

  const copyErrorLog = async () => {
    try {
      const logText = JSON.stringify(fullErrorLog, null, 2)
      await navigator.clipboard.writeText(logText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy error log:', err)
    }
  }

  const downloadErrorLog = () => {
    const logText = JSON.stringify(fullErrorLog, null, 2)
    const blob = new Blob([logText], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error-log-${errorId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRefresh = () => {
    if (resetError) {
      resetError()
    } else {
      window.location.reload()
    }
  }

  const goToDashboard = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Main Error Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-purple-600 to-orange-600 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-purple-900/30 to-orange-900/30"></div>
            <div className="relative z-10 flex items-center space-x-4 sm:space-x-6">
              <div className="relative">
                <div className="bg-white/20 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 sm:p-2">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">YukiFiles</h1>
                  <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium w-fit">
                    Error
                  </div>
                </div>
                <p className="text-red-100 text-lg sm:text-xl drop-shadow">Something went wrong</p>
                <p className="text-white/80 text-sm mt-1">We're working to fix this issue</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
            {/* Error Message Card */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-red-500/20 p-2 sm:p-3 rounded-xl flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-red-300 mb-2 sm:mb-3 text-base sm:text-lg">Error Details</h3>
                  <div className="bg-black/50 p-3 sm:p-4 rounded-lg border border-red-500/20">
                    <p className="text-red-200 font-mono text-xs sm:text-sm break-all leading-relaxed">
                      {error?.message || 'Unknown error occurred'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-4 space-y-2 sm:space-y-0">
                    <p className="text-red-400 text-sm font-medium">
                      Error ID: <span className="font-mono bg-red-500/20 px-2 py-1 rounded text-red-300">{errorId}</span>
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date().toLocaleString('en-US')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={handleRefresh}
                className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-105 min-h-[48px]"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={goToDashboard}
                className="group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-105 min-h-[48px]"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Go to Dashboard</span>
              </button>
            </div>

            {/* Feature Status Cards - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 sm:p-4 text-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-sm sm:text-base">Security</p>
                <p className="text-gray-400 text-xs sm:text-sm">Data Protected</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 sm:p-4 text-center">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-sm sm:text-base">Performance</p>
                <p className="text-gray-400 text-xs sm:text-sm">Fast Recovery</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 text-center">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-sm sm:text-base">Quality</p>
                <p className="text-gray-400 text-xs sm:text-sm">Premium Service</p>
              </div>
            </div>

            {/* Full Log Section */}
            <div className="border-t border-purple-500/20 pt-6 sm:pt-8">
              <button
                onClick={() => setShowFullLog(!showFullLog)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-500/10 to-red-500/10 hover:from-purple-500/20 hover:to-red-500/20 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-purple-500/20 min-h-[48px]"
              >
                <span className="font-bold text-white text-base sm:text-lg">View Full Error Log</span>
                <div className="bg-white/10 p-2 rounded-lg shadow-sm">
                  {showFullLog ? (
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  )}
                </div>
              </button>

              {showFullLog && (
                <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 animate-in slide-in-from-top duration-500">
                  {/* Copy and Download Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={copyErrorLog}
                      className="flex items-center justify-center space-x-3 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[48px] flex-1 sm:flex-none"
                    >
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{copied ? 'Copied!' : 'Copy Log'}</span>
                    </button>
                    
                    <button
                      onClick={downloadErrorLog}
                      className="flex items-center justify-center space-x-3 px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[48px] flex-1 sm:flex-none"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Download Log</span>
                    </button>
                  </div>

                  {/* Full Error Log Display */}
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-xl p-4 sm:p-6 max-h-64 sm:max-h-96 overflow-auto shadow-2xl border border-purple-500/20">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h4 className="text-purple-400 font-bold text-base sm:text-lg">Error Log Details</h4>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                    <pre className="text-green-300 text-xs sm:text-sm font-mono whitespace-pre-wrap break-all leading-relaxed">
                      {JSON.stringify(fullErrorLog, null, 2)}
                    </pre>
                  </div>

                  {/* Help Info */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-orange-500/10 border border-purple-500/20 p-4 sm:p-6 rounded-xl shadow-lg">
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg flex-shrink-0">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white mb-2 sm:mb-3 text-base sm:text-lg">How to use this information:</p>
                        <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-300 text-sm sm:text-base">
                          <li className="font-medium">Copy the log and share it with the development team</li>
                          <li className="font-medium">The error ID helps track this specific issue</li>
                          <li className="font-medium">The stack trace shows where the error occurred</li>
                          <li className="font-medium">Component stack shows which React component failed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-white/60 text-base sm:text-lg font-medium drop-shadow px-4">
          <p>If this problem persists, please contact support with the error ID above.</p>
          <p className="text-sm mt-2 text-purple-400">YukiFiles - Secure File Sharing Platform</p>
        </div>
      </div>
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import { AlertTriangle, RefreshCw, Home, Copy, ChevronDown, ChevronUp, Download } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Main Error Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-700/50 via-red-600/50 to-orange-600/50"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <AlertTriangle className="w-10 h-10 drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-bold drop-shadow-lg">Oops! Something went wrong</h1>
                <p className="text-red-100 mt-2 text-lg drop-shadow">We encountered an unexpected error</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-sm">
            {/* Error Message */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-300/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-2 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-800 mb-2 text-lg">Error Details</h3>
                  <p className="text-red-700 font-mono text-sm break-all bg-white/50 p-3 rounded-lg border border-red-300/30">
                    {error?.message || 'Unknown error occurred'}
                  </p>
                  <p className="text-red-600 text-sm mt-3 font-medium">
                    Error ID: <span className="font-mono bg-red-100 px-2 py-1 rounded">{errorId}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRefresh}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={goToDashboard}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Home className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </button>
            </div>

            {/* Full Log Section */}
            <div className="border-t border-red-200/50 pt-8">
              <button
                onClick={() => setShowFullLog(!showFullLog)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span className="font-bold text-red-800 text-lg">View Full Error Log</span>
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  {showFullLog ? (
                    <ChevronUp className="w-6 h-6 text-red-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </button>

              {showFullLog && (
                <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-300">
                  {/* Copy and Download Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={copyErrorLog}
                      className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Copy className="w-5 h-5" />
                      <span>{copied ? 'Copied!' : 'Copy Log'}</span>
                    </button>
                    
                    <button
                      onClick={downloadErrorLog}
                      className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Log</span>
                    </button>
                  </div>

                  {/* Full Error Log Display */}
                  <div className="bg-gradient-to-br from-red-950 via-red-900 to-orange-950 rounded-2xl p-6 max-h-96 overflow-auto shadow-2xl border border-red-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-orange-300 font-bold text-lg">Error Log Details</h4>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                    <pre className="text-orange-200 text-sm font-mono whitespace-pre-wrap break-all leading-relaxed">
                      {JSON.stringify(fullErrorLog, null, 2)}
                    </pre>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-300/50 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-100 p-2 rounded-xl">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-red-800 mb-3 text-lg">How to use this information:</p>
                        <ul className="list-disc list-inside space-y-2 text-red-700">
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
        <div className="text-center mt-8 text-white/80 text-lg font-medium drop-shadow">
          <p>If this problem persists, please contact support with the error ID above.</p>
        </div>
      </div>
    </div>
  )
}
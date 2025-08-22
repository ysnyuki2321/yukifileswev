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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Error Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
                <p className="text-red-100 mt-1">We encountered an unexpected error</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-1">Error Details</h3>
                  <p className="text-red-700 font-mono text-sm break-all">
                    {error?.message || 'Unknown error occurred'}
                  </p>
                  <p className="text-red-600 text-xs mt-2">
                    Error ID: <span className="font-mono">{errorId}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRefresh}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Page</span>
              </button>
              
              <button
                onClick={goToDashboard}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            </div>

            {/* Full Log Section */}
            <div className="border-t pt-6">
              <button
                onClick={() => setShowFullLog(!showFullLog)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-700">View Full Error Log</span>
                {showFullLog ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {showFullLog && (
                <div className="mt-4 space-y-4">
                  {/* Copy and Download Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={copyErrorLog}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? 'Copied!' : 'Copy Log'}</span>
                    </button>
                    
                    <button
                      onClick={downloadErrorLog}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Log</span>
                    </button>
                  </div>

                  {/* Full Error Log Display */}
                  <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto">
                    <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all">
                      {JSON.stringify(fullErrorLog, null, 2)}
                    </pre>
                  </div>

                  {/* Additional Info */}
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium mb-1">How to use this information:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Copy the log and share it with the development team</li>
                      <li>The error ID helps track this specific issue</li>
                      <li>The stack trace shows where the error occurred</li>
                      <li>Component stack shows which React component failed</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>If this problem persists, please contact support with the error ID above.</p>
        </div>
      </div>
    </div>
  )
}
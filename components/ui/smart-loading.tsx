"use client"

import React, { useState, useEffect } from 'react'
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SmartLoadingProps {
  timeout?: number // milliseconds
  onTimeout?: () => void
  onRetry?: () => void
  message?: string
  className?: string
  showProgress?: boolean
  progressSteps?: string[]
}

export const SmartLoading: React.FC<SmartLoadingProps> = ({
  timeout = 10000, // 10 seconds default
  onTimeout,
  onRetry,
  message = "Loading...",
  className,
  showProgress = false,
  progressSteps = []
}) => {
  const [timeLeft, setTimeLeft] = useState(timeout)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          setIsTimedOut(true)
          onTimeout?.()
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(timer)
  }, [onTimeout])

  useEffect(() => {
    if (showProgress && progressSteps.length > 0) {
      const progressTimer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < progressSteps.length - 1) {
            return prev + 1
          }
          return prev
        })
      }, 2000) // Change step every 2 seconds

      return () => clearInterval(progressTimer)
    }
  }, [showProgress, progressSteps])

  const handleRetry = () => {
    setIsRetrying(true)
    setIsTimedOut(false)
    setTimeLeft(timeout)
    setCurrentStep(0)
    
    // Simulate retry delay
    setTimeout(() => {
      setIsRetrying(false)
      onRetry?.()
    }, 1000)
  }

  const progressPercentage = ((timeout - timeLeft) / timeout) * 100

  if (isTimedOut) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center min-h-[60vh] p-8",
        className
      )}>
        <div className="text-center space-y-6">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          
          {/* Error Message */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Loading Timeout
            </h3>
            <p className="text-gray-400 max-w-md">
              The page is taking longer than expected to load. This might be due to a slow connection or server issue.
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Time elapsed</span>
              <span>{Math.round(timeout / 1000)}s</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: '100%' }}
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
            >
              {isRetrying ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[60vh] p-8",
      className
    )}>
      <div className="text-center space-y-6">
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          
          {/* Progress Ring */}
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" />
        </div>
        
        {/* Loading Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            {message}
          </h3>
          {showProgress && progressSteps[currentStep] && (
            <p className="text-gray-400">
              {progressSteps[currentStep]}
            </p>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Loading...</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Time Left */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            {Math.ceil(timeLeft / 1000)}s remaining
          </span>
        </div>
        
        {/* Progress Steps */}
        {showProgress && progressSteps.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {progressSteps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-1 px-2 py-1 rounded-full text-xs",
                  index <= currentStep
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                )}
              >
                {index <= currentStep ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                )}
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Quick Loading Components
export const QuickLoading: React.FC<{ message?: string; className?: string }> = ({ 
  message = "Loading...", 
  className 
}) => (
  <div className={cn("flex items-center justify-center p-8", className)}>
    <div className="text-center space-y-4">
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
      <p className="text-gray-400">{message}</p>
    </div>
  </div>
)

export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
  message?: string;
}> = ({ 
  size = 'md', 
  className,
  message
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("text-blue-400 animate-spin", sizes[size])} />
      {message && (
        <p className="text-gray-400 text-sm mt-2">{message}</p>
      )}
    </div>
  )
}

// Loading States
export const LoadingStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  TIMEOUT: 'timeout'
} as const

export type LoadingState = typeof LoadingStates[keyof typeof LoadingStates]

// Loading Context Provider
export const LoadingProvider: React.FC<{
  children: React.ReactNode
  defaultTimeout?: number
}> = ({ children, defaultTimeout = 10000 }) => {
  return (
    <div className="loading-provider">
      {children}
    </div>
  )
}

export default SmartLoading
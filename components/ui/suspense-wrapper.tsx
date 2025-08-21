"use client"

import { Suspense, ReactNode } from 'react'
import { LoadingSkeleton } from './loading-skeleton'

interface SuspenseWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

export function SuspenseWrapper({ 
  children, 
  fallback = <LoadingSkeleton />, 
  className 
}: SuspenseWrapperProps) {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  )
}

// Specific loading components for different sections
export function FileManagerSuspense({ children }: { children: ReactNode }) {
  return (
    <SuspenseWrapper
      fallback={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-700 rounded w-48 animate-pulse" />
            <div className="h-10 bg-gray-700 rounded w-32 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      {children}
    </SuspenseWrapper>
  )
}

export function DashboardSuspense({ children }: { children: ReactNode }) {
  return (
    <SuspenseWrapper
      fallback={
        <div className="space-y-6">
          <div className="h-12 bg-gray-700 rounded w-64 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-gray-700 rounded-lg animate-pulse" />
        </div>
      }
    >
      {children}
    </SuspenseWrapper>
  )
}
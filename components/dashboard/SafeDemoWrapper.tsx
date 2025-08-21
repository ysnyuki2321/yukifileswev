"use client"

import React, { Suspense } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface SafeDemoWrapperProps {
  children: React.ReactNode
  fallbackTitle?: string
}

function DemoLoadingFallback({ title = "Loading Demo..." }: { title?: string }) {
  return (
    <Card className="bg-black/40 border-purple-500/20">
      <CardContent className="p-8 text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>
        <p className="text-white font-medium">{title}</p>
        <p className="text-gray-400 text-sm mt-2">Initializing demo features...</p>
      </CardContent>
    </Card>
  )
}

function DemoErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <Card className="bg-black/40 border-red-500/20">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <p className="text-red-300 font-medium mb-2">Demo Feature Error</p>
        <p className="text-gray-400 text-sm mb-4">{error.message}</p>
        <button
          onClick={resetError}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600"
        >
          Retry Demo
        </button>
      </CardContent>
    </Card>
  )
}

export function SafeDemoWrapper({ children, fallbackTitle }: SafeDemoWrapperProps) {
  return (
    <ErrorBoundary fallback={DemoErrorFallback}>
      <Suspense fallback={<DemoLoadingFallback title={fallbackTitle} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
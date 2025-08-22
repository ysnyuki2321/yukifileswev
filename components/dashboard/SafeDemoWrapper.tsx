"use client"

import React, { Suspense, Component, ErrorInfo, ReactNode } from "react"
import { SimpleErrorScreen } from "@/components/ui/simple-error-screen"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface SafeDemoWrapperProps {
  children: React.ReactNode
  fallbackTitle?: string
}

// Simple Error Boundary for Demo Components
class DemoErrorBoundary extends Component<
  { children: ReactNode; fallbackTitle?: string },
  { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null }
> {
  constructor(props: { children: ReactNode; fallbackTitle?: string }) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Demo Component Error:', error)
    console.error('Error Info:', errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <SimpleErrorScreen 
          error={this.state.error || undefined}
          errorInfo={this.state.errorInfo || undefined}
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      )
    }

    return this.props.children
  }
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

export function SafeDemoWrapper({ children, fallbackTitle }: SafeDemoWrapperProps) {
  return (
    <DemoErrorBoundary fallbackTitle={fallbackTitle}>
      <Suspense fallback={<DemoLoadingFallback title={fallbackTitle} />}>
        {children}
      </Suspense>
    </DemoErrorBoundary>
  )
}
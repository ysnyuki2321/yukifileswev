import React from "react"
import { Loader2, FileText, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface SmartLoadingProps {
  type?: "spinner" | "dots" | "pulse" | "file" | "folder"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function SmartLoading({ 
  type = "spinner", 
  size = "md", 
  text,
  className = "" 
}: SmartLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  const renderLoader = () => {
    switch (type) {
      case "dots":
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )
      case "pulse":
        return (
          <div className={cn("bg-current rounded-full animate-pulse", sizeClasses[size])} />
        )
      case "file":
        return (
          <div className="relative">
            <FileText className={cn("text-blue-500", sizeClasses[size])} />
            <Loader2 className={cn("absolute inset-0 text-blue-600 animate-spin", sizeClasses[size])} />
          </div>
        )
      case "folder":
        return (
          <div className="relative">
            <FolderOpen className={cn("text-yellow-500", sizeClasses[size])} />
            <Loader2 className={cn("absolute inset-0 text-yellow-600 animate-spin", sizeClasses[size])} />
          </div>
        )
      default:
        return <Loader2 className={cn("animate-spin", sizeClasses[size])} />
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="text-gray-500">
        {renderLoader()}
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      )}
    </div>
  )
}

export function LoadingSpinner({ className = "" }: { className?: string }) {
  return <SmartLoading type="spinner" className={className} />
}

export function LoadingDots({ className = "" }: { className?: string }) {
  return <SmartLoading type="dots" className={className} />
}

export function LoadingPulse({ className = "" }: { className?: string }) {
  return <SmartLoading type="pulse" className={className} />
}
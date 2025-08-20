"use client"

import * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-green-500/20"
      case "error":
        return "border-red-500/20"
      case "warning":
        return "border-yellow-500/20"
      case "info":
        return "border-blue-500/20"
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-500/10"
      case "error":
        return "bg-red-500/10"
      case "warning":
        return "bg-yellow-500/10"
      case "info":
        return "bg-blue-500/10"
    }
  }

  return (
    <Card className={`bg-black/80 backdrop-blur-lg border ${getBorderColor()} animate-in slide-in-from-right-2 duration-300`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${getBgColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white">{toast.title}</h4>
            {toast.message && (
              <p className="text-sm text-gray-400 mt-1">{toast.message}</p>
            )}
            {toast.action && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toast.action.onClick}
                className="mt-2 h-6 px-2 text-xs text-purple-400 hover:text-purple-300"
              >
                {toast.action.label}
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(toast.id)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Convenience functions
export function useToastHelpers() {
  const { addToast } = useToast()

  return {
    success: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: "success", title, message, ...options })
    },
    error: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: "error", title, message, ...options })
    },
    warning: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: "warning", title, message, ...options })
    },
    info: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: "info", title, message, ...options })
    }
  }
}
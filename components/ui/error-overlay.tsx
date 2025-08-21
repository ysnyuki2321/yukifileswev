"use client"

import React, { useEffect, useState } from "react"

type ErrorInfo = { message: string; stack?: string }

export function ErrorOverlay() {
  const [error, setError] = useState<ErrorInfo | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      setError({ message: event.message || "Unknown error", stack: event.error?.stack })
      setVisible(true)
    }
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const message = typeof reason === 'string' ? reason : (reason?.message || 'Unhandled rejection')
      setError({ message, stack: reason?.stack })
      setVisible(true)
    }
    window.addEventListener("error", onError)
    window.addEventListener("unhandledrejection", onRejection)
    return () => {
      window.removeEventListener("error", onError)
      window.removeEventListener("unhandledrejection", onRejection)
    }
  }, [])

  if (!visible || !error) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-2xl mx-auto mt-20 rounded-xl border border-purple-500/30 bg-slate-900/95 text-white shadow-2xl">
        <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Application error</h3>
          <button
            onClick={() => setVisible(false)}
            className="text-gray-300 hover:text-white px-2 py-1 rounded-md border border-white/10"
          >Close</button>
        </div>
        <div className="p-4 space-y-2">
          <p className="font-medium text-red-300">{error.message}</p>
          {error.stack && (
            <pre className="text-xs whitespace-pre-wrap text-gray-300 bg-black/40 p-3 rounded-lg border border-white/10 max-h-64 overflow-auto">
              {error.stack}
            </pre>
          )}
          <p className="text-xs text-gray-400">Open DevTools → Console for full details.</p>
        </div>
      </div>
    </div>
  )
}


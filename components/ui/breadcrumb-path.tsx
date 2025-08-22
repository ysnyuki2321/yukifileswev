"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  ChevronRight, Home, Folder, FolderOpen, 
  ArrowLeft, ArrowRight, ArrowUp
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbPathProps {
  currentPath: string[]
  onNavigate: (path: string[]) => void
  className?: string
}

export function BreadcrumbPath({ currentPath, onNavigate, className = "" }: BreadcrumbPathProps) {
  const [history, setHistory] = useState<string[][]>([currentPath])
  const [historyIndex, setHistoryIndex] = useState(0)

  const navigateToPath = (newPath: string[]) => {
    // Add to history if it's a new navigation (not back/forward)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newPath)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    onNavigate(newPath)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      onNavigate(history[newIndex])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      onNavigate(history[newIndex])
    }
  }

  const goUp = () => {
    if (currentPath.length > 0) {
      const parentPath = currentPath.slice(0, -1)
      navigateToPath(parentPath)
    }
  }

  const canGoBack = historyIndex > 0
  const canGoForward = historyIndex < history.length - 1
  const canGoUp = currentPath.length > 0

  return (
    <div className={`flex items-center gap-2 p-2 bg-black/20 rounded-lg border border-gray-700/50 ${className}`}>
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={goBack}
          disabled={!canGoBack}
          className="w-8 h-8 p-0 text-gray-400 hover:text-white disabled:opacity-30"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={goForward}
          disabled={!canGoForward}
          className="w-8 h-8 p-0 text-gray-400 hover:text-white disabled:opacity-30"
          title="Forward"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={goUp}
          disabled={!canGoUp}
          className="w-8 h-8 p-0 text-gray-400 hover:text-white disabled:opacity-30"
          title="Up"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-600 mx-1" />
      </div>

      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
        {/* Home/Root */}
        <button
          onClick={() => navigateToPath([])}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors text-gray-300 hover:text-white whitespace-nowrap"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm">Home</span>
        </button>

        {/* Path segments */}
        {currentPath.map((segment, index) => {
          const isLast = index === currentPath.length - 1
          const pathToHere = currentPath.slice(0, index + 1)
          
          return (
            <div key={index} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-gray-500" />
              
              <button
                onClick={() => navigateToPath(pathToHere)}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  isLast 
                    ? 'text-white bg-purple-500/10 border border-purple-500/20' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isLast ? (
                  <FolderOpen className="w-4 h-4 text-purple-400" />
                ) : (
                  <Folder className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{segment}</span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Path Input (Windows-style) */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="w-px h-6 bg-gray-600" />
        <div className="text-xs text-gray-400 font-mono bg-black/30 px-2 py-1 rounded border border-gray-700">
          /{currentPath.join('/')}
        </div>
      </div>
    </div>
  )
}
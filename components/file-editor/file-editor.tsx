"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, FileCode, Save, X, AlertCircle, CheckCircle,
  Type, Code, File, Folder, Maximize2, Minimize2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FileItem {
  id: string
  name: string
  content: string
  type: string
  size: number
  lastModified: Date
}

interface FileEditorProps {
  file: FileItem
  onSave: (file: FileItem, newContent: string, newName?: string, newType?: string) => void
  onClose: () => void
}

export function FileEditor({ file, onSave, onClose }: FileEditorProps) {
  const [fileName, setFileName] = useState(file.name || 'untitled.txt')
  const [content, setContent] = useState(file.content || '')
  const [isModified, setIsModified] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFileName(file.name || 'untitled.txt')
    setContent(file.content || '')
    setIsModified(false)
  }, [file])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setIsModified(true)
  }

  const handleFileNameChange = (newName: string) => {
    setFileName(newName)
    setIsModified(true)
  }

  const handleSave = () => {
    onSave(file, content, fileName)
    setIsModified(false)
  }

  const getFileIcon = () => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    const iconMap: { [key: string]: { icon: any, color: string } } = {
      'js': { icon: FileCode, color: 'text-yellow-400' },
      'ts': { icon: FileCode, color: 'text-blue-400' },
      'jsx': { icon: FileCode, color: 'text-cyan-400' },
      'tsx': { icon: FileCode, color: 'text-cyan-400' },
      'py': { icon: FileCode, color: 'text-green-400' },
      'java': { icon: FileCode, color: 'text-red-400' },
      'cpp': { icon: FileCode, color: 'text-blue-500' },
      'c': { icon: FileCode, color: 'text-blue-600' },
      'cs': { icon: FileCode, color: 'text-purple-400' },
      'php': { icon: FileCode, color: 'text-indigo-400' },
      'html': { icon: FileCode, color: 'text-orange-400' },
      'css': { icon: FileCode, color: 'text-pink-400' },
      'json': { icon: FileCode, color: 'text-yellow-300' },
      'xml': { icon: FileCode, color: 'text-orange-300' },
      'yaml': { icon: FileCode, color: 'text-red-300' },
      'yml': { icon: FileCode, color: 'text-red-300' },
      'sql': { icon: FileCode, color: 'text-blue-300' },
      'md': { icon: FileText, color: 'text-gray-300' },
      'txt': { icon: FileText, color: 'text-gray-400' },
      'go': { icon: FileCode, color: 'text-cyan-300' },
      'rs': { icon: FileCode, color: 'text-orange-500' },
      'swift': { icon: FileCode, color: 'text-orange-400' },
      'kt': { icon: FileCode, color: 'text-purple-300' },
      'rb': { icon: FileCode, color: 'text-red-500' },
      'sh': { icon: FileCode, color: 'text-green-300' },
      'bash': { icon: FileCode, color: 'text-green-300' },
    }
    
    const fileInfo = iconMap[extension || ''] || { icon: FileText, color: 'text-gray-400' }
    const IconComponent = fileInfo.icon
    
    return <IconComponent className={`w-5 h-5 ${fileInfo.color}`} />
  }

  const getLanguage = () => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const langMap: { [key: string]: string } = {
      'js': 'JavaScript',
      'ts': 'TypeScript',
      'jsx': 'React JSX',
      'tsx': 'React TSX',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'cs': 'C#',
      'php': 'PHP',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'sass': 'Sass',
      'json': 'JSON',
      'xml': 'XML',
      'yaml': 'YAML',
      'yml': 'YAML',
      'sql': 'SQL',
      'md': 'Markdown',
      'txt': 'Plain Text',
      'go': 'Go',
      'rs': 'Rust',
      'swift': 'Swift',
      'kt': 'Kotlin',
      'rb': 'Ruby',
      'sh': 'Shell',
      'bash': 'Bash',
      'zsh': 'Zsh',
      'fish': 'Fish',
      'ps1': 'PowerShell',
      'vue': 'Vue.js',
      'svelte': 'Svelte',
      'dart': 'Dart',
      'scala': 'Scala',
      'clj': 'Clojure',
      'elm': 'Elm',
      'haskell': 'Haskell',
      'lua': 'Lua',
      'r': 'R',
      'matlab': 'MATLAB',
      'dockerfile': 'Dockerfile'
    }
    return langMap[extension || ''] || 'Plain Text'
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-2 sm:inset-4 bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-6 border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center ring-2 ring-purple-500/20 flex-shrink-0"
              >
                {getFileIcon()}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="min-w-0 flex-1"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-white truncate">File Editor</h2>
                <p className="text-xs sm:text-sm text-gray-400 truncate">{fileName}</p>
              </motion.div>
              {isModified && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-shrink-0"
                >
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1 animate-pulse"></div>
                    <span className="hidden sm:inline">Modified</span>
                    <span className="sm:hidden">*</span>
                  </Badge>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleSave}
                disabled={!isModified}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-red-500/20 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Content */}
          <motion.div 
            className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-180px)] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {/* File Name Input */}
            <div className="p-3 sm:p-6 border-b border-purple-500/10 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">File Name</label>
                  <Input
                    value={fileName}
                    onChange={(e) => handleFileNameChange(e.target.value)}
                    className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-400 transition-colors duration-200"
                    placeholder="Enter file name..."
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-400">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {getLanguage()}
                  </Badge>
                  <span className="text-xs sm:text-sm">{content.length} chars</span>
                  <span className="text-xs sm:text-sm">{content.split('\n').length} lines</span>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-3 md:p-6">
              <div className="h-full relative overflow-hidden rounded-lg border border-purple-500/20">
                <div className="flex h-full">
                  {/* Line numbers */}
                  <div 
                    ref={lineNumbersRef}
                    className="flex-shrink-0 bg-slate-800/80 border-r border-purple-500/20 px-2 py-3 text-xs text-gray-500 font-mono leading-6 select-none overflow-hidden"
                  >
                    {content.split('\n').map((_, index) => (
                      <div key={index} className="h-6 text-right min-w-[2rem]">
                        {String(index + 1).padStart(3, ' ')}
                      </div>
                    ))}
                  </div>
                  
                  {/* Code area */}
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      onScroll={(e) => {
                        // Sync line numbers scroll with textarea scroll
                        if (lineNumbersRef.current) {
                          lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop
                        }
                      }}
                      className="w-full h-full bg-slate-800/30 border-0 text-white font-mono text-sm resize-none focus:ring-0 focus:outline-none leading-6 p-3 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-700"
                      placeholder="Start typing your code here..."
                      style={{ 
                        minHeight: '100%',
                        tabSize: 2,
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <motion.div 
              className="p-2 sm:p-4 border-t border-purple-500/10 bg-slate-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-400 flex-shrink-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="truncate">Last: {file.lastModified.toLocaleDateString()}</span>
                <span>Size: {(content.length / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Ready</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
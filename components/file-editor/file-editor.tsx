"use client"

import { useState, useEffect } from "react"
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
    const codeExtensions = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'html', 'css', 'json', 'xml', 'yaml', 'sql', 'md']
    
    if (codeExtensions.includes(extension || '')) {
      return <FileCode className="w-5 h-5 text-purple-400" />
    }
    return <FileText className="w-5 h-5 text-blue-400" />
  }

  const getLanguage = () => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'sql': 'sql',
      'md': 'markdown'
    }
    return langMap[extension || ''] || 'text'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-4 bg-gradient-to-br from-slate-900 via-purple-950/50 to-slate-900 border border-purple-500/20 rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center ring-2 ring-purple-500/20"
              >
                {getFileIcon()}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-white">File Editor</h2>
                <p className="text-sm text-gray-400">{fileName}</p>
              </motion.div>
              {isModified && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                    Modified
                  </Badge>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleSave}
                disabled={!isModified}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
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
            className="flex flex-col h-[calc(100vh-180px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {/* File Name Input */}
            <div className="p-6 border-b border-purple-500/10">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">File Name</label>
                  <Input
                    value={fileName}
                    onChange={(e) => handleFileNameChange(e.target.value)}
                    className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-400 transition-colors duration-200"
                    placeholder="Enter file name..."
                  />
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {getLanguage()}
                  </Badge>
                  <span>{content.length} chars</span>
                  <span>{content.split('\n').length} lines</span>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-6">
              <div className="h-full relative">
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full bg-slate-800/30 border-purple-500/20 text-white font-mono text-sm resize-none focus:border-purple-400 leading-6 pl-16"
                  placeholder="Start typing your code here..."
                  style={{ 
                    minHeight: '100%',
                    tabSize: 2,
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
                  }}
                />
                
                {/* Line numbers overlay */}
                <div className="absolute left-4 top-4 text-xs text-gray-500 font-mono leading-6 pointer-events-none select-none bg-slate-800/50 px-2 py-1 rounded-l">
                  {content.split('\n').map((_, index) => (
                    <div key={index} className="h-6 text-right">
                      {String(index + 1).padStart(3, ' ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <motion.div 
              className="p-4 border-t border-purple-500/10 bg-slate-900/30 flex items-center justify-between text-xs text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <span>Last modified: {file.lastModified.toLocaleDateString()} {file.lastModified.toLocaleTimeString()}</span>
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
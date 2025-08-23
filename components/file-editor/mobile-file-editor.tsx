"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, FileCode, Save, X, ArrowLeft, Settings,
  Code, File, Folder, Music, Image, Video, Database,
  Eye, EyeOff, Search, Download, Share2, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileFileEditorProps {
  file: any
  onClose: () => void
  onSave: (fileName: string, content: string, fileType: string) => void
}

const ALLOWED_EXTENSIONS = {
  text: ['.txt', '.md', '.json', '.csv', '.log', '.rtf'],
  code: ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.swift', '.kt'],
  audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'],
  video: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'],
  database: ['.db', '.sqlite', '.sqlite3', '.sql'],
  folder: []
}

const FILE_TYPE_NAMES = {
  text: 'Text File',
  code: 'Code File', 
  audio: 'Audio File',
  image: 'Image File',
  video: 'Video File',
  database: 'Database File',
  folder: 'Folder'
}

const FILE_TYPE_ICONS = {
  text: FileText,
  code: FileCode,
  audio: Music,
  image: Image,
  video: Video,
  database: Database,
  folder: Folder
}

export function MobileFileEditor({ file, onClose, onSave }: MobileFileEditorProps) {
  const [fileName, setFileName] = useState(file?.name || '')
  const [content, setContent] = useState(file?.content || '')
  const [selectedType, setSelectedType] = useState('text')
  const [fontSize, setFontSize] = useState(16)
  const [showPreview, setShowPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [wordWrap, setWordWrap] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(false) // Disabled on mobile for space
  const [autoSave, setAutoSave] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (file) {
      setFileName(file.name || '')
      setContent(file.content || '')
      const detectedType = detectFileType(file.name)
      setSelectedType(detectedType)
    }
  }, [file])

  useEffect(() => {
    if (autoSave && content) {
      const timeout = setTimeout(() => {
        handleSave()
      }, 3000) // Longer delay on mobile
      return () => clearTimeout(timeout)
    }
  }, [content, autoSave])

  const detectFileType = (filename: string): string => {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
    
    for (const [type, extensions] of Object.entries(ALLOWED_EXTENSIONS)) {
      if (extensions.includes(ext)) {
        return type
      }
    }
    return 'text'
  }

  const handleSave = () => {
    if (onSave) {
      onSave(fileName, content, selectedType)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault()
          handleSave()
          break
      }
    }
  }

  const getFileIcon = () => {
    const IconComponent = FILE_TYPE_ICONS[selectedType as keyof typeof FILE_TYPE_ICONS]
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <FileText className="w-5 h-5" />
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex flex-col">
      {/* Mobile Header - Enhanced */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-xl backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                {getFileIcon()}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{fileName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-white/20 text-white/90 border-white/30 text-xs px-2 py-1 rounded-full">
                    {FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}
                  </Badge>
                  <span className="text-white/70 text-xs">
                    {content.split('\n').length} lines
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSearch(true)}
              className="text-white hover:bg-white/20 p-2 rounded-xl backdrop-blur-sm"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20 p-2 rounded-xl backdrop-blur-sm"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg font-medium"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* File Type Selector - Enhanced Mobile */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/90 font-medium text-sm">File Type</h4>
            <span className="text-white/60 text-xs">Auto-detected</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(FILE_TYPE_NAMES).map(([key, name]) => {
              const IconComponent = FILE_TYPE_ICONS[key as keyof typeof FILE_TYPE_ICONS]
              const isSelected = selectedType === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border transition-all duration-200",
                    isSelected
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/40 text-white shadow-lg"
                      : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30"
                  )}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  <span className="text-sm font-medium">{name}</span>
                  {isSelected && (
                    <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Editor Area - Enhanced */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 overflow-hidden">
          {/* Editor Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          {/* Line Numbers - Mobile Optimized */}
          {lineNumbers && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-white/5 backdrop-blur-sm border-r border-white/10 text-right text-white/30 text-xs font-mono py-4">
              {content.split('\n').map((_, index) => (
                <div key={index} className="px-2 py-0.5">
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          
          {/* Editor */}
          <Textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full h-full bg-transparent border-0 resize-none outline-none text-white font-mono text-base p-4 transition-all duration-200",
              lineNumbers && "pl-16"
            )}
            style={{
              fontFamily: 'Inter',
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              letterSpacing: '0.3px'
            }}
            placeholder="✨ Start typing your content here..."
            wrap="soft"
          />
          
          {/* Floating Save Indicator */}
          {autoSave && (
            <div className="absolute top-4 right-4">
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-3 py-1">
                <span className="text-green-400 text-xs font-medium">Auto-save</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Bar - Enhanced */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 border-t border-white/10 px-4 py-4">
          <div className="flex items-center justify-between">
            {/* File Statistics */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white/80 text-sm font-medium">
                  {content.split('\n').length} lines
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/80 text-sm font-medium">
                  {content.length} chars
                </span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLineNumbers(!lineNumbers)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  lineNumbers 
                    ? "bg-purple-500/20 text-purple-300 border border-purple-400/30" 
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                )}
              >
                <span className="text-xs font-medium">Lines</span>
              </button>
              <button
                onClick={() => setWordWrap(!wordWrap)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  wordWrap 
                    ? "bg-purple-500/20 text-purple-300 border border-purple-400/30" 
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                )}
              >
                <span className="text-xs font-medium">Wrap</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel - Enhanced Mobile */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border-t border-white/20 rounded-t-3xl z-[10001]"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-white/30 rounded-full"></div>
            </div>
            
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-xl">Editor Settings</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSettings(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Font Size Control */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white font-medium text-sm">Font Size</label>
                    <span className="text-purple-300 font-bold text-lg">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(fontSize - 12) / 8 * 100}%, rgba(255,255,255,0.2) ${(fontSize - 12) / 8 * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-2">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Toggle Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-purple-300 text-sm">Aa</span>
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">Word Wrap</span>
                        <p className="text-white/60 text-xs">Wrap long lines</p>
                      </div>
                    </div>
                    <Switch
                      checked={wordWrap}
                      onCheckedChange={setWordWrap}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-white/20"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-green-300 text-sm">💾</span>
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">Auto Save</span>
                        <p className="text-white/60 text-xs">Save automatically</p>
                      </div>
                    </div>
                    <Switch
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-white/20"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-300 text-sm">123</span>
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">Line Numbers</span>
                        <p className="text-white/60 text-xs">Show line numbers</p>
                      </div>
                    </div>
                    <Switch
                      checked={lineNumbers}
                      onCheckedChange={setLineNumbers}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-white/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal - Enhanced Mobile */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[10001] flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Find Text</h3>
                  <p className="text-white/60 text-sm">Search in your file</p>
                </div>
              </div>
              
              {/* Search Input */}
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm font-medium block mb-3">Search for</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 pl-10 py-3 rounded-xl"
                      placeholder="Enter search text..."
                      autoFocus
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowSearch(false)}
                  className="border-white/20 text-white hover:bg-white/10 flex-1 py-3 rounded-xl font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Search logic here
                    setShowSearch(false)
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1 py-3 rounded-xl font-medium shadow-lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
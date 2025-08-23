"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                {getFileIcon()}
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">{fileName}</h3>
                <p className="text-white/80 text-xs">{FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSearch(true)}
              className="text-white hover:bg-white/20 p-2"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20 p-2"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* File Type Selector - Mobile */}
        <div className="bg-white/5 border-b border-white/10 px-4 py-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
          >
            {Object.entries(FILE_TYPE_NAMES).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
          <Textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent border-0 resize-none outline-none text-white font-mono text-base p-4"
            style={{
              fontFamily: 'Inter',
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              letterSpacing: '0.3px'
            }}
            placeholder="Start typing your content..."
            wrap="soft"
          />
        </div>

        {/* Mobile Bottom Bar */}
        <div className="bg-white/5 border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-white/70">
            <div className="flex items-center gap-4">
              <span>Ln {content.split('\n').length}</span>
              <span>Chr {content.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Auto: {autoSave ? 'ON' : 'OFF'}</span>
              <span>Wrap: {wordWrap ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel - Mobile */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 rounded-t-3xl p-6 z-[10001]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Editor Settings</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSettings(false)}
                className="text-white hover:bg-white/20 p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm block mb-2">Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Word Wrap</span>
                <Switch
                  checked={wordWrap}
                  onCheckedChange={setWordWrap}
                  className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-white/20"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Auto Save</span>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                  className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-white/20"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal - Mobile */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001] flex items-center justify-center p-4"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-white font-semibold text-lg mb-4">Find Text</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm block mb-2">Search for</label>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    placeholder="Enter search text..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowSearch(false)}
                  className="border-white/20 text-white hover:bg-white/10 flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Search logic here
                    setShowSearch(false)
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
                >
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
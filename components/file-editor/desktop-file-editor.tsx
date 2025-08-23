"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  FileText, FileCode, Save, X, AlertCircle, CheckCircle,
  Code, File, Folder, Music, Image, Video, Database, Info,
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Indent, Outdent, Link, Table, Code2, Palette, Eye, EyeOff,
  Settings, Download, Share2, Star, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut,
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Fullscreen, FullscreenExit,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, Filter, SortAsc, SortDesc,
  RefreshCw, GitBranch, GitCommit, GitMerge, GitPullRequest, Terminal, Zap,
  Lightbulb, Shield, Globe, Lock, Unlock, Trash2, Copy,
  Scissors, FlipHorizontal, FlipVertical, Crop, Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DesktopFileEditorProps {
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

const THEMES = {
  'yuki-dark': 'Yuki Dark',
  'yuki-light': 'Yuki Light',
  'ocean-dark': 'Ocean Dark',
  'ocean-light': 'Ocean Light',
  'sunset': 'Sunset',
  'midnight': 'Midnight'
}

const FONT_FAMILIES = {
  'Inter': 'Inter',
  'Roboto Mono': 'Roboto Mono',
  'Fira Code': 'Fira Code',
  'Source Code Pro': 'Source Code Pro',
  'JetBrains Mono': 'JetBrains Mono'
}

export function DesktopFileEditor({ file, onClose, onSave }: DesktopFileEditorProps) {
  const [fileName, setFileName] = useState(file?.name || '')
  const [content, setContent] = useState(file?.content || '')
  const [selectedType, setSelectedType] = useState('text')
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState<'yuki-dark' | 'yuki-light' | 'ocean-dark' | 'ocean-light' | 'sunset' | 'midnight'>('yuki-dark')
  const [fontFamily, setFontFamily] = useState('Inter')
  const [showPreview, setShowPreview] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [wordWrap, setWordWrap] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

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
      }, 2000)
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
        case 'f':
          e.preventDefault()
          setShowSearch(true)
          break
        case 'h':
          e.preventDefault()
          setShowSearch(true)
          break
      }
    }
  }

  const getFileIcon = () => {
    const IconComponent = FILE_TYPE_ICONS[selectedType as keyof typeof FILE_TYPE_ICONS]
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <FileText className="w-5 h-5" />
  }

  const getThemeClasses = () => {
    switch (theme) {
      case 'yuki-dark':
        return 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white'
      case 'yuki-light':
        return 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'
      case 'ocean-dark':
        return 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white'
      case 'ocean-light':
        return 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 text-gray-900'
      case 'sunset':
        return 'bg-gradient-to-br from-orange-900 via-red-900 to-purple-900 text-white'
      case 'midnight':
        return 'bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white'
      default:
        return 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white'
    }
  }

  const getEditorStyles = () => {
    return {
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: '1.6',
      letterSpacing: '0.3px'
    }
  }

  return (
    <div className={cn(
      "fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex flex-col",
      isFullscreen ? "z-[10000]" : ""
    )}>
      {/* Header - Web Style */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 border-b border-purple-500/30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* File Icon & Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                {getFileIcon()}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{fileName}</h3>
                <p className="text-white/80 text-sm">{FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}</p>
              </div>
            </div>

            {/* File Type Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-white text-sm font-medium"
              >
                {Object.entries(FILE_TYPE_NAMES).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSearch(true)}
              className="text-white hover:bg-white/20"
            >
              <Search className="w-4 h-4 mr-2" />
              Find
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Web Style */}
        <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col">
          {/* File Info */}
          <div className="p-6 border-b border-white/10">
            <h4 className="text-white font-semibold text-lg mb-4">File Information</h4>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="text-white">{FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}</span>
              </div>
              <div className="flex justify-between">
                <span>Lines:</span>
                <span className="text-white">{content.split('\n').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Characters:</span>
                <span className="text-white">{content.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Words:</span>
                <span className="text-white">{content.split(/\s+/).filter(word => word.length > 0).length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b border-white/10">
            <h4 className="text-white font-semibold text-lg mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <Button
                size="sm"
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save File
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          </div>

          {/* Editor Settings */}
          <div className="p-6 flex-1">
            <h4 className="text-white font-semibold text-lg mb-4">Editor Settings</h4>
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm block mb-2">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                >
                  {Object.entries(THEMES).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/80 text-sm block mb-2">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                >
                  {Object.entries(FONT_FAMILIES).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/80 text-sm block mb-2">Font Size: {fontSize}px</label>
                <Slider
                  value={[fontSize]}
                  min={12}
                  max={24}
                  step={1}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="w-full"
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
                <span className="text-white/80 text-sm">Line Numbers</span>
                <Switch
                  checked={lineNumbers}
                  onCheckedChange={setLineNumbers}
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
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Content */}
          <div className="flex-1 relative">
            <div className={cn("absolute inset-0", getThemeClasses())}>
              {/* Line Numbers */}
              {lineNumbers && (
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-white/5 backdrop-blur-sm border-r border-white/10 text-right text-white/50 text-sm font-mono py-4">
                  {content.split('\n').map((_, index) => (
                    <div key={index} className="px-3 py-0.5">
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
                  "w-full h-full bg-transparent border-0 resize-none outline-none text-white font-mono",
                  lineNumbers && "pl-20"
                )}
                style={getEditorStyles()}
                placeholder="Start typing your content..."
                wrap={wordWrap ? "soft" : "off"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar - Web Style */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 px-6 py-2 flex items-center justify-between text-sm text-white/70">
        <div className="flex items-center gap-6">
          <span>Ln {content.split('\n').length}, Col {content.length}</span>
          <span>{selectedType.toUpperCase()}</span>
          <span>{theme}</span>
          <span>{fontFamily}</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span>Auto Save: {autoSave ? 'ON' : 'OFF'}</span>
          <span>Word Wrap: {wordWrap ? 'ON' : 'OFF'}</span>
          <span>Encoding: UTF-8</span>
        </div>
      </div>

      {/* Search & Replace Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10001] flex items-center justify-center p-4"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-white font-semibold text-xl mb-4">Find & Replace</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm block mb-2">Find</label>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    placeholder="Search query..."
                  />
                </div>
                
                <div>
                  <label className="text-white/80 text-sm block mb-2">Replace</label>
                  <Input
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    placeholder="Replace with..."
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
                    // Replace logic here
                    setShowSearch(false)
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
                >
                  Replace All
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
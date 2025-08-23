"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, FileCode, Save, Search, Settings, Download, Share2, Star,
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Indent, Outdent, Link, Table, Code2, Palette, ChevronDown, ChevronUp,
  Undo2, Redo2, History, Clock, Calendar, Tag, Bookmark, Pin,
  MessageSquare, Phone, Mail, MapPin, Navigation, Compass, Globe2,
  Menu, MoreVertical, ZoomIn, ZoomOut, RotateCcw, FlipHorizontal, FlipVertical,
  Eye, EyeOff, Copy, Scissors, Paste, Type, Hash, HashIcon, Database,
  Music, Image, Video, Folder, Archive, File, FileX, FileCheck,
  Sparkles, Zap, Target, Shield, Lock, Unlock, Key, Wifi, WifiOff,
  Smartphone, Monitor, Tablet, Laptop, Desktop, Watch, Headphones,
  Camera, Mic, Speaker, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward,
  Replace
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UltimateWebEditorProps {
  file: {
    id: string
    name: string
    content: string
    type: string
    size: number
    lastModified: Date
  }
  onSave: (fileName: string, content: string, fileType: string) => void
  onClose: () => void
  readOnly?: boolean
}

const FILE_TYPES = {
  text: { name: 'Text Document', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  code: { name: 'Code File', icon: FileCode, color: 'from-purple-500 to-pink-500' },
  audio: { name: 'Audio File', icon: Music, color: 'from-green-500 to-emerald-500' },
  image: { name: 'Image File', icon: Image, color: 'from-orange-500 to-red-500' },
  video: { name: 'Video File', icon: Video, color: 'from-red-500 to-pink-500' },
  database: { name: 'Database File', icon: Database, color: 'from-indigo-500 to-purple-500' },
  folder: { name: 'Folder', icon: Folder, color: 'from-yellow-500 to-orange-500' },
  archive: { name: 'Archive File', icon: Archive, color: 'from-gray-500 to-slate-500' }
}

const THEMES = [
  { id: 'cosmic', name: 'Cosmic', bg: 'bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900', accent: 'from-purple-500 to-pink-500' },
  { id: 'ocean', name: 'Ocean', bg: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900', accent: 'from-blue-500 to-cyan-500' },
  { id: 'forest', name: 'Forest', bg: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900', accent: 'from-green-500 to-emerald-500' },
  { id: 'sunset', name: 'Sunset', bg: 'bg-gradient-to-br from-orange-900 via-red-900 to-pink-900', accent: 'from-orange-500 to-red-500' },
  { id: 'midnight', name: 'Midnight', bg: 'bg-gradient-to-br from-slate-900 via-gray-900 to-black', accent: 'from-slate-500 to-gray-500' }
]

const FONT_FAMILIES = [
  { id: 'inter', name: 'Inter', class: 'font-inter' },
  { id: 'poppins', name: 'Poppins', class: 'font-poppins' },
  { id: 'roboto', name: 'Roboto', class: 'font-roboto' },
  { id: 'mono', name: 'Monospace', class: 'font-mono' },
  { id: 'serif', name: 'Serif', class: 'font-serif' }
]

export function UltimateWebEditor({ file, onSave, onClose, readOnly = false }: UltimateWebEditorProps) {
  const [fileName, setFileName] = useState(file.name)
  const [content, setContent] = useState(file.content)
  const [fileType, setFileType] = useState(file.type || 'text')
  const [errors, setErrors] = useState<string[]>([])
  const [isValid, setIsValid] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState('cosmic')
  const [fontFamily, setFontFamily] = useState('inter')
  const [wordWrap, setWordWrap] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [searchOptions, setSearchOptions] = useState({
    caseSensitive: false,
    wholeWord: false,
    regex: false
  })
  const [activePanel, setActivePanel] = useState<'editor' | 'preview' | 'settings' | 'search'>('editor')
  const [isMobile, setIsMobile] = useState(false)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setShowSidebar(!mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setFileName(file.name)
    setContent(file.content)
    setFileType(file.type || 'text')
    validateFileName()
  }, [file])

  useEffect(() => {
    if (autoSave && content !== file.content) {
      const timer = setTimeout(() => {
        handleSave()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [content, autoSave])

  const detectFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) return 'audio'
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext)) return 'image'
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) return 'video'
    if (['db', 'sqlite', 'sqlite3', 'sql'].includes(ext)) return 'database'
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive'
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift', 'kt'].includes(ext)) return 'code'
    if (['txt', 'md', 'json', 'csv', 'log', 'rtf'].includes(ext)) return 'text'
    
    return 'text'
  }

  const handleFileNameChange = (newName: string) => {
    setFileName(newName)
    const detectedType = detectFileType(newName)
    if (detectedType !== fileType) {
      setFileType(detectedType)
    }
    validateFileName()
  }

  const validateFileName = () => {
    const newErrors: string[] = []
    
    if (!fileName.trim()) {
      newErrors.push('File name is required')
    }
    
    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(fileName)) {
      newErrors.push('File name contains invalid characters')
    }
    
    setErrors(newErrors)
    setIsValid(newErrors.length === 0 && fileName.trim().length > 0)
  }

  const handleSave = () => {
    if (!isValid) return
    onSave(fileName, content, fileType)
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
          setActivePanel('search')
          setTimeout(() => searchRef.current?.focus(), 100)
          break
        case 'b':
          e.preventDefault()
          setShowToolbar(!showToolbar)
          break
      }
    }
  }

  const handleSearch = () => {
    if (!searchQuery) return
    
    const text = content
    let matches: number[] = []
    
    if (searchOptions.regex) {
      try {
        const regex = new RegExp(searchQuery, searchOptions.caseSensitive ? 'g' : 'gi')
        let match
        while ((match = regex.exec(text)) !== null) {
          matches.push(match.index)
        }
      } catch (e) {
        return
      }
    } else {
      if (searchOptions.caseSensitive) {
        let index = text.indexOf(searchQuery)
        while (index !== -1) {
          matches.push(index)
          index = text.indexOf(searchQuery, index + 1)
        }
      } else {
        const lowerText = text.toLowerCase()
        const lowerQuery = searchQuery.toLowerCase()
        let index = lowerText.indexOf(lowerQuery)
        while (index !== -1) {
          matches.push(index)
          index = lowerText.indexOf(lowerQuery, index + 1)
        }
      }
    }
    
    if (matches.length > 0) {
      const firstMatch = matches[0]
      editorRef.current?.setSelectionRange(firstMatch, firstMatch + searchQuery.length)
    }
  }

  const handleReplace = () => {
    if (!searchQuery || !replaceQuery) return
    
    const newContent = content.replace(new RegExp(searchQuery, 'g'), replaceQuery)
    setContent(newContent)
    setSearchQuery('')
    setReplaceQuery('')
    setActivePanel('editor')
  }

  const getFileIcon = () => {
    const fileTypeInfo = FILE_TYPES[fileType as keyof typeof FILE_TYPES] || FILE_TYPES.text
    const IconComponent = fileTypeInfo.icon
    return (
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-lg",
        `bg-gradient-to-br ${fileTypeInfo.color} border-white/20`
      )}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
    )
  }

  const getCurrentTheme = () => {
    return THEMES.find(t => t.id === theme) || THEMES[0]
  }

  const getEditorStyles = () => {
    const currentFont = FONT_FAMILIES.find(f => f.id === fontFamily) || FONT_FAMILIES[0]
    return {
      fontSize: `${fontSize}px`,
      fontFamily: currentFont.class,
      lineHeight: '1.6',
      whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const currentTheme = getCurrentTheme()

  return (
    <div className={cn("w-full h-full flex flex-col", currentTheme.bg)}>
      {/* Ultimate Header */}
      <div className="relative bg-gradient-to-r from-black/40 via-purple-900/40 to-black/40 border-b border-white/20 backdrop-blur-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="relative p-4">
          {/* Main Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {getFileIcon()}
              <div>
                <h2 className="text-white font-bold text-xl mb-1">{fileName}</h2>
                <div className="flex items-center gap-3">
                  <Badge className={cn(
                    "bg-gradient-to-r border-0 text-white text-xs px-3 py-1",
                    `from-${FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.color.split('-')[1]}-500 to-${FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.color.split('-')[3]}-500`
                  )}>
                    {FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.name}
                  </Badge>
                  <span className="text-white/60 text-sm">
                    {formatBytes(file.size)}
                  </span>
                  <span className="text-white/60 text-sm">
                    {file.lastModified.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {!isMobile && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSearch(true)}
                    className="text-white hover:bg-white/20"
                    title="Search (Ctrl+F)"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSettings(true)}
                    className="text-white hover:bg-white/20"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                onClick={handleSave}
                disabled={!isValid || readOnly}
                className={cn(
                  "bg-gradient-to-r text-white px-6 py-2 shadow-lg",
                  `from-${currentTheme.accent.split('-')[1]}-500 to-${currentTheme.accent.split('-')[3]}-500`
                )}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <span className="text-white/60 block text-xs">Lines</span>
              <span className="text-white font-bold text-lg">{content.split('\n').length}</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <span className="text-white/60 block text-xs">Characters</span>
              <span className="text-white font-bold text-lg">{content.length}</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <span className="text-white/60 block text-xs">Words</span>
              <span className="text-white font-bold text-lg">{content.split(/\s+/).filter(word => word.length > 0).length}</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <span className="text-white/60 block text-xs">Type</span>
              <span className="text-white font-bold text-lg">{fileType.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar - Desktop Only */}
        {!isMobile && showSidebar && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-80 bg-black/20 border-r border-white/10 p-4 space-y-6"
          >
            {/* File Info */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-semibold text-lg mb-3">File Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Created:</span>
                  <span className="text-white">{file.lastModified.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Modified:</span>
                  <span className="text-white">{file.lastModified.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Size:</span>
                  <span className="text-white">{formatBytes(file.size)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-semibold text-lg mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full text-white hover:bg-white/10 justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowToolbar(!showToolbar)}
                  className="w-full text-white hover:bg-white/10 justify-start"
                >
                  <Menu className="w-4 h-4 mr-2" />
                  {showToolbar ? 'Hide Toolbar' : 'Show Toolbar'}
                </Button>
              </div>
            </div>

            {/* Editor Settings */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-semibold text-lg mb-3">Editor Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-white/60 text-sm block mb-1">Font Size</label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                      className="text-white hover:bg-white/10"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-white font-medium">{fontSize}px</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                      className="text-white hover:bg-white/10"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Line Numbers</span>
                  <Switch
                    checked={lineNumbers}
                    onCheckedChange={setLineNumbers}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Word Wrap</span>
                  <Switch
                    checked={wordWrap}
                    onCheckedChange={setWordWrap}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          {showToolbar && (
            <div className="bg-black/30 border-b border-white/10 p-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-white hover:bg-white/20"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
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
                  onClick={() => setShowSettings(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                
                <div className="w-px h-6 bg-white/20 mx-2"></div>
                
                <span className="text-white/60 text-sm">Theme:</span>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {THEMES.map((themeOption) => (
                      <SelectItem key={themeOption.id} value={themeOption.id} className="text-white hover:bg-white/20">
                        {themeOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {activePanel === 'editor' && (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col"
                >
                  {/* File Name Input */}
                  <div className="p-4 border-b border-white/10 bg-black/20">
                    <label className="block text-white/80 text-sm font-medium mb-2">File Name</label>
                    <Input
                      value={fileName}
                      onChange={(e) => handleFileNameChange(e.target.value)}
                      disabled={readOnly}
                      className="bg-white/10 border-white/20 text-white text-base"
                    />
                  </div>

                  {/* Editor Area */}
                  <div className="flex-1 p-4 relative">
                    {showPreview ? (
                      <div className="h-full">
                        <div className="bg-white/10 rounded-xl p-4 border border-white/20 h-full overflow-auto">
                          <h3 className="text-white font-semibold mb-2">Preview</h3>
                          <pre className="text-white text-sm whitespace-pre-wrap">{content}</pre>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full relative">
                        {/* Line Numbers */}
                        {lineNumbers && (
                          <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/20 border-r border-white/10 text-right text-xs text-white/40 p-3 select-none">
                            {content.split('\n').map((_, index) => (
                              <div key={index} className="leading-6">
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
                          disabled={readOnly}
                          className={cn(
                            "w-full h-full resize-none border-0 bg-transparent text-white font-mono p-4 text-base",
                            lineNumbers && "pl-16"
                          )}
                          style={getEditorStyles()}
                          placeholder={`✨ Start writing your ${FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.name.toLowerCase()}...`}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activePanel === 'search' && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full p-6"
                >
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-2xl mb-2">Search & Replace</h3>
                      <p className="text-white/60">Find and replace text in your file</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-white text-sm font-medium block mb-2">Find</label>
                        <Input
                          ref={searchRef}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-white/10 border-white/20 text-white text-lg h-12"
                          placeholder="Search text..."
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm font-medium block mb-2">Replace</label>
                        <Input
                          value={replaceQuery}
                          onChange={(e) => setReplaceQuery(e.target.value)}
                          className="bg-white/10 border-white/20 text-white text-lg h-12"
                          placeholder="Replace with..."
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                          <Switch
                            checked={searchOptions.caseSensitive}
                            onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, caseSensitive: checked }))}
                          />
                          <label className="text-white text-sm">Case sensitive</label>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                          <Switch
                            checked={searchOptions.wholeWord}
                            onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, wholeWord: checked }))}
                          />
                          <label className="text-white text-sm">Whole word</label>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                          <Switch
                            checked={searchOptions.regex}
                            onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, regex: checked }))}
                          />
                          <label className="text-white text-sm">Regex</label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-6">
                        <Button onClick={handleSearch} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 text-lg">
                          <Search className="w-5 h-5 mr-2" />
                          Find
                        </Button>
                        <Button onClick={handleReplace} variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 text-lg">
                          <Replace className="w-5 h-5 mr-2" />
                          Replace
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePanel === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full p-6 overflow-y-auto"
                >
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-2xl mb-2">Editor Settings</h3>
                      <p className="text-white/60">Customize your editing experience</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Theme Selection */}
                      <div>
                        <label className="text-white text-lg font-medium block mb-4">Theme</label>
                        <div className="grid grid-cols-2 gap-3">
                          {THEMES.map((themeOption) => (
                            <div
                              key={themeOption.id}
                              onClick={() => setTheme(themeOption.id)}
                              className={cn(
                                "p-4 rounded-xl border-2 cursor-pointer transition-all",
                                theme === themeOption.id
                                  ? "border-purple-500 bg-purple-500/20"
                                  : "border-white/20 hover:border-purple-500/50"
                              )}
                            >
                              <div className={cn("w-full h-16 rounded-lg mb-3", themeOption.bg)}></div>
                              <span className="text-white text-sm font-medium">{themeOption.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Font Settings */}
                      <div>
                        <label className="text-white text-lg font-medium block mb-4">Font Family</label>
                        <Select value={fontFamily} onValueChange={setFontFamily}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20">
                            {FONT_FAMILIES.map((font) => (
                              <SelectItem key={font.id} value={font.id} className="text-white hover:bg-white/20">
                                <span className={font.class}>{font.name}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="mt-6">
                          <label className="text-white text-lg font-medium block mb-4">Font Size: {fontSize}px</label>
                          <div className="flex items-center gap-4">
                            <Button
                              size="lg"
                              variant="outline"
                              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <ZoomOut className="w-5 h-5" />
                            </Button>
                            <div className="flex-1">
                              <div className="w-full bg-white/20 rounded-full h-3">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                                  style={{ width: `${((fontSize - 12) / (24 - 12)) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <Button
                              size="lg"
                              variant="outline"
                              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <ZoomIn className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Editor Options */}
                    <div className="mt-8">
                      <h4 className="text-white text-lg font-medium mb-4">Editor Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                          <div>
                            <label className="text-white text-sm font-medium">Word Wrap</label>
                            <p className="text-white/60 text-xs">Wrap long lines</p>
                          </div>
                          <Switch
                            checked={wordWrap}
                            onCheckedChange={setWordWrap}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                          <div>
                            <label className="text-white text-sm font-medium">Line Numbers</label>
                            <p className="text-white/60 text-xs">Show line numbers</p>
                          </div>
                          <Switch
                            checked={lineNumbers}
                            onCheckedChange={setLineNumbers}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                          <div>
                            <label className="text-white text-sm font-medium">Auto Save</label>
                            <p className="text-white/60 text-xs">Save automatically</p>
                          </div>
                          <Switch
                            checked={autoSave}
                            onCheckedChange={setAutoSave}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Errors Display */}
      {errors.length > 0 && (
        <div className="p-4 bg-red-500/20 border-t border-red-500/30">
          <div className="text-red-400 text-sm font-medium mb-2">Validation Errors:</div>
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div key={index} className="text-red-300 text-xs flex items-center gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            onClick={() => setShowSettings(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  )
}
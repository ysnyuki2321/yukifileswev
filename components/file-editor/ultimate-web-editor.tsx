"use client"

import React, { useState, useEffect, useRef } from 'react'

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

  // Mobile detection và responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setShowSidebar(!mobile)
      // Giảm font size trên mobile
      if (mobile) {
        setFontSize(14)
      } else {
        setFontSize(16)
      }
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

        <div className={cn("relative", isMobile ? "p-3" : "p-4")}>
          {/* Main Header */}
          <div className={cn("flex items-center justify-between", isMobile ? "mb-3" : "mb-4")}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center justify-center border-2 shadow-lg",
                isMobile ? "w-10 h-10 rounded-xl" : "w-12 h-12 rounded-2xl"
              )}>
                {getFileIcon()}
              </div>
              <div>
                <h2 className={cn(
                  "text-white font-bold mb-1",
                  isMobile ? "text-lg" : "text-xl"
                )}>{fileName}</h2>
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    "bg-gradient-to-r border-0 text-white px-2 py-0.5",
                    isMobile ? "text-xs" : "text-xs px-3 py-1",
                    `from-${FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.color.split('-')[1]}-500 to-${FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.color.split('-')[3]}-500`
                  )}>
                    {FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.name}
                  </Badge>
                  <span className={cn(
                    "text-white/60",
                    isMobile ? "text-xs" : "text-sm"
                  )}>
                    {formatBytes(file.size)}
                  </span>
                  {!isMobile && (
                    <span className="text-white/60 text-sm">
                      {file.lastModified.toLocaleDateString()}
                    </span>
                  )}
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
                size={isMobile ? "sm" : "default"}
                className={cn(
                  "bg-gradient-to-r text-white shadow-lg",
                  isMobile ? "px-3 py-1.5 text-sm" : "px-6 py-2",
                  `from-${currentTheme.accent.split('-')[1]}-500 to-${currentTheme.accent.split('-')[3]}-500`
                )}
              >
                <Save className={cn("mr-2", isMobile ? "w-3 h-3" : "w-4 h-4")} />
                {!isMobile && "Save"}
              </Button>
            </div>
          </div>

          {/* Quick Stats - Mobile: 2x2 grid, Desktop: 4x1 grid */}
          <div className={cn(
            "text-center",
            isMobile 
              ? "grid grid-cols-2 gap-2" 
              : "grid grid-cols-4 gap-4"
          )}>
            <div className={cn(
              "bg-white/5 rounded-lg border border-white/10",
              isMobile ? "p-2" : "p-3"
            )}>
              <span className={cn(
                "text-white/60 block",
                isMobile ? "text-xs" : "text-xs"
              )}>Lines</span>
              <span className={cn(
                "text-white font-bold",
                isMobile ? "text-base" : "text-lg"
              )}>{content.split('\n').length}</span>
            </div>
            <div className={cn(
              "bg-white/5 rounded-lg border border-white/10",
              isMobile ? "p-2" : "p-3"
            )}>
              <span className={cn(
                "text-white/60 block",
                isMobile ? "text-xs" : "text-xs"
              )}>Chars</span>
              <span className={cn(
                "text-white font-bold",
                isMobile ? "text-base" : "text-lg"
              )}>{content.length}</span>
            </div>
            {!isMobile && (
              <>
                <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                  <span className="text-white/60 block text-xs">Words</span>
                  <span className="text-white font-bold text-lg">{content.split(/\s+/).filter(word => word.length > 0).length}</span>
                </div>
                <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                  <span className="text-white/60 block text-xs">Type</span>
                  <span className="text-white font-bold text-lg">{fileType.toUpperCase()}</span>
                </div>
              </>
            )}
            {isMobile && (
              <>
                <div className="bg-white/5 rounded-lg border border-white/10 p-2">
                  <span className="text-white/60 block text-xs">Words</span>
                  <span className="text-white font-bold text-base">{content.split(/\s+/).filter(word => word.length > 0).length}</span>
                </div>
                <div className="bg-white/5 rounded-lg border border-white/10 p-2">
                  <span className="text-white/60 block text-xs">Type</span>
                  <span className="text-white font-bold text-base">{fileType.toUpperCase()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar - Desktop Only */}
        {!isMobile && showSidebar && (
          <div className="w-80 bg-black/20 border-r border-white/10 p-4 space-y-6">
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
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          {showToolbar && (
            <div className={cn(
              "bg-black/30 border-b border-white/10",
              isMobile ? "p-2" : "p-3"
            )}>
              <div className={cn(
                "flex items-center gap-2 flex-wrap",
                isMobile ? "gap-1" : "gap-2"
              )}>
                <Button
                  size={isMobile ? "sm" : "sm"}
                  variant="ghost"
                  onClick={() => setShowPreview(!showPreview)}
                  className={cn(
                    "text-white hover:bg-white/20",
                    isMobile ? "px-2 py-1 text-xs" : ""
                  )}
                >
                  <Eye className={cn("mr-2", isMobile ? "w-3 h-3" : "w-4 h-4")} />
                  {!isMobile && "Preview"}
                </Button>
                <Button
                  size={isMobile ? "sm" : "sm"}
                  variant="ghost"
                  onClick={() => setShowSearch(true)}
                  className={cn(
                    "text-white hover:bg-white/20",
                    isMobile ? "px-2 py-1 text-xs" : ""
                  )}
                >
                  <Search className={cn("mr-2", isMobile ? "w-3 h-3" : "w-4 h-4")} />
                  {!isMobile && "Find"}
                </Button>
                <Button
                  size={isMobile ? "sm" : "sm"}
                  variant="ghost"
                  onClick={() => setShowSettings(true)}
                  className={cn(
                    "text-white hover:bg-white/20",
                    isMobile ? "px-2 py-1 text-xs" : ""
                  )}
                >
                  <Settings className={cn("mr-2", isMobile ? "w-3 h-3" : "w-4 h-4")} />
                  {!isMobile && "Settings"}
                </Button>
                
                {!isMobile && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 relative">
            {activePanel === 'editor' && (
              <div className="h-full flex flex-col">
                  {/* File Name Input */}
                  <div className={cn(
                    "border-b border-white/10 bg-black/20",
                    isMobile ? "p-3" : "p-4"
                  )}>
                    <label className={cn(
                      "block text-white/80 font-medium mb-2",
                      isMobile ? "text-xs" : "text-sm"
                    )}>File Name</label>
                    <Input
                      value={fileName}
                      onChange={(e) => handleFileNameChange(e.target.value)}
                      disabled={readOnly}
                      className={cn(
                        "bg-white/10 border-white/20 text-white",
                        isMobile ? "text-sm h-8" : "text-base"
                      )}
                    />
                  </div>

                  {/* Editor Area */}
                  <div className={cn(
                    "flex-1 relative",
                    isMobile ? "p-3" : "p-4"
                  )}>
                    {showPreview ? (
                      <div className="h-full">
                        <div className={cn(
                          "bg-white/10 rounded-xl border border-white/20 h-full overflow-auto",
                          isMobile ? "p-3" : "p-4"
                        )}>
                          <h3 className={cn(
                            "text-white font-semibold mb-2",
                            isMobile ? "text-sm" : "text-base"
                          )}>Preview</h3>
                          <pre className={cn(
                            "text-white whitespace-pre-wrap",
                            isMobile ? "text-xs" : "text-sm"
                          )}>{content}</pre>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full relative">
                        {/* Line Numbers */}
                        {lineNumbers && (
                          <div className={cn(
                            "absolute left-0 top-0 bottom-0 bg-black/20 border-r border-white/10 text-right text-white/40 select-none",
                            isMobile ? "w-8 p-2 text-xs" : "w-12 p-3 text-xs"
                          )}>
                            {content.split('\n').map((_, index) => (
                              <div key={index} className={cn(
                                isMobile ? "leading-5" : "leading-6"
                              )}>
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
                            "w-full h-full resize-none border-0 bg-transparent text-white font-mono",
                            isMobile ? "p-2 text-sm" : "p-4 text-base",
                            lineNumbers && (isMobile ? "pl-10" : "pl-16")
                          )}
                          style={getEditorStyles()}
                          placeholder={`✨ Start writing your ${FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.name.toLowerCase()}...`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activePanel === 'search' && (
                <div className={cn("h-full", isMobile ? "p-3" : "p-6")}>
                  <div className={cn("mx-auto", isMobile ? "w-full" : "max-w-2xl")}>
                    <div className={cn("text-center", isMobile ? "mb-4" : "mb-8")}>
                      <div className={cn(
                        "bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4",
                        isMobile ? "w-12 h-12" : "w-16 h-16"
                      )}>
                        <Search className={cn("text-white", isMobile ? "w-6 h-6" : "w-8 h-8")} />
                      </div>
                      <h3 className={cn(
                        "text-white font-bold mb-2",
                        isMobile ? "text-lg" : "text-2xl"
                      )}>Search & Replace</h3>
                      <p className={cn(
                        "text-white/60",
                        isMobile ? "text-xs" : "text-sm"
                      )}>Find and replace text in your file</p>
                    </div>

                    <div className={cn("space-y-4", isMobile ? "space-y-3" : "space-y-6")}>
                      <div>
                        <label className={cn(
                          "text-white font-medium block mb-2",
                          isMobile ? "text-xs" : "text-sm"
                        )}>Find</label>
                        <Input
                          ref={searchRef}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={cn(
                            "bg-white/10 border-white/20 text-white",
                            isMobile ? "text-sm h-10" : "text-lg h-12"
                          )}
                          placeholder="Search text..."
                        />
                      </div>
                      
                      <div>
                        <label className={cn(
                          "text-white font-medium block mb-2",
                          isMobile ? "text-xs" : "text-sm"
                        )}>Replace</label>
                        <Input
                          value={replaceQuery}
                          onChange={(e) => setReplaceQuery(e.target.value)}
                          className={cn(
                            "bg-white/10 border-white/20 text-white",
                            isMobile ? "text-sm h-10" : "text-lg h-12"
                          )}
                          placeholder="Replace with..."
                        />
                      </div>

                      <div className={cn(
                        "grid gap-3",
                        isMobile ? "grid-cols-1" : "grid-cols-3"
                      )}>
                        <div className={cn(
                          "flex items-center gap-3 bg-white/5 rounded-lg border border-white/10",
                          isMobile ? "p-3" : "p-4"
                        )}>
                          <Switch
                            checked={searchOptions.caseSensitive}
                            onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, caseSensitive: checked }))}
                          />
                          <label className={cn(
                            "text-white",
                            isMobile ? "text-xs" : "text-sm"
                          )}>Case sensitive</label>
                        </div>

                        <div className={cn(
                          "flex items-center gap-3 bg-white/5 rounded-lg border border-white/10",
                          isMobile ? "p-3" : "p-4"
                        )}>
                          <Switch
                            checked={searchOptions.wholeWord}
                            onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, wholeWord: checked }))}
                          />
                          <label className={cn(
                            "text-white",
                            isMobile ? "text-xs" : "text-sm"
                          )}>Whole word</label>
                        </div>

                        <div className={cn(
                          "flex items-center gap-3 bg-white/5 rounded-lg border border-white/10",
                          isMobile ? "p-3" : "p-4"
                        )}>
                          <Switch
                            checked={searchOptions.regex}
                            onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, regex: checked }))}
                          />
                          <label className={cn(
                            "text-white",
                            isMobile ? "text-xs" : "text-sm"
                          )}>Regex</label>
                        </div>
                      </div>

                      <div className={cn(
                        "grid gap-3 pt-4",
                        isMobile ? "grid-cols-1" : "grid-cols-2"
                      )}>
                        <Button onClick={handleSearch} className={cn(
                          "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
                          isMobile ? "h-10 text-sm" : "h-12 text-lg"
                        )}>
                          <Search className={cn("mr-2", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                          Find
                        </Button>
                        <Button onClick={handleReplace} variant="outline" className={cn(
                          "border-white/20 text-white hover:bg-white/10",
                          isMobile ? "h-10 text-sm" : "h-12 text-lg"
                        )}>
                          <Replace className={cn("mr-2", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                          Replace
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'settings' && (
                <div className="h-full p-6 overflow-y-auto">
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
                </div>
              )}

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
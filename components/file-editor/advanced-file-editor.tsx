"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, FileCode, Save, Search, Settings, Download, Share2, Star,
  Eye, EyeOff, Copy, Scissors, Paste, Type, Hash, Database,
  Music, Image, Video, Folder, Archive, File, FileX, FileCheck,
  Smartphone, Monitor, ZoomIn, ZoomOut, RotateCcw, Replace,
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Indent, Outdent, Link, Table, Code2, Palette, ChevronDown, ChevronUp,
  Undo2, Redo2, History, Clock, Calendar, Tag, Bookmark, Pin,
  MessageSquare, Phone, Mail, MapPin, Navigation, Compass, Globe2,
  Menu, MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdvancedFileEditorProps {
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
  { id: 'cosmic', name: 'Cosmic', bg: 'bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900' },
  { id: 'ocean', name: 'Ocean', bg: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900' },
  { id: 'forest', name: 'Forest', bg: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900' },
  { id: 'sunset', name: 'Sunset', bg: 'bg-gradient-to-br from-orange-900 via-red-900 to-pink-900' },
  { id: 'midnight', name: 'Midnight', bg: 'bg-gradient-to-br from-slate-900 via-gray-900 to-black' }
]

const FONT_FAMILIES = [
  { id: 'inter', name: 'Inter', class: 'font-inter' },
  { id: 'poppins', name: 'Poppins', class: 'font-poppins' },
  { id: 'roboto', name: 'Roboto', class: 'font-roboto' },
  { id: 'mono', name: 'Monospace', class: 'font-mono' },
  { id: 'serif', name: 'Serif', class: 'font-serif' }
]

export function AdvancedFileEditor({ file, onSave, onClose, readOnly = false }: AdvancedFileEditorProps) {
  const [fileName, setFileName] = useState(file.name)
  const [content, setContent] = useState(file.content)
  const [fileType, setFileType] = useState(file.type || 'text')
  const [showPreview, setShowPreview] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [wordWrap, setWordWrap] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [theme, setTheme] = useState('cosmic')
  const [fontFamily, setFontFamily] = useState('mono')
  const [showToolbar, setShowToolbar] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')
  const [isMobile, setIsMobile] = useState(false)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setFontSize(14)
        setLineNumbers(false)
        setShowSidebar(false)
      } else {
        setFontSize(16)
        setLineNumbers(true)
        setShowSidebar(true)
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
    // Initialize undo stack
    setUndoStack([file.content])
    setRedoStack([])
  }, [file])

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
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    // Add to undo stack
    setUndoStack(prev => [...prev, newContent])
    setRedoStack([])
  }

  const handleSave = () => {
    onSave(fileName, content, fileType)
  }

  const handleUndo = () => {
    if (undoStack.length > 1) {
      const currentContent = undoStack[undoStack.length - 1]
      const previousContent = undoStack[undoStack.length - 2]
      
      setRedoStack(prev => [...prev, currentContent])
      setUndoStack(prev => prev.slice(0, -1))
      setContent(previousContent)
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[redoStack.length - 1]
      
      setUndoStack(prev => [...prev, nextContent])
      setRedoStack(prev => prev.slice(0, -1))
      setContent(nextContent)
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
          setTimeout(() => searchRef.current?.focus(), 100)
          break
        case 'z':
          e.preventDefault()
          if (e.shiftKey) {
            handleRedo()
          } else {
            handleUndo()
          }
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
    const searchText = searchQuery
    const regex = new RegExp(searchText, 'gi')
    const matches = text.match(regex)
    
    if (matches) {
      console.log(`Found ${matches.length} matches`)
    }
  }

  const handleReplace = () => {
    if (!searchQuery || !replaceQuery) return
    
    const newContent = content.replace(new RegExp(searchQuery, 'gi'), replaceQuery)
    setContent(newContent)
    setSearchQuery('')
    setReplaceQuery('')
    setShowSearch(false)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = () => {
    const IconComponent = FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.icon || FileText
    return <IconComponent className="w-6 h-6" />
  }

  const getCurrentTheme = () => {
    return THEMES.find(t => t.id === theme) || THEMES[0]
  }

  return (
    <div className={cn(
      "h-full flex flex-col",
      getCurrentTheme().bg
    )}>
      {/* Header */}
      <div className={cn(
        "border-b border-white/10 bg-black/20",
        isMobile ? "p-2" : "p-4"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "bg-gradient-to-r rounded-lg p-2",
              FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.color || 'from-blue-500 to-cyan-500'
            )}>
              {getFileIcon()}
            </div>
            <div className="flex-1">
              <Input
                value={fileName}
                onChange={(e) => handleFileNameChange(e.target.value)}
                disabled={readOnly}
                className={cn(
                  "bg-white/10 border-white/20 text-white font-medium",
                  isMobile ? "text-sm h-8" : "text-base h-10"
                )}
              />
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.name}
                </Badge>
                <span className="text-white/60 text-xs">
                  {formatBytes(file.size)}
                </span>
                {!isMobile && (
                  <span className="text-white/60 text-xs">
                    {file.lastModified.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size={isMobile ? "sm" : "default"}
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Save className={cn("mr-2", isMobile ? "w-3 h-3" : "w-4 h-4")} />
              {!isMobile && "Save"}
            </Button>
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
                <div className="flex justify-between">
                  <span className="text-white/60">Type:</span>
                  <span className="text-white">{fileType.toUpperCase()}</span>
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
                  <label className="text-white/60 text-sm block mb-1">Theme</label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-white/60 text-sm block mb-1">Font Family</label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.id} value={font.id}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editor Content */}
        <div className="flex-1 relative">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className={cn(
              "bg-black/20 border-b border-white/10",
              isMobile ? "p-1" : "p-2"
            )}>
              <TabsTrigger value="editor" className="text-white">Editor</TabsTrigger>
              <TabsTrigger value="preview" className="text-white">Preview</TabsTrigger>
              <TabsTrigger value="search" className="text-white">Search</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="h-full mt-0">
              {/* Toolbar */}
              {showToolbar && (
                <div className={cn(
                  "border-b border-white/10 bg-black/10",
                  isMobile ? "p-2" : "p-3"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleUndo}
                        disabled={undoStack.length <= 1}
                        className="text-white hover:bg-white/10"
                      >
                        <Undo2 className="w-4 h-4" />
                        {!isMobile && <span className="ml-2">Undo</span>}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                        className="text-white hover:bg-white/10"
                      >
                        <Redo2 className="w-4 h-4" />
                        {!isMobile && <span className="ml-2">Redo</span>}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowSearch(!showSearch)}
                        className="text-white hover:bg-white/10"
                      >
                        <Search className="w-4 h-4" />
                        {!isMobile && <span className="ml-2">Search</span>}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {!isMobile && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-white/60 text-xs">Font:</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                              className="text-white hover:bg-white/10"
                            >
                              <ZoomOut className="w-3 h-3" />
                            </Button>
                            <span className="text-white text-sm w-8 text-center">{fontSize}px</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                              className="text-white hover:bg-white/10"
                            >
                              <ZoomIn className="w-3 h-3" />
                            </Button>
                          </div>
                        </>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-xs">Lines</span>
                        <Switch
                          checked={lineNumbers}
                          onCheckedChange={setLineNumbers}
                          className="data-[state=checked]:bg-purple-500"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-xs">Wrap</span>
                        <Switch
                          checked={wordWrap}
                          onCheckedChange={setWordWrap}
                          className="data-[state=checked]:bg-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Panel */}
              {showSearch && (
                <div className={cn(
                  "border-b border-white/10 bg-black/20",
                  isMobile ? "p-2" : "p-4"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        ref={searchRef}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={replaceQuery}
                        onChange={(e) => setReplaceQuery(e.target.value)}
                        placeholder="Replace with..."
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <Button size="sm" onClick={handleSearch} variant="outline">
                      <Search className="w-4 h-4 mr-1" />
                      Find
                    </Button>
                    <Button size="sm" onClick={handleReplace} variant="outline">
                      <Replace className="w-4 h-4 mr-1" />
                      Replace
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowSearch(false)}>
                      ✕
                    </Button>
                  </div>
                </div>
              )}

              {/* Editor */}
              <div className="h-full relative">
                {/* Line Numbers */}
                {lineNumbers && (
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 bg-black/20 border-r border-white/10 text-right text-white/40 select-none",
                    isMobile ? "w-6 p-1 text-xs" : "w-12 p-2 text-xs"
                  )}>
                    {content.split('\n').map((_, index) => (
                      <div key={index} className="leading-6">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                )}

                {/* Text Editor */}
                <Textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={readOnly}
                  className={cn(
                    "w-full h-full resize-none border-0 bg-transparent text-white font-mono",
                    isMobile ? "p-3 text-sm" : "p-4 text-base",
                    lineNumbers && (isMobile ? "pl-8" : "pl-16")
                  )}
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: FONT_FAMILIES.find(f => f.id === fontFamily)?.class || 'ui-monospace',
                    lineHeight: '1.6',
                    whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
                  }}
                  placeholder="Start writing your content..."
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="h-full mt-0">
              <div className={cn(
                "h-full overflow-auto",
                isMobile ? "p-3" : "p-4"
              )}>
                <div className="bg-white/10 rounded-lg border border-white/20 p-4 h-full">
                  <h3 className="text-white font-semibold mb-3">Preview</h3>
                  <pre className="text-white whitespace-pre-wrap text-sm">{content}</pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="search" className="h-full mt-0">
              <div className={cn(
                "h-full overflow-auto",
                isMobile ? "p-3" : "p-4"
              )}>
                <div className="bg-white/10 rounded-lg border border-white/20 p-4 h-full">
                  <h3 className="text-white font-semibold mb-3">Search & Replace</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm block mb-2">Find</label>
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search query..."
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm block mb-2">Replace with</label>
                      <Input
                        value={replaceQuery}
                        onChange={(e) => setReplaceQuery(e.target.value)}
                        placeholder="Replacement text..."
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSearch} variant="outline">
                        <Search className="w-4 h-4 mr-2" />
                        Find
                      </Button>
                      <Button onClick={handleReplace} variant="outline">
                        <Replace className="w-4 h-4 mr-2" />
                        Replace
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Status Bar */}
      <div className={cn(
        "border-t border-white/10 bg-black/20 text-white/60 text-xs",
        isMobile ? "p-2" : "p-3"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Lines: {content.split('\n').length}</span>
            <span>Chars: {content.length}</span>
            <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
            <span>•</span>
            <span>{fileType.toUpperCase()}</span>
            <span>•</span>
            <span>{fontSize}px</span>
          </div>
        </div>
      </div>
    </div>
  )
}
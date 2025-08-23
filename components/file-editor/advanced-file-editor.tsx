"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlignCenter, AlignLeft, AlignRight, Archive, Bold, Database, Edit3, Eye, FileCode, FileText, Folder, Image, Italic, Music, Redo2, Replace, Save, Search, Underline, Undo2, Video, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

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
    <div className="h-full flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Input
            value={fileName}
            onChange={handleFileNameChange}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 flex-1 min-w-0 max-w-xs sm:max-w-md"
            placeholder="Enter file name..."
          />
          <Badge variant="secondary" className="bg-slate-600 text-gray-300 border-0">
            {fileType}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white"
            size={isMobile ? "sm" : "default"}
          >
            <Save className="w-4 h-4 mr-2" />
            {isMobile ? "Save" : "Save File"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Desktop Only */}
        {!isMobile && (
          <div className="w-64 bg-slate-800/50 border-r border-slate-700 p-4">
            <div className="space-y-4">
              {/* Theme Selector */}
              <div>
                <Label className="text-sm font-medium text-gray-300">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="monokai">Monokai</SelectItem>
                    <SelectItem value="dracula">Dracula</SelectItem>
                    <SelectItem value="nord">Nord</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Family */}
              <div>
                <Label className="text-sm font-medium text-gray-300">Font</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="consolas">Consolas</SelectItem>
                    <SelectItem value="fira-code">Fira Code</SelectItem>
                    <SelectItem value="jetbrains-mono">JetBrains Mono</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div>
                <Label className="text-sm font-medium text-gray-300">
                  Font Size: {fontSize}px
                </Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={([value]) => setFontSize(value)}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-300">Line Numbers</Label>
                  <Switch
                    checked={lineNumbers}
                    onCheckedChange={setLineNumbers}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-300">Word Wrap</Label>
                  <Switch
                    checked={wordWrap}
                    onCheckedChange={setWordWrap}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-300">Toolbar</Label>
                  <Switch
                    checked={showToolbar}
                    onCheckedChange={setShowToolbar}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>

              {/* Undo/Redo */}
              <div className="flex gap-2">
                <Button
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  <Undo2 className="w-4 h-4 mr-1" />
                  Undo
                </Button>
                <Button
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  <Redo2 className="w-4 h-4 mr-1" />
                  Redo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar - Conditional */}
          {showToolbar && (
            <div className="bg-slate-800/50 border-b border-slate-700 p-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.execCommand('bold')}
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.execCommand('italic')}
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.execCommand('underline')}
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  <Underline className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 bg-slate-600" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.execCommand('justifyLeft')}
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.execCommand('justifyCenter')}
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.execCommand('justifyRight')}
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 bg-slate-600" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(true)}
                  className="text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="bg-slate-800/50 border-b border-slate-700 rounded-none">
              <TabsTrigger value="editor" className="data-[state=active]:bg-slate-700">
                <Edit3 className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-slate-700">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-slate-700">
                <Search className="w-4 h-4 mr-2" />
                Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 p-4 min-h-0">
              <div className="relative h-full">
                <Textarea
                  value={content}
                  onChange={handleContentChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full h-full resize-none bg-slate-800 border-slate-600 text-white placeholder-gray-400 p-4 font-mono ${
                    lineNumbers ? 'pl-12' : ''
                  } ${wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: fontFamily === 'monospace' ? 'monospace' : 
                               fontFamily === 'consolas' ? 'Consolas' : 
                               fontFamily === 'fira-code' ? 'Fira Code' : 'JetBrains Mono'
                  }}
                  placeholder="Start typing your content here..."
                />
                
                {/* Line Numbers */}
                {lineNumbers && (
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-700/50 border-r border-slate-600 text-gray-400 text-xs font-mono p-4 pt-4 leading-6 select-none">
                    {content.split('\n').map((_, index) => (
                      <div key={index} className="text-right">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 p-4 min-h-0">
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 h-full overflow-auto">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
                />
              </div>
            </TabsContent>

            <TabsContent value="search" className="flex-1 p-4 min-h-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Search</Label>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter search term..."
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Replace</Label>
                    <Input
                      value={replaceQuery}
                      onChange={(e) => setReplaceQuery(e.target.value)}
                      placeholder="Enter replacement text..."
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    onClick={handleReplace}
                    className="bg-green-600 hover:bg-green-700"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Replace className="w-4 h-4 mr-2" />
                    Replace
                  </Button>
                  <Button
                    onClick={handleReplace}
                    className="bg-purple-600 hover:bg-purple-700"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Replace className="w-4 h-4 mr-2" />
                    Replace All
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-800/50 border-t border-slate-700 p-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>Lines: {content.split('\n').length}</span>
            <span>Chars: {content.length}</span>
            <span>Size: {formatBytes(content.length)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Theme: {theme}</span>
            <span>Font: {fontSize}px</span>
          </div>
        </div>
      </div>
    </div>
  )
}
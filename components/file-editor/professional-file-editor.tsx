"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Scissors, FlipHorizontal, FlipVertical, Crop, Layers, Type, Hash, Quote,
  Minus, Plus, Equal, Braces, Brackets, Parentheses, Slash, Backslash,
  Undo2, Redo2, History, Clock, Calendar, Tag, Bookmark, Pin,
  MessageSquare, Phone, Mail, MapPin, Navigation, Compass, Globe2, Puzzle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfessionalFileEditorProps {
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

const THEMES = [
  { value: 'dark', label: 'Dark', preview: 'bg-slate-900' },
  { value: 'light', label: 'Light', preview: 'bg-white' },
  { value: 'blue', label: 'Blue', preview: 'bg-blue-900' },
  { value: 'green', label: 'Green', preview: 'bg-green-900' },
  { value: 'purple', label: 'Purple', preview: 'bg-purple-900' },
  { value: 'red', label: 'Red', preview: 'bg-red-900' }
]

const FONT_FAMILIES = [
  { value: 'mono', label: 'Monospace', preview: 'font-mono' },
  { value: 'sans', label: 'Sans Serif', preview: 'font-sans' },
  { value: 'serif', label: 'Serif', preview: 'font-serif' }
]

const FONT_SIZES = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 32]

export function ProfessionalFileEditor({ file, onSave, onClose, readOnly = false }: ProfessionalFileEditorProps) {
  const [fileName, setFileName] = useState(file.name)
  const [content, setContent] = useState(file.content)
  const [fileType, setFileType] = useState(file.type || 'text')
  const [errors, setErrors] = useState<string[]>([])
  const [isValid, setIsValid] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('dark')
  const [fontFamily, setFontFamily] = useState('mono')
  const [wordWrap, setWordWrap] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [minimap, setMinimap] = useState(true)
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
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [gitStatus, setGitStatus] = useState('clean')
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [activePanel, setActivePanel] = useState<'editor' | 'terminal' | 'git' | 'debug'>('editor')

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

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
    
    if (ALLOWED_EXTENSIONS.audio.includes(`.${ext}`)) return 'audio'
    if (ALLOWED_EXTENSIONS.image.includes(`.${ext}`)) return 'image'
    if (ALLOWED_EXTENSIONS.video.includes(`.${ext}`)) return 'video'
    if (ALLOWED_EXTENSIONS.database.includes(`.${ext}`)) return 'database'
    if (ALLOWED_EXTENSIONS.code.includes(`.${ext}`)) return 'code'
    if (ALLOWED_EXTENSIONS.text.includes(`.${ext}`)) return 'text'
    
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
    
    if (fileName.includes('.')) {
      const extension = fileName.substring(fileName.lastIndexOf('.'))
      const allowedExtensions = ALLOWED_EXTENSIONS[fileType as keyof typeof ALLOWED_EXTENSIONS]
      
      if (allowedExtensions && allowedExtensions.length > 0 && !allowedExtensions.includes(extension.toLowerCase())) {
        newErrors.push(`Invalid extension for ${FILE_TYPE_NAMES[fileType as keyof typeof FILE_TYPE_NAMES]}. Allowed: ${allowedExtensions.join(', ')}`)
      }
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
        case 'y':
          e.preventDefault()
          handleRedo()
          break
      }
    }
  }

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1]
      setRedoStack([content, ...redoStack])
      setContent(previousContent)
      setUndoStack(undoStack.slice(0, -1))
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[0]
      setUndoStack([...undoStack, content])
      setContent(nextContent)
      setRedoStack(redoStack.slice(1))
    }
  }

  const handleSearch = () => {
    if (!searchQuery) return
    
    const text = content
    let matches: number[] = []
    let searchText = searchQuery
    
    if (searchOptions.regex) {
      try {
        const regex = new RegExp(searchQuery, searchOptions.caseSensitive ? 'g' : 'gi')
        let match
        while ((match = regex.exec(text)) !== null) {
          matches.push(match.index)
        }
      } catch (e) {
        // Invalid regex
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
      // Highlight first match
      const firstMatch = matches[0]
      setSelection({ start: firstMatch, end: firstMatch + searchQuery.length })
      editorRef.current?.setSelectionRange(firstMatch, firstMatch + searchQuery.length)
    }
  }

  const handleReplace = () => {
    if (!searchQuery || !replaceQuery) return
    
    const newContent = content.replace(new RegExp(searchQuery, 'g'), replaceQuery)
    setContent(newContent)
    setSearchQuery('')
    setReplaceQuery('')
    setShowSearch(false)
  }

  const handleReplaceAll = () => {
    if (!searchQuery || !replaceQuery) return
    
    const newContent = content.replace(new RegExp(searchQuery, 'g'), replaceQuery)
    setContent(newContent)
    setSearchQuery('')
    setReplaceQuery('')
    setShowSearch(false)
  }

  const getFileIcon = () => {
    const IconComponent = FILE_TYPE_ICONS[fileType as keyof typeof FILE_TYPE_ICONS]
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <FileText className="w-5 h-5" />
  }

  const getThemeClasses = () => {
    switch (theme) {
      case 'light': return 'bg-white text-black'
      case 'blue': return 'bg-blue-900 text-white'
      case 'green': return 'bg-green-900 text-white'
      case 'purple': return 'bg-purple-900 text-white'
      case 'red': return 'bg-red-900 text-white'
      default: return 'bg-slate-900 text-white'
    }
  }

  const getEditorStyles = () => {
    return {
      fontSize: `${fontSize}px`,
      fontFamily: fontFamily === 'mono' ? 'monospace' : fontFamily === 'sans' ? 'sans-serif' : 'serif',
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

  return (
    <div className={cn("w-full h-full flex flex-col", getThemeClasses())}>
      {/* Top Toolbar */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/30 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* File Info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                {getFileIcon()}
              </div>
              <div>
                <Input
                  value={fileName}
                  onChange={(e) => handleFileNameChange(e.target.value)}
                  disabled={readOnly}
                  className="w-48 bg-black/30 border-purple-500/30 text-white"
                />
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                    {FILE_TYPE_NAMES[fileType as keyof typeof FILE_TYPE_NAMES]}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {formatBytes(file.size)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {file.lastModified.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
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
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPreview(!showPreview)}
                className="text-white hover:bg-white/20"
                title="Toggle Preview"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={!isValid || readOnly}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-black/20 border-r border-purple-500/20 p-4 space-y-4">
          {/* File Explorer */}
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Explorer
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 p-2 rounded hover:bg-white/10 cursor-pointer">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white">{fileName}</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </h3>
            <Input
              placeholder="Search in files..."
              className="w-full bg-black/30 border-purple-500/30 text-white text-sm"
            />
          </div>

          {/* Git */}
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Source Control
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 p-2 rounded hover:bg-white/10 cursor-pointer">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  gitStatus === 'clean' ? "bg-green-400" : "bg-yellow-400"
                )} />
                <span className="text-sm text-white">main</span>
              </div>
            </div>
          </div>

          {/* Extensions */}
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Puzzle className="w-4 h-4" />
              Extensions
            </h3>
            <div className="space-y-1">
              <div className="text-xs text-gray-400 p-2">
                No extensions installed
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="bg-black/30 border-b border-purple-500/20">
            <div className="flex items-center">
              <div className="flex items-center gap-1 p-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 px-4 py-2 text-white text-sm">
                {fileName} - YukiFiles Editor
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 relative">
            {showPreview ? (
              <div className="p-6">
                <div className="bg-white/10 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="text-white font-semibold mb-2">Preview</h3>
                  <pre className="text-white text-sm whitespace-pre-wrap">{content}</pre>
                </div>
              </div>
            ) : (
              <div className="relative h-full">
                {/* Line Numbers */}
                {lineNumbers && (
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/20 border-r border-purple-500/20 text-right text-xs text-gray-400 p-2 select-none">
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
                    "w-full h-full resize-none border-0 bg-transparent text-white font-mono p-4",
                    lineNumbers && "pl-16"
                  )}
                  style={getEditorStyles()}
                  placeholder={`Enter ${FILE_TYPE_NAMES[fileType as keyof typeof FILE_TYPE_NAMES]} content...`}
                />
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="bg-black/30 border-t border-purple-500/20 p-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
                <span>{content.split('\n').length} lines</span>
                <span>{content.length} characters</span>
                <span>{fileType.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>UTF-8</span>
                <span>{fontSize}px</span>
                <span>{fontFamily}</span>
                <span>{wordWrap ? 'Word Wrap' : 'No Wrap'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 bg-black/20 border-l border-purple-500/20 p-4 space-y-4">
          {/* Outline */}
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <List className="w-4 h-4" />
              Outline
            </h3>
            <div className="space-y-1">
              <div className="text-xs text-gray-400 p-2">
                No symbols found
              </div>
            </div>
          </div>

          {/* Problems */}
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Problems
            </h3>
            <div className="space-y-1">
              {errors.length > 0 ? (
                errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded hover:bg-white/10 cursor-pointer">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400">{error}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 p-2">
                  No problems
                </div>
              )}
            </div>
          </div>

          {/* Output */}
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Output
            </h3>
            <div className="space-y-1">
              <div className="text-xs text-gray-400 p-2">
                No output
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Replace Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-6 w-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Search & Replace</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSearch(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm block mb-2">Find</label>
                  <Input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="Search text..."
                  />
                </div>
                
                <div>
                  <label className="text-white text-sm block mb-2">Replace</label>
                  <Input
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="Replace with..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={searchOptions.caseSensitive}
                    onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, caseSensitive: checked }))}
                  />
                  <label className="text-white text-sm">Case sensitive</label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={searchOptions.wholeWord}
                    onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, wholeWord: checked }))}
                  />
                  <label className="text-white text-sm">Whole word</label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={searchOptions.regex}
                    onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, regex: checked }))}
                  />
                  <label className="text-white text-sm">Regex</label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSearch} className="flex-1">
                    Find
                  </Button>
                  <Button onClick={handleReplace} variant="outline" className="flex-1">
                    Replace
                  </Button>
                  <Button onClick={handleReplaceAll} variant="outline" className="flex-1">
                    Replace All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Editor Settings</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSettings(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <label className="text-white text-sm font-medium block mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {THEMES.map((themeOption) => (
                      <div
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value)}
                        className={cn(
                          "p-3 rounded-lg border-2 cursor-pointer transition-all",
                          theme === themeOption.value
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-gray-600 hover:border-purple-500/50"
                        )}
                      >
                        <div className={cn("w-full h-8 rounded", themeOption.preview)}></div>
                        <span className="text-white text-xs mt-2 block text-center">{themeOption.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Family */}
                <div>
                  <label className="text-white text-sm font-medium block mb-2">Font Family</label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-500/30">
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value} className="text-white hover:bg-purple-500/20">
                          <span className={font.preview}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="text-white text-sm font-medium block mb-2">Font Size: {fontSize}px</label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={10}
                    max={32}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Editor Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm">Word Wrap</label>
                    <Switch
                      checked={wordWrap}
                      onCheckedChange={setWordWrap}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm">Line Numbers</label>
                    <Switch
                      checked={lineNumbers}
                      onCheckedChange={setLineNumbers}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm">Minimap</label>
                    <Switch
                      checked={minimap}
                      onCheckedChange={setMinimap}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm">Auto Save</label>
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
  )
}
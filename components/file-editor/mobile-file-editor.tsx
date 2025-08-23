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
  FileText, FileCode, Save, X, ArrowLeft, Settings,
  Code, File, Folder, Music, Image, Video, Database,
  Eye, EyeOff, Search, Download, Share2, Star,
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Indent, Outdent, Link, Table, Code2, Palette, ChevronDown, ChevronUp,
  Undo2, Redo2, History, Clock, Calendar, Tag, Bookmark, Pin,
  MessageSquare, Phone, Mail, MapPin, Navigation, Compass, Globe2,
  Menu, MoreVertical, ZoomIn, ZoomOut, RotateCcw, FlipHorizontal, FlipVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileFileEditorProps {
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

export function MobileFileEditor({ file, onSave, onClose, readOnly = false }: MobileFileEditorProps) {
  const [fileName, setFileName] = useState(file.name)
  const [content, setContent] = useState(file.content)
  const [fileType, setFileType] = useState(file.type || 'text')
  const [errors, setErrors] = useState<string[]>([])
  const [isValid, setIsValid] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState('dark')
  const [fontFamily, setFontFamily] = useState('mono')
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
  const [activePanel, setActivePanel] = useState<'editor' | 'settings' | 'search'>('editor')

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
          setActivePanel('search')
          setTimeout(() => searchRef.current?.focus(), 100)
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
    const IconComponent = FILE_TYPE_ICONS[fileType as keyof typeof FILE_TYPE_ICONS]
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <FileText className="w-6 h-6" />
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
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800 border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActivePanel('editor')}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center border border-purple-500/30">
              {getFileIcon()}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{fileName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                  {FILE_TYPE_NAMES[fileType as keyof typeof FILE_TYPE_NAMES]}
                </Badge>
                <span className="text-white/60 text-xs">
                  {formatBytes(file.size)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActivePanel('search')}
              className="text-white hover:bg-white/20"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActivePanel('settings')}
              className="text-white hover:bg-white/20"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid || readOnly}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* File Info Bar */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <span className="text-white/60 block">Type</span>
            <span className="text-white font-medium">{FILE_TYPE_NAMES[fileType as keyof typeof FILE_TYPE_NAMES]}</span>
          </div>
          <div className="text-center">
            <span className="text-white/60 block">Lines</span>
            <span className="text-white font-medium">{content.split('\n').length}</span>
          </div>
          <div className="text-center">
            <span className="text-white/60 block">Chars</span>
            <span className="text-white font-medium">{content.length}</span>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activePanel === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* File Name Input */}
              <div className="p-4 border-b border-purple-500/20 bg-slate-800/50">
                <label className="block text-white/80 text-sm font-medium mb-2">File Name</label>
                <Input
                  value={fileName}
                  onChange={(e) => handleFileNameChange(e.target.value)}
                  disabled={readOnly}
                  className="bg-black/30 border-purple-500/30 text-white text-base"
                />
              </div>

              {/* Editor Area */}
              <div className="flex-1 p-4 relative">
                {showPreview ? (
                  <div className="h-full">
                    <div className="bg-white/10 rounded-lg p-4 border border-purple-500/20 h-full overflow-auto">
                      <h3 className="text-white font-semibold mb-2">Preview</h3>
                      <pre className="text-white text-sm whitespace-pre-wrap">{content}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="h-full relative">
                    {/* Line Numbers */}
                    {lineNumbers && (
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/20 border-r border-purple-500/20 text-right text-xs text-gray-400 p-2 select-none">
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
                        lineNumbers && "pl-12"
                      )}
                      style={getEditorStyles()}
                      placeholder={`Enter ${FILE_TYPE_NAMES[fileType as keyof typeof FILE_TYPE_NAMES]} content...`}
                    />
                  </div>
                )}
              </div>

              {/* Mobile Bottom Bar */}
              <div className="p-4 border-t border-purple-500/20 bg-slate-800/50">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>Ln 1, Col 1</span>
                  <span>{fileType.toUpperCase()}</span>
                  <span>UTF-8</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={showPreview}
                        onCheckedChange={setShowPreview}
                        className="scale-75"
                      />
                      <span className="text-white text-xs">Preview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={lineNumbers}
                        onCheckedChange={setLineNumbers}
                        className="scale-75"
                      />
                      <span className="text-white text-xs">Lines</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs">{fontSize}px</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePanel === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full p-4 space-y-6 overflow-y-auto"
            >
              <div className="text-center mb-6">
                <h3 className="text-white font-bold text-xl">Editor Settings</h3>
                <p className="text-white/60 text-sm">Customize your editing experience</p>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="text-white text-sm font-medium block mb-3">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map((themeOption) => (
                    <div
                      key={themeOption.value}
                      onClick={() => setTheme(themeOption.value)}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all",
                        theme === themeOption.value
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-gray-600 hover:border-purple-500/50"
                      )}
                    >
                      <div className={cn("w-full h-12 rounded-lg mb-2", themeOption.preview)}></div>
                      <span className="text-white text-sm font-medium">{themeOption.label}</span>
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
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                    className="border-purple-500/30 text-purple-300"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${((fontSize - 12) / (24 - 12)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                    className="border-purple-500/30 text-purple-300"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Editor Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div>
                    <label className="text-white text-sm font-medium">Word Wrap</label>
                    <p className="text-white/60 text-xs">Wrap long lines</p>
                  </div>
                  <Switch
                    checked={wordWrap}
                    onCheckedChange={setWordWrap}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div>
                    <label className="text-white text-sm font-medium">Line Numbers</label>
                    <p className="text-white/60 text-xs">Show line numbers</p>
                  </div>
                  <Switch
                    checked={lineNumbers}
                    onCheckedChange={setLineNumbers}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
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
            </motion.div>
          )}

          {activePanel === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full p-4 space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-white font-bold text-xl">Search & Replace</h3>
                <p className="text-white/60 text-sm">Find and replace text in your file</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-2">Find</label>
                  <Input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white text-base"
                    placeholder="Search text..."
                  />
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium block mb-2">Replace</label>
                  <Input
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-white text-base"
                    placeholder="Replace with..."
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                    <Switch
                      checked={searchOptions.caseSensitive}
                      onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, caseSensitive: checked }))}
                      className="scale-75"
                    />
                    <label className="text-white text-sm">Case sensitive</label>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                    <Switch
                      checked={searchOptions.wholeWord}
                      onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, wholeWord: checked }))}
                      className="scale-75"
                    />
                    <label className="text-white text-sm">Whole word</label>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                    <Switch
                      checked={searchOptions.regex}
                      onCheckedChange={(checked) => setSearchOptions(prev => ({ ...prev, regex: checked }))}
                      className="scale-75"
                    />
                    <label className="text-white text-sm">Regex</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button onClick={handleSearch} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Find
                  </Button>
                  <Button onClick={handleReplace} variant="outline" className="border-purple-500/30 text-purple-300">
                    Replace
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </div>
  )
}
"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  RefreshCw,   GitBranch, GitCommit, GitMerge, GitPullRequest, Terminal,
  Lightbulb, Zap, Shield, Globe, Lock, Unlock, Trash2, Copy,
  Scissors, FlipHorizontal, FlipVertical, Crop, Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UltimateFileEditorProps {
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
  'vs-dark': 'VS Code Dark',
  'vs-light': 'VS Code Light',
  'hc-black': 'High Contrast Black',
  'hc-light': 'High Contrast Light',
  'yuki-dark': 'Yuki Dark',
  'yuki-light': 'Yuki Light'
}

const FONT_FAMILIES = {
  'JetBrains Mono': 'JetBrains Mono',
  'Fira Code': 'Fira Code',
  'Source Code Pro': 'Source Code Pro',
  'Consolas': 'Consolas',
  'Monaco': 'Monaco',
  'Menlo': 'Menlo'
}

export function UltimateFileEditor({ file, onClose, onSave }: UltimateFileEditorProps) {
  const [fileName, setFileName] = useState(file?.name || '')
  const [content, setContent] = useState(file?.content || '')
  const [selectedType, setSelectedType] = useState('text')
  const [activeTab, setActiveTab] = useState('editor')
  const [errors, setErrors] = useState<string[]>([])
  const [isValid, setIsValid] = useState(false)
  const [iconKey, setIconKey] = useState(0)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState<'vs-dark' | 'vs-light' | 'hc-black' | 'hc-light' | 'yuki-dark' | 'yuki-light'>('yuki-dark')
  const [fontFamily, setFontFamily] = useState('JetBrains Mono')
  const [showPreview, setShowPreview] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showReplace, setShowReplace] = useState(false)
  const [currentMatch, setCurrentMatch] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [imageRotation, setImageRotation] = useState(0)
  const [imageZoom, setImageZoom] = useState(1)
  const [showImageTools, setShowImageTools] = useState(false)
  const [showVideoTools, setShowVideoTools] = useState(false)
  const [showAudioTools, setShowAudioTools] = useState(false)
  const [showDatabaseTools, setShowDatabaseTools] = useState(false)
  const [wordWrap, setWordWrap] = useState(true)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [minimap, setMinimap] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [showGitPanel, setShowGitPanel] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [showExtensions, setShowExtensions] = useState(false)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (file) {
      setFileName(file.name || '')
      setContent(file.content || '')
      const detectedType = detectFileType(file.name)
      setSelectedType(detectedType)
      setIconKey(prev => prev + 1)
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
          setShowReplace(true)
          break
        case 'z':
          e.preventDefault()
          // Undo functionality
          break
        case 'y':
          e.preventDefault()
          // Redo functionality
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
      case 'vs-dark':
        return 'bg-gray-900 text-gray-100'
      case 'vs-light':
        return 'bg-white text-gray-900'
      case 'hc-black':
        return 'bg-black text-white'
      case 'hc-light':
        return 'bg-white text-black'
      case 'yuki-dark':
        return 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white'
      case 'yuki-light':
        return 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'
      default:
        return 'bg-gray-900 text-gray-100'
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
      {/* Top Bar - VSCode Style */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          {/* File Icon & Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              {getFileIcon()}
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{fileName}</h3>
              <p className="text-gray-400 text-xs">{FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}</p>
            </div>
          </div>

          {/* File Type Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            >
              {Object.entries(FILE_TYPE_NAMES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Bar Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSearch(true)}
            className="text-gray-300 hover:text-white hover:bg-slate-700"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowGitPanel(!showGitPanel)}
            className={cn(
              "text-gray-300 hover:text-white hover:bg-slate-700",
              showGitPanel && "bg-slate-700 text-white"
            )}
          >
            <GitBranch className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowTerminal(!showTerminal)}
            className={cn(
              "text-gray-300 hover:text-white hover:bg-slate-700",
              showTerminal && "bg-slate-700 text-white"
            )}
          >
            <Terminal className="w-4 h-4" />
          </Button>
                      <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className={cn(
                "text-gray-300 hover:text-white hover:bg-slate-700",
                showDebugPanel && "bg-slate-700 text-white"
              )}
            >
              <Code2 className="w-4 h-4" />
            </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowExtensions(!showExtensions)}
            className={cn(
              "text-gray-300 hover:text-white hover:bg-slate-700",
              showExtensions && "bg-slate-700 text-white"
            )}
          >
            <Zap className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-300 hover:text-white hover:bg-slate-700"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-gray-300 hover:text-white hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - VSCode Style */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
          {/* Activity Bar */}
          <div className="bg-slate-900 p-2">
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveTab('explorer')}
                className={cn(
                  "w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700",
                  activeTab === 'explorer' && "bg-slate-700 text-white"
                )}
              >
                <File className="w-4 h-4 mr-2" />
                Explorer
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveTab('search')}
                className={cn(
                  "w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700",
                  activeTab === 'search' && "bg-slate-700 text-white"
                )}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveTab('git')}
                className={cn(
                  "w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700",
                  activeTab === 'git' && "bg-slate-700 text-white"
                )}
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Git
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveTab('extensions')}
                className={cn(
                  "w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700",
                  activeTab === 'extensions' && "bg-slate-700 text-white"
                )}
              >
                <Zap className="w-4 h-4 mr-2" />
                Extensions
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 p-4">
            {activeTab === 'explorer' && (
              <div className="space-y-4">
                <h4 className="text-white font-medium text-sm">WORKSPACE</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <FileText className="w-4 h-4" />
                    {fileName}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Folder className="w-4 h-4" />
                    Documents
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="space-y-4">
                <h4 className="text-white font-medium text-sm">SEARCH</h4>
                <Input
                  placeholder="Search in files..."
                  className="bg-slate-700 border-slate-600 text-white text-sm"
                />
                <div className="text-gray-400 text-xs">
                  Use Ctrl+F to search in current file
                </div>
              </div>
            )}

            {activeTab === 'git' && (
              <div className="space-y-4">
                <h4 className="text-white font-medium text-sm">GIT</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <GitCommit className="w-4 h-4" />
                    main
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <GitBranch className="w-4 h-4" />
                    feature/editor
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'extensions' && (
              <div className="space-y-4">
                <h4 className="text-white font-medium text-sm">EXTENSIONS</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Yuki Theme
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Code Formatter
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="bg-slate-800 border-b border-slate-700">
            <div className="flex items-center">
              <div className="flex items-center gap-1 px-4 py-2 bg-slate-700 border-r border-slate-600">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">{fileName}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="w-5 h-5 p-0 ml-2 text-gray-400 hover:text-white hover:bg-slate-600"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex">
            {/* Main Editor */}
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-slate-900">
                {/* Line Numbers */}
                {lineNumbers && (
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 border-r border-slate-700 text-right text-gray-500 text-xs font-mono py-4">
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
                    "w-full h-full bg-transparent border-0 resize-none outline-none text-white font-mono",
                    lineNumbers && "pl-16"
                  )}
                  style={getEditorStyles()}
                  placeholder="Start typing your content..."
                  wrap={wordWrap ? "soft" : "off"}
                />
              </div>
            </div>

            {/* Right Sidebar - Settings & Tools */}
            <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 space-y-6">
              {/* Editor Settings */}
              <div className="space-y-4">
                <h4 className="text-white font-medium text-sm">EDITOR SETTINGS</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-300 text-xs block mb-1">Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as any)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    >
                      {Object.entries(THEMES).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 text-xs block mb-1">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    >
                      {Object.entries(FONT_FAMILIES).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 text-xs block mb-1">Font Size: {fontSize}px</label>
                    <Slider
                      value={[fontSize]}
                      min={8}
                      max={24}
                      step={1}
                      onValueChange={(value) => setFontSize(value[0])}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">Word Wrap</span>
                    <Switch
                      checked={wordWrap}
                      onCheckedChange={setWordWrap}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">Line Numbers</span>
                    <Switch
                      checked={lineNumbers}
                      onCheckedChange={setLineNumbers}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">Minimap</span>
                    <Switch
                      checked={minimap}
                      onCheckedChange={setMinimap}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">Auto Save</span>
                    <Switch
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* File Tools */}
              <div className="space-y-4">
                <h4 className="text-white font-medium text-sm">FILE TOOLS</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSave}
                    className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSearch(true)}
                    className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                  >
                    <Search className="w-4 h-4 mr-1" />
                    Find
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowReplace(true)}
                    className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Replace
                  </Button>
                </div>
              </div>

              {/* File Info */}
              <div className="space-y-4">
                <h4 className="text-white font-medium text-sm">FILE INFO</h4>
                
                <div className="space-y-2 text-xs text-gray-400">
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
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar - VSCode Style */}
      <div className="bg-slate-900 border-t border-slate-700 px-4 py-1 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>Ln {content.split('\n').length}, Col {content.length}</span>
          <span>{selectedType.toUpperCase()}</span>
          <span>{theme}</span>
          <span>{fontFamily}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Auto Save: {autoSave ? 'ON' : 'OFF'}</span>
          <span>Word Wrap: {wordWrap ? 'ON' : 'OFF'}</span>
          <span>Encoding: UTF-8</span>
          <span>End of Line: LF</span>
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
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-white font-medium mb-4">Find & Replace</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Find</label>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Search query..."
                  />
                </div>
                
                <div>
                  <label className="text-gray-300 text-sm block mb-1">Replace</label>
                  <Input
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Replace with..."
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowSearch(false)}
                  className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Replace logic here
                    setShowSearch(false)
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
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
"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, FileCode, Save, X, AlertCircle, CheckCircle,
  Type, Code, File, Folder, Music, Image, Video, Database, Info,
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Indent, Outdent, Link, Image as ImageIcon, Table, Code2, Palette, Eye, EyeOff,
  Settings, Download, Share2, Star, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut,
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Fullscreen, FullscreenExit,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, Filter, SortAsc, SortDesc,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedFileEditorProps {
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

export function EnhancedFileEditor({ file, onClose, onSave }: EnhancedFileEditorProps) {
  const [fileName, setFileName] = useState(file?.name || '')
  const [content, setContent] = useState(file?.content || '')
  const [selectedType, setSelectedType] = useState('text')
  const [activeTab, setActiveTab] = useState('editor')
  const [errors, setErrors] = useState<string[]>([])
  const [isValid, setIsValid] = useState(false)
  const [iconKey, setIconKey] = useState(0)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark')
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
    validateFileName()
  }, [fileName, selectedType])

  // Auto-detect file type from extension
  const detectFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    
    if (ALLOWED_EXTENSIONS.audio.includes(`.${ext}`)) return 'audio'
    if (ALLOWED_EXTENSIONS.image.includes(`.${ext}`)) return 'image'
    if (ALLOWED_EXTENSIONS.video.includes(`.${ext}`)) return 'video'
    if (ALLOWED_EXTENSIONS.database.includes(`.${ext}`)) return 'database'
    if (ALLOWED_EXTENSIONS.code.includes(`.${ext}`)) return 'code'
    if (ALLOWED_EXTENSIONS.text.includes(`.${ext}`)) return 'text'
    
    return 'text' // default
  }

  const handleFileNameChange = (newName: string) => {
    setFileName(newName)
    
    // Auto-detect and update file type with animation
    const detectedType = detectFileType(newName)
    if (detectedType !== selectedType) {
      setSelectedType(detectedType)
      setIconKey(prev => prev + 1)
    }
  }

  const validateFileName = () => {
    const newErrors: string[] = []
    
    if (!fileName.trim()) {
      newErrors.push('File name is required')
    }
    
    if (fileName.includes('/') || fileName.includes('\\')) {
      newErrors.push('File name cannot contain / or \\')
    }
    
    if (selectedType !== 'folder' && !fileName.includes('.')) {
      newErrors.push('File name should include an extension')
    }
    
    if (selectedType === 'folder' && fileName.includes('.')) {
      newErrors.push('Folder names should not include file extensions')
    }
    
    setErrors(newErrors)
    setIsValid(newErrors.length === 0)
  }

  const handleSave = () => {
    if (!isValid) return
    
    onSave(fileName, content, selectedType)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  // Search and Replace functionality
  const findMatches = (text: string, query: string): number => {
    if (!query) return 0
    const regex = new RegExp(query, 'gi')
    const matches = text.match(regex)
    return matches ? matches.length : 0
  }

  const findNext = () => {
    if (!searchQuery || !editorRef.current) return
    
    const text = editorRef.current.value
    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase(), currentMatch + 1)
    
    if (index !== -1) {
      setCurrentMatch(index)
      editorRef.current.setSelectionRange(index, index + searchQuery.length)
      editorRef.current.focus()
    } else {
      // Wrap around to beginning
      const firstIndex = text.toLowerCase().indexOf(searchQuery.toLowerCase())
      if (firstIndex !== -1) {
        setCurrentMatch(firstIndex)
        editorRef.current.setSelectionRange(firstIndex, firstIndex + searchQuery.length)
        editorRef.current.focus()
      }
    }
  }

  const findPrevious = () => {
    if (!searchQuery || !editorRef.current) return
    
    const text = editorRef.current.value
    let index = text.toLowerCase().lastIndexOf(searchQuery.toLowerCase(), currentMatch - 1)
    
    if (index === -1) {
      // Wrap around to end
      index = text.toLowerCase().lastIndexOf(searchQuery.toLowerCase())
    }
    
    if (index !== -1) {
      setCurrentMatch(index)
      editorRef.current.setSelectionRange(index, index + searchQuery.length)
      editorRef.current.focus()
    }
  }

  const replaceCurrent = () => {
    if (!searchQuery || !replaceQuery || !editorRef.current) return
    
    const text = editorRef.current.value
    const before = text.substring(0, currentMatch)
    const after = text.substring(currentMatch + searchQuery.length)
    const newText = before + replaceQuery + after
    
    setContent(newText)
    setCurrentMatch(currentMatch + replaceQuery.length - searchQuery.length)
    
    // Update total matches
    setTotalMatches(findMatches(newText, searchQuery))
  }

  const replaceAll = () => {
    if (!searchQuery || !replaceQuery || !editorRef.current) return
    
    const text = editorRef.current.value
    const regex = new RegExp(searchQuery, 'gi')
    const newText = text.replace(regex, replaceQuery)
    
    setContent(newText)
    setTotalMatches(0)
  }

  // Media controls
  const togglePlay = () => {
    if (selectedType === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else if (selectedType === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (selectedType === 'video' && videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration)
    } else if (selectedType === 'audio' && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (selectedType === 'video' && videoRef.current) {
      videoRef.current.currentTime = time
    } else if (selectedType === 'audio' && audioRef.current) {
      audioRef.current.currentTime = time
    }
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    if (selectedType === 'video' && videoRef.current) {
      videoRef.current.volume = vol
    } else if (selectedType === 'audio' && audioRef.current) {
      audioRef.current.volume = vol
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (selectedType === 'video' && videoRef.current) {
      videoRef.current.muted = !isMuted
    } else if (selectedType === 'audio' && audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Image tools
  const rotateImage = (direction: 'left' | 'right') => {
    const newRotation = direction === 'left' ? imageRotation - 90 : imageRotation + 90
    setImageRotation(newRotation)
  }

  const zoomImage = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? imageZoom * 1.2 : imageZoom / 1.2
    setImageZoom(Math.max(0.1, Math.min(5, newZoom)))
  }

  const resetImage = () => {
    setImageRotation(0)
    setImageZoom(1)
  }

  // Database tools
  const executeQuery = () => {
    // Mock query execution for demo
    console.log('Executing query:', content)
  }

  const exportData = () => {
    // Mock export for demo
    console.log('Exporting data')
  }

  const IconComponent = FILE_TYPE_ICONS[selectedType as keyof typeof FILE_TYPE_ICONS] || FileText

  if (!file) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              key={iconKey}
              initial={{ scale: 0.8, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
            >
              <IconComponent className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold text-white">Enhanced File Editor</h2>
              <p className="text-sm text-gray-400">{FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/20 border-b border-purple-500/20">
          <TabsTrigger 
            value="editor" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            <FileText className="w-4 h-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger 
            value="preview" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger 
            value="tools" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            <Settings className="w-4 h-4 mr-2" />
            Tools
          </TabsTrigger>
          <TabsTrigger 
            value="media" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            <Play className="w-4 h-4 mr-2" />
            Media
          </TabsTrigger>
          <TabsTrigger 
            value="database" 
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
          >
            <Database className="w-4 h-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>

        {/* Editor Tab */}
        <TabsContent value="editor" className="p-6 space-y-4">
          {/* File Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">File Name</label>
            <Input
              value={fileName}
              onChange={(e) => handleFileNameChange(e.target.value)}
              placeholder="Enter file name..."
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
            />
            {errors.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                {errors[0]}
              </div>
            )}
          </div>

          {/* Editor Toolbar */}
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3">
              {/* Font Size */}
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="px-3 py-1 text-sm bg-black/30 border border-purple-500/30 rounded text-white"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
                <option value={20}>20px</option>
              </select>
              
              {/* Theme */}
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="px-3 py-1 text-sm bg-black/30 border border-purple-500/30 rounded text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              
              {/* Replace */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReplace(!showReplace)}
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Replace
              </Button>
            </div>
          </div>

          {/* Search and Replace */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-black/20 rounded-xl border border-purple-500/20"
              >
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setTotalMatches(findMatches(content, e.target.value))
                      setCurrentMatch(0)
                    }}
                    className="flex-1 bg-black/30 border-purple-500/30 text-white"
                  />
                  <span className="text-sm text-gray-400">
                    {totalMatches > 0 ? `${currentMatch + 1}/${totalMatches}` : '0/0'}
                  </span>
                  <Button size="sm" onClick={findPrevious} disabled={!searchQuery}>
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={findNext} disabled={!searchQuery}>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showReplace && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-black/20 rounded-xl border border-purple-500/20"
              >
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Find..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setTotalMatches(findMatches(content, e.target.value))
                      setCurrentMatch(0)
                    }}
                    className="flex-1 bg-black/30 border-purple-500/30 text-white"
                  />
                  <Input
                    placeholder="Replace with..."
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    className="flex-1 bg-black/30 border-purple-500/30 text-white"
                  />
                  <Button size="sm" onClick={replaceCurrent} disabled={!searchQuery || !replaceQuery}>
                    Replace
                  </Button>
                  <Button size="sm" onClick={replaceAll} disabled={!searchQuery || !replaceQuery}>
                    Replace All
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Editor */}
          {selectedType !== 'folder' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Content</label>
              <Textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Enter ${FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]} content...`}
                className="min-h-[400px] font-mono text-sm bg-black/30 border-purple-500/30 text-white placeholder-gray-400 resize-none"
                style={{ fontSize: `${fontSize}px` }}
              />
            </div>
          )}
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="p-6">
          <div className="min-h-[400px] p-4 border border-purple-500/20 rounded-xl bg-black/20 overflow-auto">
            {selectedType === 'markdown' ? (
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-white">{content}</pre>
              </div>
            ) : selectedType === 'code' ? (
              <pre className="text-sm text-white" style={{ fontSize: `${fontSize}px` }}>
                <code>{content}</code>
              </pre>
            ) : (
              <div className="text-white" style={{ fontSize: `${fontSize}px` }}>
                {content}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black/20 rounded-xl border border-purple-500/20">
              <h3 className="text-lg font-medium text-white mb-3">Text Tools</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bold className="w-4 h-4 mr-2" />
                  Bold
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Italic className="w-4 h-4 mr-2" />
                  Italic
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Underline className="w-4 h-4 mr-2" />
                  Underline
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-black/20 rounded-xl border border-purple-500/20">
              <h3 className="text-lg font-medium text-white mb-3">Code Tools</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Code2 className="w-4 h-4 mr-2" />
                  Format Code
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Find References
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Lint Code
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="p-6">
          {selectedType === 'image' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Image Tools</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageTools(!showImageTools)}
                  className="border-purple-500/30 text-purple-400"
                >
                  {showImageTools ? 'Hide Tools' : 'Show Tools'}
                </Button>
              </div>
              
              <div className="relative overflow-hidden rounded-xl border border-purple-500/20">
                <img
                  ref={imageRef}
                  src={file.content}
                  alt={file.name}
                  className="w-full h-auto"
                  style={{
                    transform: `rotate(${imageRotation}deg) scale(${imageZoom})`,
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>
              
              {showImageTools && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-black/20 rounded-xl border border-purple-500/20"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" size="sm" onClick={() => rotateImage('left')}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Rotate Left
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => rotateImage('right')}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Rotate Right
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetImage}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => zoomImage('out')}>
                      <ZoomOut className="w-4 h-4 mr-2" />
                      Zoom Out
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => zoomImage('in')}>
                      <ZoomIn className="w-4 h-4 mr-2" />
                      Zoom In
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {selectedType === 'video' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Video Player</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVideoTools(!showVideoTools)}
                  className="border-purple-500/30 text-purple-400"
                >
                  {showVideoTools ? 'Hide Tools' : 'Show Tools'}
                </Button>
              </div>
              
              <div className="relative overflow-hidden rounded-xl border border-purple-500/20">
                <video
                  ref={videoRef}
                  src={file.content}
                  poster={file.thumbnail}
                  className="w-full h-auto"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={togglePlay} className="bg-purple-500 hover:bg-purple-600">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-purple-500/30 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    
                    <Button size="sm" variant="outline" onClick={toggleMute} className="border-purple-500/30 text-purple-400">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-purple-500/30 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              {showVideoTools && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-black/20 rounded-xl border border-purple-500/20"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" size="sm">
                      <SkipBack className="w-4 h-4 mr-2" />
                      Skip -10s
                    </Button>
                    <Button variant="outline" size="sm">
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip +10s
                    </Button>
                    <Button variant="outline" size="sm">
                      <Fullscreen className="w-4 h-4 mr-2" />
                      Fullscreen
                    </Button>
                    <select
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(Number(e.target.value))}
                      className="px-3 py-2 bg-black/30 border border-purple-500/30 rounded text-white"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {selectedType === 'audio' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Audio Player</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAudioTools(!showAudioTools)}
                  className="border-purple-500/30 text-purple-400"
                >
                  {showAudioTools ? 'Hide Tools' : 'Show Tools'}
                </Button>
              </div>
              
              <div className="p-6 bg-black/20 rounded-xl border border-purple-500/20">
                <audio
                  ref={audioRef}
                  src={file.content}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  className="w-full"
                />
                
                <div className="flex items-center gap-3 mt-4">
                  <Button size="lg" onClick={togglePlay} className="bg-purple-500 hover:bg-purple-600 w-16 h-16 rounded-full">
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
                  
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-purple-500/30 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>
              
              {showAudioTools && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-black/20 rounded-xl border border-purple-500/20"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" size="sm">
                      <SkipBack className="w-4 h-4 mr-2" />
                      Skip -10s
                    </Button>
                    <Button variant="outline" size="sm">
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip +10s
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Loop
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4 mr-2" />
                      Favorite
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="p-6">
          {selectedType === 'database' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Database Tools</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDatabaseTools(!showDatabaseTools)}
                  className="border-purple-500/30 text-purple-400"
                >
                  {showDatabaseTools ? 'Hide Tools' : 'Show Tools'}
                </Button>
              </div>
              
              <div className="p-4 bg-black/20 rounded-xl border border-purple-500/20">
                <h4 className="text-md font-medium text-white mb-3">SQL Query</h4>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter SQL query..."
                  className="min-h-[200px] font-mono text-sm bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                />
              </div>
              
              {showDatabaseTools && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-black/20 rounded-xl border border-purple-500/20"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" size="sm" onClick={executeQuery}>
                      <Play className="w-4 h-4 mr-2" />
                      Execute Query
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm">
                      <Database className="w-4 h-4 mr-2" />
                      Backup
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Optimize
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Check Integrity
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="bg-black/20 border-t border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
              {FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}
            </Badge>
            {isValid && (
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Valid
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save File
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
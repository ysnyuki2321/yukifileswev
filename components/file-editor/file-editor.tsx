"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Save, Download, Share2, Settings, Maximize2, Minimize2, 
  FileText, Code, Image, File, X, Check, AlertCircle,
  Copy, Undo, Redo, Search, Replace, Edit3, Type,
  ZoomIn, ZoomOut, Eye, EyeOff, FileType, FileCode,
  ChevronDown, MoreHorizontal, RotateCcw, Play, Square,
  FileImage, FileVideo, FileAudio, FileArchive, FilePdf,
  FileWord, FileSpreadsheet, FilePresentation, Database,
  Globe, Lock, Unlock, Star, StarOff
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"

interface FileEditorProps {
  file: {
    id: string
    name: string
    content: string
    type: string
    size: number
    lastModified: Date
  }
  onSave?: (content: string, newName?: string, newType?: string) => void
  onClose?: () => void
  onRename?: (newName: string) => void
  readOnly?: boolean
}

interface EditorState {
  content: string
  selection: { start: number; end: number }
  scrollPosition: { x: number; y: number }
  zoom: number
  wordWrap: boolean
  lineNumbers: boolean
  minimap: boolean
  theme: 'dark' | 'light' | 'premium'
  fontSize: number
}

// File type icons mapping
const fileTypeIcons = {
  // Code files
  'javascript': FileCode,
  'typescript': FileCode,
  'python': FileCode,
  'html': FileCode,
  'css': FileCode,
  'json': FileCode,
  'js': FileCode,
  'ts': FileCode,
  'py': FileCode,
  'jsx': FileCode,
  'tsx': FileCode,
  'vue': FileCode,
  'php': FileCode,
  'java': FileCode,
  'cs': FileCode,
  'cpp': FileCode,
  'c': FileCode,
  'go': FileCode,
  'rs': FileCode,
  'rb': FileCode,
  'swift': FileCode,
  'kt': FileCode,
  'scala': FileCode,
  'r': FileCode,
  'matlab': FileCode,
  'bash': FileCode,
  'ps1': FileCode,
  'dockerfile': FileCode,
  'gitignore': FileCode,
  'env': FileCode,
  
  // Text files
  'markdown': FileText,
  'md': FileText,
  'txt': FileText,
  'log': FileText,
  'csv': FileText,
  'xml': FileText,
  'yaml': FileText,
  'yml': FileText,
  'toml': FileText,
  'ini': FileText,
  'conf': FileText,
  
  // Image files
  'jpg': FileImage,
  'jpeg': FileImage,
  'png': FileImage,
  'gif': FileImage,
  'webp': FileImage,
  'svg': FileImage,
  'bmp': FileImage,
  'ico': FileImage,
  'tiff': FileImage,
  
  // Video files
  'mp4': FileVideo,
  'avi': FileVideo,
  'mov': FileVideo,
  'wmv': FileVideo,
  'flv': FileVideo,
  'webm': FileVideo,
  'mkv': FileVideo,
  'm4v': FileVideo,
  
  // Audio files
  'mp3': FileAudio,
  'wav': FileAudio,
  'flac': FileAudio,
  'aac': FileAudio,
  'ogg': FileAudio,
  'wma': FileAudio,
  'm4a': FileAudio,
  
  // Archive files
  'zip': FileArchive,
  'rar': FileArchive,
  '7z': FileArchive,
  'tar': FileArchive,
  'gz': FileArchive,
  'bz2': FileArchive,
  
  // Document files
  'pdf': FilePdf,
  'doc': FileWord,
  'docx': FileWord,
  'xls': FileSpreadsheet,
  'xlsx': FileSpreadsheet,
  'ppt': FilePresentation,
  'pptx': FilePresentation,
  
  // Database files
  'sql': Database,
  'db': Database,
  'sqlite': Database,
  
  // Web files
  'html': Globe,
  'htm': Globe,
  'css': Globe,
  'js': Globe,
  
  // Default
  'default': File
}

// Syntax highlighting languages
const syntaxLanguages = {
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'py': 'python',
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'css',
  'sass': 'css',
  'json': 'json',
  'md': 'markdown',
  'sql': 'sql',
  'yaml': 'yaml',
  'yml': 'yaml',
  'xml': 'xml',
  'php': 'php',
  'java': 'java',
  'cs': 'csharp',
  'cpp': 'cpp',
  'c': 'c',
  'go': 'go',
  'rs': 'rust',
  'rb': 'ruby',
  'swift': 'swift',
  'kt': 'kotlin',
  'scala': 'scala',
  'r': 'r',
  'matlab': 'matlab',
  'sh': 'bash',
  'bash': 'bash',
  'ps1': 'powershell',
  'dockerfile': 'dockerfile',
  'gitignore': 'gitignore',
  'env': 'env',
  'txt': 'plaintext',
  'log': 'plaintext',
  'csv': 'plaintext'
}

// File type colors
const fileTypeColors = {
  'javascript': 'text-yellow-400',
  'typescript': 'text-blue-400',
  'python': 'text-green-400',
  'html': 'text-orange-400',
  'css': 'text-pink-400',
  'json': 'text-purple-400',
  'markdown': 'text-blue-300',
  'sql': 'text-cyan-400',
  'yaml': 'text-red-400',
  'xml': 'text-green-300',
  'php': 'text-purple-300',
  'java': 'text-red-500',
  'csharp': 'text-purple-500',
  'cpp': 'text-blue-500',
  'c': 'text-gray-400',
  'go': 'text-cyan-500',
  'rust': 'text-orange-500',
  'ruby': 'text-red-400',
  'swift': 'text-orange-400',
  'kotlin': 'text-purple-400',
  'scala': 'text-red-500',
  'r': 'text-blue-400',
  'matlab': 'text-orange-400',
  'bash': 'text-green-400',
  'powershell': 'text-blue-400',
  'dockerfile': 'text-blue-500',
  'gitignore': 'text-gray-400',
  'env': 'text-green-400',
  'plaintext': 'text-gray-300',
  'image': 'text-green-400',
  'video': 'text-red-400',
  'audio': 'text-purple-400',
  'archive': 'text-orange-400',
  'pdf': 'text-red-500',
  'word': 'text-blue-500',
  'spreadsheet': 'text-green-500',
  'presentation': 'text-orange-500',
  'database': 'text-cyan-400',
  'web': 'text-blue-400',
  'default': 'text-gray-400'
}

export function FileEditor({ file, onSave, onClose, onRename, readOnly = false }: FileEditorProps) {
  const [editorState, setEditorState] = useState<EditorState>({
    content: file.content,
    selection: { start: 0, end: 0 },
    scrollPosition: { x: 0, y: 0 },
    zoom: 100,
    wordWrap: true,
    lineNumbers: true,
    minimap: true,
    theme: 'premium',
    fontSize: 14
  })

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [isModified, setIsModified] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [isRenaming, setIsRenaming] = useState(false)
  const [newFileName, setNewFileName] = useState(file.name)
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [selectedFileType, setSelectedFileType] = useState(getFileExtension(file.name))

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Get file extension
  function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'txt'
  }

  // Get file type icon
  function getFileTypeIcon(filename: string) {
    const ext = getFileExtension(filename)
    const IconComponent = fileTypeIcons[ext] || fileTypeIcons['default']
    return IconComponent
  }

  // Get file type color
  function getFileTypeColor(filename: string) {
    const ext = getFileExtension(filename)
    const language = syntaxLanguages[ext] || 'default'
    return fileTypeColors[language] || fileTypeColors['default']
  }

  // Get syntax language
  function getSyntaxLanguage(filename: string) {
    const ext = getFileExtension(filename)
    return syntaxLanguages[ext] || 'plaintext'
  }

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setEditorState(prev => ({ ...prev, content: newContent }))
    setIsModified(true)
    
    // Update cursor position
    const textarea = e.target
    const lines = newContent.substring(0, textarea.selectionStart).split('\n')
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    })
  }

  // Handle save
  const handleSave = async () => {
    if (isSaving) return
    
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onSave) {
        onSave(editorState.content, newFileName, selectedFileType)
      }
      
      setIsModified(false)
      setSaveStatus('saved')
      
      // Reset save status after 5 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 5000)
      
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle rename
  const handleRename = () => {
    if (newFileName.trim() && newFileName !== file.name) {
      if (onRename) {
        onRename(newFileName)
      }
      setIsRenaming(false)
    }
  }

  // Handle file type change
  const handleFileTypeChange = (newType: string) => {
    setSelectedFileType(newType)
    setShowTypeSelector(false)
    
    // Update file name with new extension
    const nameWithoutExt = newFileName.split('.').slice(0, -1).join('.')
    const newName = `${nameWithoutExt}.${newType}`
    setNewFileName(newName)
  }

  // Keyboard shortcuts
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
        case 'h':
          e.preventDefault()
          setShowSearch(true)
          setTimeout(() => searchRef.current?.focus(), 100)
          break
        case 'a':
          e.preventDefault()
          editorRef.current?.select()
          break
      }
    }
  }

  // Context menu actions
  const handleContextMenuAction = (action: string) => {
    const textarea = editorRef.current
    if (!textarea) return

    switch (action) {
      case 'undo':
        document.execCommand('undo')
        break
      case 'redo':
        document.execCommand('redo')
        break
      case 'cut':
        document.execCommand('cut')
        break
      case 'copy':
        document.execCommand('copy')
        break
      case 'paste':
        document.execCommand('paste')
        break
      case 'selectAll':
        textarea.select()
        break
    }
  }

  // Auto-save effect
  useEffect(() => {
    if (isModified && !isSaving) {
      const timer = setTimeout(() => {
        handleSave()
      }, 30000) // Auto-save after 30 seconds of inactivity
      
      return () => clearTimeout(timer)
    }
  }, [isModified, isSaving])

  const FileIcon = getFileTypeIcon(file.name)
  const fileColor = getFileTypeColor(file.name)
  const syntaxLang = getSyntaxLanguage(file.name)

  return (
    <TooltipProvider>
      <div className={cn("fixed inset-0 z-50 bg-black/80 backdrop-blur-sm", isFullscreen ? "z-[100]" : "")}>
        <Card className={cn("h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/20", isFullscreen ? "rounded-none" : "m-4 rounded-xl")}>
          {/* Header */}
          <CardHeader className="flex-shrink-0 p-4 border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {isRenaming ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <FileIcon className={cn("w-5 h-5", fileColor)} />
                    <Input
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename()
                        if (e.key === 'Escape') setIsRenaming(false)
                      }}
                      onBlur={handleRename}
                      className="flex-1 text-sm bg-transparent border-purple-500/30 focus:border-purple-500"
                      autoFocus
                    />
                    <DropdownMenu open={showTypeSelector} onOpenChange={setShowTypeSelector}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-purple-500/30">
                          <FileType className="w-4 h-4 mr-1" />
                          {selectedFileType}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-60 overflow-y-auto">
                        {Object.keys(syntaxLanguages).map((ext) => (
                          <DropdownMenuItem
                            key={ext}
                            onClick={() => handleFileTypeChange(ext)}
                            className="flex items-center space-x-2"
                          >
                            <FileIcon className="w-4 h-4" />
                            <span>{ext}</span>
                            <span className="text-xs text-gray-400">({syntaxLanguages[ext]})</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileIcon className={cn("w-5 h-5", fileColor)} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{file.name}</h3>
                      <p className="text-xs text-gray-400">{syntaxLang} • {file.size} bytes</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {/* Save Button with Animation */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving || !isModified}
                      className={cn(
                        "transition-all duration-300",
                        isModified ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" : "bg-gray-600"
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {saveStatus === 'saving' && (
                          <motion.div
                            key="saving"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center space-x-2"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </motion.div>
                            <span>Saving...</span>
                          </motion.div>
                        )}
                        {saveStatus === 'saved' && (
                          <motion.div
                            key="saved"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center space-x-2 text-green-400"
                          >
                            <Check className="w-4 h-4" />
                            <span>Saved</span>
                          </motion.div>
                        )}
                        {saveStatus === 'idle' && (
                          <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center space-x-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save file (Ctrl+S)</p>
                  </TooltipContent>
                </Tooltip>

                {/* Rename Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsRenaming(true)}
                      className="border-purple-500/30"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Rename file</p>
                  </TooltipContent>
                </Tooltip>

                {/* Settings Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSettings(!showSettings)}
                      className="border-purple-500/30"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editor settings</p>
                  </TooltipContent>
                </Tooltip>

                {/* Fullscreen Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="border-purple-500/30"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Close Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onClose}
                      className="border-red-500/30 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close editor</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Search Bar */}
            {showSearch && (
              <div className="flex items-center space-x-2 mt-3">
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    ref={searchRef}
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-sm bg-transparent border-purple-500/30"
                  />
                  <Input
                    placeholder="Replace..."
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    className="flex-1 text-sm bg-transparent border-purple-500/30"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSearch(false)}
                  className="border-purple-500/30"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="mt-3 p-3 bg-black/20 rounded-lg border border-purple-500/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-gray-400">Font Size</Label>
                    <Slider
                      value={[editorState.fontSize]}
                      onValueChange={([value]) => setEditorState(prev => ({ ...prev, fontSize: value }))}
                      min={10}
                      max={24}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editorState.wordWrap}
                      onCheckedChange={(checked) => setEditorState(prev => ({ ...prev, wordWrap: checked }))}
                    />
                    <Label className="text-xs text-gray-400">Word Wrap</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editorState.lineNumbers}
                      onCheckedChange={(checked) => setEditorState(prev => ({ ...prev, lineNumbers: checked }))}
                    />
                    <Label className="text-xs text-gray-400">Line Numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editorState.minimap}
                      onCheckedChange={(checked) => setEditorState(prev => ({ ...prev, minimap: checked }))}
                    />
                    <Label className="text-xs text-gray-400">Minimap</Label>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>

          {/* Editor Content */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="relative h-full">
                  {/* Line Numbers */}
                  {editorState.lineNumbers && (
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/20 border-r border-purple-500/20 text-xs text-gray-400 font-mono overflow-hidden">
                      {editorState.content.split('\n').map((_, index) => (
                        <div key={index} className="px-2 py-0.5 text-right">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Main Editor */}
                  <textarea
                    ref={editorRef}
                    value={editorState.content}
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                    readOnly={readOnly}
                    className={cn(
                      "w-full h-full bg-transparent text-white font-mono resize-none outline-none p-4",
                      editorState.lineNumbers && "pl-16",
                      editorState.wordWrap && "whitespace-pre-wrap",
                      "text-sm leading-relaxed"
                    )}
                    style={{ 
                      fontSize: `${editorState.fontSize}px`, 
                      fontFamily: '"Outfit", "JetBrains Mono", "Monaco", monospace'
                    }}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    data-language={syntaxLang}
                  />

                  {/* Minimap */}
                  {editorState.minimap && (
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-black/10 border-l border-purple-500/20">
                      {/* Minimap content would go here */}
                    </div>
                  )}

                  {/* Cursor Position */}
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                    Ln {cursorPosition.line}, Col {cursorPosition.column}
                  </div>
                </div>
              </ContextMenuTrigger>
              
              <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={() => handleContextMenuAction('undo')}>
                  <Undo className="w-4 h-4 mr-2" />Undo
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextMenuAction('redo')}>
                  <Redo className="w-4 h-4 mr-2" />Redo
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => handleContextMenuAction('cut')}>
                  <FileText className="w-4 h-4 mr-2" />Cut
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextMenuAction('copy')}>
                  <Copy className="w-4 h-4 mr-2" />Copy
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextMenuAction('paste')}>
                  <FileText className="w-4 h-4 mr-2" />Paste
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => handleContextMenuAction('selectAll')}>
                  <FileText className="w-4 h-4 mr-2" />Select All
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
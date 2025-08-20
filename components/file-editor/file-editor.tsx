"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Save, Download, Share2, Settings, Maximize2, Minimize2, 
  FileText, Code, Image, File, X, Check, AlertCircle,
  Copy, Undo, Redo, Search, 
  ZoomIn, ZoomOut, Eye, EyeOff,
  ChevronDown, MoreHorizontal, RotateCcw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface FileEditorProps {
  file: {
    id: string
    name: string
    content: string
    type: string
    size: number
    lastModified: Date
  }
  onSave?: (content: string) => void
  onClose?: () => void
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

const syntaxLanguages = {
  'javascript': 'js',
  'typescript': 'ts',
  'python': 'py',
  'html': 'html',
  'css': 'css',
  'json': 'json',
  'markdown': 'md',
  'sql': 'sql',
  'yaml': 'yaml',
  'xml': 'xml',
  'php': 'php',
  'java': 'java',
  'csharp': 'cs',
  'cpp': 'cpp',
  'c': 'c',
  'go': 'go',
  'rust': 'rs',
  'ruby': 'rb',
  'swift': 'swift',
  'kotlin': 'kt',
  'scala': 'scala',
  'r': 'r',
  'matlab': 'matlab',
  'bash': 'bash',
  'powershell': 'ps1',
  'dockerfile': 'dockerfile',
  'gitignore': 'gitignore',
  'env': 'env',
  'txt': 'plaintext'
}

export function FileEditor({ file, onSave, onClose, readOnly = false }: FileEditorProps) {
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
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect file type and language
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'txt'
  const language = syntaxLanguages[fileExtension] || 'plaintext'

  // Handle content changes
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setEditorState(prev => ({ ...prev, content: newContent }))
    setIsModified(true)
    
    // Update cursor position
    const textarea = e.target
    const lines = newContent.substring(0, textarea.selectionStart).split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1
    setCursorPosition({ line, column })
  }, [])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
        case 'z':
          e.preventDefault()
          // TODO: Implement undo
          break
        case 'y':
          e.preventDefault()
          // TODO: Implement redo
          break
        case 'a':
          e.preventDefault()
          editorRef.current?.select()
          break
      }
    }
  }, [])

  // Save file
  const handleSave = async () => {
    if (!onSave) return
    
    setIsSaving(true)
    try {
      await onSave(editorState.content)
      setIsModified(false)
      
      // Show success animation
      setTimeout(() => {
        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error('Save failed:', error)
      setIsSaving(false)
    }
  }

  // Context menu actions
  const handleContextMenuAction = (action: string) => {
    const textarea = editorRef.current
    if (!textarea) return

    switch (action) {
      case 'copy':
        document.execCommand('copy')
        break
      case 'cut':
        document.execCommand('cut')
        break
      case 'paste':
        document.execCommand('paste')
        break
      case 'selectAll':
        textarea.select()
        break
      case 'undo':
        document.execCommand('undo')
        break
      case 'redo':
        document.execCommand('redo')
        break
    }
  }

  // Search and replace
  const handleSearch = (direction: 'next' | 'prev' = 'next') => {
    if (!searchQuery) return
    
    const textarea = editorRef.current
    if (!textarea) return

    const content = textarea.value
    const currentPos = textarea.selectionStart
    
    let searchPos = -1
    if (direction === 'next') {
      searchPos = content.indexOf(searchQuery, currentPos)
      if (searchPos === -1) {
        searchPos = content.indexOf(searchQuery, 0)
      }
    } else {
      searchPos = content.lastIndexOf(searchQuery, currentPos - 1)
      if (searchPos === -1) {
        searchPos = content.lastIndexOf(searchQuery)
      }
    }

    if (searchPos !== -1) {
      textarea.setSelectionRange(searchPos, searchPos + searchQuery.length)
      textarea.focus()
    }
  }

  const handleReplace = () => {
    if (!searchQuery || !replaceQuery) return
    
    const textarea = editorRef.current
    if (!textarea) return

    const content = textarea.value
    const newContent = content.replace(new RegExp(searchQuery, 'g'), replaceQuery)
    
    setEditorState(prev => ({ ...prev, content: newContent }))
    setIsModified(true)
  }

  // Zoom controls
  const handleZoom = (delta: number) => {
    setEditorState(prev => ({
      ...prev,
      zoom: Math.max(50, Math.min(200, prev.zoom + delta))
    }))
  }

  // Auto-save effect
  useEffect(() => {
    if (isModified) {
      const timer = setTimeout(() => {
        handleSave()
      }, 3000) // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [editorState.content, isModified])

  return (
    <TooltipProvider>
      <div className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
        isFullscreen ? "z-[100]" : ""
      )}>
        <Card className={cn(
          "h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/20",
          isFullscreen ? "rounded-none" : "m-4 rounded-xl"
        )}>
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-purple-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-white font-medium">{file.name}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>{language.toUpperCase()}</span>
                  <span>•</span>
                  <span>{file.size.toLocaleString()} bytes</span>
                  <span>•</span>
                  <span>Line {cursorPosition.line}, Col {cursorPosition.column}</span>
                  {isModified && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">Modified</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Search */}
              {showSearch && (
                <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-2 border border-purple-500/20">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-white placeholder-gray-400 text-sm w-32 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Replace..."
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    className="bg-transparent text-white placeholder-gray-400 text-sm w-32 focus:outline-none"
                  />
                  <Button size="sm" variant="ghost" onClick={() => handleSearch('prev')}>
                    ↑
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleSearch('next')}>
                    ↓
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleReplace}>
                    Replace
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowSearch(false)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowSearch(!showSearch)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Search (Ctrl+F)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleZoom(-10)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom Out</TooltipContent>
                </Tooltip>

                <span className="text-sm text-gray-400 px-2">{editorState.zoom}%</span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleZoom(10)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom In</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onClose}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>

          {/* Settings Panel */}
          {showSettings && (
            <div className="border-b border-purple-500/20 p-4 bg-black/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Font Size</Label>
                  <Slider
                    value={[editorState.fontSize]}
                    onValueChange={([value]) => setEditorState(prev => ({ ...prev, fontSize: value }))}
                    min={10}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-400">Theme</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        {editorState.theme}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setEditorState(prev => ({ ...prev, theme: 'dark' }))}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditorState(prev => ({ ...prev, theme: 'light' }))}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditorState(prev => ({ ...prev, theme: 'premium' }))}>
                        Premium
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editorState.wordWrap}
                    onCheckedChange={(checked) => setEditorState(prev => ({ ...prev, wordWrap: checked }))}
                  />
                  <Label className="text-sm text-gray-400">Word Wrap</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editorState.lineNumbers}
                    onCheckedChange={(checked) => setEditorState(prev => ({ ...prev, lineNumbers: checked }))}
                  />
                  <Label className="text-sm text-gray-400">Line Numbers</Label>
                </div>
              </div>
            </div>
          )}

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

                  {/* Editor */}
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
                      fontFamily: '"Outfit", monospace'
                    }}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />

                  {/* Minimap */}
                  {editorState.minimap && (
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-black/10 border-l border-purple-500/20">
                      {/* Minimap content would go here */}
                    </div>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48">
                                 <ContextMenuItem onClick={() => handleContextMenuAction('undo')}>
                   <Undo className="w-4 h-4 mr-2" />
                   Undo
                 </ContextMenuItem>
                 <ContextMenuItem onClick={() => handleContextMenuAction('redo')}>
                   <Redo className="w-4 h-4 mr-2" />
                   Redo
                 </ContextMenuItem>
                 <ContextMenuSeparator />
                 <ContextMenuItem onClick={() => handleContextMenuAction('copy')}>
                   <Copy className="w-4 h-4 mr-2" />
                   Copy
                 </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => handleContextMenuAction('selectAll')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Select All
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </CardContent>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-purple-500/20 bg-black/10">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{editorState.content.length} characters</span>
              <span>•</span>
              <span>{editorState.content.split('\n').length} lines</span>
              <span>•</span>
              <span>{editorState.content.split(' ').length} words</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {/* TODO: Download */}}
                className="text-gray-400 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {/* TODO: Share */}}
                className="text-gray-400 hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !isModified}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isSaving ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
}
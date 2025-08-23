"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, FileCode, Save, Search, Settings, Download, Share2, Star,
  Eye, EyeOff, Copy, Scissors, Paste, Type, Hash, Database,
  Music, Image, Video, Folder, Archive, File, FileX, FileCheck,
  Smartphone, Monitor, ZoomIn, ZoomOut, RotateCcw, Replace
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SimpleFileEditorProps {
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
  text: { name: 'Text', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  code: { name: 'Code', icon: FileCode, color: 'from-purple-500 to-pink-500' },
  audio: { name: 'Audio', icon: Music, color: 'from-green-500 to-emerald-500' },
  image: { name: 'Image', icon: Image, color: 'from-orange-500 to-red-500' },
  video: { name: 'Video', icon: Video, color: 'from-red-500 to-pink-500' },
  database: { name: 'Database', icon: Database, color: 'from-indigo-500 to-purple-500' },
  folder: { name: 'Folder', icon: Folder, color: 'from-yellow-500 to-orange-500' },
  archive: { name: 'Archive', icon: Archive, color: 'from-gray-500 to-slate-500' }
}

export function SimpleFileEditor({ file, onSave, onClose, readOnly = false }: SimpleFileEditorProps) {
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
  const [isMobile, setIsMobile] = useState(false)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setFontSize(14)
        setLineNumbers(false) // Tắt line numbers trên mobile
      } else {
        setFontSize(16)
        setLineNumbers(true)
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

  const handleSave = () => {
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
      // Simple search highlight (in real app, you'd implement proper highlighting)
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Header */}
      <div className={cn(
        "border-b border-white/10 bg-black/20",
        isMobile ? "p-3" : "p-4"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "bg-gradient-to-r rounded-lg p-2",
              FILE_TYPES[fileType as keyof typeof FILE_TYPES]?.color || 'from-blue-500 to-cyan-500'
            )}>
              {getFileIcon()}
            </div>
            <div>
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

      {/* Toolbar */}
      <div className={cn(
        "border-b border-white/10 bg-black/10",
        isMobile ? "p-2" : "p-3"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              className="text-white hover:bg-white/10"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {!isMobile && <span className="ml-2">Preview</span>}
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

      {/* Search Panel */}
      {showSearch && (
        <div className={cn(
          "border-b border-white/10 bg-black/20",
          isMobile ? "p-3" : "p-4"
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

      {/* Editor Content */}
      <div className="flex-1 relative">
        {showPreview ? (
          <div className={cn(
            "h-full overflow-auto",
            isMobile ? "p-3" : "p-4"
          )}>
            <div className="bg-white/10 rounded-lg border border-white/20 p-4 h-full">
              <h3 className="text-white font-semibold mb-3">Preview</h3>
              <pre className="text-white whitespace-pre-wrap text-sm">{content}</pre>
            </div>
          </div>
        ) : (
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
                lineNumbers && (isMobile ? "pl-8" : "pl-16")
              )}
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                lineHeight: '1.6',
                whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
              }}
              placeholder="Start writing your content..."
            />
          </div>
        )}
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
          </div>
        </div>
      </div>
    </div>
  )
}
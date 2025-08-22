"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Upload, FolderPlus, FilePlus, Search, Grid, List,
  File, Folder, Star, Share2, MoreHorizontal, Trash2,
  Download, Eye, Edit3, Copy, Filter, SortAsc, SortDesc,
  Calendar, Clock, HardDrive, Users, Lock, Unlock,
  Link, RefreshCw, Archive, FileImage, FileVideo,
  FileAudio, FileCode, FileText, Image, Video, Music,
  Zap, Shield, Globe, Settings, BarChart3, TrendingUp,
  Database, Cloud, CloudUpload, CloudDownload, Wifi,
  WifiOff, CheckCircle, XCircle, AlertCircle, Info
} from "lucide-react"
import { FileEditor } from "@/components/file-editor/file-editor"
import { MediaPreview } from "@/components/ui/media-preview"
import { FileContextMenu } from "@/components/ui/file-context-menu"
import { useProfessionalModal } from "@/components/ui/professional-modal"
import { SimpleShareModal } from "@/components/ui/simple-share-modal"
import { AdvancedShareModal } from "@/components/ui/advanced-share-modal"
import { BreadcrumbPath } from "@/components/ui/breadcrumb-path"
import { CompressionOverlay } from "@/components/ui/compression-overlay"
import { DatabaseEditor } from "@/components/file-editor/database-editor"
import { ArchiveViewer } from "@/components/ui/archive-viewer"
import { formatBytes } from "@/lib/utils"

export interface FileItem {
  id: string
  name: string
  type: string
  size: number
  lastModified: Date
  isFolder: boolean
  content?: string
  thumbnail?: string
  isStarred?: boolean
  isShared?: boolean
  owner?: string
  path?: string
}

interface EnhancedFileManagerProps {
  files: FileItem[]
  onFileUpload?: (files: File[]) => void
  onFileEdit?: (file: FileItem) => void
  onFileDelete?: (fileId: string) => void
  onFileSave?: (file: FileItem, content: string, name?: string) => void
  onFileCreate?: (newFile: { name: string, type: string, content: string, path: string }) => void
  onFolderCreate?: (name: string) => void
  uploadProgress?: { [key: string]: number }
  uploadingFiles?: string[]
  isAdmin?: boolean
}

export function EnhancedFileManager({
  files = [],
  onFileUpload,
  onFileEdit,
  onFileDelete,
  onFileSave,
  onFileCreate,
  onFolderCreate,
  uploadProgress = {},
  uploadingFiles = [],
  isAdmin = false
}: EnhancedFileManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showMediaPreview, setShowMediaPreview] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "size" | "date">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterType, setFilterType] = useState<"all" | "images" | "videos" | "audio" | "documents" | "code">("all")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showUploadProgress, setShowUploadProgress] = useState(false)
  const [storageStats, setStorageStats] = useState({ used: 0, total: 0 })
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ file: FileItem; position: { x: number; y: number } } | null>(null)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [selectedMultiFiles, setSelectedMultiFiles] = useState<Set<string>>(new Set())
  const [showMultiActions, setShowMultiActions] = useState(false)
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; file: FileItem | null }>({ isOpen: false, file: null })
  const [advancedShareModal, setAdvancedShareModal] = useState<{ isOpen: boolean; file: FileItem | null }>({ isOpen: false, file: null })
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [compressionOverlay, setCompressionOverlay] = useState<{ isOpen: boolean; files: FileItem[] }>({ isOpen: false, files: [] })
  const [databaseEditor, setDatabaseEditor] = useState<{ isOpen: boolean; file: FileItem | null }>({ isOpen: false, file: null })
  const [archiveViewer, setArchiveViewer] = useState<{ isOpen: boolean; file: FileItem | null }>({ isOpen: false, file: null })
  
  // Professional modal system
  const { showInput, showConfirm, Modal } = useProfessionalModal()

  const getFileCategory = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp']
    const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv']
    const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a']
    const codeExts = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'html', 'css', 'scss']
    const docExts = ['pdf', 'doc', 'docx', 'txt', 'md', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx']
    
    if (imageExts.includes(ext)) return 'images'
    if (videoExts.includes(ext)) return 'videos'
    if (audioExts.includes(ext)) return 'audio'
    if (codeExts.includes(ext)) return 'code'
    if (docExts.includes(ext)) return 'documents'
    return 'other'
  }

  const filteredAndSortedFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterType === 'all' || getFileCategory(file.name) === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'size':
          comparison = a.size - b.size
          break
        case 'date':
          comparison = a.lastModified.getTime() - b.lastModified.getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleFileClick = (file: FileItem) => {
    if (file.isFolder) {
      // Handle folder navigation
      return
    }
    
    if (isDatabaseFile(file.name)) {
      setDatabaseEditor({ isOpen: true, file })
    } else if (isArchiveFile(file.name)) {
      setArchiveViewer({ isOpen: true, file })
    } else if (isTextFile(file.name)) {
      setSelectedFile(file)
      setShowEditor(true)
      onFileEdit?.(file)
    } else if (isMediaFile(file.name)) {
      setSelectedFile(file)
      setShowMediaPreview(true)
      onFileEdit?.(file)
    }
  }

  const isDatabaseFile = (filename: string): boolean => {
    const dbExtensions = ['db', 'sqlite', 'sqlite3', 'sql']
    const ext = filename.split('.').pop()?.toLowerCase()
    return dbExtensions.includes(ext || '')
  }

  const isArchiveFile = (filename: string): boolean => {
    const archiveExtensions = ['zip', 'tar', 'gz', 'tar.gz', '7z', 'rar']
    const ext = filename.split('.').pop()?.toLowerCase()
    const fullExt = filename.toLowerCase()
    return archiveExtensions.includes(ext || '') || fullExt.endsWith('.tar.gz')
  }

  // Long press handlers for mobile context menu
  const handleLongPressStart = (file: FileItem, event: React.TouchEvent | React.MouseEvent) => {
    const timer = setTimeout(() => {
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      setContextMenu({
        file,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        }
      })
      
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
    }, 500) // 500ms long press
    
    setLongPressTimer(timer)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const handleRightClick = (file: FileItem, event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenu({
      file,
      position: { x: event.clientX, y: event.clientY }
    })
  }

  // Multi-select handlers
  const toggleMultiSelect = (fileId: string) => {
    setSelectedMultiFiles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fileId)) {
        newSet.delete(fileId)
      } else {
        newSet.add(fileId)
      }
      setShowMultiActions(newSet.size > 0)
      return newSet
    })
  }

  const selectAllFiles = () => {
    const allFileIds = new Set(filteredAndSortedFiles.map(f => f.id))
    setSelectedMultiFiles(allFileIds)
    setShowMultiActions(true)
  }

  const clearSelection = () => {
    setSelectedMultiFiles(new Set())
    setShowMultiActions(false)
    setMultiSelectMode(false)
  }

  const handleMultiAction = {
    compress: () => {
      const selectedFiles = filteredAndSortedFiles.filter(f => selectedMultiFiles.has(f.id))
      setCompressionOverlay({ isOpen: true, files: selectedFiles })
      clearSelection()
    },
    delete: () => {
      const selectedFiles = filteredAndSortedFiles.filter(f => selectedMultiFiles.has(f.id))
      console.log('Deleting files:', selectedFiles.map(f => f.name))
      clearSelection()
    },
    move: () => {
      const selectedFiles = filteredAndSortedFiles.filter(f => selectedMultiFiles.has(f.id))
      console.log('Moving files:', selectedFiles.map(f => f.name))
      clearSelection()
    },
    share: () => {
      const selectedFiles = filteredAndSortedFiles.filter(f => selectedMultiFiles.has(f.id))
      console.log('Sharing files:', selectedFiles.map(f => f.name))
      clearSelection()
    }
  }

  // Context menu actions with professional modals
  const handleContextAction = {
    share: (file: FileItem) => {
      setAdvancedShareModal({ isOpen: true, file })
      setContextMenu(null)
    },
    rename: (file: FileItem) => {
      showInput("Rename File", {
        description: `Enter a new name for "${file.name}"`,
        placeholder: "New file name",
        defaultValue: file.name,
        onConfirm: (newName) => {
          if (newName && newName !== file.name) {
            console.log('Renaming:', file.name, 'to:', newName)
            // Rename logic here
          }
        }
      })
    },
    delete: (file: FileItem) => {
      showConfirm("Delete File", {
        description: `Are you sure you want to delete "${file.name}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        destructive: true,
        onConfirm: () => {
          console.log('Deleting:', file.name)
          // Delete logic here
        }
      })
    },
    download: (file: FileItem) => {
      console.log('Downloading:', file.name)
      // Download logic here
    },
    copy: (file: FileItem) => {
      navigator.clipboard.writeText(`https://yukifiles.com/share/${file.id}`)
      console.log('Copied link for:', file.name)
    },
    view: (file: FileItem) => handleFileClick(file),
    toggleStar: (file: FileItem) => {
      console.log('Toggle star:', file.name)
      // Star toggle logic here
    },
    togglePrivacy: (file: FileItem) => {
      console.log('Toggle privacy:', file.name)
      // Privacy toggle logic here
    },
    moveToFolder: (file: FileItem) => {
      showInput("Move to Folder", {
        description: `Move "${file.name}" to a different folder`,
        placeholder: "Folder path (e.g., /Documents/Projects)",
        onConfirm: (folderPath) => {
          if (folderPath) {
            console.log('Moving:', file.name, 'to:', folderPath)
            // Move logic here
          }
        }
      })
    },
    archive: (file: FileItem) => {
      console.log('Archive:', file.name)
      // Archive logic here
    },
    select: (file: FileItem) => {
      setMultiSelectMode(true)
      toggleMultiSelect(file.id)
    }
  }

  const isTextFile = (filename: string): boolean => {
    const textExtensions = [
      'txt', 'md', 'json', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss',
      'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift', 'kt',
      'xml', 'yaml', 'yml', 'sql', 'csv', 'log'
    ]
    const ext = filename.split('.').pop()?.toLowerCase()
    return textExtensions.includes(ext || '')
  }

  const isMediaFile = (filename: string): boolean => {
    const mediaExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp',
      'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv',
      'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'
    ]
    const ext = filename.split('.').pop()?.toLowerCase()
    return mediaExtensions.includes(ext || '')
  }

  const getFileIcon = (file: FileItem) => {
    if (file.isFolder) {
      return <Folder className="w-8 h-8 text-blue-400" />
    }
    
    // Show thumbnail for images/videos if available
    if (file.thumbnail && getFileCategory(file.name) === 'images') {
      return (
        <div className="w-8 h-8 rounded overflow-hidden">
          <img 
            src={file.thumbnail} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>
      )
    }
    
    if (file.thumbnail && getFileCategory(file.name) === 'videos') {
      return (
        <div className="w-8 h-8 rounded overflow-hidden relative">
          <video 
            src={file.thumbnail} 
            className="w-full h-full object-cover"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <FileVideo className="w-4 h-4 text-white" />
          </div>
        </div>
      )
    }
    
    const category = getFileCategory(file.name)
    switch (category) {
      case 'images':
        return <FileImage className="w-8 h-8 text-green-400" />
      case 'videos':
        return <FileVideo className="w-8 h-8 text-red-400" />
      case 'audio':
        return <FileAudio className="w-8 h-8 text-purple-400" />
      case 'code':
        return <FileCode className="w-8 h-8 text-yellow-400" />
      case 'documents':
        return <FileText className="w-8 h-8 text-blue-400" />
      default:
        return <File className="w-8 h-8 text-gray-400" />
    }
  }

  const handleCreateFile = () => {
    const name = prompt("Enter file name:")
    if (name && onFileCreate) {
      const newFile = {
        name,
        type: "text",
        content: "",
        path: "/"
      }
      onFileCreate(newFile)
    }
  }

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:")
    if (name) {
      onFolderCreate?.(name)
    }
  }

  const closeEditor = () => {
    setShowEditor(false)
    setSelectedFile(null)
  }

  const closeMediaPreview = () => {
    setShowMediaPreview(false)
    setSelectedFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Path */}
      <BreadcrumbPath 
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        className="mb-4"
      />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">YukiFiles Manager</h1>
          <p className="text-gray-400">{filteredAndSortedFiles.length} of {files.length} items</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreateFile} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
            <FilePlus className="w-4 h-4 mr-2" />
            New File
          </Button>
          <Button onClick={handleCreateFolder} size="sm" variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button onClick={() => setShowUploadProgress(true)} size="sm" variant="outline">
            <CloudUpload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button onClick={() => setShowAnalytics(!showAnalytics)} size="sm" variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Search, Filter and View Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-purple-500/20 text-white"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-slate-800/50 border border-purple-500/20 text-white text-sm rounded px-2 py-1"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="audio">Audio</option>
              <option value="documents">Documents</option>
              <option value="code">Code</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800/50 border border-purple-500/20 text-white text-sm rounded px-2 py-1"
            >
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="date">Date</option>
            </select>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={() => window.location.reload()} title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </Button>
            {!multiSelectMode && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setMultiSelectMode(true)}
                title="Multi-select"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
            {multiSelectMode && (
              <>
                <Button size="sm" variant="outline" onClick={selectAllFiles} title="Select All">
                  Select All
                </Button>
                <Button size="sm" variant="outline" onClick={clearSelection} title="Cancel">
                  Cancel
                </Button>
              </>
            )}
                          <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  showInput("Create New File", {
                    description: "Enter a name for the new file",
                    placeholder: "filename.txt",
                    onConfirm: (fileName) => {
                      if (fileName) {
                        console.log('Creating file:', fileName)
                        onFileCreate?.({ name: fileName, isFolder: false })
                      }
                    }
                  })
                }}
                title="New File"
              >
                <FilePlus className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">File</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  showInput("Create New Folder", {
                    description: "Enter a name for the new folder",
                    placeholder: "New Folder",
                    onConfirm: (folderName) => {
                      if (folderName) {
                        console.log('Creating folder:', folderName)
                        onFileCreate?.({ name: folderName, isFolder: true })
                      }
                    }
                  })
                }}
                title="New Folder"
              >
                <FolderPlus className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Folder</span>
              </Button>
              <Button size="sm" variant="outline" title="Storage Info">
                <HardDrive className="w-4 h-4" />
              </Button>
          </div>
        </div>
      </div>

      {/* File Grid/List */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardContent className="p-6">
          {filteredAndSortedFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold text-white mb-2">No files found</h3>
              <p className="text-gray-400">
                {searchQuery ? "Try adjusting your search query" : "Upload your first file to get started"}
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              : "space-y-2"
            }>
              {filteredAndSortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group cursor-pointer rounded-lg border transition-all duration-200 relative ${
                    selectedMultiFiles.has(file.id) 
                      ? "border-purple-500 bg-purple-500/10" 
                      : "border-gray-700 hover:border-purple-500/50"
                  } ${
                    viewMode === "grid"
                      ? "p-4 text-center bg-slate-800/30 hover:bg-slate-800/50"
                      : "p-3 flex items-center gap-3 bg-slate-800/20 hover:bg-slate-800/40"
                  }`}
                  onClick={(e) => {
                    if (multiSelectMode) {
                      e.preventDefault()
                      toggleMultiSelect(file.id)
                    } else {
                      handleFileClick(file)
                    }
                  }}
                  onContextMenu={(e) => handleRightClick(file, e)}
                  onTouchStart={(e) => handleLongPressStart(file, e)}
                  onTouchEnd={handleLongPressEnd}
                  onMouseDown={(e) => e.button === 2 ? handleLongPressStart(file, e) : undefined}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                >
                  {/* Multi-select checkbox */}
                  {multiSelectMode && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedMultiFiles.has(file.id) 
                          ? 'bg-purple-600 border-purple-600' 
                          : 'border-gray-400 bg-black/20'
                      }`}>
                        {selectedMultiFiles.has(file.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  )}
                  {viewMode === "grid" ? (
                    <>
                      <div className="mb-3">
                        {getFileIcon(file)}
                      </div>
                      <p className="text-sm text-white font-medium truncate mb-1">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {file.isFolder ? "Folder" : formatBytes(file.size)}
                      </p>
                      {file.isStarred && (
                        <Star className="w-3 h-3 text-yellow-400 mx-auto mt-1" />
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        {getFileIcon(file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {file.isFolder ? "Folder" : `${formatBytes(file.size)} • ${file.lastModified.toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {file.isStarred && (
                          <Star className="w-4 h-4 text-yellow-400" />
                        )}
                        {file.isShared && (
                          <Share2 className="w-4 h-4 text-green-400" />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle more actions
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Panel */}
      {showAnalytics && (
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              File Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{files.length}</div>
                <div className="text-sm text-gray-400">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {files.filter(f => getFileCategory(f.name) === 'images').length}
                </div>
                <div className="text-sm text-gray-400">Images</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {files.filter(f => getFileCategory(f.name) === 'documents').length}
                </div>
                <div className="text-sm text-gray-400">Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {files.filter(f => getFileCategory(f.name) === 'code').length}
                </div>
                <div className="text-sm text-gray-400">Code Files</div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-medium mb-2">Storage Usage</h4>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Used</span>
                    <span className="text-white">{formatBytes(files.reduce((acc, f) => acc + f.size, 0))}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Recent Activity</h4>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Files uploaded today: {files.filter(f => 
                        new Date(f.lastModified).toDateString() === new Date().toDateString()
                      ).length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">Total downloads: 1,234</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Share2 className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400">Shared files: {files.filter(f => f.isShared).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Editor Modal */}
      {showEditor && selectedFile && (
        <div className="fixed inset-0 z-50">
          <FileEditor
            file={{
              id: selectedFile.id,
              name: selectedFile.name,
              content: selectedFile.content || '',
              type: selectedFile.type,
              size: selectedFile.size,
              lastModified: selectedFile.lastModified
            }}
            onSave={(file, content, name) => {
              if (onFileSave) {
                onFileSave(selectedFile, content, name)
              }
              closeEditor()
            }}
            onClose={closeEditor}
            readOnly={false}
          />
        </div>
      )}

      {/* Media Preview Modal */}
      {showMediaPreview && selectedFile && (
        <MediaPreview
          file={{
            id: selectedFile.id,
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            thumbnail: selectedFile.thumbnail
          }}
          onClose={closeMediaPreview}
        />
      )}

      {/* File Context Menu */}
      <FileContextMenu
        file={contextMenu?.file}
        position={contextMenu?.position || null}
        onClose={() => setContextMenu(null)}
        onShare={handleContextAction.share}
        onRename={handleContextAction.rename}
        onDelete={handleContextAction.delete}
        onDownload={handleContextAction.download}
        onCopy={handleContextAction.copy}
        onView={handleContextAction.view}
        onToggleStar={handleContextAction.toggleStar}
        onTogglePrivacy={handleContextAction.togglePrivacy}
        onMoveToFolder={handleContextAction.moveToFolder}
        onArchive={handleContextAction.archive}
        onSelect={handleContextAction.select}
      />

      {/* Professional Modal */}
      <Modal />

            {/* Simple Share Modal */}
      {shareModal.file && (
        <SimpleShareModal
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal({ isOpen: false, file: null })}
          file={{
            id: shareModal.file.id,
            name: shareModal.file.name,
            size: shareModal.file.size
          }}
        />
      )}

      {/* Advanced Share Modal */}
      {advancedShareModal.file && (
        <AdvancedShareModal
          isOpen={advancedShareModal.isOpen}
          onClose={() => setAdvancedShareModal({ isOpen: false, file: null })}
          file={{
            id: advancedShareModal.file.id,
            name: advancedShareModal.file.name,
            size: advancedShareModal.file.size
          }}
        />
      )}

             {/* Database Editor */}
       {databaseEditor.file && (
         <DatabaseEditor
           file={{
             id: databaseEditor.file.id,
             name: databaseEditor.file.name,
             size: databaseEditor.file.size
           }}
           onClose={() => setDatabaseEditor({ isOpen: false, file: null })}
           readOnly={false}
         />
       )}

       {/* Archive Viewer */}
       {archiveViewer.file && (
         <ArchiveViewer
           isOpen={archiveViewer.isOpen}
           onClose={() => setArchiveViewer({ isOpen: false, file: null })}
           archiveFile={{
             id: archiveViewer.file.id,
             name: archiveViewer.file.name,
             size: archiveViewer.file.size || 0,
             type: archiveViewer.file.type || 'archive'
           }}
         />
       )}

       {/* Multi-select Actions Bar */}
        {showMultiActions && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4">
            <div className="bg-black/90 backdrop-blur-lg border border-purple-500/30 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 shadow-2xl max-w-[calc(100vw-2rem)]">
                          <div className="text-center sm:text-left">
                <span className="text-white text-sm font-medium">
                  {selectedMultiFiles.size} selected
                </span>
              </div>
              
              <div className="hidden sm:block w-px h-6 bg-gray-600" />
              
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  size="sm"
                  onClick={handleMultiAction.compress}
                  className="bg-purple-600 hover:bg-purple-700 text-white h-8 px-3"
                >
                  <Archive className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Compress</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMultiAction.share}
                  className="border-gray-600 text-gray-300 h-8 px-3"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMultiAction.delete}
                  className="border-red-600 text-red-400 hover:bg-red-600/10 h-8 px-3"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearSelection}
                  className="text-gray-400 hover:text-white h-8 px-3"
                >
                  Cancel
                </Button>
              </div>
          </div>
        </div>
      )}

      {/* Compression Overlay */}
      <CompressionOverlay
        isOpen={compressionOverlay.isOpen}
        onClose={() => setCompressionOverlay({ isOpen: false, files: [] })}
        files={compressionOverlay.files}
        onComplete={(archiveName, compressionType) => {
          console.log('Archive created:', archiveName, compressionType)
          // Add archive to file list with "In Archive" badge
          setCompressionOverlay({ isOpen: false, files: [] })
        }}
      />
    </div>
  )
}
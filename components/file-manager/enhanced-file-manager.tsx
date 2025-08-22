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
  WifiOff, CheckCircle, XCircle, AlertCircle, Info, X
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

export interface EnhancedFileManagerProps {
  files: any[]
  folders?: any[]
  onFileCreate?: (fileData: any) => void
  onFileUpdate?: (updatedFile: any) => void
  onFileDelete?: (fileId: string) => void
  onFileUpload?: (files: File[]) => void
  isDemoMode?: boolean
  isAdmin?: boolean
}

export function EnhancedFileManager({
  files = [],
  folders = [],
  onFileCreate,
  onFileUpdate,
  onFileDelete,
  onFileUpload,
  isDemoMode = false,
  isAdmin = false
}: EnhancedFileManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFile, setSelectedFile] = useState<any | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showMediaPreview, setShowMediaPreview] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "size" | "date">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterType, setFilterType] = useState<"all" | "images" | "videos" | "audio" | "documents" | "code">("all")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showUploadProgress, setShowUploadProgress] = useState(false)
  const [storageStats, setStorageStats] = useState({ used: 0, total: 0 })
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ file: any; position: { x: number; y: number } } | null>(null)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [selectedMultiFiles, setSelectedMultiFiles] = useState<Set<string>>(new Set())
  const [showMultiActions, setShowMultiActions] = useState(false)
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; file: any | null }>({ isOpen: false, file: null })
  const [advancedShareModal, setAdvancedShareModal] = useState<{ isOpen: boolean; file: any | null }>({ isOpen: false, file: null })
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [compressionOverlay, setCompressionOverlay] = useState<{ isOpen: boolean; files: any[] }>({ isOpen: false, files: [] })
  const [databaseEditor, setDatabaseEditor] = useState<{ isOpen: boolean; file: any | null }>({ isOpen: false, file: null })
  const [archiveViewer, setArchiveViewer] = useState<{ isOpen: boolean; file: any | null }>({ isOpen: false, file: null })
  
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

  const filteredAndSortedFiles = (files || [])
    .filter(file => {
      const matchesSearch = file?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false
      const matchesFilter = filterType === 'all' || getFileCategory(file?.name || '') === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = (a?.name || '').localeCompare(b?.name || '')
          break
        case 'size':
          comparison = (a?.size || 0) - (b?.size || 0)
          break
        case 'date':
          comparison = (a?.lastModified?.getTime() || 0) - (b?.lastModified?.getTime() || 0)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleFileClick = (file: any) => {
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
      onFileUpdate?.(file)
    } else if (isMediaFile(file.name)) {
      setSelectedFile(file)
      setShowMediaPreview(true)
      onFileUpdate?.(file)
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
  const handleLongPressStart = (file: any, event: React.TouchEvent | React.MouseEvent) => {
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

  const handleRightClick = (file: any, event: React.MouseEvent) => {
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
    const allFileIds = new Set((filteredAndSortedFiles || []).map(f => f?.id).filter(Boolean))
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
      const selectedFiles = (filteredAndSortedFiles || []).filter(f => f?.id && selectedMultiFiles.has(f.id))
      setCompressionOverlay({ isOpen: true, files: selectedFiles })
      clearSelection()
    },
    delete: () => {
      const selectedFiles = (filteredAndSortedFiles || []).filter(f => f?.id && selectedMultiFiles.has(f.id))
      console.log('Deleting files:', selectedFiles.map(f => f?.name).filter(Boolean))
      clearSelection()
    },
    move: () => {
      const selectedFiles = (filteredAndSortedFiles || []).filter(f => f?.id && selectedMultiFiles.has(f.id))
      console.log('Moving files:', selectedFiles.map(f => f?.name).filter(Boolean))
      clearSelection()
    },
    share: () => {
      const selectedFiles = (filteredAndSortedFiles || []).filter(f => f?.id && selectedMultiFiles.has(f.id))
      console.log('Sharing files:', selectedFiles.map(f => f?.name).filter(Boolean))
      clearSelection()
    }
  }

  // Context menu actions with professional modals
  const handleContextAction = {
    share: (file: any) => {
      setAdvancedShareModal({ isOpen: true, file })
      setContextMenu(null)
    },
    rename: (file: any) => {
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
    delete: (file: any) => {
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
    download: (file: any) => {
      console.log('Downloading:', file.name)
      // Download logic here
    },
    copy: (file: any) => {
      navigator.clipboard.writeText(`https://yukifiles.com/share/${file.id}`)
      console.log('Copied link for:', file.name)
    },
    view: (file: any) => handleFileClick(file),
    toggleStar: (file: any) => {
      console.log('Toggle star:', file.name)
      // Star toggle logic here
    },
    togglePrivacy: (file: any) => {
      console.log('Toggle privacy:', file.name)
      // Privacy toggle logic here
    },
    moveToFolder: (file: any) => {
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
    archive: (file: any) => {
      console.log('Archive:', file.name)
      // Archive logic here
    },
    unarchive: (file: any) => {
      showConfirm("Extract Archive", {
        description: `Extract all files from "${file.name}"? This will add the extracted files to your file manager.`,
        confirmText: "Extract",
        cancelText: "Cancel",
        onConfirm: () => {
          console.log('Extracting archive:', file.name)
          // Mock extraction - add extracted files
          const extractedFiles = [
            {
              id: `extracted-${Date.now()}-1`,
              name: 'document.pdf',
              size: 1048576,
              type: 'application/pdf',
              lastModified: new Date(),
              isFolder: false,
              isStarred: false,
              isShared: false,
              hasPassword: false,
              inArchive: false
            },
            {
              id: `extracted-${Date.now()}-2`,
              name: 'image.jpg',
              size: 512000,
              type: 'image/jpeg',
              lastModified: new Date(),
              isFolder: false,
              isStarred: false,
              isShared: false,
              hasPassword: false,
              inArchive: false
            }
          ]
          
          extractedFiles.forEach(extractedFile => {
            if (onFileCreate) {
              onFileCreate(extractedFile)
            }
          })
        }
      })
    },
    select: (file: any) => {
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

  const getFileIcon = (file: any) => {
    if (file.isFolder) {
      return (
        <div className="relative">
          <Folder className="w-12 h-12 text-blue-400 drop-shadow-2xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-lg blur-lg"></div>
        </div>
      )
    }
    
    // Show thumbnail for images/videos if available
    if (file.thumbnail && getFileCategory(file.name) === 'images') {
      return (
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 relative">
          <img 
            src={file.thumbnail} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20"></div>
        </div>
      )
    }
    
    if (file.thumbnail && getFileCategory(file.name) === 'videos') {
      return (
        <div className="w-12 h-12 rounded-xl overflow-hidden relative shadow-2xl border-2 border-white/20">
          <video 
            src={file.thumbnail} 
            className="w-full h-full object-cover"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <FileVideo className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      )
    }
    
    const category = getFileCategory(file.name)
    switch (category) {
      case 'images':
        return (
          <div className="relative">
            <FileImage className="w-12 h-12 text-green-400 drop-shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-lg blur-lg"></div>
          </div>
        )
      case 'videos':
        return (
          <div className="relative">
            <FileVideo className="w-12 h-12 text-red-400 drop-shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-pink-400/30 rounded-lg blur-lg"></div>
          </div>
        )
      case 'audio':
        return (
          <div className="relative">
            <FileAudio className="w-12 h-12 text-purple-400 drop-shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-lg blur-lg animate-pulse"></div>
          </div>
        )
      case 'code':
        return (
          <div className="relative">
            <FileCode className="w-12 h-12 text-yellow-400 drop-shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-lg blur-lg"></div>
          </div>
        )
      case 'documents':
        return (
          <div className="relative">
            <FileText className="w-12 h-12 text-blue-400 drop-shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-lg blur-lg"></div>
          </div>
        )
      default:
        return (
          <div className="relative">
            <File className="w-12 h-12 text-gray-400 drop-shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-slate-400/30 rounded-lg blur-lg"></div>
          </div>
        )
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
      // Assuming onFileCreate can handle folder creation
      const newFolder = {
        name,
        type: "folder",
        content: "",
        path: "/"
      }
      onFileCreate(newFolder)
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
      <div className="flex flex-col gap-4 items-start justify-between">
        <div className="w-full">
          <h1 className="text-mobile-h2 font-bold text-white">YukiFiles Manager</h1>
          <p className="text-mobile-body text-gray-400">{filteredAndSortedFiles?.length || 0} of {files?.length || 0} items</p>
        </div>
        
        {/* Mobile-First Action Buttons */}
        <div className="w-full space-y-4">
          {/* Primary Actions - Always Visible */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
            <Button onClick={handleCreateFile} size="sm" className="btn-gradient-primary min-h-[48px] flex-1 sm:flex-none">
              <FilePlus className="w-4 h-4 mr-2" />
              <span className="text-sm">New File</span>
            </Button>
            <Button onClick={handleCreateFolder} size="sm" variant="outline" className="min-h-[48px] flex-1 sm:flex-none border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
              <FolderPlus className="w-4 h-4 mr-2" />
              <span className="text-sm">New Folder</span>
            </Button>
          </div>
          
          {/* Secondary Actions - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button onClick={() => setShowUploadProgress(true)} size="sm" variant="outline" className="min-h-[44px] border-gray-600 text-gray-300 hover:bg-gray-600/10">
              <CloudUpload className="w-4 h-4 mr-2" />
              <span className="text-sm">Upload</span>
            </Button>
            <Button onClick={() => setShowAnalytics(!showAnalytics)} size="sm" variant="outline" className="min-h-[44px] border-gray-600 text-gray-300 hover:bg-gray-600/10">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                console.log('Refreshing file list...')
                if (onFileUpload) {
                  window.dispatchEvent(new CustomEvent('refreshFileList'))
                }
              }} 
              title="Refresh Files"
              className="min-h-[44px] border-gray-600 text-gray-300 hover:bg-gray-600/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="text-sm">Refresh</span>
            </Button>
            {!multiSelectMode ? (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setMultiSelectMode(true)}
                title="Multi-select"
                className="min-h-[44px] border-gray-600 text-gray-300 hover:bg-gray-600/10"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Select</span>
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={clearSelection}
                title="Cancel"
                className="min-h-[44px] border-red-600 text-red-400 hover:bg-red-600/10"
              >
                <span className="text-sm">Cancel</span>
              </Button>
            )}
          </div>

          {/* Multi-select Actions - Full Width on Mobile */}
          {multiSelectMode && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button size="sm" variant="outline" onClick={selectAllFiles} title="Select All" className="min-h-[44px] border-gray-600 text-gray-300 hover:bg-gray-600/10">
                <span className="text-sm">Select All</span>
              </Button>
              <Button size="sm" variant="outline" onClick={handleMultiAction.compress} title="Compress" className="min-h-[44px] border-purple-600 text-purple-400 hover:bg-purple-600/10">
                <Archive className="w-4 h-4 mr-2" />
                <span className="text-sm">Compress</span>
              </Button>
              <Button size="sm" variant="outline" onClick={handleMultiAction.share} title="Share" className="min-h-[44px] border-gray-600 text-gray-300 hover:bg-gray-600/10">
                <Share2 className="w-4 h-4 mr-2" />
                <span className="text-sm">Share</span>
              </Button>
              <Button size="sm" variant="outline" onClick={handleMultiAction.delete} title="Delete" className="min-h-[44px] border-red-600 text-red-400 hover:bg-red-600/10">
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="text-sm">Delete</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search, Filter and View Controls */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          {/* Mobile Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-purple-500/20 text-white min-h-[48px] text-base"
            />
          </div>
          
          {/* View and Filter Controls - Mobile Optimized */}
          <div className="space-y-4">
            {/* View Mode - Horizontal on Mobile */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className="min-h-[44px] flex-1 sm:flex-none"
              >
                <Grid className="w-4 h-4 mr-2" />
                <span className="text-sm">Grid</span>
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                title="List View"
                className="min-h-[44px] flex-1 sm:flex-none"
              >
                <List className="w-4 h-4 mr-2" />
                <span className="text-sm">List</span>
              </Button>
            </div>

            {/* Filters - Stacked on Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-slate-800/50 border border-purple-500/20 text-white text-base rounded px-3 py-2 flex-1 min-h-[44px]"
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
                <span className="text-sm text-gray-400 flex-shrink-0">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-800/50 border border-purple-500/20 text-white text-base rounded px-3 py-2 flex-1 min-h-[44px]"
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
                  className="min-h-[44px] min-w-[44px] border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Grid/List */}
      <Card className="glass-card">
        <CardContent className="p-4 sm:p-6">
          {(filteredAndSortedFiles?.length || 0) === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <File className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No files found</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {searchQuery ? "Try adjusting your search query" : "Upload your first file to get started"}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-3"
            }>
              {(filteredAndSortedFiles || []).map((file) => file && (
                <div
                  key={file.id}
                  className={`group cursor-pointer rounded-xl border transition-all duration-300 relative hover:scale-105 hover:shadow-2xl ${
                    selectedMultiFiles.has(file.id) 
                      ? "border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/10 shadow-lg shadow-purple-500/25" 
                      : "border-gray-700/30 hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-slate-800/40 hover:to-slate-900/60"
                  } ${
                    viewMode === "grid"
                      ? "p-4 sm:p-6 text-center bg-gradient-to-br from-slate-800/20 to-slate-900/30 min-h-[180px] sm:min-h-[200px] flex flex-col items-center justify-center backdrop-blur-sm"
                      : "p-4 flex items-center gap-4 bg-slate-800/20 min-h-[72px]"
                  }`}
                  onClick={(e) => {
                    if (multiSelectMode) {
                      e.preventDefault()
                      toggleMultiSelect(file.id)
                      return
                    }
                    handleFileClick(file)
                  }}
                  onContextMenu={(e) => handleRightClick(file, e)}
                  onTouchStart={(e) => handleLongPressStart(file, e)}
                  onTouchEnd={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                >
                  {/* Multi-select checkbox */}
                  {multiSelectMode && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                        selectedMultiFiles.has(file.id)
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 shadow-lg'
                          : 'bg-black/60 border-gray-400'
                      }`}>
                        {selectedMultiFiles.has(file.id) && (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* File status badges - Floating */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 sm:gap-2">
                    {file.isStarred && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current" />
                      </div>
                    )}
                    {file.hasPassword && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                    {file.isShared && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {viewMode === "grid" ? (
                    // Grid View - Mobile Optimized
                    <>
                      <div className="mb-3 sm:mb-4 relative">
                        <div className="transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
                          <div className="w-10 h-10 sm:w-12 sm:h-12">
                            {getFileIcon(file)}
                          </div>
                        </div>
                        {/* File type indicator with glow */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="space-y-2 text-center">
                        <p className="text-white text-xs sm:text-sm font-semibold truncate px-2 leading-tight" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {formatBytes(file.size)}
                        </p>
                        <div className="flex justify-center items-center gap-1 mt-2 sm:mt-3">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-400 rounded-full animate-pulse delay-100"></div>
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View - Mobile Optimized
                    <>
                      <div className="flex-shrink-0">
                        <div className="transform transition-all duration-300 group-hover:scale-110">
                          <div className="w-8 h-8 sm:w-12 sm:h-12">
                            {getFileIcon(file)}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm sm:text-base font-semibold truncate" title={file.name}>
                              {file.name}
                            </p>
                            <div className="flex items-center space-x-2 sm:space-x-4 mt-1">
                              <p className="text-gray-400 text-xs sm:text-sm">
                                {formatBytes(file.size)}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {new Date(file.lastModified).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4">
                            {/* Status indicators with animations */}
                            {file.isStarred && (
                              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current animate-pulse" />
                            )}
                            {file.isShared && (
                              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                            )}
                            {file.hasPassword && (
                              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                            )}
                            {/* More options with hover effect */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRightClick(file, e)
                              }}
                              className="p-1 sm:p-2 text-gray-400 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg hover:scale-110"
                            >
                              <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
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
                <div className="text-2xl font-bold text-purple-400">{files?.length || 0}</div>
                <div className="text-sm text-gray-400">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {files?.filter(f => getFileCategory(f.name) === 'images')?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Images</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {files?.filter(f => getFileCategory(f.name) === 'documents')?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {files?.filter(f => getFileCategory(f.name) === 'code')?.length || 0}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeEditor}></div>
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-xl border border-purple-500/30 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <h3 className="text-lg font-semibold text-white">Editing: {selectedFile.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeEditor}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <FileEditor
                isOpen={true}
                onClose={closeEditor}
                onSave={(file, content, name) => {
                  if (onFileUpdate) {
                    onFileUpdate({ ...selectedFile, content, name: name || selectedFile.name })
                  }
                  closeEditor()
                }}
                initialFileName={selectedFile.name}
                initialContent={selectedFile.content || ''}
                fileType={isTextFile(selectedFile.name) ? 'text' : 'code'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {showMediaPreview && selectedFile && (
        <MediaPreview
          file={{
            id: selectedFile.id,
            name: selectedFile.name,
            type: selectedFile.type,
            content: selectedFile.content || selectedFile.thumbnail || '',
            thumbnail: selectedFile.thumbnail,
            size: selectedFile.size,
            artist: selectedFile.artist,
            album: selectedFile.album,
            albumArt: selectedFile.albumArt
          }}
          onDownload={() => {
            console.log('Downloading:', selectedFile.name)
            closeMediaPreview()
          }}
          onShare={() => {
            setAdvancedShareModal({ isOpen: true, file: selectedFile })
            closeMediaPreview()
          }}
          onLike={() => {
            console.log('Liked:', selectedFile.name)
          }}
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
        onUnarchive={handleContextAction.unarchive}
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
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-md">
          <div className="bg-black/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="text-center sm:text-left">
                <span className="text-white text-sm font-medium">
                  {selectedMultiFiles.size} selected
                </span>
              </div>
              
              <div className="hidden sm:block w-px h-6 bg-gray-600" />
              
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  onClick={handleMultiAction.compress}
                  className="btn-gradient-primary h-8 px-3 text-xs sm:text-sm"
                >
                  <Archive className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span>Compress</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMultiAction.share}
                  className="border-gray-600 text-gray-300 h-8 px-3 text-xs sm:text-sm hover:bg-gray-600/10"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span>Share</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMultiAction.delete}
                  className="border-red-600 text-red-400 hover:bg-red-600/10 h-8 px-3 text-xs sm:text-sm"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span>Delete</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearSelection}
                  className="text-gray-400 hover:text-white h-8 px-3 text-xs sm:text-sm"
                >
                  Cancel
                </Button>
              </div>
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
          
          // Add new archive file to the list
          const newArchiveFile = {
            id: `archive-${Date.now()}`,
            name: `${archiveName}.${compressionType}`,
            size: compressionOverlay.files.reduce((acc, f) => acc + (f.size || 0), 0) * 0.4, // 40% compression
            type: compressionType === 'zip' ? 'application/zip' : 
                  compressionType === '7z' ? 'application/x-7z-compressed' :
                  'application/gzip',
            lastModified: new Date(),
            isFolder: false,
            isStarred: false,
            isShared: false,
            hasPassword: false,
            inArchive: true,
            thumbnail: undefined
          }
          
          // Add to files list
          if (onFileCreate) {
            onFileCreate(newArchiveFile)
          }
          
          setCompressionOverlay({ isOpen: false, files: [] })
        }}
      />
    </div>
  )
}
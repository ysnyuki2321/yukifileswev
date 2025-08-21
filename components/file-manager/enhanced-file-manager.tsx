"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Filter, Grid, List, MoreHorizontal, 
  FileText, Image, Video, Music, Archive, Code, File,
  Eye, Download, Share2, Edit3, Trash2, Star, Clock, User,
  Folder, FolderOpen, ChevronRight, ChevronDown, Home,
  RefreshCw, Settings, SortAsc, SortDesc, FileArchive, FileSpreadsheet,
  Plus, FolderPlus, FilePlus, Upload
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { EnhancedUpload } from "./enhanced-upload"
import { FileEditor } from "../file-editor/file-editor"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LucideIcon } from "lucide-react"
import { toast } from "sonner"

interface FileItem {
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
  path: string
}

interface EnhancedFileManagerProps {
  files?: FileItem[]
  onFileSelect?: (file: FileItem) => void
  onFileEdit?: (file: FileItem) => void
  onFileDelete?: (fileId: string) => void
  onFileShare?: (fileId: string) => void
  onFileDownload?: (fileId: string) => void
  onFileUpload?: (files: File[]) => void
  onFileCreate?: (file: { name: string, type: string, content: string, path: string }) => void
  onFolderCreate?: (folder: { name: string, path: string }) => void
  onFileRename?: (fileId: string, newName: string) => void
  onFileCopy?: (fileId: string) => void
  onFileMove?: (fileId: string, newPath: string) => void
  className?: string
}

const fileTypeIcons: { [key: string]: LucideIcon } = {
  'image': Image,
  'video': Video,
  'audio': Music,
  'document': FileText,
  'archive': FileArchive,
  'spreadsheet': FileSpreadsheet,
  'presentation': FileText,
  'default': FileText
}

const getFileType = (fileName: string, mimeType?: string): string => {
  if (!fileName || typeof fileName !== 'string') return 'default'
  
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive'
    if (mimeType.includes('javascript') || mimeType.includes('python') || mimeType.includes('java') || 
        mimeType.includes('cpp') || mimeType.includes('csharp') || mimeType.includes('php') ||
        mimeType.includes('html') || mimeType.includes('css') || mimeType.includes('json') ||
        mimeType.includes('xml') || mimeType.includes('yaml') || mimeType.includes('sql')) return 'code'
    if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('excel') || 
        mimeType.includes('powerpoint')) return 'document'
    if (mimeType.includes('text/')) return 'text'
  }
  
  if (extension) {
    const codeExtensions = ['js', 'ts', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'html', 'css', 'json', 'xml', 'yaml', 'sql', 'md']
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
    const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg']
    const archiveExtensions = ['zip', 'rar', 'tar', 'gz', '7z']
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
    
    if (codeExtensions.includes(extension)) return 'code'
    if (imageExtensions.includes(extension)) return 'image'
    if (videoExtensions.includes(extension)) return 'video'
    if (audioExtensions.includes(extension)) return 'audio'
    if (archiveExtensions.includes(extension)) return 'archive'
    if (documentExtensions.includes(extension)) return 'document'
  }
  
  return 'default'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export function EnhancedFileManager({
  files = [],
  onFileSelect,
  onFileEdit,
  onFileDelete,
  onFileShare,
  onFileDownload,
  onFileUpload,
  onFileCreate,
  onFolderCreate,
  className
}: EnhancedFileManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'type'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState('/')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [editingFile, setEditingFile] = useState<FileItem | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createType, setCreateType] = useState<'file' | 'folder'>('file')
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState('txt')
  const [newFileContent, setNewFileContent] = useState('')
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [renamingFile, setRenamingFile] = useState<FileItem | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [copiedFiles, setCopiedFiles] = useState<string[]>([])
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [movingFile, setMovingFile] = useState<FileItem | null>(null)

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter(file => {
      if (!file.name) return false
      if (!searchQuery || searchQuery.trim() === '') return file.path.startsWith(currentPath)
      return file.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
             file.path.startsWith(currentPath)
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '')
          break
        case 'size':
          comparison = a.size - b.size
          break
        case 'date':
          comparison = a.lastModified.getTime() - b.lastModified.getTime()
          break
        case 'type':
          comparison = getFileType(a.name || '').localeCompare(getFileType(b.name || ''))
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Handle file selection
  const handleFileClick = useCallback((file: FileItem) => {
    if (file.isFolder) {
      if (expandedFolders.has(file.id)) {
        setExpandedFolders(prev => {
          const newSet = new Set(prev)
          newSet.delete(file.id)
          return newSet
        })
      } else {
        setExpandedFolders(prev => new Set(prev).add(file.id))
      }
      setCurrentPath(file.path)
    } else {
      // Check if it's a text file that can be edited
      const fileType = getFileType(file.name || '')
      if (['text', 'code', 'document'].includes(fileType)) {
        setEditingFile(file)
      } else {
        onFileSelect?.(file)
      }
    }
  }, [expandedFolders, onFileSelect])

  // Handle file actions
  const handleFileAction = useCallback((action: string, file: FileItem) => {
    switch (action) {
      case 'edit':
        setEditingFile(file)
        break
      case 'download':
        onFileDownload?.(file.id)
        break
      case 'share':
        onFileShare?.(file.id)
        break
      case 'delete':
        onFileDelete?.(file.id)
        break
      case 'star':
        // Implement star functionality
        setFiles(prev => prev.map(file => 
          file.id === selectedFiles[0] 
            ? { ...file, isStarred: !file.isStarred } 
            : file
        ))
        toast.success("File starred!", `${files.find(f => f.id === selectedFiles[0])?.name} has been ${files.find(f => f.id === selectedFiles[0])?.isStarred ? 'unstarred' : 'starred'}.`)
        break
    }
  }, [onFileDownload, onFileShare, onFileDelete, files, selectedFiles])

  // Handle create file/folder
  const handleCreate = useCallback(() => {
    if (!newFileName.trim()) return

    const fileName = createType === 'file' 
      ? (newFileName.includes('.') ? newFileName : `${newFileName}.${newFileType}`)
      : newFileName

    const newItem: FileItem = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: fileName,
      type: createType === 'file' ? `text/${newFileType}` : 'folder',
      size: createType === 'file' ? (newFileContent?.length || 0) : 0,
      lastModified: new Date(),
      isFolder: createType === 'folder',
      content: createType === 'file' ? newFileContent : undefined,
      path: currentPath,
      isStarred: false,
      isShared: false,
      owner: 'demo@yukifiles.com'
    }

    // Add to files list (demo mode - will reset on page reload)
    if (onFileCreate && createType === 'file') {
      onFileCreate({
        name: fileName,
        type: newFileType,
        content: newFileContent,
        path: currentPath
      })
    } else if (onFolderCreate && createType === 'folder') {
      onFolderCreate({
        name: fileName,
        path: currentPath
      })
    }

    // Add to local state for immediate UI update
    const updatedFiles = [...files, newItem]
    // Update parent component if callback exists
    if (onFileUpload) {
      onFileUpload([])  // Trigger refresh
    }

    // Reset form and close dialog
    setShowCreateDialog(false)
    setNewFileName('')
    setNewFileContent('')
    setNewFileType('txt')
    
    toast.success(
      `${createType === 'file' ? 'File' : 'Folder'} created!`, 
      `${fileName} has been created successfully. Note: This is demo mode - changes will reset on page reload.`
    )
  }, [newFileName, createType, newFileType, newFileContent, currentPath, files, onFileCreate, onFolderCreate, onFileUpload])

  // Handle file save
  const handleFileSave = useCallback(async (content: string) => {
    if (editingFile) {
      // Implement actual save functionality
      try {
        const response = await fetch('/api/files/update-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: editingFile.id,
            content: content,
            fileName: editingFile.name || 'untitled'
          })
        })

        if (response.ok) {
          console.log('File saved successfully:', editingFile.name || 'untitled', content)
          toast.success("File saved!", "Your changes have been saved successfully.")
          setEditingFile(null)
          // setEditContent('') // This state variable doesn't exist in the original file
        } else {
          throw new Error('Failed to save file')
        }
      } catch (error) {
        console.error('Save failed:', error)
        toast.error("Save failed", "Unable to save your changes. Please try again.")
      }
    }
  }, [editingFile])

  // Get file icon
  const getFileIcon = (file: FileItem) => {
    if (file.isFolder) {
      return expandedFolders.has(file.id) ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />
    }
    
    const fileType = getFileType(file.name || '')
    const Icon = fileTypeIcons[fileType] || fileTypeIcons.default
    return <Icon className="w-5 h-5" />
  }

  // Breadcrumb navigation
  const breadcrumbs = currentPath.split('/').filter(Boolean)

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-2xl font-bold text-white">Files</h2>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {filteredAndSortedFiles.length} items
            </Badge>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <EnhancedUpload
              onUpload={async (uploadFiles) => {
                // Handle actual upload
                try {
                  const uploadPromises = uploadFiles.map(async (file) => {
                    const formData = new FormData()
                    formData.append('file', file)
                    
                    const response = await fetch('/api/files/upload', {
                      method: 'POST',
                      body: formData
                    })
                    
                    if (!response.ok) {
                      throw new Error(`Upload failed for ${file.name}`)
                    }
                    
                    return response.json()
                  })
                  
                  const results = await Promise.all(uploadPromises)
                  console.log('Upload files completed:', results)
                  toast.success("Upload complete!", `${uploadFiles.length} file(s) uploaded successfully.`)
                  
                  // Refresh file list
                  // You might want to call a refresh function here
                } catch (error) {
                  console.error('Upload error:', error)
                  toast.error("Upload failed", "Some files could not be uploaded. Please try again.")
                }
              }}
              storageQuota={2 * 1024 * 1024 * 1024} // 2GB
              usedStorage={files.reduce((sum, file) => sum + file.size, 0)}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-purple-500/20 text-purple-300 touch-manipulation">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-gray-700 text-white">
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10">Preferences</DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10">Keyboard Shortcuts</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10">About</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPath('/')}
            className="text-gray-400 hover:text-white p-1"
          >
            <Home className="w-4 h-4" />
          </Button>
          
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb}>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const path = '/' + breadcrumbs.slice(0, index + 1).join('/')
                  setCurrentPath(path)
                }}
                className="text-gray-400 hover:text-white"
              >
                {crumb}
              </Button>
            </React.Fragment>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64 bg-black/20 border-purple-500/20 text-white placeholder-gray-400"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-purple-500/20 text-purple-300 touch-manipulation">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort by {sortBy}
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 ml-2" /> : <SortDesc className="w-4 h-4 ml-2" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-gray-700 text-white">
                <DropdownMenuItem onClick={() => setSortBy('name')} className="text-gray-300 hover:text-white hover:bg-white/10">
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('size')} className="text-gray-300 hover:text-white hover:bg-white/10">
                  Size
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date')} className="text-gray-300 hover:text-white hover:bg-white/10">
                  Date Modified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('type')} className="text-gray-300 hover:text-white hover:bg-white/10">
                  Type
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="text-gray-300 hover:text-white hover:bg-white/10">
                  {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-purple-500 text-white' : 'border-purple-500/20 text-purple-300'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Grid View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-purple-500 text-white' : 'border-purple-500/20 text-purple-300'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List View</TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCreateType('file')
                setShowCreateDialog(true)
                setNewFileName('')
                setNewFileContent('')
              }}
              className="border-purple-500/20 text-purple-300 hover:border-purple-400 hover:text-purple-200"
            >
              <FilePlus className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCreateType('folder')
                setShowCreateDialog(true)
                setNewFileName('')
              }}
              className="border-purple-500/20 text-purple-300 hover:border-purple-400 hover:text-purple-200"
            >
              <FolderPlus className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Internal refresh instead of web reload
                toast.success("Files refreshed", "File list has been updated")
                // Trigger a re-render by updating a state
                setSearchQuery("")
                setSelectedFiles([])
                setCurrentPath("/")
              }}
              className="border-purple-500/20 text-purple-300 hover:border-purple-400 hover:text-purple-200"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* File Grid/List */}
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
            : "space-y-2"
        )}>
          <AnimatePresence>
            {filteredAndSortedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <div
                      className={cn(
                        "group cursor-pointer transition-all duration-200",
                        viewMode === 'grid'
                          ? "p-4 rounded-lg border border-purple-500/20 bg-black/20 hover:bg-purple-500/10 hover:border-purple-500/40"
                          : "flex items-center space-x-4 p-3 rounded-lg border border-purple-500/20 bg-black/20 hover:bg-purple-500/10 hover:border-purple-500/40"
                      )}
                      onClick={() => handleFileClick(file)}
                    >
                      {viewMode === 'grid' ? (
                        <div className="text-center space-y-2">
                          <div className="flex justify-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-purple-400">
                              {getFileIcon(file)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-white text-sm font-medium truncate" title={file.name || 'Untitled'}>
                              {file.name || 'Untitled'}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {file.isFolder ? 'Folder' : formatFileSize(file.size)}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {formatDate(file.lastModified)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-purple-400">
                              {getFileIcon(file)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-white font-medium truncate">{file.name || 'Untitled'}</p>
                              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <span>{file.isFolder ? 'Folder' : formatFileSize(file.size)}</span>
                                <span>•</span>
                                <span>{formatDate(file.lastModified)}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Quick Actions */}
                      <div className={cn(
                        "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        viewMode === 'list' && "relative top-0 right-0 opacity-100"
                      )}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70 touch-manipulation"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-black/90 border-gray-700 text-white">
                            <DropdownMenuItem onClick={() => handleFileAction('edit', file)} className="text-gray-300 hover:text-white hover:bg-white/10">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileAction('download', file)} className="text-gray-300 hover:text-white hover:bg-white/10">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileAction('share', file)} className="text-gray-300 hover:text-white hover:bg-white/10">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem onClick={() => handleFileAction('delete', file)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileAction('star', file)} className="text-gray-300 hover:text-white hover:bg-white/10">
                              <Star className="w-4 h-4 mr-2" />
                              {file.isStarred ? 'Unstar' : 'Star'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="bg-black/90 border-gray-700 text-white">
                    <ContextMenuItem onClick={() => handleFileClick(file)} className="text-gray-300 hover:text-white hover:bg-white/10">
                      <Eye className="w-4 h-4 mr-2" />
                      Open
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleFileAction('edit', file)} className="text-gray-300 hover:text-white hover:bg-white/10">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </ContextMenuItem>
                    <ContextMenuSeparator className="bg-gray-700" />
                    <ContextMenuItem onClick={() => handleFileAction('download', file)} className="text-gray-300 hover:text-white hover:bg-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleFileAction('share', file)} className="text-gray-300 hover:text-white hover:bg-white/10">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </ContextMenuItem>
                    <ContextMenuSeparator className="bg-gray-700" />
                    <ContextMenuItem onClick={() => handleFileAction('delete', file)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleFileAction('star', file)} className="text-gray-300 hover:text-white hover:bg-white/10">
                      <Star className="w-4 h-4 mr-2" />
                      {file.isStarred ? 'Unstar' : 'Star'}
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAndSortedFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No files found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowUpload(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Upload Files
              </Button>
            )}
          </div>
        )}

        {/* Create File/Folder Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-slate-900 border-purple-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">
                Create New {createType === 'file' ? 'File' : 'Folder'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {createType === 'file' 
                  ? 'Create a new file with optional content' 
                  : 'Create a new folder to organize your files'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fileName" className="text-gray-300">
                  {createType === 'file' ? 'File Name' : 'Folder Name'}
                </Label>
                <Input
                  id="fileName"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder={createType === 'file' ? 'example.txt' : 'New Folder'}
                  className="bg-slate-800 border-purple-500/20 text-white"
                />
              </div>
              {createType === 'file' && (
                <>
                  <div>
                    <Label htmlFor="fileType" className="text-gray-300">File Type</Label>
                    <Select value={newFileType} onValueChange={setNewFileType}>
                      <SelectTrigger className="bg-slate-800 border-purple-500/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/20 max-h-60 overflow-y-auto">
                        <SelectItem value="txt">📄 Plain Text (.txt)</SelectItem>
                        <SelectItem value="js">🟨 JavaScript (.js)</SelectItem>
                        <SelectItem value="ts">🔵 TypeScript (.ts)</SelectItem>
                        <SelectItem value="jsx">⚛️ React JSX (.jsx)</SelectItem>
                        <SelectItem value="tsx">⚛️ React TSX (.tsx)</SelectItem>
                        <SelectItem value="html">🌐 HTML (.html)</SelectItem>
                        <SelectItem value="css">🎨 CSS (.css)</SelectItem>
                        <SelectItem value="scss">🎨 SCSS (.scss)</SelectItem>
                        <SelectItem value="json">📋 JSON (.json)</SelectItem>
                        <SelectItem value="md">📝 Markdown (.md)</SelectItem>
                        <SelectItem value="py">🐍 Python (.py)</SelectItem>
                        <SelectItem value="java">☕ Java (.java)</SelectItem>
                        <SelectItem value="cpp">⚙️ C++ (.cpp)</SelectItem>
                        <SelectItem value="c">⚙️ C (.c)</SelectItem>
                        <SelectItem value="cs">🔷 C# (.cs)</SelectItem>
                        <SelectItem value="php">🐘 PHP (.php)</SelectItem>
                        <SelectItem value="go">🐹 Go (.go)</SelectItem>
                        <SelectItem value="rs">🦀 Rust (.rs)</SelectItem>
                        <SelectItem value="swift">🍎 Swift (.swift)</SelectItem>
                        <SelectItem value="kt">🟣 Kotlin (.kt)</SelectItem>
                        <SelectItem value="rb">💎 Ruby (.rb)</SelectItem>
                        <SelectItem value="sh">🐚 Shell (.sh)</SelectItem>
                        <SelectItem value="vue">💚 Vue.js (.vue)</SelectItem>
                        <SelectItem value="svelte">🧡 Svelte (.svelte)</SelectItem>
                        <SelectItem value="dart">🎯 Dart (.dart)</SelectItem>
                        <SelectItem value="xml">📄 XML (.xml)</SelectItem>
                        <SelectItem value="yaml">📄 YAML (.yaml)</SelectItem>
                        <SelectItem value="sql">🗄️ SQL (.sql)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fileContent" className="text-gray-300">Initial Content (Optional)</Label>
                    <Textarea
                      id="fileContent"
                      value={newFileContent}
                      onChange={(e) => setNewFileContent(e.target.value)}
                      placeholder="Enter initial file content..."
                      className="bg-slate-800 border-purple-500/20 text-white font-mono"
                      rows={4}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!newFileName.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Create {createType === 'file' ? 'File' : 'Folder'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* File Editor Modal */}
        <AnimatePresence>
          {editingFile && (
            <FileEditor
              file={{
                id: editingFile.id,
                name: editingFile.name || 'untitled.txt',
                content: editingFile.content || '',
                type: editingFile.type,
                size: editingFile.size,
                lastModified: editingFile.lastModified
              }}
              onSave={handleFileSave}
              onClose={() => setEditingFile(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
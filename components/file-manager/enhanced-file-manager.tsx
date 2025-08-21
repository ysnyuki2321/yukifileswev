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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">Files</h2>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {filteredAndSortedFiles.length} items
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[10rem] sm:w-64 bg-black/20 border-purple-500/20 text-white placeholder-gray-400"
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

          <div className="flex items-center space-x-1 sm:space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Grid view"
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-purple-500 text-white' : 'border-purple-500/20 text-purple-300 w-9 h-9'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Grid View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="List view"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-purple-500 text-white' : 'border-purple-500/20 text-purple-300 w-9 h-9'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List View</TooltipContent>
            </Tooltip>

            <Button
              aria-label="Refresh"
              variant="outline"
              size="icon"
              onClick={() => window.location.reload()}
              className="border-purple-500/20 text-purple-300 w-9 h-9"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* File Grid/List */}
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3"
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
                        "group cursor-pointer transition-all duration-200 touch-manipulation",
                        viewMode === 'grid'
                          ? "p-4 rounded-lg border border-purple-500/20 bg-black/20 hover:bg-purple-500/10 hover:border-purple-500/40"
                          : "flex items-center space-x-4 p-3 rounded-lg border border-purple-500/20 bg-black/20 hover:bg-purple-500/10 hover:border-purple-500/40"
                      )}
                      onClick={() => handleFileClick(file)}
                    >
                      {viewMode === 'grid' ? (
                        <div className="text-center space-y-2 select-none">
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
              userQuota={{ used: files.reduce((s, f) => s + f.size, 0), limit: 2 * 1024 * 1024 * 1024 }}
              onSave={handleFileSave}
              onClose={() => setEditingFile(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}
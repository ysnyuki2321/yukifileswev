"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useDemoAuth } from '@/contexts/demo-auth-context'
import { demoBackend } from '@/lib/demo/demo-backend'
import { DemoFile, DemoFolder } from '@/lib/demo/demo-architecture'
import { 
  Upload, 
  FolderPlus, 
  Search, 
  Grid, 
  List, 
  Star, 
  Share2, 
  Download,
  Trash2,
  MoreHorizontal,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
  Home,
  LogOut,
  User,
  Settings
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export function WorkingDemoDashboard() {
  const { user, logout } = useDemoAuth()
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [files, setFiles] = useState<DemoFile[]>([])
  const [folders, setFolders] = useState<DemoFolder[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Load files and folders
  useEffect(() => {
    if (user) {
      loadContent()
    }
  }, [user, currentFolder])

  const loadContent = async () => {
    if (!user) return
    
    try {
      const [userFiles, userFolders] = await Promise.all([
        demoBackend.getFilesByFolder(user.id, currentFolder),
        demoBackend.getFoldersByParent(user.id, currentFolder)
      ])
      
      setFiles(userFiles)
      setFolders(userFolders)
    } catch (error) {
      console.error('Failed to load content:', error)
    }
  }

  // File upload handling
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 100)
        
        await demoBackend.uploadFile(user.id, file, currentFolder)
        
        clearInterval(progressInterval)
        setUploadProgress(100)
        
        // Reload content
        await loadContent()
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [user, currentFolder])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'audio/*': ['.mp3', '.wav', '.flac'],
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip', '.rar', '.7z']
    }
  })

  // Folder creation
  const createFolder = async () => {
    if (!user) return
    
    const name = prompt('Enter folder name:')
    if (!name) return
    
    try {
      await demoBackend.createFolder(user.id, name, currentFolder)
      await loadContent()
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  }

  // File operations
  const deleteFile = async (fileId: string) => {
    if (!user) return
    
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await demoBackend.deleteFile(user.id, fileId)
        await loadContent()
      } catch (error) {
        console.error('Failed to delete file:', error)
      }
    }
  }

  const deleteFolder = async (folderId: string) => {
    if (!user) return
    
    if (confirm('Are you sure you want to delete this folder and all its contents?')) {
      try {
        await demoBackend.deleteFolder(user.id, folderId)
        await loadContent()
      } catch (error) {
        console.error('Failed to delete folder:', error)
      }
    }
  }

  // Navigation
  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId)
  }

  const getBreadcrumbs = () => {
    if (!currentFolder) return ['Home']
    
    const breadcrumbs = ['Home']
    let current = folders.find(f => f.id === currentFolder)
    
    while (current) {
      breadcrumbs.unshift(current.name)
      current = folders.find(f => f.id === current.parentId)
    }
    
    return breadcrumbs
  }

  // File type icon
  const getFileIcon = (file: DemoFile) => {
    if (file.mimeType.startsWith('image/')) return <Image className="w-6 h-6 text-blue-500" />
    if (file.mimeType.startsWith('video/')) return <Video className="w-6 h-6 text-red-500" />
    if (file.mimeType.startsWith('audio/')) return <Music className="w-6 h-6 text-green-500" />
    if (file.mimeType.includes('zip') || file.mimeType.includes('rar')) return <Archive className="w-6 h-6 text-orange-500" />
    if (file.mimeType === 'application/pdf') return <FileText className="w-6 h-6 text-red-500" />
    return <File className="w-6 h-6 text-gray-500" />
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
          <Button onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/demo/login'
            }
          }}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">YukiFiles Demo</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Demo Mode
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigateToFolder(null)}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Storage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Used</span>
                  <span>{formatFileSize(user.storageUsed)}</span>
                </div>
                <Progress 
                  value={(user.storageUsed / user.storageLimit) * 100} 
                  className="h-2"
                />
                <div className="text-xs text-gray-500 text-center">
                  {formatFileSize(user.storageLimit)} total
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 mb-6">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">/</span>}
                <button
                  onClick={() => {
                    if (index === 0) navigateToFolder(null)
                    // For other breadcrumbs, find the folder ID
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {crumb}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button onClick={createFolder} variant="outline">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
              
              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <div className="flex border border-gray-200 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Uploading...</span>
                <span className="text-sm text-blue-700">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </motion.div>
          )}

          {/* Content */}
          <div className="space-y-4">
            {/* Folders */}
            {folders.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Folders</h3>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                  {folders.map(folder => (
                    <Card
                      key={folder.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigateToFolder(folder.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <FolderPlus className="w-8 h-8 text-yellow-500" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{folder.name}</p>
                            <p className="text-sm text-gray-500">
                              {folder.itemCount} items
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteFolder(folder.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {files.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Files</h3>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                  {files.map(file => (
                    <Card key={file.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Download file
                                const link = document.createElement('a')
                                link.href = file.content
                                link.download = file.name
                                link.click()
                              }}
                            >
                              <Download className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFile(file.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {folders.length === 0 && files.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
                <p className="text-gray-500 mb-4">
                  Upload your first file or create a folder to get started
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button onClick={createFolder} variant="outline">
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Create Folder
                  </Button>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
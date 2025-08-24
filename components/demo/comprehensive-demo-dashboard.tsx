"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Upload, 
  FolderOpen, 
  Share2, 
  Users, 
  BarChart3, 
  Settings, 
  User, 
  Shield, 
  Download, 
  Eye, 
  Star, 
  Clock, 
  MapPin, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Lock, 
  Unlock, 
  Calendar, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Code, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Copy, 
  ExternalLink, 
  QrCode, 
  Bell, 
  Mail, 
  MessageSquare, 
  Zap, 
  Rocket, 
  Database, 
  Cloud, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Folder,
  File,
  HardDrive,
  Activity,
  TrendingUp,
  Users as UsersIcon,
  Globe as GlobeIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  Star as StarIcon,
  Clock as ClockIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
  MessageSquare as MessageSquareIcon,
  Settings as SettingsIcon,
  HelpCircle,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Home,
  FolderPlus,
  FilePlus,
  Star as StarIcon2,
  Trash2 as TrashIcon,
  Edit3 as EditIcon,
  Copy as CopyIcon,
  Share2 as ShareIcon,
  MoreHorizontal,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  RefreshCw,
  Info as InfoIcon,
  AlertCircle,
  Check,
  X
} from 'lucide-react'

import { DEMO_FILES, DEMO_USERS, DEMO_ANALYTICS, getDemoStorageStats } from '@/lib/demo/demo-data'
import { DemoFile, DemoUser } from '@/lib/demo/demo-architecture'
import { ComprehensiveShareSystem } from './comprehensive-share-system'

// ====================================================================
// COMPREHENSIVE DEMO DASHBOARD COMPONENT
// ====================================================================

interface ComprehensiveDemoDashboardProps {
  isDemo?: boolean
  scenario?: string
  mode?: 'quick' | 'full'
}

interface DemoState {
  currentUser: DemoUser
  files: DemoFile[]
  selectedFiles: string[]
  viewMode: 'grid' | 'list'
  searchQuery: string
  currentFolder: string | null
  showShareSystem: boolean
  selectedFileForShare: DemoFile | null
  showUploadModal: boolean
  showCreateFolderModal: boolean
  showUserManagement: boolean
  showAnalytics: boolean
  showSettings: boolean
  sortBy: 'name' | 'size' | 'date' | 'type'
  sortOrder: 'asc' | 'desc'
  filterType: string | null
  showStarredOnly: boolean
  showSharedOnly: boolean
}

export function ComprehensiveDemoDashboard({
  isDemo = true,
  scenario,
  mode = 'full'
}: ComprehensiveDemoDashboardProps) {
  const [demoState, setDemoState] = useState<DemoState>({
    currentUser: DEMO_USERS[0],
    files: DEMO_FILES,
    selectedFiles: [],
    viewMode: 'grid',
    searchQuery: '',
    currentFolder: null,
    showShareSystem: false,
    selectedFileForShare: null,
    showUploadModal: false,
    showCreateFolderModal: false,
    showUserManagement: false,
    showAnalytics: false,
    showSettings: false,
    sortBy: 'name',
    sortOrder: 'asc',
    filterType: null,
    showStarredOnly: false,
    showSharedOnly: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [newFolderName, setNewFolderName] = useState('')
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null)

  useEffect(() => {
    initializeDemoData()
    loadRecentActivity()
  }, [])

  const initializeDemoData = () => {
    // Initialize demo data and state
    setDemoState(prev => ({
      ...prev,
      currentUser: DEMO_USERS[0],
      files: DEMO_FILES
    }))
  }

  const loadRecentActivity = () => {
    // Load recent activity for the dashboard
    const activities = [
      {
        id: '1',
        type: 'upload',
        user: 'John Doe',
        file: 'Project_Proposal.pdf',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        icon: Upload
      },
      {
        id: '2',
        type: 'share',
        user: 'Jane Smith',
        file: 'Design_Mockups.zip',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        icon: Share2
      },
      {
        id: '3',
        type: 'download',
        user: 'Mike Johnson',
        file: 'Financial_Report.xlsx',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        icon: Download
      }
    ]
    setRecentActivity(activities)
  }

  const handleFileSelection = (fileId: string) => {
    setDemoState(prev => ({
      ...prev,
      selectedFiles: prev.selectedFiles.includes(fileId)
        ? prev.selectedFiles.filter(id => id !== fileId)
        : [...prev.selectedFiles, fileId]
    }))
  }

  const handleFileShare = (file: DemoFile) => {
    setDemoState(prev => ({
      ...prev,
      showShareSystem: true,
      selectedFileForShare: file
    }))
  }

  const handleFileUpload = async (files: FileList) => {
    setIsLoading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    clearInterval(interval)
    setUploadProgress(100)
    setIsLoading(false)
    
    // Close modal
    setDemoState(prev => ({
      ...prev,
      showUploadModal: false
    }))
    
    // Show success message
    alert('Files uploaded successfully!')
  }

  const handleCreateFolder = (folderName: string) => {
    if (!folderName.trim()) return
    
    const newFolder: DemoFile = {
      id: `folder_${Date.now()}`,
      name: folderName,
      type: 'folder',
      mimeType: 'folder',
      size: 0,
      parentId: demoState.currentFolder,
      path: demoState.currentFolder ? [...getCurrentFolderPath(), folderName] : [folderName],
      isStarred: false,
      isShared: false,
      isPublic: false,
      shareSettings: {} as any,
      metadata: { version: 1, checksum: '', software: 'YukiFiles' },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
      downloadCount: 0,
      viewCount: 0,
      tags: [],
      description: `New folder: ${folderName}`
    }
    
    setDemoState(prev => ({
      ...prev,
      files: [...prev.files, newFolder],
      showCreateFolderModal: false
    }))
    
    setNewFolderName('')
  }

  const getCurrentFolderPath = (): string[] => {
    if (!demoState.currentFolder) return []
    const folder = demoState.files.find(f => f.id === demoState.currentFolder)
    return folder ? folder.path : []
  }

  const getCurrentFolderFiles = () => {
    return demoState.files.filter(file => file.parentId === demoState.currentFolder)
  }

  const getFilteredFiles = () => {
    let files = demoState.currentFolder ? getCurrentFolderFiles() : demoState.files.filter(f => !f.parentId)
    
    // Apply search filter
    if (demoState.searchQuery) {
      files = files.filter(file => 
        file.name.toLowerCase().includes(demoState.searchQuery.toLowerCase()) ||
        file.description?.toLowerCase().includes(demoState.searchQuery.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(demoState.searchQuery.toLowerCase()))
      )
    }
    
    // Apply type filter
    if (demoState.filterType) {
      files = files.filter(file => file.mimeType.startsWith(demoState.filterType!))
    }
    
    // Apply starred filter
    if (demoState.showStarredOnly) {
      files = files.filter(file => file.isStarred)
    }
    
    // Apply shared filter
    if (demoState.showSharedOnly) {
      files = files.filter(file => file.isShared)
    }
    
    // Apply sorting
    files.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (demoState.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'size':
          aValue = a.size
          bValue = b.size
          break
        case 'date':
          aValue = a.updatedAt.getTime()
          bValue = b.updatedAt.getTime()
          break
        case 'type':
          aValue = a.mimeType
          bValue = b.mimeType
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }
      
      if (demoState.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    return files
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'folder') return <Folder className="w-6 h-6 text-blue-400" />
    if (mimeType.startsWith('image/')) return <Image className="w-6 h-6 text-green-400" />
    if (mimeType.startsWith('video/')) return <Video className="w-6 h-6 text-purple-400" />
    if (mimeType.startsWith('audio/')) return <Music className="w-6 h-6 text-yellow-400" />
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className="w-6 h-6 text-orange-400" />
    if (mimeType.includes('pdf')) return <FileText className="w-6 h-6 text-red-400" />
    if (mimeType.includes('code') || mimeType.includes('text')) return <Code className="w-6 h-6 text-indigo-400" />
    return <File className="w-6 h-6 text-gray-400" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const storageStats = getDemoStorageStats()

  return (
    <div className="min-h-screen theme-premium">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">YukiFiles Dashboard</h1>
                <p className="text-gray-400">Welcome back, {demoState.currentUser.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isDemo && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Demo Mode
                </Badge>
              )}
              
              <Button
                onClick={() => setDemoState(prev => ({ ...prev, showAnalytics: true }))}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </Button>
              
              <Button
                onClick={() => setDemoState(prev => ({ ...prev, showSettings: true }))}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
              
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Storage Overview */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  Storage Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Used</span>
                    <span className="text-white">{formatFileSize(storageStats.used)}</span>
                  </div>
                  <Progress value={storageStats.percentage} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {formatFileSize(storageStats.total)} total
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-black/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">{storageStats.files}</div>
                    <div className="text-xs text-gray-400">Files</div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">{storageStats.folders}</div>
                    <div className="text-xs text-gray-400">Folders</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={() => setDemoState(prev => ({ ...prev, showUploadModal: true }))}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                  
                  <Button
                    onClick={() => setDemoState(prev => ({ ...prev, showCreateFolderModal: true }))}
                    variant="outline"
                    className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                    size="sm"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setDemoState(prev => ({ ...prev, currentFolder: null }))}
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-purple-500/20"
                  size="sm"
                >
                  <Home className="w-4 h-4 mr-2" />
                  All Files
                </Button>
                
                <Button
                  onClick={() => setDemoState(prev => ({ ...prev, showStarredOnly: !prev.showStarredOnly }))}
                  variant="ghost"
                  className={`w-full justify-start ${demoState.showStarredOnly ? 'text-yellow-400 bg-yellow-500/20' : 'text-gray-300 hover:text-white hover:bg-purple-500/20'}`}
                  size="sm"
                >
                  <StarIcon className="w-4 h-4 mr-2" />
                  Starred
                </Button>
                
                <Button
                  onClick={() => setDemoState(prev => ({ ...prev, showSharedOnly: !prev.showSharedOnly }))}
                  variant="ghost"
                  className={`w-full justify-start ${demoState.showSharedOnly ? 'text-blue-400 bg-blue-500/20' : 'text-gray-300 hover:text-white hover:bg-purple-500/20'}`}
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Shared
                </Button>
                
                <Button
                  onClick={() => setDemoState(prev => ({ ...prev, showUserManagement: true }))}
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-purple-500/20"
                  size="sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Team Members
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 bg-black/20 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {activity.file}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {activity.user} • {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={demoState.searchQuery}
                    onChange={(e) => setDemoState(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Search files and folders..."
                    className="pl-10 bg-slate-600/50 border-purple-500/30 text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setDemoState(prev => ({ ...prev, viewMode: prev.viewMode === 'grid' ? 'list' : 'grid' }))}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  {demoState.viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </Button>
                
                <Button
                  onClick={() => setDemoState(prev => ({ ...prev, showUploadModal: true }))}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Filters and Sorting */}
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={demoState.filterType || ''}
                onChange={(e) => setDemoState(prev => ({ ...prev, filterType: e.target.value || null }))}
                className="bg-slate-600/50 border border-purple-500/30 rounded-md px-3 py-2 text-white text-sm"
              >
                <option value="">All Types</option>
                <option value="image/">Images</option>
                <option value="video/">Videos</option>
                <option value="audio/">Audio</option>
                <option value="application/">Documents</option>
                <option value="text/">Text Files</option>
              </select>
              
              <select
                value={`${demoState.sortBy}-${demoState.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  setDemoState(prev => ({ 
                    ...prev, 
                    sortBy: sortBy as any, 
                    sortOrder: sortOrder as any 
                  }))
                }}
                className="bg-slate-600/50 border border-purple-500/30 rounded-md px-3 py-2 text-white text-sm"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="size-asc">Size Small-Large</option>
                <option value="size-desc">Size Large-Small</option>
                <option value="date-asc">Date Old-New</option>
                <option value="date-desc">Date New-Old</option>
                <option value="type-asc">Type A-Z</option>
                <option value="type-desc">Type Z-A</option>
              </select>
              
              <Button
                onClick={() => window.location.reload()}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Breadcrumb */}
            {demoState.currentFolder && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Button
                  onClick={() => setDemoState(prev => ({ ...prev, currentFolder: null }))}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-1 h-auto"
                >
                  <Home className="w-4 h-4" />
                </Button>
                
                {getCurrentFolderPath().map((path, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    <Button
                      onClick={() => {
                        // Navigate to this folder level
                        const targetPath = getCurrentFolderPath().slice(0, index + 1)
                        const targetFolder = demoState.files.find(f => 
                          f.type === 'folder' && 
                          JSON.stringify(f.path) === JSON.stringify(targetPath)
                        )
                        if (targetFolder) {
                          setDemoState(prev => ({ ...prev, currentFolder: targetFolder.id }))
                        }
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white p-1 h-auto"
                    >
                      {path}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Files Grid/List */}
            <div className="min-h-[400px]">
              {getFilteredFiles().length === 0 ? (
                <div className="text-center py-16">
                  <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {demoState.searchQuery ? 'No files found' : 'No files here'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {demoState.searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'Upload some files or create a folder to get started'
                    }
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => setDemoState(prev => ({ ...prev, showUploadModal: true }))}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                    <Button
                      onClick={() => setDemoState(prev => ({ ...prev, showCreateFolderModal: true }))}
                      variant="outline"
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                    >
                      <FolderPlus className="w-4 h-4 mr-2" />
                      New Folder
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={demoState.viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
                  {getFilteredFiles().map(file => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`group relative ${
                        demoState.viewMode === 'grid' 
                          ? 'bg-black/40 border border-purple-500/20 rounded-xl p-4 hover:bg-black/60 transition-all duration-200 cursor-pointer' 
                          : 'bg-black/40 border border-purple-500/20 rounded-lg p-4 hover:bg-black/60 transition-all duration-200 cursor-pointer'
                      }`}
                      onClick={() => {
                        if (file.type === 'folder') {
                          setDemoState(prev => ({ ...prev, currentFolder: file.id }))
                        } else {
                          handleFileSelection(file.id)
                        }
                      }}
                    >
                      {/* File/Folder Icon */}
                      <div className="flex items-center gap-3 mb-3">
                        {getFileIcon(file.mimeType)}
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">{file.name}</div>
                          <div className="text-gray-400 text-sm">
                            {file.type === 'folder' ? 'Folder' : formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      
                      {/* File Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Modified:</span>
                          <span className="text-white">{formatDate(file.updatedAt)}</span>
                        </div>
                        
                        {file.type === 'file' && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Downloads:</span>
                              <span className="text-white">{file.downloadCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Views:</span>
                              <span className="text-white">{file.viewCount}</span>
                            </div>
                          </>
                        )}
                        
                        {file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {file.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                                {tag}
                              </Badge>
                            ))}
                            {file.tags.length > 3 && (
                              <Badge className="text-xs bg-gray-500/20 text-gray-300 border-gray-500/30">
                                +{file.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-1">
                          {file.type === 'file' && (
                            <>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleFileShare(file)
                                }}
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0 bg-black/50 hover:bg-purple-500/20 text-purple-300"
                              >
                                <ShareIcon className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Simulate download
                                  alert(`Downloading ${file.name}...`)
                                }}
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0 bg-black/50 hover:bg-blue-500/20 text-blue-300"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              // Toggle star
                              setDemoState(prev => ({
                                ...prev,
                                files: prev.files.map(f => 
                                  f.id === file.id ? { ...f, isStarred: !f.isStarred } : f
                                )
                              }))
                            }}
                            variant="ghost"
                            size="sm"
                            className={`w-8 h-8 p-0 bg-black/50 hover:bg-yellow-500/20 ${
                              file.isStarred ? 'text-yellow-400' : 'text-gray-400'
                            }`}
                          >
                            <StarIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Selection Indicator */}
                      {demoState.selectedFiles.includes(file.id) && (
                        <div className="absolute top-3 left-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Share System Modal */}
      <AnimatePresence>
        {demoState.showShareSystem && demoState.selectedFileForShare && (
          <ComprehensiveShareSystem
            file={demoState.selectedFileForShare}
            onClose={() => setDemoState(prev => ({ ...prev, showShareSystem: false }))}
            isDemo={true}
          />
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {demoState.showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDemoState(prev => ({ ...prev, showUploadModal: false }))}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Upload Files</h3>
                <Button
                  onClick={() => setDemoState(prev => ({ ...prev, showUploadModal: false }))}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-white mb-2">Drop files here or click to browse</p>
                  <p className="text-gray-400 text-sm">Supports all file types up to 100MB</p>
                  
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setUploadFiles(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Choose Files
                    </Button>
                  </label>
                </div>
                
                {uploadFiles && uploadFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-white font-medium">Selected Files:</p>
                    {Array.from(uploadFiles).map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                        <File className="w-5 h-5 text-purple-400" />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">{file.name}</div>
                          <div className="text-gray-400 text-xs">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Uploading...</span>
                      <span className="text-white">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setDemoState(prev => ({ ...prev, showUploadModal: false }))}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={() => uploadFiles && handleFileUpload(uploadFiles)}
                    disabled={!uploadFiles || uploadFiles.length === 0 || isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isLoading ? 'Uploading...' : 'Upload Files'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {demoState.showCreateFolderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDemoState(prev => ({ ...prev, showCreateFolderModal: false }))}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Create New Folder</h3>
                <Button
                  onClick={() => setDemoState(prev => ({ ...prev, showCreateFolderModal: false }))}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Folder Name</label>
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                    className="bg-slate-600/50 border-purple-500/30 text-white"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setDemoState(prev => ({ ...prev, showCreateFolderModal: false }))}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={() => handleCreateFolder(newFolderName)}
                    disabled={!newFolderName.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Create Folder
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper function for time formatting
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}
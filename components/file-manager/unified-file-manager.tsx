"use client"

import React, { useState, useEffect, useReducer, useCallback, useMemo } from "react"
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
  WifiOff, CheckCircle, XCircle, AlertCircle, Info, X,
  Smartphone, Monitor, Tablet, ChevronDown, Menu, Plus,
  ArrowUpDown, FileX, FileCheck
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleFileEditor } from "@/components/file-editor/simple-file-editor"
import { SimpleDatabaseEditor } from "@/components/file-editor/simple-database-editor"
import { MediaPreview } from "@/components/ui/media-preview"
import { formatBytes } from "@/lib/utils"

// Types
interface FileItem {
  id: string
  name: string
  original_name: string
  mime_type: string
  file_size: number
  size: number
  created_at: string
  content: string
  thumbnail: string | null
  is_starred: boolean
  isStarred: boolean
  is_public: boolean
  isFolder?: boolean
  lastModified?: Date
}

interface TabItem {
  id: string
  title: string
  type: 'file' | 'database' | 'media'
  content: React.ReactNode
  isActive: boolean
}

interface FileManagerState {
  // Search & Filter
  searchQuery: string
  filterType: 'all' | 'images' | 'videos' | 'audio' | 'documents' | 'code'
  sortBy: 'name' | 'size' | 'date'
  sortOrder: 'asc' | 'desc'
  
  // View & UI
  viewMode: 'grid' | 'list'
  isMobile: boolean
  showAnalytics: boolean
  showUploadProgress: boolean
  
  // File Management
  selectedFile: FileItem | null
  selectedFiles: Set<string>
  selectedMultiFiles: Set<string>
  multiSelectMode: boolean
  showMultiActions: boolean
  
  // Tabs
  tabs: TabItem[]
  activeTabId: string | null
  
  // Navigation
  currentPath: string[]
  
  // Storage
  storageStats: { used: number; total: number }
}

type FileManagerAction =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_TYPE'; payload: 'all' | 'images' | 'videos' | 'audio' | 'documents' | 'code' }
  | { type: 'SET_SORT_BY'; payload: 'name' | 'size' | 'date' }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
  | { type: 'SET_IS_MOBILE'; payload: boolean }
  | { type: 'SET_SHOW_ANALYTICS'; payload: boolean }
  | { type: 'SET_SHOW_UPLOAD_PROGRESS'; payload: boolean }
  | { type: 'SET_SELECTED_FILE'; payload: FileItem | null }
  | { type: 'SET_SELECTED_FILES'; payload: Set<string> }
  | { type: 'SET_SELECTED_MULTI_FILES'; payload: Set<string> }
  | { type: 'SET_MULTI_SELECT_MODE'; payload: boolean }
  | { type: 'SET_SHOW_MULTI_ACTIONS'; payload: boolean }
  | { type: 'ADD_TAB'; payload: TabItem }
  | { type: 'REMOVE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_CURRENT_PATH'; payload: string[] }
  | { type: 'SET_STORAGE_STATS'; payload: { used: number; total: number } }

const initialState: FileManagerState = {
  searchQuery: '',
  filterType: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
  viewMode: 'grid',
  isMobile: false,
  showAnalytics: false,
  showUploadProgress: false,
  selectedFile: null,
  selectedFiles: new Set(),
  selectedMultiFiles: new Set(),
  multiSelectMode: false,
  showMultiActions: false,
  tabs: [],
  activeTabId: null,
  currentPath: [],
  storageStats: { used: 0, total: 0 }
}

function fileManagerReducer(state: FileManagerState, action: FileManagerAction): FileManagerState {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'SET_FILTER_TYPE':
      return { ...state, filterType: action.payload }
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload }
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload }
    case 'SET_IS_MOBILE':
      return { ...state, isMobile: action.payload }
    case 'SET_SHOW_ANALYTICS':
      return { ...state, showAnalytics: action.payload }
    case 'SET_SHOW_UPLOAD_PROGRESS':
      return { ...state, showUploadProgress: action.payload }
    case 'SET_SELECTED_FILE':
      return { ...state, selectedFile: action.payload }
    case 'SET_SELECTED_FILES':
      return { ...state, selectedFiles: action.payload }
    case 'SET_SELECTED_MULTI_FILES':
      return { ...state, selectedMultiFiles: action.payload }
    case 'SET_MULTI_SELECT_MODE':
      return { ...state, multiSelectMode: action.payload }
    case 'SET_SHOW_MULTI_ACTIONS':
      return { ...state, showMultiActions: action.payload }
    case 'ADD_TAB':
      return { 
        ...state, 
        tabs: [...state.tabs.map(t => ({ ...t, isActive: false })), action.payload],
        activeTabId: action.payload.id
      }
    case 'REMOVE_TAB':
      return { 
        ...state, 
        tabs: state.tabs.filter(t => t.id !== action.payload),
        activeTabId: state.activeTabId === action.payload ? (state.tabs[0]?.id || null) : state.activeTabId
      }
    case 'SET_ACTIVE_TAB':
      return { 
        ...state, 
        activeTabId: action.payload,
        tabs: state.tabs.map(t => ({ ...t, isActive: t.id === action.payload }))
      }
    case 'SET_CURRENT_PATH':
      return { ...state, currentPath: action.payload }
    case 'SET_STORAGE_STATS':
      return { ...state, storageStats: action.payload }
    default:
      return state
  }
}

// Mock data
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'document.txt',
    original_name: 'document.txt',
    mime_type: 'text/plain',
    file_size: 1024,
    size: 1024,
    created_at: '2024-01-15T10:30:00Z',
    content: 'This is a sample text document.',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    lastModified: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    name: 'image.jpg',
    original_name: 'image.jpg',
    mime_type: 'image/jpeg',
    file_size: 2048576,
    size: 2048576,
    created_at: '2024-01-16T14:20:00Z',
    content: '',
    thumbnail: '/api/placeholder/300/200',
    is_starred: true,
    isStarred: true,
    is_public: true,
    lastModified: new Date('2024-01-16T14:20:00Z')
  },
  {
    id: '3',
    name: 'database.db',
    original_name: 'database.db',
    mime_type: 'application/x-sqlite3',
    file_size: 1048576,
    size: 1048576,
    created_at: '2024-01-17T09:15:00Z',
    content: '',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    lastModified: new Date('2024-01-17T09:15:00Z')
  },
  {
    id: '4',
    name: 'Documents',
    original_name: 'Documents',
    mime_type: 'inode/directory',
    file_size: 0,
    size: 0,
    created_at: '2024-01-18T11:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isFolder: true,
    lastModified: new Date('2024-01-18T11:00:00Z')
  }
]

export function UnifiedFileManager() {
  const [state, dispatch] = useReducer(fileManagerReducer, initialState)
  const [currentPath, setCurrentPath] = useState<string[]>([])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      dispatch({ type: 'SET_IS_MOBILE', payload: mobile })
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = mockFiles.filter(file => {
      if (state.searchQuery) {
        return file.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      }
      if (state.filterType !== 'all') {
        return getFileCategory(file.name) === state.filterType
      }
      return true
    })

    // Sort files
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (state.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'size':
          aValue = a.size
          bValue = b.size
          break
        case 'date':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (state.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [state.searchQuery, state.filterType, state.sortBy, state.sortOrder])

  // File category detection
  const getFileCategory = (filename: string): string => {
    const ext = filename.toLowerCase().split('.').pop() || ''
    
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) return 'audio'
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext)) return 'images'
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) return 'videos'
    if (['db', 'sqlite', 'sqlite3', 'sql'].includes(ext)) return 'database'
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift', 'kt'].includes(ext)) return 'code'
    if (['txt', 'md', 'json', 'csv', 'log', 'rtf', 'doc', 'docx', 'pdf'].includes(ext)) return 'documents'
    
    return 'documents'
  }

  // File icon
  const getFileIcon = (file: FileItem) => {
    if (file.isFolder) {
      return <Folder className="w-8 h-8 text-yellow-400" />
    }

    const category = getFileCategory(file.name)
    switch (category) {
      case 'images':
        return <Image className="w-8 h-8 text-green-400" />
      case 'videos':
        return <Video className="w-8 h-8 text-red-400" />
      case 'audio':
        return <Music className="w-8 h-8 text-blue-400" />
      case 'code':
        return <FileCode className="w-8 h-8 text-purple-400" />
      case 'database':
        return <Database className="w-8 h-8 text-indigo-400" />
      case 'documents':
        return <FileText className="w-8 h-8 text-cyan-400" />
      default:
        return <File className="w-8 h-8 text-gray-400" />
    }
  }

  // File handlers
  const handleFileClick = useCallback((file: FileItem) => {
    if (file.isFolder) {
      const newPath = [...currentPath, file.name]
      setCurrentPath(newPath)
      return
    }
    
    if (getFileCategory(file.name) === 'database') {
      const tabId = `db-${file.id}`
      const newTab: TabItem = {
        id: tabId,
        title: file.name,
        type: 'database',
        content: (
          <SimpleDatabaseEditor
            file={file}
            onClose={() => dispatch({ type: 'REMOVE_TAB', payload: tabId })}
            readOnly={false}
          />
        ),
        isActive: true
      }
      dispatch({ type: 'ADD_TAB', payload: newTab })
    } else if (getFileCategory(file.name) === 'documents' || getFileCategory(file.name) === 'code') {
      const tabId = `file-${file.id}`
      const newTab: TabItem = {
        id: tabId,
        title: file.name,
        type: 'file',
        content: (
          <SimpleFileEditor
            file={{
              id: file.id,
              name: file.name,
              content: file.content || '',
              type: getFileCategory(file.name),
              size: file.size || 0,
              lastModified: file.lastModified || new Date(file.created_at)
            }}
            onSave={(fileName, content, fileType) => {
              console.log('Saving file:', fileName, content, fileType)
            }}
            onClose={() => dispatch({ type: 'REMOVE_TAB', payload: tabId })}
            readOnly={false}
          />
        ),
        isActive: true
      }
      dispatch({ type: 'ADD_TAB', payload: newTab })
    } else {
      const tabId = `media-${file.id}`
      const newTab: TabItem = {
        id: tabId,
        title: file.name,
        type: 'media',
        content: (
          <MediaPreview
            file={file}
            onDownload={() => {}}
            onShare={() => {}}
            onLike={() => {}}
            onClose={() => dispatch({ type: 'REMOVE_TAB', payload: tabId })}
          />
        ),
        isActive: true
      }
      dispatch({ type: 'ADD_TAB', payload: newTab })
    }
  }, [currentPath])

  const toggleMultiSelect = useCallback((fileId: string) => {
    const newSelected = new Set(state.selectedMultiFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    dispatch({ type: 'SET_SELECTED_MULTI_FILES', payload: newSelected })
  }, [state.selectedMultiFiles])

  const clearMultiSelect = useCallback(() => {
    dispatch({ type: 'SET_SELECTED_MULTI_FILES', payload: new Set() })
    dispatch({ type: 'SET_MULTI_SELECT_MODE', payload: false })
    dispatch({ type: 'SET_SHOW_MULTI_ACTIONS', payload: false })
  }, [])

  const setMultiSelectMode = useCallback((mode: boolean) => {
    dispatch({ type: 'SET_MULTI_SELECT_MODE', payload: mode })
    if (!mode) {
      clearMultiSelect()
    }
  }, [clearMultiSelect])

  const setShowMultiActions = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_MULTI_ACTIONS', payload: show })
  }, [])

  const handleTouchStart = useCallback((file: FileItem) => {
    if (state.multiSelectMode) {
      toggleMultiSelect(file.id)
    }
  }, [state.multiSelectMode, toggleMultiSelect])

  const handleTouchEnd = useCallback(() => {
    // Touch end handler
  }, [])

  const handleRightClick = useCallback((file: FileItem, event: React.MouseEvent) => {
    event.preventDefault()
    // Context menu logic
  }, [])

  const handleShare = useCallback((file: FileItem) => {
    console.log('Sharing file:', file.name)
  }, [])

  const handleAdvancedShare = useCallback((file: FileItem) => {
    console.log('Advanced sharing file:', file.name)
  }, [])

  const handleCreateFile = useCallback(() => {
    console.log('Creating new file')
  }, [])

  const handleCreateFolder = useCallback(() => {
    console.log('Creating new folder')
  }, [])

  const setShowUploadProgress = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_UPLOAD_PROGRESS', payload: show })
  }, [])

  const closeTab = useCallback((tabId: string) => {
    dispatch({ type: 'REMOVE_TAB', payload: tabId })
  }, [])

  const activateTab = useCallback((tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId })
  }, [])

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">File Manager</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {state.isMobile ? 'Mobile' : 'Desktop'} Mode
                </Badge>
                <span className="text-sm text-gray-400">
                  {currentPath.length > 0 ? currentPath.join(' / ') : 'Root'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: 'SET_SHOW_ANALYTICS', payload: !state.showAnalytics })}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {!state.isMobile && "Analytics"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* File Manager Panel */}
        <div className={`${state.tabs.length > 0 ? 'w-1/2' : 'w-full'} border-r border-purple-500/20 flex flex-col`}>
          {/* Search and Controls */}
          <div className="p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search files..."
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                className="pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 h-12 text-base"
              />
            </div>

            {/* Filter and Sort */}
            <div className="flex flex-wrap gap-2">
              {/* Filter Pills */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {['all', 'images', 'videos', 'audio', 'documents', 'code'].map((type) => (
                  <Button
                    key={type}
                    variant={state.filterType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => dispatch({ type: 'SET_FILTER_TYPE', payload: type as any })}
                    className={`whitespace-nowrap ${
                      state.filterType === type 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0" 
                        : "bg-slate-800/50 border-purple-500/30 text-gray-300 hover:bg-slate-700/50"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Sort Controls */}
              <div className="flex gap-1 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_SORT_ORDER', payload: state.sortOrder === 'asc' ? 'desc' : 'asc' })}
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: state.viewMode === 'grid' ? 'list' : 'grid' })}
                  className="border-purple-500/30 text-purple-300 hover:bg-slate-700/50"
                >
                  {state.viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleCreateFile}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white h-12"
              >
                <FilePlus className="w-4 h-4 mr-2" />
                New File
              </Button>
              <Button
                onClick={handleCreateFolder}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
              <Button
                onClick={() => setShowUploadProgress(true)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white h-12"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>

            {/* Multi-select Actions */}
            {state.showMultiActions && (
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">
                      {state.selectedMultiFiles.size} file{state.selectedMultiFiles.size !== 1 ? 's' : ''} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearMultiSelect}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-slate-700/50 border-purple-500/30 text-purple-300 hover:bg-slate-600/50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-slate-700/50 border-purple-500/30 text-purple-300 hover:bg-slate-600/50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Files Grid/List */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAndSortedFiles.map((file) => {
                  const isSelected = state.selectedMultiFiles.has(file.id)
                  const isFolder = file.isFolder
                  
                  return (
                    <Card
                      key={file.id}
                      className={`relative cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? "ring-2 ring-blue-500 bg-blue-500/10" 
                          : "bg-slate-800/50 border-purple-500/30 hover:bg-slate-700/50"
                      }`}
                      onClick={() => {
                        if (state.multiSelectMode) {
                          toggleMultiSelect(file.id)
                        } else {
                          handleFileClick(file)
                        }
                      }}
                      onContextMenu={(e) => handleRightClick(file, e)}
                      onTouchStart={() => handleTouchStart(file)}
                      onTouchEnd={handleTouchEnd}
                    >
                      <CardContent className="p-3">
                        {/* File Icon */}
                        <div className="w-full h-20 mb-2 flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                        
                        {/* File Name */}
                        <div className="text-center">
                          <p className="text-sm text-white font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {isFolder ? "Folder" : formatBytes(file.size || 0, 2)}
                          </p>
                        </div>

                        {/* Selection Indicator */}
                        {state.multiSelectMode && (
                          <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? "bg-blue-500 border-blue-500" 
                              : "bg-transparent border-gray-400"
                          }`}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        )}

                        {/* File Type Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-slate-700/80 text-gray-300 border-0"
                          >
                            {getFileCategory(file.name)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAndSortedFiles.map((file) => {
                  const isSelected = state.selectedMultiFiles.has(file.id)
                  const isFolder = file.isFolder
                  
                  return (
                    <Card
                      key={file.id}
                      className={`relative cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? "ring-2 ring-blue-500 bg-blue-500/10" 
                          : "bg-slate-800/50 border-purple-500/30 hover:bg-slate-700/50"
                      }`}
                      onClick={() => {
                        if (state.multiSelectMode) {
                          toggleMultiSelect(file.id)
                        } else {
                          handleFileClick(file)
                        }
                      }}
                      onContextMenu={(e) => handleRightClick(file, e)}
                      onTouchStart={() => handleTouchStart(file)}
                      onTouchEnd={handleTouchEnd}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          {/* File Icon */}
                          <div className="flex-shrink-0">
                            {getFileIcon(file)}
                          </div>
                          
                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{file.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-400">
                                {isFolder ? "Folder" : formatBytes(file.size || 0, 2)}
                              </span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-400">
                                {new Date(file.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* File Type Badge */}
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-slate-700/80 text-gray-300 border-0 flex-shrink-0"
                          >
                            {getFileCategory(file.name)}
                          </Badge>
                        </div>

                        {/* Selection Indicator */}
                        {state.multiSelectMode && (
                          <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? "bg-blue-500 border-blue-500" 
                              : "bg-transparent border-gray-400"
                          }`}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Empty State */}
            {filteredAndSortedFiles.length === 0 && (
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardContent className="p-8 text-center">
                  <File className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No files found</h3>
                  <p className="text-gray-400 mb-4">
                    {state.searchQuery ? `No files match "${state.searchQuery}"` : "Create your first file to get started"}
                  </p>
                  {!state.searchQuery && (
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleCreateFile} className="bg-gradient-to-r from-blue-500 to-blue-600">
                        <FilePlus className="w-4 h-4 mr-2" />
                        Create File
                      </Button>
                      <Button onClick={handleCreateFolder} className="bg-gradient-to-r from-green-500 to-green-600">
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Create Folder
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs Panel */}
        {state.tabs.length > 0 && (
          <div className="w-1/2 flex flex-col">
            {/* Tabs Header */}
            <div className="bg-slate-800/50 border-b border-purple-500/20">
              <div className="overflow-x-auto">
                <div className="flex min-w-full">
                  {state.tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 cursor-pointer transition-colors ${
                        tab.isActive 
                          ? "border-purple-500 text-purple-300 bg-purple-500/10" 
                          : "border-transparent text-gray-400 hover:text-white hover:bg-slate-700/50"
                      }`}
                      onClick={() => activateTab(tab.id)}
                    >
                      <span className="text-sm font-medium truncate max-w-[120px]">
                        {tab.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          closeTab(tab.id)
                        }}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {state.tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`h-full ${tab.isActive ? 'block' : 'hidden'}`}
                >
                  {tab.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
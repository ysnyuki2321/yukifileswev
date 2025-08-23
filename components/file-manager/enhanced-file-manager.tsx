"use client"

import React, { useState, useEffect, useReducer, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  Smartphone, Monitor, Tablet, ChevronDown, Menu, Plus
} from "lucide-react"
import { TabSystem } from "@/components/ui/tab-system"
import { AdvancedFileEditor } from "@/components/file-editor/advanced-file-editor"
import { AdvancedDatabaseEditor } from "@/components/file-editor/advanced-database-editor"
import { MediaPreview } from "@/components/ui/media-preview"
import { FileContextMenu } from "@/components/ui/file-context-menu"
import { useProfessionalModal } from "@/components/ui/professional-modal"
import { useProfessionalInput } from "@/components/ui/professional-input-modal"
import { SimpleShareModal } from "@/components/ui/simple-share-modal"
import { AdvancedShareModal } from "@/components/ui/advanced-share-modal"
import { BreadcrumbPath } from "@/components/ui/breadcrumb-path"
import { CompressionOverlay } from "@/components/ui/compression-overlay"
import { ArchiveViewer } from "@/components/ui/archive-viewer"
import { formatBytes } from "@/lib/utils"
import { MobileLayout } from "./mobile-layout"
import { DesktopLayout } from "./desktop-layout"

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
  selectedMultiFiles: Set<string> // ✅ Thêm biến này
  multiSelectMode: boolean
  showMultiActions: boolean
  
  // Tabs
  tabs: TabItem[]
  activeTabId: string | null
  
  // Modals & Overlays
  contextMenu: { file: FileItem; position: { x: number; y: number } } | null
  shareModal: { isOpen: boolean; file: FileItem | null }
  advancedShareModal: { isOpen: boolean; file: FileItem | null }
  compressionOverlay: { isOpen: boolean; files: FileItem[] }
  archiveViewer: { isOpen: boolean; file: FileItem | null }
  
  // Navigation
  currentPath: string[]
  
  // Storage
  storageStats: { used: number; total: number }
}

type FileManagerAction = 
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_TYPE'; payload: FileManagerState['filterType'] }
  | { type: 'SET_SORT_BY'; payload: FileManagerState['sortBy'] }
  | { type: 'SET_SORT_ORDER'; payload: FileManagerState['sortOrder'] }
  | { type: 'SET_VIEW_MODE'; payload: FileManagerState['viewMode'] }
  | { type: 'SET_MOBILE'; payload: boolean }
  | { type: 'SET_ANALYTICS'; payload: boolean }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: boolean }
  | { type: 'SET_SELECTED_FILE'; payload: FileItem | null }
  | { type: 'SET_SELECTED_FILES'; payload: Set<string> }
  | { type: 'SET_SELECTED_MULTI_FILES'; payload: Set<string> } // ✅ Thêm action này
  | { type: 'SET_MULTI_SELECT_MODE'; payload: boolean }
  | { type: 'SET_MULTI_ACTIONS'; payload: boolean }
  | { type: 'ADD_TAB'; payload: TabItem }
  | { type: 'REMOVE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_CONTEXT_MENU'; payload: FileManagerState['contextMenu'] }
  | { type: 'SET_SHARE_MODAL'; payload: FileManagerState['shareModal'] }
  | { type: 'SET_ADVANCED_SHARE_MODAL'; payload: FileManagerState['advancedShareModal'] }
  | { type: 'SET_COMPRESSION_OVERLAY'; payload: FileManagerState['compressionOverlay'] }
  | { type: 'SET_ARCHIVE_VIEWER'; payload: FileManagerState['archiveViewer'] }
  | { type: 'SET_CURRENT_PATH'; payload: string[] }
  | { type: 'SET_STORAGE_STATS'; payload: { used: number; total: number } }
  | { type: 'RESET_STATE' }

// Initial state
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
  contextMenu: null,
  shareModal: { isOpen: false, file: null },
  advancedShareModal: { isOpen: false, file: null },
  compressionOverlay: { isOpen: false, files: [] },
  archiveViewer: { isOpen: false, file: null },
  currentPath: [],
  storageStats: { used: 0, total: 0 }
}

// Reducer
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
    case 'SET_MOBILE':
      return { ...state, isMobile: action.payload }
    case 'SET_ANALYTICS':
      return { ...state, showAnalytics: action.payload }
    case 'SET_UPLOAD_PROGRESS':
      return { ...state, showUploadProgress: action.payload }
    case 'SET_SELECTED_FILE':
      return { ...state, selectedFile: action.payload }
    case 'SET_SELECTED_FILES':
      return { ...state, selectedFiles: action.payload }
    case 'SET_SELECTED_MULTI_FILES':
      return { ...state, selectedMultiFiles: action.payload }
    case 'SET_MULTI_SELECT_MODE':
      return { ...state, multiSelectMode: action.payload }
    case 'SET_MULTI_ACTIONS':
      return { ...state, showMultiActions: action.payload }
    case 'ADD_TAB':
      return { 
        ...state, 
        tabs: state.tabs.map(tab => ({ ...tab, isActive: false })).concat(action.payload),
        activeTabId: action.payload.id
      }
    case 'REMOVE_TAB':
      const newTabs = state.tabs.filter(tab => tab.id !== action.payload)
      const newActiveTabId = state.activeTabId === action.payload 
        ? (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null)
        : state.activeTabId
      return { 
        ...state, 
        tabs: newTabs.map((tab, index) => ({ 
          ...tab, 
          isActive: index === newTabs.length - 1 && newActiveTabId === tab.id 
        })),
        activeTabId: newActiveTabId
      }
    case 'SET_ACTIVE_TAB':
      return { 
        ...state, 
        tabs: state.tabs.map(tab => ({ ...tab, isActive: tab.id === action.payload })),
        activeTabId: action.payload
      }
    case 'SET_CONTEXT_MENU':
      return { ...state, contextMenu: action.payload }
    case 'SET_SHARE_MODAL':
      return { ...state, shareModal: action.payload }
    case 'SET_ADVANCED_SHARE_MODAL':
      return { ...state, advancedShareModal: action.payload }
    case 'SET_COMPRESSION_OVERLAY':
      return { ...state, compressionOverlay: action.payload }
    case 'SET_ARCHIVE_VIEWER':
      return { ...state, archiveViewer: action.payload }
    case 'SET_CURRENT_PATH':
      return { ...state, currentPath: action.payload }
    case 'SET_STORAGE_STATS':
      return { ...state, storageStats: action.payload }
    case 'RESET_STATE':
      return initialState
    default:
      return state
  }
}

export interface EnhancedFileManagerProps {
  files: FileItem[]
  folders?: FileItem[]
  onFileCreate?: (fileData: any) => void
  onFileUpdate?: (updatedFile: any) => void
  onFileDelete?: (fileId: string) => void
  onFileUpload?: (files: File[]) => void
  isDemoMode?: boolean
  isAdmin?: boolean
}

// Helper functions - moved outside component to avoid hoisting issues
const getFileCategory = (filename: string): string => {
  if (!filename) return 'other'
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'tiff']
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v', '3gp']
  const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'opus']
  const codeExts = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'html', 'css', 'scss', 'sass', 'json', 'xml', 'yaml', 'yml', 'sql', 'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd']
  const docExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'rtf', 'odt', 'ods', 'odp']
  
  if (imageExts.includes(ext)) return 'images'
  if (videoExts.includes(ext)) return 'videos'
  if (audioExts.includes(ext)) return 'audio'
  if (codeExts.includes(ext)) return 'code'
  if (docExts.includes(ext)) return 'documents'
  return 'other'
}

const getFileIcon = (file: FileItem) => {
  if (file.isFolder) {
    return (
      <div className="relative">
        <Folder className="w-full h-full text-blue-400 drop-shadow-2xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-lg blur-lg"></div>
      </div>
    )
  }
  
  // Show thumbnail for images/videos if available
  if (file.thumbnail && getFileCategory(file.name) === 'images') {
    return (
      <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 relative">
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
      <div className="w-full h-full rounded-xl overflow-hidden relative shadow-2xl border-2 border-white/20">
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
  
  // Return appropriate icon based on file type
  const category = getFileCategory(file.name)
  switch (category) {
    case 'images':
      return (
        <div className="relative">
          <Image className="w-full h-full text-blue-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-lg blur-lg"></div>
        </div>
      )
    case 'videos':
      return (
        <div className="relative">
          <Video className="w-full h-full text-red-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-pink-500/30 rounded-lg blur-lg"></div>
        </div>
      )
    case 'audio':
      return (
        <div className="relative">
          <Music className="w-full h-full text-green-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-lg blur-lg animate-pulse"></div>
        </div>
      )
    case 'code':
      return (
        <div className="relative">
          <FileCode className="w-full h-full text-purple-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-lg blur-lg"></div>
        </div>
      )
    case 'documents':
      return (
        <div className="relative">
          <FileText className="w-full h-full text-yellow-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-lg blur-lg"></div>
        </div>
      )
    case 'database':
      return (
        <div className="relative">
          <Database className="w-full h-full text-cyan-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-lg blur-lg"></div>
        </div>
      )
    default:
      return (
        <div className="relative">
          <File className="w-full h-full text-gray-400 drop-shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-slate-400/30 rounded-lg blur-lg"></div>
        </div>
      )
  }
}




// Enhanced File Manager Component
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
  const [state, dispatch] = useReducer(fileManagerReducer, initialState)
  const { 
    searchQuery, filterType, sortBy, sortOrder, viewMode, isMobile, 
    showAnalytics, showUploadProgress, selectedFile, selectedFiles, 
    selectedMultiFiles, multiSelectMode, showMultiActions, tabs, activeTabId, contextMenu,
    shareModal, advancedShareModal, compressionOverlay, archiveViewer,
    currentPath, storageStats
  } = state

  // Memoized values
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files.filter(file => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!file.name.toLowerCase().includes(query)) return false
      }
      
      if (filterType !== 'all') {
        const category = getFileCategory(file.name)
        if (category !== filterType) return false
      }
      
      return true
    })

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'size':
          comparison = (a.size || 0) - (b.size || 0)
          break
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [files, searchQuery, filterType, sortBy, sortOrder])

  // Actions
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }, [])

  const setFilterType = useCallback((type: FileManagerState['filterType']) => {
    dispatch({ type: 'SET_FILTER_TYPE', payload: type })
  }, [])

  const setSortBy = useCallback((sort: FileManagerState['sortBy']) => {
    dispatch({ type: 'SET_SORT_BY', payload: sort })
  }, [])

  const setSortOrder = useCallback((order: FileManagerState['sortOrder']) => {
    dispatch({ type: 'SET_SORT_ORDER', payload: order })
  }, [])

  const setViewMode = useCallback((mode: FileManagerState['viewMode']) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode })
  }, [])

  const setMultiSelectMode = useCallback((mode: boolean) => {
    dispatch({ type: 'SET_MULTI_SELECT_MODE', payload: mode })
  }, [])

  const setShowAnalytics = useCallback((show: boolean) => {
    dispatch({ type: 'SET_ANALYTICS', payload: show })
  }, [])

  const setShowUploadProgress = useCallback((show: boolean) => {
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: show })
  }, [])

  const setShowMultiActions = useCallback((show: boolean) => {
    dispatch({ type: 'SET_MULTI_ACTIONS', payload: show })
  }, [])

  const setSelectedMultiFiles = useCallback((files: Set<string>) => {
    dispatch({ type: 'SET_SELECTED_MULTI_FILES', payload: files })
  }, [])

  const setCurrentPath = useCallback((path: string[]) => {
    dispatch({ type: 'SET_CURRENT_PATH', payload: path })
  }, [])

  // Tab management functions
  const openFileInTab = useCallback((file: FileItem) => {
    const tabId = `file-${file.id || Date.now()}`
    const newTab: TabItem = {
      id: tabId,
      title: file.name,
      type: 'file',
      content: (
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-6 border border-white/10">
          <AdvancedFileEditor
            file={{
              id: file.id || `file-${Date.now()}`,
              name: file.name,
              content: file.content || '',
              type: detectFileType(file.name),
              size: file.size || 0,
              lastModified: file.lastModified || new Date(file.created_at)
            }}
            onSave={(fileName, content, fileType) => {
              if (onFileUpdate) {
                onFileUpdate({ ...file, content, name: fileName })
              }
            }}
            onClose={() => closeTab(tabId)}
            readOnly={false}
          />
        </div>
      ),
      isActive: true
    }
    
    dispatch({ type: 'ADD_TAB', payload: newTab })
  }, [onFileUpdate])

  const closeTab = useCallback((tabId: string) => {
    dispatch({ type: 'REMOVE_TAB', payload: tabId })
  }, [])

  const activateTab = useCallback((tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId })
  }, [])

  // File type detection
  const detectFileType = useCallback((filename: string): string => {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
    
    if (['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'].includes(ext)) return 'audio'
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'].includes(ext)) return 'image'
    if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'].includes(ext)) return 'video'
    if (['.db', '.sqlite', '.sqlite3', '.sql'].includes(ext)) return 'database'
    if (['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.swift', '.kt'].includes(ext)) return 'code'
    if (['.txt', '.md', '.json', '.csv', '.log', '.rtf'].includes(ext)) return 'text'
    
    return 'text'
  }, [])

  // File handlers
  const handleFileClick = useCallback((file: FileItem) => {
    if (file.isFolder) {
      const newPath = [...currentPath, file.name]
      setCurrentPath(newPath)
      return
    }
    
    if (isDatabaseFile(file.name)) {
      const tabId = `db-${file.id || Date.now()}`
      const newTab: TabItem = {
        id: tabId,
        title: file.name,
        type: 'database',
        content: (
          <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-6 border border-white/10">
            <AdvancedDatabaseEditor
              file={file}
              onClose={() => closeTab(tabId)}
              readOnly={false}
            />
          </div>
        ),
        isActive: true
      }
      
      dispatch({ type: 'ADD_TAB', payload: newTab })
    } else if (isArchiveFile(file.name)) {
      dispatch({ type: 'SET_ARCHIVE_VIEWER', payload: { isOpen: true, file } })
    } else if (isTextFile(file.name)) {
      openFileInTab(file)
    } else if (isMediaFile(file.name)) {
      const tabId = `media-${file.id || Date.now()}`
      const newTab: TabItem = {
        id: tabId,
        title: file.name,
        type: 'media',
        content: (
          <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-6 border border-white/10">
            <MediaPreview
              file={file}
              onDownload={() => {}}
              onShare={() => {}}
              onLike={() => {}}
              onClose={() => closeTab(tabId)}
            />
          </div>
        ),
        isActive: true
      }
      
      dispatch({ type: 'ADD_TAB', payload: newTab })
    }
  }, [currentPath, setCurrentPath, openFileInTab, closeTab])

  // Context menu handlers
  const handleRightClick = useCallback((file: FileItem, event: React.MouseEvent) => {
    event.preventDefault()
    dispatch({ 
      type: 'SET_CONTEXT_MENU', 
      payload: { file, position: { x: event.clientX, y: event.clientY } } 
    })
  }, [])

  const closeContextMenu = useCallback(() => {
    dispatch({ type: 'SET_CONTEXT_MENU', payload: null })
  }, [])

  // Share handlers
  const handleShare = useCallback((file: FileItem) => {
    dispatch({ type: 'SET_SHARE_MODAL', payload: { isOpen: true, file } })
  }, [])

  const handleAdvancedShare = useCallback((file: FileItem) => {
    dispatch({ type: 'SET_ADVANCED_SHARE_MODAL', payload: { isOpen: true, file } })
  }, [])

  // File type detection helpers
  const isDatabaseFile = useCallback((filename: string): boolean => {
    const dbExtensions = ['db', 'sqlite', 'sqlite3', 'sql']
    const ext = filename.split('.').pop()?.toLowerCase()
    return dbExtensions.includes(ext || '')
  }, [])

  const isArchiveFile = useCallback((filename: string): boolean => {
    const archiveExtensions = ['zip', 'tar', 'gz', 'tar.gz', '7z', 'rar']
    const ext = filename.split('.').pop()?.toLowerCase()
    const fullExt = filename.toLowerCase()
    return archiveExtensions.includes(ext || '') || fullExt.endsWith('.tar.gz')
  }, [])

  const isTextFile = useCallback((filename: string): boolean => {
    const textExtensions = [
      'txt', 'md', 'json', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss',
      'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift', 'kt',
      'xml', 'yaml', 'yml', 'sql', 'csv', 'log'
    ]
    const ext = filename.split('.').pop()?.toLowerCase()
    return textExtensions.includes(ext || '')
  }, [])

  const isMediaFile = useCallback((filename: string): boolean => {
    const mediaExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp',
      'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv',
      'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'
    ]
    const ext = filename.split('.').pop()?.toLowerCase()
    return mediaExtensions.includes(ext || '')
  }, [])

  // File creation handlers
  const handleCreateFile = useCallback(() => {
    // Implementation for file creation
    console.log('Create file clicked')
  }, [])

  const handleCreateFolder = useCallback(() => {
    // Implementation for folder creation
    console.log('Create folder clicked')
  }, [])

  // Multi-select handlers
  const toggleMultiSelect = useCallback((fileId: string) => {
    const newSelectedFiles = new Set(selectedMultiFiles)
    if (newSelectedFiles.has(fileId)) {
      newSelectedFiles.delete(fileId)
    } else {
      newSelectedFiles.add(fileId)
    }
    setSelectedMultiFiles(newSelectedFiles)
    
    // Show multi-actions if files are selected
    if (newSelectedFiles.size > 0) {
      setShowMultiActions(true)
    } else {
      setShowMultiActions(false)
    }
  }, [selectedMultiFiles, setSelectedMultiFiles, setShowMultiActions])

  const clearMultiSelect = useCallback(() => {
    setSelectedMultiFiles(new Set())
    setShowMultiActions(false)
  }, [setSelectedMultiFiles, setShowMultiActions])

  // Long press handler for mobile
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null)

  const handleTouchStart = useCallback((file: FileItem) => {
    const timer = window.setTimeout(() => {
      // Long press detected - enter multi-select mode
      const newSelectedFiles = new Set(selectedMultiFiles)
      newSelectedFiles.add(file.id)
      setSelectedMultiFiles(newSelectedFiles)
      setShowMultiActions(true)
    }, 500)
    setLongPressTimer(timer)
  }, [selectedMultiFiles, setSelectedMultiFiles, setShowMultiActions])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }, [longPressTimer])

  // Multi-action handlers
  const handleMultiAction = useCallback({
    compress: () => {
      if (selectedMultiFiles.size > 0) {
        dispatch({ 
          type: 'SET_COMPRESSION_OVERLAY', 
          payload: { isOpen: true, files: files.filter(f => selectedMultiFiles.has(f.id)) } 
        })
      }
    },
    share: () => {
      if (selectedMultiFiles.size > 0) {
        const firstFile = files.find(f => selectedMultiFiles.has(f.id))
        if (firstFile) {
          handleAdvancedShare(firstFile)
        }
      }
    },
    delete: () => {
      if (selectedMultiFiles.size > 0) {
        // Handle bulk delete
        console.log('Deleting files:', Array.from(selectedMultiFiles))
        clearMultiSelect()
      }
    }
  }, [selectedMultiFiles, files, handleAdvancedShare, clearMultiSelect])

  // Professional modal hooks
  const { showInput, showConfirm, showAlert } = useProfessionalModal()
  const { showInput: showInputModal } = useProfessionalInput()

  return (
    <div className="space-y-6">
      {/* Breadcrumb Path */}
      <BreadcrumbPath 
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        className="mb-4"
      />
      
      {/* Responsive Layouts */}
      {isMobile ? (
        <MobileLayout
          files={files}
          filteredAndSortedFiles={filteredAndSortedFiles}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
          handleCreateFile={handleCreateFile}
          handleCreateFolder={handleCreateFolder}
          setShowUploadProgress={setShowUploadProgress}
          handleFileClick={handleFileClick}
          handleRightClick={handleRightClick}
          handleShare={handleShare}
          handleAdvancedShare={handleAdvancedShare}
          selectedFiles={selectedFiles}
          selectedMultiFiles={selectedMultiFiles} // ✅ Thêm prop này
          toggleMultiSelect={toggleMultiSelect}
          clearMultiSelect={clearMultiSelect}
          multiSelectMode={multiSelectMode}
          showMultiActions={showMultiActions}
          setShowMultiActions={setShowMultiActions}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          handleMultiAction={handleMultiAction} // ✅ Thêm prop này
          getFileCategory={getFileCategory}
          getFileIcon={getFileIcon}
        />
      ) : (
        <DesktopLayout
          files={files}
          filteredAndSortedFiles={filteredAndSortedFiles}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showAnalytics={showAnalytics}
          setShowAnalytics={setShowAnalytics}
          setShowUploadProgress={setShowUploadProgress}
          handleCreateFile={handleCreateFile}
          handleCreateFolder={handleCreateFolder}
          handleFileClick={handleFileClick}
          handleRightClick={handleRightClick}
          handleShare={handleShare}
          handleAdvancedShare={handleAdvancedShare}
          selectedFiles={selectedFiles}
          selectedMultiFiles={selectedMultiFiles} // ✅ Thêm prop này
          toggleMultiSelect={toggleMultiSelect}
          clearMultiSelect={clearMultiSelect}
          multiSelectMode={multiSelectMode}
          showMultiActions={showMultiActions}
          setShowMultiActions={setShowMultiActions}
          handleMultiAction={handleMultiAction} // ✅ Thêm prop này
          getFileCategory={getFileCategory}
          getFileIcon={getFileIcon}
        />
      )}

      {/* Tab System */}
      {tabs.length > 0 && (
        <TabSystem
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={activateTab}
          onTabClose={closeTab}
          className="mt-6"
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <FileContextMenu
          file={contextMenu.file}
          position={contextMenu.position}
          onClose={closeContextMenu}
          onShare={handleShare}
          onAdvancedShare={handleAdvancedShare}
          onDelete={onFileDelete}
          isAdmin={isAdmin}
        />
      )}

      {/* Modals */}
      {shareModal.isOpen && (
        <SimpleShareModal
          file={shareModal.file}
          onClose={() => dispatch({ type: 'SET_SHARE_MODAL', payload: { isOpen: false, file: null } })}
        />
      )}

      {advancedShareModal.isOpen && (
        <AdvancedShareModal
          file={advancedShareModal.file}
          onClose={() => dispatch({ type: 'SET_ADVANCED_SHARE_MODAL', payload: { isOpen: false, file: null } })}
        />
      )}

      {/* Overlays */}
      {compressionOverlay.isOpen && (
        <CompressionOverlay
          files={compressionOverlay.files}
          onClose={() => dispatch({ type: 'SET_COMPRESSION_OVERLAY', payload: { isOpen: false, files: [] } })}
        />
      )}

      {archiveViewer.isOpen && (
        <ArchiveViewer
          file={archiveViewer.file}
          onClose={() => dispatch({ type: 'SET_ARCHIVE_VIEWER', payload: { isOpen: false, file: null } })}
        />
      )}
    </div>
  )
}
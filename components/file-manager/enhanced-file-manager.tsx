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




// Mobile-specific layout component
const MobileLayout = ({ 
  files, 
  filteredAndSortedFiles, 
  searchQuery, 
  setSearchQuery, 
  filterType, 
  setFilterType, 
  showAnalytics, 
  setShowAnalytics, 
  handleCreateFile, 
  handleCreateFolder, 
  setShowUploadProgress, 
  handleFileClick, 
  handleLongPressStart, 
  handleLongPressEnd, 
  showMultiActions, 
  selectedMultiFiles, 
  handleMultiAction, 
  clearSelection 
}: any) => (
  <div className="space-y-4 md:hidden">
    {/* Mobile Header */}
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Files</h1>
          <p className="text-sm text-gray-400">{filteredAndSortedFiles?.length || 0} items</p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="bg-purple-500/20 text-purple-300 border-purple-500/30"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-black/40 border-purple-500/30 text-white h-12 text-base"
        />
      </div>

      {/* Mobile Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={handleCreateFile}
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-12 text-sm font-medium"
        >
          <FilePlus className="w-4 h-4 mr-2" />
          New File
        </Button>
        <Button
          onClick={handleCreateFolder}
          variant="outline"
          className="border-purple-500/30 text-purple-300 h-12 text-sm font-medium"
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          Folder
        </Button>
        <Button
          onClick={() => setShowUploadProgress(true)}
          variant="outline"
          className="border-purple-500/30 text-purple-300 h-12 text-sm font-medium"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>
    </div>

    {/* Mobile Filters */}
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Button
        size="sm"
        variant={filterType === "all" ? "default" : "outline"}
        onClick={() => setFilterType("all")}
        className="bg-gradient-to-r from-purple-500 to-pink-500 whitespace-nowrap"
      >
        All
      </Button>
      <Button
        size="sm"
        variant={filterType === "images" ? "default" : "outline"}
        onClick={() => setFilterType("images")}
        className="whitespace-nowrap"
      >
        Images
      </Button>
      <Button
        size="sm"
        variant={filterType === "documents" ? "default" : "outline"}
        onClick={() => setFilterType("documents")}
        className="whitespace-nowrap"
      >
        Documents
      </Button>
      <Button
        size="sm"
        variant={filterType === "code" ? "default" : "outline"}
        onClick={() => setFilterType("code")}
        className="whitespace-nowrap"
      >
        Code
      </Button>
    </div>

    {/* Mobile File Grid */}
    <div className="grid grid-cols-2 gap-3">
      {(filteredAndSortedFiles || []).map((file: any) => file && (
        <div
          key={file.id}
          className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-xl p-4 border border-purple-500/20 cursor-pointer touch-target"
          onClick={() => handleFileClick(file)}
          onTouchStart={(e) => handleLongPressStart(file, e)}
          onTouchEnd={handleLongPressEnd}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3">
              {/* Dynamic File Icon */}
              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30 shadow-lg">
                {getFileIcon(file)}
              </div>
            </div>
            <p className="text-white text-sm font-medium truncate mb-1" title={file.name}>
              {file.name}
            </p>
            <p className="text-gray-400 text-xs mb-2">
              {formatBytes(file.size)}
            </p>
            
            {/* Mobile Status Badges */}
            <div className="flex justify-center gap-1">
              {file.isStarred && (
                <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
              )}
              {file.isShared && (
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Share2 className="w-3 h-3 text-green-400" />
                </div>
              )}
              {file.hasPassword && (
                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-3 h-3 text-red-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Mobile Multi-select Actions */}
    {showMultiActions && (
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-black/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 shadow-2xl">
          <div className="text-center mb-3">
            <span className="text-white text-sm font-medium">
              {selectedMultiFiles.size} files selected
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              onClick={handleMultiAction.compress}
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-10"
            >
              <Archive className="w-4 h-4 mr-2" />
              Compress
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleMultiAction.share}
              className="border-purple-500/30 text-purple-300 h-10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleMultiAction.delete}
              className="border-red-600 text-red-400 h-10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSelection}
              className="text-gray-400 h-10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
)

// Desktop power-user layout component
const DesktopLayout = ({ 
  files, 
  filteredAndSortedFiles, 
  searchQuery, 
  setSearchQuery, 
  filterType, 
  setFilterType, 
  sortBy, 
  setSortBy, 
  sortOrder, 
  setSortOrder, 
  viewMode, 
  setViewMode, 
  showAnalytics, 
  setShowAnalytics, 
  setShowUploadProgress, 
  handleCreateFile, 
  handleCreateFolder, 
  multiSelectMode, 
  setMultiSelectMode, 
  selectedMultiFiles, 
  toggleMultiSelect, 
  handleFileClick, 
  handleRightClick, 
  getFileCategory 
}: any) => (
  <div className="hidden md:block space-y-6">
    {/* Desktop Header with Advanced Controls */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">File Manager</h1>
        <p className="text-gray-400 text-lg">{filteredAndSortedFiles?.length || 0} of {files?.length || 0} items</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setShowAnalytics(!showAnalytics)}
          variant="outline"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        <Button
          onClick={() => setShowUploadProgress(true)}
          variant="outline"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
        <Button
          onClick={handleCreateFile}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <FilePlus className="w-4 h-4 mr-2" />
          New File
        </Button>
      </div>
    </div>

    {/* Desktop Advanced Controls */}
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search files, folders, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-purple-500/20 text-white h-12 text-base"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-slate-800/50 border border-purple-500/20 text-white text-base rounded px-3 py-2 h-12"
        >
          <option value="all">All Files</option>
          <option value="images">Images</option>
          <option value="videos">Videos</option>
          <option value="audio">Audio</option>
          <option value="documents">Documents</option>
          <option value="code">Code</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-slate-800/50 border border-purple-500/20 text-white text-base rounded px-3 py-2 h-12"
        >
          <option value="name">Name</option>
          <option value="size">Size</option>
          <option value="date">Date</option>
        </select>
        
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 h-12 w-12"
        >
          {sortOrder === "asc" ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          onClick={() => setViewMode("grid")}
          className="h-12 px-4"
        >
          <Grid className="w-4 h-4 mr-2" />
          Grid
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => setViewMode("list")}
          className="h-12 px-4"
        >
          <List className="w-4 h-4 mr-2" />
          List
        </Button>
      </div>
    </div>

    {/* Desktop File Management */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* File Display */}
        <Card className="glass-card">
          <CardContent className="p-6">
            {(filteredAndSortedFiles?.length || 0) === 0 ? (
              <div className="text-center py-16">
                <File className="w-20 h-20 mx-auto mb-6 text-gray-500" />
                <h3 className="text-2xl font-semibold text-white mb-3">No files found</h3>
                <p className="text-gray-400 text-lg mb-6">
                  {searchQuery ? "Try adjusting your search query" : "Upload your first file to get started"}
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={handleCreateFile} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <FilePlus className="w-4 h-4 mr-2" />
                    Create File
                  </Button>
                  <Button onClick={() => setShowUploadProgress(true)} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
                  : "space-y-3"
              }>
                {/* Desktop File Items */}
                {(filteredAndSortedFiles || []).map((file: any, index: number) => file && (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.05,
                      type: "spring",
                      damping: 20,
                      stiffness: 100
                    }}
                    className={`group cursor-pointer rounded-xl border transition-all duration-300 relative hover:scale-105 hover:shadow-2xl ${
                      selectedMultiFiles.has(file.id) 
                        ? "border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/10 shadow-lg shadow-purple-500/25" 
                        : "border-gray-700/30 hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-slate-800/40 hover:to-slate-900/60"
                    } ${
                      viewMode === "grid"
                        ? "p-6 text-center bg-gradient-to-br from-slate-800/20 to-slate-900/30 min-h-[220px] flex flex-col items-center justify-center backdrop-blur-sm"
                        : "p-4 flex items-center gap-4 bg-slate-800/20 min-h-[80px]"
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
                  >
                    {/* Desktop Multi-select */}
                    {multiSelectMode && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                          selectedMultiFiles.has(file.id)
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 shadow-lg'
                            : 'bg-black/60 border-gray-400'
                        }`}>
                          {selectedMultiFiles.has(file.id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Desktop Status Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {file.isStarred && (
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                          <Star className="w-4 h-4 text-white fill-current" />
                        </div>
                      )}
                      {file.hasPassword && (
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {file.isShared && (
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {viewMode === "grid" ? (
                      // Desktop Grid View
                      <>
                        <div className="mb-4 relative">
                          <div className="transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
                            <div className="w-16 h-16">
                              {/* Dynamic File Icon */}
                              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30 shadow-lg">
                                {getFileIcon(file)}
                              </div>
                            </div>
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="space-y-3 text-center">
                          <p className="text-white text-base font-semibold truncate px-2 leading-tight" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {formatBytes(file.size, 2, file.isFolder)}
                          </p>
                          <div className="flex justify-center items-center gap-2 mt-4">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-100"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Desktop List View
                      <>
                        <div className="flex-shrink-0">
                          <div className="transform transition-all duration-300 group-hover:scale-110">
                            <div className="w-12 h-12">
                              {/* Dynamic File Icon */}
                              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30 shadow-md">
                                {getFileIcon(file)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-lg font-semibold truncate" title={file.name}>
                                {file.name}
                              </p>
                              <div className="flex items-center space-x-6 mt-2">
                                <p className="text-gray-400 text-sm">
                                  {formatBytes(file.size, 2, file.isFolder)}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  {new Date(file.lastModified).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 ml-6">
                              {file.isStarred && (
                                <Star className="w-5 h-5 text-yellow-400 fill-current animate-pulse" />
                              )}
                              {file.isShared && (
                                <Share2 className="w-5 h-5 text-green-400" />
                              )}
                              {file.hasPassword && (
                                <Lock className="w-5 h-5 text-red-400" />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRightClick(file, e)
                                }}
                                className="p-2 text-gray-400 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg hover:scale-110"
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Desktop Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleCreateFolder}
              variant="outline"
              className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            <Button
              onClick={() => setMultiSelectMode(!multiSelectMode)}
              variant="outline"
              className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {multiSelectMode ? 'Exit Select' : 'Multi Select'}
            </Button>
            <Button
              onClick={() => setShowAnalytics(!showAnalytics)}
              variant="outline"
              className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </CardContent>
        </Card>

        {/* File Stats */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-lg">File Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                    <span className="text-white">{formatBytes(files.reduce((acc, f) => acc + (f.size || 0), 0))}</span>
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
      </div>
    </div>
  </div>
)

export function EnhancedFileManager({ 
  files, 
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
    multiSelectMode, showMultiActions, tabs, activeTabId, contextMenu,
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

  const setShowAnalytics = useCallback((show: boolean) => {
    dispatch({ type: 'SET_ANALYTICS', payload: show })
  }, [])

  const setShowUploadProgress = useCallback((show: boolean) => {
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: show })
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
  }, [])

  const handleCreateFolder = useCallback(() => {
    // Implementation for folder creation
  }, [])

  // Multi-select handlers
  const toggleMultiSelect = useCallback((fileId: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    dispatch({ type: 'SET_SELECTED_FILES', payload: newSelected })
    dispatch({ type: 'SET_MULTI_SELECT_MODE', payload: newSelected.size > 0 })
  }, [selectedFiles])

  const clearMultiSelect = useCallback(() => {
    dispatch({ type: 'SET_SELECTED_FILES', payload: new Set() })
    dispatch({ type: 'SET_MULTI_SELECT_MODE', payload: false })
  }, [])

  // Long press handler for mobile
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null)

  const handleTouchStart = useCallback((file: FileItem) => {
    const timer = window.setTimeout(() => {
      dispatch({ type: 'SET_MULTI_SELECT_MODE', payload: true })
      toggleMultiSelect(file.id)
    }, 500)
    setLongPressTimer(timer)
  }, [toggleMultiSelect])

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }, [longPressTimer])

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
          toggleMultiSelect={toggleMultiSelect} 
          clearMultiSelect={clearMultiSelect} 
          multiSelectMode={multiSelectMode} 
          showMultiActions={showMultiActions} 
          setShowMultiActions={setShowMultiActions} 
          handleTouchStart={handleTouchStart} 
          handleTouchEnd={handleTouchEnd} 
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
          handleCreateFile={handleCreateFile} 
          handleCreateFolder={handleCreateFolder} 
          setShowUploadProgress={setShowUploadProgress} 
          handleFileClick={handleFileClick} 
          handleRightClick={handleRightClick} 
          handleShare={handleShare} 
          handleAdvancedShare={handleAdvancedShare} 
          selectedFiles={selectedFiles} 
          toggleMultiSelect={toggleMultiSelect} 
          clearMultiSelect={clearMultiSelect} 
          multiSelectMode={multiSelectMode} 
          showMultiActions={showMultiActions} 
          setShowMultiActions={setShowMultiActions} 
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
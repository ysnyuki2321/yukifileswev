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
import { ProfessionalFileEditor } from "@/components/file-editor/professional-file-editor"
import { SQLiteGUIEditor } from "@/components/file-editor/sqlite-gui-editor"
import { FilePreviewContent } from "@/components/file-preview/FilePreview"
import { FileContextMenu } from "@/components/ui/file-context-menu"
import { ShareSystem } from "@/components/ui/share-system"
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
  
  // Context Menu & Share
  contextMenu: { file: FileItem | null; position: { x: number; y: number } | null }
  showShareSystem: boolean
  selectedFileForShare: FileItem | null
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
  | { type: 'SHOW_CONTEXT_MENU'; payload: { file: FileItem; position: { x: number; y: number } } }
  | { type: 'HIDE_CONTEXT_MENU' }
  | { type: 'SHOW_SHARE_SYSTEM'; payload: FileItem }
  | { type: 'HIDE_SHARE_SYSTEM' }

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
  storageStats: { used: 0, total: 0 },
  contextMenu: { file: null, position: null },
  showShareSystem: false,
  selectedFileForShare: null
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
    case 'SHOW_CONTEXT_MENU':
      return { ...state, contextMenu: action.payload }
    case 'HIDE_CONTEXT_MENU':
      return { ...state, contextMenu: { file: null, position: null } }
    case 'SHOW_SHARE_SYSTEM':
      return { ...state, showShareSystem: true, selectedFileForShare: action.payload }
    case 'HIDE_SHARE_SYSTEM':
      return { ...state, showShareSystem: false, selectedFileForShare: null }
    default:
      return state
  }
}

// Mock data - Rich demo files for testing
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'document.txt',
    original_name: 'document.txt',
    mime_type: 'text/plain',
    file_size: 1024,
    size: 1024,
    created_at: '2024-01-15T10:30:00Z',
    content: 'This is a sample text document with some content to demonstrate the text editor functionality.',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    lastModified: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    name: 'sample-image.jpg',
    original_name: 'sample-image.jpg',
    mime_type: 'image/jpeg',
    file_size: 2048576,
    size: 2048576,
    created_at: '2024-01-16T14:20:00Z',
    content: 'https://picsum.photos/800/600?random=1',
    thumbnail: 'https://picsum.photos/300/200?random=1',
    is_starred: true,
    isStarred: true,
    is_public: true,
    lastModified: new Date('2024-01-16T14:20:00Z')
  },
  {
    id: '3',
    name: 'sample-video.mp4',
    original_name: 'sample-video.mp4',
    mime_type: 'video/mp4',
    file_size: 15728640,
    size: 15728640,
    created_at: '2024-01-17T09:15:00Z',
    content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://picsum.photos/300/200?random=2',
    is_starred: false,
    isStarred: false,
    is_public: true,
    lastModified: new Date('2024-01-17T09:15:00Z')
  },
  {
    id: '4',
    name: 'sample-music.mp3',
    original_name: 'sample-music.mp3',
    mime_type: 'audio/mpeg',
    file_size: 5242880,
    size: 5242880,
    created_at: '2024-01-18T11:00:00Z',
    content: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: 'https://picsum.photos/300/200?random=3',
    is_starred: true,
    isStarred: true,
    is_public: true,
    lastModified: new Date('2024-01-18T11:00:00Z')
  },
  {
    id: '5',
    name: 'database.db',
    original_name: 'database.db',
    mime_type: 'application/x-sqlite3',
    file_size: 1048576,
    size: 1048576,
    created_at: '2024-01-19T09:15:00Z',
    content: '',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    lastModified: new Date('2024-01-19T09:15:00Z')
  },
  {
    id: '6',
    name: 'code.js',
    original_name: 'code.js',
    mime_type: 'application/javascript',
    file_size: 2048,
    size: 2048,
    created_at: '2024-01-20T12:00:00Z',
    content: 'function hello() {\n  console.log("Hello, World!");\n  return "Hello from YukiFiles!";\n}\n\n// Sample JavaScript code\nexport default hello;',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    lastModified: new Date('2024-01-20T12:00:00Z')
  },
  {
    id: '11',
    name: 'README.md',
    original_name: 'README.md',
    mime_type: 'text/markdown',
    file_size: 1536,
    size: 1536,
    created_at: '2024-01-31T08:00:00Z',
    content: '# Welcome to YukiFiles!\n\nThis is a **secure file sharing platform** with:\n\n- 🔐 **Enterprise Security** - Bank-level encryption\n- 📱 **Responsive Design** - Works on all devices\n- 🎨 **Beautiful UI** - Modern gradient design\n- 🚀 **Fast Performance** - Global CDN delivery\n\n## Features\n\n- File preview (images, videos, music)\n- Text and code editing\n- Database management\n- Secure sharing\n- Mobile optimized\n\n*Start exploring by clicking on files and folders!*',
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: true,
    lastModified: new Date('2024-01-31T08:00:00Z')
  },
  {
    id: '12',
    name: 'config.json',
    original_name: 'config.json',
    mime_type: 'application/json',
    file_size: 512,
    size: 512,
    created_at: '2024-02-01T10:00:00Z',
    content: '{\n  "app": "YukiFiles",\n  "version": "1.0.0",\n  "features": {\n    "filePreview": true,\n    "videoPlayer": true,\n    "musicPlayer": true,\n    "textEditor": true,\n    "databaseEditor": true\n  },\n  "theme": "dark",\n  "responsive": true\n}',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    lastModified: new Date('2024-02-01T10:00:00Z')
  },
  {
    id: '13',
    name: 'sample.csv',
    original_name: 'sample.csv',
    mime_type: 'text/csv',
    file_size: 256,
    size: 256,
    created_at: '2024-02-02T11:00:00Z',
    content: 'Name,Age,City\nJohn,25,New York\nJane,30,Los Angeles\nBob,35,Chicago\nAlice,28,Boston',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    lastModified: new Date('2024-02-02T11:00:00Z')
  },
  {
    id: '14',
    name: 'logo.svg',
    original_name: 'logo.svg',
    mime_type: 'image/svg+xml',
    file_size: 1024,
    size: 1024,
    created_at: '2024-02-03T12:00:00Z',
    content: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="purple" stroke-width="3" fill="pink"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="12">YF</text></svg>',
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: true,
    lastModified: new Date('2024-02-03T12:00:00Z')
  },
  {
    id: '15',
    name: 'project-files.zip',
    original_name: 'project-files.zip',
    mime_type: 'application/zip',
    file_size: 5120000,
    size: 5120000,
    created_at: '2024-02-04T10:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    lastModified: new Date('2024-02-04T10:00:00Z')
  },
  {
    id: '16',
    name: 'backup-data.tar.gz',
    original_name: 'backup-data.tar.gz',
    mime_type: 'application/gzip',
    file_size: 8192000,
    size: 8192000,
    created_at: '2024-02-05T11:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: false,
    lastModified: new Date('2024-02-05T11:00:00Z')
  },
  {
    id: '7',
    name: 'Documents',
    original_name: 'Documents',
    mime_type: 'inode/directory',
    file_size: 0,
    size: 0,
    created_at: '2024-01-21T11:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isFolder: true,
    lastModified: new Date('2024-01-21T11:00:00Z')
  },
  {
    id: '8',
    name: 'Pictures',
    original_name: 'Pictures',
    mime_type: 'inode/directory',
    file_size: 0,
    size: 0,
    created_at: '2024-01-22T14:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: true,
    isFolder: true,
    lastModified: new Date('2024-01-22T14:00:00Z')
  },
  {
    id: '9',
    name: 'Music',
    original_name: 'Music',
    mime_type: 'inode/directory',
    file_size: 0,
    size: 0,
    created_at: '2024-01-23T10:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isFolder: true,
    lastModified: new Date('2024-01-23T10:00:00Z')
  },
  {
    id: '10',
    name: 'Videos',
    original_name: 'Videos',
    mime_type: 'inode/directory',
    file_size: 0,
    size: 0,
    created_at: '2024-01-24T15:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: true,
    isFolder: true,
    lastModified: new Date('2024-01-24T15:00:00Z')
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
    // Get current files based on path
    let currentFiles = [...mockFiles]
    
    // If we're in a folder, show folder contents
    if (currentPath.length > 0) {
      const currentFolder = currentPath[currentPath.length - 1]
      currentFiles = getFolderFiles(currentFolder)
    }
    
    let filtered = currentFiles.filter(file => {
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

  // Demo files for folders
  const getFolderFiles = (folderName: string): FileItem[] => {
    switch (folderName) {
      case 'Documents':
        return [
          {
            id: 'doc1',
            name: 'report.pdf',
            original_name: 'report.pdf',
            mime_type: 'application/pdf',
            file_size: 512000,
            size: 512000,
            created_at: '2024-01-25T09:00:00Z',
            content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            thumbnail: null,
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-01-25T09:00:00Z')
          },
          {
            id: 'doc2',
            name: 'presentation.pptx',
            original_name: 'presentation.pptx',
            mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            file_size: 2048000,
            size: 2048000,
            created_at: '2024-01-26T14:00:00Z',
            content: '',
            thumbnail: null,
            is_starred: true,
            isStarred: true,
            is_public: false,
            lastModified: new Date('2024-01-26T14:00:00Z')
          },
          {
            id: 'doc3',
            name: 'meeting-notes.txt',
            original_name: 'meeting-notes.txt',
            mime_type: 'text/plain',
            file_size: 768,
            size: 768,
            created_at: '2024-01-27T15:00:00Z',
            content: 'Meeting Notes - Project Kickoff\n\nDate: January 27, 2024\nAttendees: John, Jane, Bob\n\nAgenda:\n1. Project overview\n2. Timeline discussion\n3. Resource allocation\n\nAction Items:\n- John: Prepare technical specs\n- Jane: Create project plan\n- Bob: Set up development environment\n\nNext meeting: February 3, 2024',
            thumbnail: null,
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-01-27T15:00:00Z')
          },
          {
            id: 'doc4',
            name: 'budget.xlsx',
            original_name: 'budget.xlsx',
            mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            file_size: 1536000,
            size: 1536000,
            created_at: '2024-01-28T09:00:00Z',
            content: '',
            thumbnail: null,
            is_starred: true,
            isStarred: true,
            is_public: false,
            lastModified: new Date('2024-01-28T09:00:00Z')
          },
          {
            id: 'doc5',
            name: 'contract.pdf',
            original_name: 'contract.pdf',
            mime_type: 'application/pdf',
            file_size: 1024000,
            size: 1024000,
            created_at: '2024-01-29T13:00:00Z',
            content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            thumbnail: null,
            is_starred: false,
            isStarred: false,
            is_public: false,
            lastModified: new Date('2024-01-29T13:00:00Z')
          },
          {
            id: 'doc6',
            name: 'manual.docx',
            original_name: 'manual.docx',
            mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            file_size: 3072000,
            size: 3072000,
            created_at: '2024-01-30T14:00:00Z',
            content: '',
            thumbnail: null,
            is_starred: true,
            isStarred: true,
            is_public: false,
            lastModified: new Date('2024-01-30T14:00:00Z')
          },
          {
            id: 'doc7',
            name: 'data.csv',
            original_name: 'data.csv',
            mime_type: 'text/csv',
            file_size: 1024,
            size: 1024,
            created_at: '2024-01-31T15:00:00Z',
            content: 'Product,Price,Stock\nLaptop,999,50\nMouse,25,200\nKeyboard,75,100\nMonitor,299,30\nHeadphones,150,80',
            thumbnail: null,
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-01-31T15:00:00Z')
          },
          {
            id: 'doc8',
            name: 'source-code.zip',
            original_name: 'source-code.zip',
            mime_type: 'application/zip',
            file_size: 2048000,
            size: 2048000,
            created_at: '2024-02-01T16:00:00Z',
            content: '',
            thumbnail: null,
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-02-01T16:00:00Z')
          }
        ]
      case 'Pictures':
        return [
          {
            id: 'pic1',
            name: 'nature.jpg',
            original_name: 'nature.jpg',
            mime_type: 'image/jpeg',
            file_size: 3072000,
            size: 3072000,
            created_at: '2024-01-27T11:00:00Z',
            content: 'https://picsum.photos/1200/800?random=4',
            thumbnail: 'https://picsum.photos/300/200?random=4',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-01-27T11:00:00Z')
          },
          {
            id: 'pic2',
            name: 'city.jpg',
            original_name: 'city.jpg',
            mime_type: 'image/jpeg',
            file_size: 2560000,
            size: 2560000,
            created_at: '2024-01-28T16:00:00Z',
            content: 'https://picsum.photos/1200/800?random=5',
            thumbnail: 'https://picsum.photos/300/200?random=5',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-01-28T16:00:00Z')
          },
          {
            id: 'pic3',
            name: 'sunset.png',
            original_name: 'sunset.png',
            mime_type: 'image/png',
            file_size: 4096000,
            size: 4096000,
            created_at: '2024-01-29T18:00:00Z',
            content: 'https://picsum.photos/1600/900?random=8',
            thumbnail: 'https://picsum.photos/300/200?random=8',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-01-29T18:00:00Z')
          },
          {
            id: 'pic4',
            name: 'abstract.gif',
            original_name: 'abstract.gif',
            mime_type: 'image/gif',
            file_size: 2048000,
            size: 2048000,
            created_at: '2024-02-01T10:00:00Z',
            content: 'https://picsum.photos/800/600?random=11',
            thumbnail: 'https://picsum.photos/300/200?random=11',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-02-01T10:00:00Z')
          },
          {
            id: 'pic5',
            name: 'portrait.jpg',
            original_name: 'portrait.jpg',
            mime_type: 'image/jpeg',
            file_size: 3584000,
            size: 3584000,
            created_at: '2024-02-04T11:00:00Z',
            content: 'https://picsum.photos/800/1200?random=14',
            thumbnail: 'https://picsum.photos/300/200?random=14',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-02-04T11:00:00Z')
          },
          {
            id: 'pic6',
            name: 'landscape.webp',
            original_name: 'landscape.webp',
            mime_type: 'image/webp',
            file_size: 2816000,
            size: 2816000,
            created_at: '2024-02-07T12:00:00Z',
            content: 'https://picsum.photos/1600/900?random=17',
            thumbnail: 'https://picsum.photos/300/200?random=17',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-02-07T12:00:00Z')
          },
          {
            id: 'pic7',
            name: 'icon.png',
            original_name: 'icon.png',
            mime_type: 'image/png',
            file_size: 512000,
            size: 512000,
            created_at: '2024-02-10T13:00:00Z',
            content: 'https://picsum.photos/256/256?random=20',
            thumbnail: 'https://picsum.photos/300/200?random=20',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-02-10T13:00:00Z')
          },
          {
            id: 'pic8',
            name: 'banner.jpg',
            original_name: 'banner.jpg',
            mime_type: 'image/jpeg',
            file_size: 1536000,
            size: 1536000,
            created_at: '2024-02-13T14:00:00Z',
            content: 'https://picsum.photos/1920/400?random=23',
            thumbnail: 'https://picsum.photos/300/200?random=23',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-02-13T14:00:00Z')
          }
        ]
      case 'Music':
        return [
          {
            id: 'music1',
            name: 'song1.mp3',
            original_name: 'song1.mp3',
            mime_type: 'audio/mpeg',
            file_size: 8192000,
            size: 8192000,
            created_at: '2024-01-29T12:00:00Z',
            content: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            thumbnail: 'https://picsum.photos/300/200?random=6',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-01-29T12:00:00Z')
          },
          {
            id: 'music2',
            name: 'instrumental.wav',
            original_name: 'instrumental.wav',
            mime_type: 'audio/wav',
            file_size: 12288000,
            size: 12288000,
            created_at: '2024-01-30T13:00:00Z',
            content: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            thumbnail: 'https://picsum.photos/300/200?random=9',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-01-30T13:00:00Z')
          },
          {
            id: 'music3',
            name: 'podcast.mp3',
            original_name: 'podcast.mp3',
            mime_type: 'audio/mpeg',
            file_size: 25600000,
            size: 25600000,
            created_at: '2024-02-02T16:00:00Z',
            content: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            thumbnail: 'https://picsum.photos/300/200?random=12',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-02-02T16:00:00Z')
          },
          {
            id: 'music4',
            name: 'ambient.ogg',
            original_name: 'ambient.ogg',
            mime_type: 'audio/ogg',
            file_size: 18432000,
            size: 18432000,
            created_at: '2024-02-05T14:00:00Z',
            content: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            thumbnail: 'https://picsum.photos/300/200?random=15',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-02-05T14:00:00Z')
          },
          {
            id: 'music5',
            name: 'jingle.m4a',
            original_name: 'jingle.m4a',
            mime_type: 'audio/mp4',
            file_size: 5120000,
            size: 5120000,
            created_at: '2024-02-08T10:00:00Z',
            content: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            thumbnail: 'https://picsum.photos/300/200?random=18',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-02-08T10:00:00Z')
          },
          {
            id: 'music6',
            name: 'soundtrack.flac',
            original_name: 'soundtrack.flac',
            mime_type: 'audio/flac',
            file_size: 45000000,
            size: 45000000,
            created_at: '2024-02-11T17:00:00Z',
            content: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            thumbnail: 'https://picsum.photos/300/200?random=21',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-02-11T17:00:00Z')
          }
        ]
      case 'Videos':
        return [
          {
            id: 'video1',
            name: 'tutorial.mp4',
            original_name: 'tutorial.mp4',
            mime_type: 'video/mp4',
            file_size: 20971520,
            size: 20971520,
            created_at: '2024-01-30T13:00:00Z',
            content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail: 'https://picsum.photos/300/200?random=7',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-01-30T13:00:00Z')
          },
          {
            id: 'video2',
            name: 'demo.webm',
            original_name: 'demo.webm',
            mime_type: 'video/webm',
            file_size: 15728640,
            size: 15728640,
            created_at: '2024-01-31T14:00:00Z',
            content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail: 'https://picsum.photos/300/200?random=10',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-01-31T14:00:00Z')
          },
          {
            id: 'video3',
            name: 'screencast.mp4',
            original_name: 'screencast.mp4',
            mime_type: 'video/mp4',
            file_size: 31457280,
            size: 31457280,
            created_at: '2024-02-03T17:00:00Z',
            content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail: 'https://picsum.photos/300/200?random=13',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-02-03T17:00:00Z')
          },
          {
            id: 'video4',
            name: 'interview.avi',
            original_name: 'interview.avi',
            mime_type: 'video/x-msvideo',
            file_size: 52428800,
            size: 52428800,
            created_at: '2024-02-06T15:00:00Z',
            content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail: 'https://picsum.photos/300/200?random=16',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-02-06T15:00:00Z')
          },
          {
            id: 'video5',
            name: 'presentation.mov',
            original_name: 'presentation.mov',
            mime_type: 'video/quicktime',
            file_size: 41943040,
            size: 41943040,
            created_at: '2024-02-09T16:00:00Z',
            content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail: 'https://picsum.photos/300/200?random=19',
            is_starred: false,
            isStarred: false,
            is_public: true,
            lastModified: new Date('2024-02-09T16:00:00Z')
          },
          {
            id: 'video6',
            name: 'trailer.mkv',
            original_name: 'trailer.mkv',
            mime_type: 'video/x-matroska',
            file_size: 62914560,
            size: 62914560,
            created_at: '2024-02-12T18:00:00Z',
            content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail: 'https://picsum.photos/300/200?random=22',
            is_starred: true,
            isStarred: true,
            is_public: true,
            lastModified: new Date('2024-02-12T18:00:00Z')
          }
        ]
      default:
        return []
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
          <SQLiteGUIEditor
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
          <ProfessionalFileEditor
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
          <FilePreviewContent
            file={{
              id: file.id,
              name: file.name,
              size: file.size || 0,
              mimeType: file.mime_type,
              content: file.content || '',
              url: file.content || file.thumbnail
            }}
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
    dispatch({
      type: 'SHOW_CONTEXT_MENU',
      payload: { file, position: { x: event.clientX, y: event.clientY } }
    })
  }, [dispatch])

  const handleHideContextMenu = useCallback(() => {
    dispatch({ type: 'HIDE_CONTEXT_MENU' })
  }, [dispatch])

  const handleShowShareSystem = useCallback((file: FileItem) => {
    dispatch({ type: 'SHOW_SHARE_SYSTEM', payload: file })
  }, [dispatch])

  const handleHideShareSystem = useCallback(() => {
    dispatch({ type: 'HIDE_SHARE_SYSTEM' })
  }, [dispatch])

  const handleToggleFileVisibility = useCallback((file: FileItem, isPublic: boolean) => {
    // Mock implementation - in real app this would update the backend
    console.log('Toggling visibility for file:', file.id, 'to:', isPublic)
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
              <h1 className={`font-bold text-white ${state.isMobile ? 'text-lg' : 'text-2xl'}`}>File Manager</h1>
              <div className={`flex items-center gap-2 mt-1 ${state.isMobile ? 'flex-col items-start gap-1' : ''}`}>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {state.isMobile ? 'Mobile' : 'Desktop'} Mode
                </Badge>
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-1 text-sm text-gray-400 flex-wrap">
                  <span 
                    className="cursor-pointer hover:text-white transition-colors"
                    onClick={() => setCurrentPath([])}
                  >
                    Root
                  </span>
                  {currentPath.map((folder, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <span className="text-gray-500">/</span>
                      <span 
                        className="cursor-pointer hover:text-white transition-colors"
                        onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                      >
                        {folder}
                      </span>
                    </span>
                  ))}
                </div>
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
      <div className="flex-1 flex flex-col min-h-0">
        {/* File Manager Panel */}
        <div className="w-full flex flex-col">
          {/* Search and Controls */}
          <div className="p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search files..."
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                className={`pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 ${
                  state.isMobile ? 'h-12 text-base' : 'h-10 text-sm'
                }`}
              />
            </div>

            {/* Filter and Sort */}
            <div className={`flex gap-2 ${state.isMobile ? 'flex-col' : 'flex-wrap'}`}>
              {/* Filter Pills */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {['all', 'images', 'videos', 'audio', 'documents', 'code'].map((type) => (
                  <Button
                    key={type}
                    variant={state.filterType === type ? "default" : "outline"}
                    size={state.isMobile ? "default" : "sm"}
                    onClick={() => dispatch({ type: 'SET_FILTER_TYPE', payload: type as any })}
                    className={`whitespace-nowrap transition-all duration-200 ${state.isMobile ? 'min-w-[80px] h-10' : ''} ${
                      state.filterType === type 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg" 
                        : "bg-slate-800/50 border-purple-500/30 text-gray-300 hover:bg-slate-700/50 hover:border-purple-400/50"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Sort Controls */}
              <div className={`flex gap-1 ${state.isMobile ? 'justify-center' : 'ml-auto'}`}>
                <Button
                  variant="outline"
                  size={state.isMobile ? "default" : "sm"}
                  onClick={() => dispatch({ type: 'SET_SORT_ORDER', payload: state.sortOrder === 'asc' ? 'desc' : 'asc' })}
                  className={`border-purple-500/30 text-purple-300 hover:bg-purple-500/10 ${state.isMobile ? 'h-10 px-4' : ''}`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {state.isMobile && <span className="ml-2">Sort</span>}
                </Button>
                <Button
                  variant="outline"
                  size={state.isMobile ? "default" : "sm"}
                  onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: state.viewMode === 'grid' ? 'list' : 'grid' })}
                  className={`border-purple-500/30 text-purple-300 hover:bg-slate-700/50 ${state.isMobile ? 'h-10 px-4' : ''}`}
                >
                  {state.viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                  {state.isMobile && <span className="ml-2">{state.viewMode === 'grid' ? 'List' : 'Grid'}</span>}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-3 ${state.isMobile ? 'flex-col' : ''}`}>
              <Button
                onClick={handleCreateFile}
                className={`${state.isMobile ? 'w-full' : 'flex-1'} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 ${state.isMobile ? 'h-12 text-base font-medium' : 'h-10'}`}
              >
                <FilePlus className="w-4 h-4 mr-2" />
                New File
              </Button>
              <Button
                onClick={handleCreateFolder}
                className={`${state.isMobile ? 'w-full' : 'flex-1'} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 ${state.isMobile ? 'h-12 text-base font-medium' : 'h-10'}`}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
              <Button
                onClick={() => setShowUploadProgress(true)}
                className={`${state.isMobile ? 'w-full' : 'flex-1'} bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 ${state.isMobile ? 'h-12 text-base font-medium' : 'h-10'}`}
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
              <div className={`grid gap-4 ${
                state.isMobile 
                  ? 'grid-cols-2' 
                  : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
              }`}>
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
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    {currentPath.length > 0 ? `No files in ${currentPath[currentPath.length - 1]}` : "No files found"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {state.searchQuery 
                      ? `No files match "${state.searchQuery}"` 
                      : currentPath.length > 0 
                        ? `This folder is empty. Add some files to get started.`
                        : "Create your first file to get started"
                    }
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

        {/* Tabs Panel - Now at bottom */}
        {state.tabs.length > 0 && (
          <div className="w-full flex flex-col border-t border-purple-500/20">
            {/* Tabs Header */}
            <div className="bg-slate-800/50 border-b border-purple-500/20">
              <div className="overflow-x-auto">
                <div className="flex min-w-full">
                  {state.tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`flex items-center gap-2 ${state.isMobile ? 'px-3 py-2' : 'px-4 py-3'} border-b-2 cursor-pointer transition-colors ${
                        tab.isActive 
                          ? "border-purple-500 text-purple-300 bg-purple-500/10" 
                          : "border-transparent text-gray-400 hover:text-white hover:bg-slate-700/50"
                      }`}
                      onClick={() => activateTab(tab.id)}
                    >
                      <span className={`${state.isMobile ? 'text-xs' : 'text-sm'} font-medium truncate ${state.isMobile ? 'max-w-[80px]' : 'max-w-[120px]'}`}>
                        {tab.title}
                      </span>
                      <Button
                        variant="ghost"
                        size={state.isMobile ? "sm" : "sm"}
                        onClick={(e) => {
                          e.stopPropagation()
                          closeTab(tab.id)
                        }}
                        className={`${state.isMobile ? 'h-5 w-5' : 'h-6 w-6'} p-0 text-gray-400 hover:text-white hover:bg-white/10`}
                      >
                        <X className={`${state.isMobile ? 'w-2 h-2' : 'w-3 h-3'}`} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className={`flex-1 overflow-hidden ${state.isMobile ? 'min-h-[300px]' : 'min-h-[400px]'}`}>
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

      {/* Context Menu */}
      {state.contextMenu.file && state.contextMenu.position && (
        <FileContextMenu
          file={state.contextMenu.file}
          position={state.contextMenu.position}
          onClose={handleHideContextMenu}
          onOpen={() => {
            handleFileClick(state.contextMenu.file!)
            handleHideContextMenu()
          }}
          onEdit={() => {
            handleFileClick(state.contextMenu.file!)
            handleHideContextMenu()
          }}
          onDownload={() => {
            console.log('Downloading file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
          onShare={() => {
            handleShowShareSystem(state.contextMenu.file!)
            handleHideContextMenu()
          }}
          onStar={() => {
            console.log('Toggling star for file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
          onCopy={() => {
            console.log('Copying file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
          onDelete={() => {
            console.log('Deleting file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
          onArchive={() => {
            console.log('Archiving file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
          onToggleVisibility={() => {
            handleToggleFileVisibility(state.contextMenu.file!, !state.contextMenu.file!.is_public)
            handleHideContextMenu()
          }}
          onRename={() => {
            console.log('Renaming file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
          onMove={() => {
            console.log('Moving file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
          onCopyLink={() => {
            console.log('Copying link for file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
          onRefresh={() => {
            console.log('Refreshing file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
          onProperties={() => {
            console.log('Showing properties for file:', state.contextMenu.file!.name)
            handleHideContextMenu()
          }}
        />
      )}

      {/* Share System */}
      {state.showShareSystem && state.selectedFileForShare && (
        <ShareSystem
          file={state.selectedFileForShare}
          onClose={handleHideShareSystem}
          onToggleVisibility={handleToggleFileVisibility}
        />
      )}
    </div>
  )
}
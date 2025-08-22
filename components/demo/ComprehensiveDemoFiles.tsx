"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, Image, Video, Music, Code, Database, Archive,
  Lock, Shield, Star, Share2, Eye, Download, Folder,
  Package, Zap, Globe, AlertTriangle, CheckCircle
} from "lucide-react"

export interface FileItem {
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
  isShared: boolean
  owner: string
  hasPassword: boolean
  inArchive: boolean
  category: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'other'
  encryptedName?: string
  accessLimits?: {
    currentViews: number
    currentDownloads: number
    maxViews: number
    maxDownloads: number
  }
  expiresAt?: string
}

export interface FolderItem {
  id: string
  name: string
  path: string
  created_at: string
  owner: string
  is_public: boolean
  hasPassword: boolean
}

export const demoFolders: FolderItem[] = [
  {
    id: 'folder-1',
    name: 'Documents',
    path: '/Documents',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    owner: 'demo@yukifiles.com',
    is_public: false,
    hasPassword: false
  },
  {
    id: 'folder-2',
    name: 'Images',
    path: '/Images',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    owner: 'demo@yukifiles.com',
    is_public: true,
    hasPassword: false
  },
  {
    id: 'folder-3',
    name: 'Projects',
    path: '/Projects',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    owner: 'demo@yukifiles.com',
    is_public: false,
    hasPassword: true
  },
  {
    id: 'folder-4',
    name: 'Archive',
    path: '/Archive',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    owner: 'demo@yukifiles.com',
    is_public: false,
    hasPassword: false
  }
]

export const comprehensiveDemoFiles: FileItem[] = [
  // Documents
  {
    id: 'doc-1',
    name: 'Project_Proposal_2024.pdf',
    original_name: 'Project_Proposal_2024.pdf',
    mime_type: 'application/pdf',
    file_size: 2547893,
    size: 2547893,
    created_at: new Date().toISOString(),
    content: 'Mock PDF content for project proposal',
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'document',
    accessLimits: {
      currentViews: 15,
      currentDownloads: 8,
      maxViews: 100,
      maxDownloads: 50
    }
  },
  {
    id: 'doc-2',
    name: 'Business_Plan.docx',
    original_name: 'Business_Plan.docx',
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size: 1892345,
    size: 1892345,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    content: 'Mock Word document content',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    hasPassword: true,
    inArchive: false,
    category: 'document'
  },
  {
    id: 'doc-3',
    name: 'Presentation_Deck.pptx',
    original_name: 'Presentation_Deck.pptx',
    mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    file_size: 5892103,
    size: 5892103,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    content: 'Mock PowerPoint content',
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'document',
    accessLimits: {
      currentViews: 45,
      currentDownloads: 12,
      maxViews: 200,
      maxDownloads: 100
    }
  },
  
  // Images
  {
    id: 'img-1',
    name: 'Team_Photo.jpg',
    original_name: 'Team_Photo.jpg',
    mime_type: 'image/jpeg',
    file_size: 1234567,
    size: 1234567,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    content: 'Mock image content',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzFFMUUyRSIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSIjNkM3Mjg1Ii8+CjxwYXRoIGQ9Ik0xNiAyMEMyMC40MTgzIDIwIDI0IDIzLjU4MTcgMjQgMjhIMTZWMjBaIiBmaWxsPSIjOEI1Q0Y2Ii8+Cjwvc3ZnPgo=',
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'image'
  },
  {
    id: 'img-2',
    name: 'Product_Screenshot.png',
    original_name: 'Product_Screenshot.png',
    mime_type: 'image/png',
    file_size: 2345678,
    size: 2345678,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    content: 'Mock PNG content',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzFFMUUyRSIvPgo8cGF0aCBkPSJNMTIgMTZIMjhWMjRIMTJWMTZaIiBmaWxsPSIjNkM3Mjg1Ii8+CjxwYXRoIGQ9Ik0xNiAyMEMyMC40MTgzIDIwIDI0IDIzLjU4MTcgMjQgMjhIMTZWMjBaIiBmaWxsPSIjOEI1Q0Y2Ii8+Cjwvc3ZnPgo=',
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'image'
  },
  
  // Videos
  {
    id: 'vid-1',
    name: 'Product_Demo.mp4',
    original_name: 'Product_Demo.mp4',
    mime_type: 'video/mp4',
    file_size: 15678901,
    size: 15678901,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    content: 'Mock video content',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzFFMUUyRSIvPgo8cGF0aCBkPSJNMTYgMTJIMjRWMjhIMTZWMTJaIiBmaWxsPSIjNkM3Mjg1Ii8+Cjwvc3ZnPgo=',
    is_starred: true,
    isStarred: true,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'video',
    accessLimits: {
      currentViews: 89,
      currentDownloads: 23,
      maxViews: 500,
      maxDownloads: 200
    }
  },
  
  // Audio
  {
    id: 'aud-1',
    name: 'Podcast_Episode.mp3',
    original_name: 'Podcast_Episode.mp3',
    mime_type: 'audio/mpeg',
    file_size: 4567890,
    size: 4567890,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    content: 'Mock audio content',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'audio'
  },
  
  // Code Files
  {
    id: 'code-1',
    name: 'app.tsx',
    original_name: 'app.tsx',
    mime_type: 'text/tsx',
    file_size: 1520,
    size: 1520,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    content: `import React from "react"
import { useState } from "react"

export default function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="app">
      <h1>Hello YukiFiles</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}`,
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'code'
  },
  {
    id: 'code-2',
    name: 'styles.css',
    original_name: 'styles.css',
    mime_type: 'text/css',
    file_size: 890,
    size: 890,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    content: `.app {
  text-align: center;
  padding: 2rem;
}

button {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}`,
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'code'
  },
  
  // Archive Files
  {
    id: 'arc-1',
    name: 'Project_Backup.zip',
    original_name: 'Project_Backup.zip',
    mime_type: 'application/zip',
    file_size: 9876543,
    size: 9876543,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    content: 'Mock ZIP archive content',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    hasPassword: true,
    inArchive: true,
    category: 'archive'
  },
  {
    id: 'arc-2',
    name: 'Documents_Archive.tar.gz',
    original_name: 'Documents_Archive.tar.gz',
    mime_type: 'application/gzip',
    file_size: 5432109,
    size: 5432109,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    content: 'Mock TAR.GZ archive content',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: true,
    category: 'archive'
  },
  
  // Other Files
  {
    id: 'other-1',
    name: 'README.md',
    original_name: 'README.md',
    mime_type: 'text/markdown',
    file_size: 2340,
    size: 2340,
    created_at: new Date(Date.now() - 86400000 * 11).toISOString(),
    content: `# YukiFiles Demo

This is a comprehensive demo of the YukiFiles platform.

## Features
- File upload and management
- Secure sharing
- Analytics and insights
- Team collaboration

## Getting Started
1. Upload your files
2. Share with team members
3. Track usage and engagement`,
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'other'
  }
]

export function getFileStats(files: FileItem[]) {
  const totalFiles = files.length
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const starredFiles = files.filter(file => file.is_starred).length
  const sharedFiles = files.filter(file => file.is_public).length
  const protectedFiles = files.filter(file => file.hasPassword).length
  const archivedFiles = files.filter(file => file.inArchive).length
  
  const categories = {
    document: files.filter(f => f.category === 'document').length,
    image: files.filter(f => f.category === 'image').length,
    video: files.filter(f => f.category === 'video').length,
    audio: files.filter(f => f.category === 'audio').length,
    code: files.filter(f => f.category === 'code').length,
    archive: files.filter(f => f.category === 'archive').length,
    other: files.filter(f => f.category === 'other').length
  }
  
  return {
    totalFiles,
    totalSize: formatBytes(totalSize),
    starredFiles,
    sharedFiles,
    protectedFiles,
    archivedFiles,
    categories
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileIcon(mimeType: string, category: string) {
  if (category === 'document') return '📄'
  if (category === 'image') return '🖼️'
  if (category === 'video') return '🎥'
  if (category === 'audio') return '🎵'
  if (category === 'code') return '💻'
  if (category === 'archive') return '📦'
  if (category === 'other') return '📁'
  
  // Fallback based on MIME type
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.startsWith('video/')) return '🎥'
  if (mimeType.startsWith('audio/')) return '🎵'
  if (mimeType.startsWith('text/')) return '📄'
  if (mimeType.includes('pdf')) return '📕'
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar')) return '📦'
  
  return '📁'
}

export function getFileColor(category: string) {
  const colors = {
    document: 'text-blue-400',
    image: 'text-green-400',
    video: 'text-purple-400',
    audio: 'text-yellow-400',
    code: 'text-orange-400',
    archive: 'text-red-400',
    other: 'text-gray-400'
  }
  
  return colors[category] || colors.other
}
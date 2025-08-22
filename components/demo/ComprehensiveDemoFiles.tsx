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

export const comprehensiveDemoFiles = [
  // Folders
  {
    id: 'folder-1',
    name: 'Documents',
    mime_type: 'folder',
    size: 0,
    created_at: '2024-01-15T10:30:00Z',
    content: '',
    thumbnail: null,
    is_starred: false,
    is_public: false,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'folder',
    encryptedName: null,
    accessLimits: null,
    expiresAt: null,
    artist: null,
    album: null,
    albumArt: null
  },
  {
    id: 'folder-2',
    name: 'Media',
    mime_type: 'folder',
    size: 0,
    created_at: '2024-01-15T11:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: false,
    is_public: false,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'folder',
    encryptedName: null,
    accessLimits: null,
    expiresAt: null,
    artist: null,
    album: null,
    albumArt: null
  },
  {
    id: 'folder-3',
    name: 'Projects',
    mime_type: 'folder',
    size: 0,
    created_at: '2024-01-15T12:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: true,
    is_public: false,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'folder',
    encryptedName: null,
    accessLimits: null,
    expiresAt: null,
    artist: null,
    album: null,
    albumArt: null
  },

  // Discord Audio
  {
    id: 'audio-1',
    name: 'NAKISO - Track.mp3',
    mime_type: 'audio/mpeg',
    size: 5242880, // 5MB
    created_at: '2024-01-15T13:00:00Z',
    content: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408373313759219722/NAKISO_-_.mp3?ex=68a9815c&is=68a82fdc&hm=f33af4367697c580038c23e870ddbe03680cdfb1ca0686e9692b243ca935a260&',
    thumbnail: null,
    is_starred: true,
    is_public: true,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'audio',
    encryptedName: null,
    accessLimits: null,
    expiresAt: null,
    artist: 'NAKISO',
    album: 'Demo Album',
    albumArt: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159531212472340/9a158cfef15faa3a2bb0d910d5bace0f.jpg?ex=68aa0bc2&is=68a8ba42&hm=7b8e6a548ea63488dd4df70f6b7730de231d365166deedc7f0d102cc116a4056&'
  },

  // Discord Image
  {
    id: 'image-1',
    name: 'demo-image.jpg',
    mime_type: 'image/jpeg',
    size: 2097152, // 2MB
    created_at: '2024-01-15T14:00:00Z',
    content: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159531212472340/9a158cfef15faa3a2bb0d910d5bace0f.jpg?ex=68aa0bc2&is=68a8ba42&hm=7b8e6a548ea63488dd4df70f6b7730de231d365166deedc7f0d102cc116a4056&',
    thumbnail: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159531212472340/9a158cfef15faa3a2bb0d910d5bace0f.jpg?ex=68aa0bc2&is=68a8ba42&hm=7b8e6a548ea63488dd4df70f6b7730de231d365166deedc7f0d102cc116a4056&',
    is_starred: false,
    is_public: true,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'image',
    encryptedName: null,
    accessLimits: null,
    expiresAt: null,
    artist: null,
    album: null,
    albumArt: null
  },

  // Discord Video
  {
    id: 'video-1',
    name: 'demo-video.mp4',
    mime_type: 'video/mp4',
    size: 15728640, // 15MB
    created_at: '2024-01-15T15:00:00Z',
    content: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159523310538844/83cb90295730d846323a14bbd13dc777.mp4?ex=68aa0bc0&is=68a8ba40&hm=b9eed69866daa68598b5aeed80fe56ba5cb6219c54385995fbb4d4998e1cd8af&',
    thumbnail: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408159523310538844/83cb90295730d846323a14bbd13dc777.mp4?ex=68aa0bc0&is=68a8ba40&hm=b9eed69866daa68598b5aeed80fe56ba5cb6219c54385995fbb4d4998e1cd8af&',
    is_starred: true,
    is_public: false,
    owner: 'demo@yukifiles.com',
    hasPassword: true,
    inArchive: false,
    category: 'video',
    encryptedName: null,
    accessLimits: null,
    expiresAt: null,
    artist: null,
    album: null,
    albumArt: null
  },

  // Code Files
  {
    id: 'code-1',
    name: 'app.js',
    mime_type: 'application/javascript',
    size: 15360, // 15KB
    created_at: '2024-01-15T16:00:00Z',
    content: `// YukiFiles Demo App
import React from 'react';

function App() {
  return (
    <div className="app">
      <h1>Welcome to YukiFiles</h1>
      <p>This is a demo file manager application.</p>
    </div>
  );
}

export default App;`,
    thumbnail: null,
    is_starred: false,
    is_public: false,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'code',
    encryptedName: null,
    accessLimits: null,
    expiresAt: null,
    artist: null,
    album: null,
    albumArt: null
  },

  // Text Files
  {
    id: 'text-1',
    name: 'README.md',
    mime_type: 'text/markdown',
    size: 2048, // 2KB
    created_at: '2024-01-15T17:00:00Z',
    content: `# YukiFiles Demo

## Features
- File management
- Media preview
- Sharing capabilities
- Security features

## Getting Started
1. Upload files
2. Organize in folders
3. Share with others

Created: ${new Date().toLocaleDateString()}`,
    thumbnail: null,
    is_starred: false,
    is_public: true,
    owner: 'demo@yukifiles.com',
    hasPassword: false,
    inArchive: false,
    category: 'text',
    encryptedName: null,
    accessLimits: null,
    expiresAt: null,
    artist: null,
    album: null,
    albumArt: null
  },

  // Database Files
  {
    id: 'db-1',
    name: 'users.db',
    mime_type: 'application/x-sqlite3',
    size: 1048576, // 1MB
    created_at: '2024-01-15T18:00:00Z',
    content: '',
    thumbnail: null,
    is_starred: false,
    is_public: false,
    owner: 'demo@yukifiles.com',
    hasPassword: true,
    inArchive: false,
    category: 'database',
    encryptedName: null,
    accessLimits: null,
    expiresAt: null,
    artist: null,
    album: null,
    albumArt: null
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
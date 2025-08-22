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

export interface DemoFileItem {
  id: string
  name: string
  size: number
  type: string
  lastModified: Date
  isFolder: boolean
  isStarred: boolean
  isShared: boolean
  hasPassword: boolean
  inArchive: boolean
  thumbnail?: string
  category: 'document' | 'image' | 'video' | 'audio' | 'code' | 'database' | 'archive' | 'folder'
  path: string[]
  encryptedName?: string
  accessLimits?: { views: number; downloads: number; maxViews: number; maxDownloads: number }
  expiresAt?: Date
}

export const comprehensiveDemoFiles: DemoFileItem[] = [
  // Documents
  {
    id: 'demo-1',
    name: 'project-proposal.pdf',
    size: 2048576,
    type: 'application/pdf',
    lastModified: new Date('2024-01-15T10:30:00Z'),
    isFolder: false,
    isStarred: true,
    isShared: true,
    hasPassword: false,
    inArchive: false,
    category: 'document',
    path: ['Documents', 'Projects'],
    thumbnail: 'https://cdn.discordapp.com/attachments/1234567890/pdf-thumbnail.jpg',
    accessLimits: { views: 15, downloads: 3, maxViews: 50, maxDownloads: 10 },
    expiresAt: new Date('2024-02-15T10:30:00Z')
  },
  {
    id: 'demo-2',
    name: 'presentation.pptx',
    size: 8388608,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    lastModified: new Date('2024-01-14T15:45:00Z'),
    isFolder: false,
    isStarred: false,
    isShared: true,
    hasPassword: true,
    inArchive: false,
    category: 'document',
    path: ['Documents', 'Work'],
    accessLimits: { views: 8, downloads: 2, maxViews: 20, maxDownloads: 5 }
  },
  
  // Media Files
  {
    id: 'demo-3',
    name: 'demo-video.mp4',
    size: 52428800,
    type: 'video/mp4',
    lastModified: new Date('2024-01-13T09:20:00Z'),
    isFolder: false,
    isStarred: true,
    isShared: false,
    hasPassword: false,
    inArchive: false,
    category: 'video',
    path: ['Media', 'Videos'],
    thumbnail: 'https://cdn.discordapp.com/attachments/1234567890/video-thumbnail.jpg'
  },
  {
    id: 'demo-4',
    name: 'NAKISO_-_.mp3',
    size: 4194304,
    type: 'audio/mpeg',
    lastModified: new Date('2024-01-12T13:20:00Z'),
    isFolder: false,
    isStarred: false,
    isShared: true,
    hasPassword: false,
    inArchive: false,
    category: 'audio',
    path: ['Media', 'Audio'],
    thumbnail: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408373313759219722/NAKISO_-_.mp3?ex=68a9815c&is=68a82fdc&hm=f33af4367697c580038c23e870ddbe03680cdfb1ca0686e9692b243ca935a260&',
    accessLimits: { views: 25, downloads: 8, maxViews: 100, maxDownloads: 25 }
  },
  {
    id: 'demo-4b',
    name: 'background-music.mp3',
    size: 3145728,
    type: 'audio/mpeg',
    lastModified: new Date('2024-01-11T13:20:00Z'),
    isFolder: false,
    isStarred: true,
    isShared: false,
    hasPassword: false,
    inArchive: false,
    category: 'audio',
    path: ['Media', 'Audio']
  },
  {
    id: 'demo-5',
    name: 'profile-picture.jpg',
    size: 1048576,
    type: 'image/jpeg',
    lastModified: new Date('2024-01-11T16:45:00Z'),
    isFolder: false,
    isStarred: true,
    isShared: true,
    hasPassword: false,
    inArchive: false,
    category: 'image',
    path: ['Photos', 'Profile'],
    thumbnail: 'https://cdn.discordapp.com/attachments/1234567890/profile-pic.jpg'
  },
  {
    id: 'demo-5b',
    name: 'screenshot.png',
    size: 2097152,
    type: 'image/png',
    lastModified: new Date('2024-01-10T14:30:00Z'),
    isFolder: false,
    isStarred: false,
    isShared: false,
    hasPassword: false,
    inArchive: false,
    category: 'image',
    path: ['Photos', 'Screenshots'],
    thumbnail: 'https://cdn.discordapp.com/attachments/1234567890/screenshot.png'
  },
  {
    id: 'demo-5c',
    name: 'banner.svg',
    size: 65536,
    type: 'image/svg+xml',
    lastModified: new Date('2024-01-09T11:15:00Z'),
    isFolder: false,
    isStarred: true,
    isShared: true,
    hasPassword: false,
    inArchive: false,
    category: 'image',
    path: ['Design', 'Assets']
  },
  
  // Code Files
  {
    id: 'demo-6',
    name: 'app.js',
    size: 131072,
    type: 'application/javascript',
    lastModified: new Date('2024-01-10T11:15:00Z'),
    isFolder: false,
    isStarred: false,
    isShared: false,
    hasPassword: false,
    inArchive: false,
    category: 'code',
    path: ['Development', 'Frontend']
  },
  {
    id: 'demo-7',
    name: 'config.json',
    size: 8192,
    type: 'application/json',
    lastModified: new Date('2024-01-09T14:30:00Z'),
    isFolder: false,
    isStarred: false,
    isShared: false,
    hasPassword: true,
    inArchive: false,
    category: 'code',
    path: ['Development', 'Config']
  },
  
  // Database Files
  {
    id: 'demo-8',
    name: 'user-data.sqlite',
    size: 12582912,
    type: 'application/x-sqlite3',
    lastModified: new Date('2024-01-08T12:00:00Z'),
    isFolder: false,
    isStarred: true,
    isShared: false,
    hasPassword: true,
    inArchive: false,
    category: 'database',
    path: ['Data', 'Production']
  },
  {
    id: 'demo-9',
    name: 'analytics.db',
    size: 25165824,
    type: 'application/x-sqlite3',
    lastModified: new Date('2024-01-07T09:45:00Z'),
    isFolder: false,
    isStarred: false,
    isShared: true,
    hasPassword: false,
    inArchive: false,
    category: 'database',
    path: ['Data', 'Analytics'],
    accessLimits: { views: 5, downloads: 1, maxViews: 10, maxDownloads: 3 }
  },
  
  // Archive Files với "In Archive" badges
  {
    id: 'demo-10',
    name: 'project-backup.tar.gz',
    size: 104857600,
    type: 'application/gzip',
    lastModified: new Date('2024-01-06T18:30:00Z'),
    isFolder: false,
    isStarred: true,
    isShared: true,
    hasPassword: false,
    inArchive: true,
    category: 'archive',
    path: ['Backups'],
    encryptedName: 'cHJvamVjdC1iYWNrdXA',
    accessLimits: { views: 12, downloads: 4, maxViews: 30, maxDownloads: 10 }
  },
  {
    id: 'demo-11',
    name: 'website-assets.zip',
    size: 15728640,
    type: 'application/zip',
    lastModified: new Date('2024-01-05T14:20:00Z'),
    isFolder: false,
    isStarred: false,
    isShared: false,
    hasPassword: true,
    inArchive: true,
    category: 'archive',
    path: ['Web', 'Assets']
  },
  {
    id: 'demo-12',
    name: 'documents-archive.7z',
    size: 7340032,
    type: 'application/x-7z-compressed',
    lastModified: new Date('2024-01-04T16:10:00Z'),
    isFolder: false,
    isStarred: false,
    isShared: true,
    hasPassword: true,
    inArchive: true,
    category: 'archive',
    path: ['Archives'],
    encryptedName: 'ZG9jdW1lbnRzLWFyY2hpdmU',
    expiresAt: new Date('2024-02-04T16:10:00Z')
  },
  
  // Folders
  {
    id: 'folder-1',
    name: 'Documents',
    size: 0,
    type: 'folder',
    lastModified: new Date('2024-01-15T10:00:00Z'),
    isFolder: true,
    isStarred: false,
    isShared: false,
    hasPassword: false,
    inArchive: false,
    category: 'folder',
    path: []
  },
  {
    id: 'folder-2',
    name: 'Media',
    size: 0,
    type: 'folder',
    lastModified: new Date('2024-01-14T10:00:00Z'),
    isFolder: true,
    isStarred: true,
    isShared: false,
    hasPassword: false,
    inArchive: false,
    category: 'folder',
    path: []
  },
  {
    id: 'folder-3',
    name: 'Development',
    size: 0,
    type: 'folder',
    lastModified: new Date('2024-01-13T10:00:00Z'),
    isFolder: true,
    isStarred: false,
    isShared: true,
    hasPassword: true,
    inArchive: false,
    category: 'folder',
    path: []
  }
]

export function getFileIcon(file: DemoFileItem, size: 'sm' | 'md' | 'lg' = 'md') {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
  
  if (file.isFolder) {
    return <Folder className={`${iconSize} text-purple-400`} />
  }
  
  switch (file.category) {
    case 'document':
      return <FileText className={`${iconSize} text-blue-400`} />
    case 'image':
      return <Image className={`${iconSize} text-green-400`} />
    case 'video':
      return <Video className={`${iconSize} text-red-400`} />
    case 'audio':
      return <Music className={`${iconSize} text-yellow-400`} />
    case 'code':
      return <Code className={`${iconSize} text-purple-400`} />
    case 'database':
      return <Database className={`${iconSize} text-cyan-400`} />
    case 'archive':
      return <Archive className={`${iconSize} text-orange-400`} />
    default:
      return <FileText className={`${iconSize} text-gray-400`} />
  }
}

export function getFileBadges(file: DemoFileItem) {
  const badges = []
  
  if (file.inArchive) {
    badges.push(
      <Badge key="archive" className="bg-orange-500/20 text-orange-400 text-xs">
        In Archive
      </Badge>
    )
  }
  
  if (file.hasPassword) {
    badges.push(
      <Badge key="password" className="bg-red-500/20 text-red-400 text-xs">
        <Lock className="w-3 h-3 mr-1" />
        Protected
      </Badge>
    )
  }
  
  if (file.isShared) {
    badges.push(
      <Badge key="shared" className="bg-green-500/20 text-green-400 text-xs">
        <Share2 className="w-3 h-3 mr-1" />
        Shared
      </Badge>
    )
  }
  
  if (file.encryptedName) {
    badges.push(
      <Badge key="encrypted" className="bg-purple-500/20 text-purple-400 text-xs">
        <Shield className="w-3 h-3 mr-1" />
        Encrypted
      </Badge>
    )
  }
  
  if (file.expiresAt) {
    const isExpiringSoon = file.expiresAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 // 7 days
    badges.push(
      <Badge key="expires" className={`text-xs ${isExpiringSoon ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        Expires
      </Badge>
    )
  }
  
  if (file.accessLimits) {
    const { views, maxViews, downloads, maxDownloads } = file.accessLimits
    const viewsUsed = (views / maxViews) * 100
    const downloadsUsed = (downloads / maxDownloads) * 100
    
    if (viewsUsed > 80 || downloadsUsed > 80) {
      badges.push(
        <Badge key="limits" className="bg-red-500/20 text-red-400 text-xs">
          <Eye className="w-3 h-3 mr-1" />
          {viewsUsed > 80 ? 'Views Low' : 'Downloads Low'}
        </Badge>
      )
    }
  }
  
  return badges
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileStats(files: DemoFileItem[]) {
  const stats = {
    total: files.length,
    folders: files.filter(f => f.isFolder).length,
    files: files.filter(f => !f.isFolder).length,
    shared: files.filter(f => f.isShared).length,
    protected: files.filter(f => f.hasPassword).length,
    archived: files.filter(f => f.inArchive).length,
    starred: files.filter(f => f.isStarred).length,
    totalSize: files.reduce((acc, f) => acc + f.size, 0),
    categories: {
      documents: files.filter(f => f.category === 'document').length,
      images: files.filter(f => f.category === 'image').length,
      videos: files.filter(f => f.category === 'video').length,
      audio: files.filter(f => f.category === 'audio').length,
      code: files.filter(f => f.category === 'code').length,
      databases: files.filter(f => f.category === 'database').length,
      archives: files.filter(f => f.category === 'archive').length
    }
  }
  
  return stats
}
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
  thumbnail?: string | null
  is_starred: boolean
  isStarred: boolean
  is_public: boolean
  isShared: boolean
  owner: string
  hasPassword?: boolean
  inArchive?: boolean
  category?: 'document' | 'media' | 'code' | 'archive' | 'database' | 'other'
  encryptedName?: string
  accessLimits?: {
    maxViews: number
    maxDownloads: number
    currentViews: number
    currentDownloads: number
  }
  expiresAt?: string
  // For audio files
  artist?: string
  album?: string
  albumArt?: string
}

export const comprehensiveDemoFiles: FileItem[] = [
  // Documents
  {
    id: 'demo-doc-1',
    name: 'Financial_Report_Q4_2024.pdf',
    original_name: 'Financial_Report_Q4_2024.pdf',
    mime_type: 'application/pdf',
    file_size: 2547893,
    size: 2547893,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    content: 'Mock PDF content - Financial Report Q4 2024',
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'document',
    hasPassword: true
  },
  {
    id: 'demo-doc-2',
    name: 'Rental_Agreement.docx',
    original_name: 'Rental_Agreement.docx',
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size: 156789,
    size: 156789,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    content: 'Mock Word document content',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'document',
    accessLimits: {
      maxViews: 100,
      maxDownloads: 50,
      currentViews: 23,
      currentDownloads: 8
    }
  },
  {
    id: 'demo-doc-3',
    name: 'Marketing_Presentation.pptx',
    original_name: 'Marketing_Presentation.pptx',
    mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    file_size: 5234567,
    size: 5234567,
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    content: 'Mock PowerPoint presentation',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'document'
  },

  // Images
  {
    id: 'demo-img-1',
    name: 'Sunset_Beach_4K.jpg',
    original_name: 'Sunset_Beach_4K.jpg',
    mime_type: 'image/jpeg',
    file_size: 3247891,
    size: 3247891,
    created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
    is_starred: true,
    isStarred: true,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'media'
  },
  {
    id: 'demo-img-2',
    name: 'Profile_Photo.png',
    original_name: 'Profile_Photo.png',
    mime_type: 'image/png',
    file_size: 1234567,
    size: 1234567,
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    content: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'media',
    hasPassword: true
  },
  {
    id: 'demo-img-3',
    name: 'Company_Logo.svg',
    original_name: 'Company_Logo.svg',
    mime_type: 'image/svg+xml',
    file_size: 45678,
    size: 45678,
    created_at: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    content: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#8B5CF6"/></svg>',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'media'
  },

  // Videos
  {
    id: 'demo-video-1',
    name: 'Demo_Tutorial.mp4',
    original_name: 'Demo_Tutorial.mp4',
    mime_type: 'video/mp4',
    file_size: 45678901,
    size: 45678901,
    created_at: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop',
    is_starred: true,
    isStarred: true,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'media',
    accessLimits: {
      maxViews: 500,
      maxDownloads: 100,
      currentViews: 156,
      currentDownloads: 34
    }
  },
  {
    id: 'demo-video-2',
    name: 'TikTok_Vertical.mp4',
    original_name: 'TikTok_Vertical.mp4',
    mime_type: 'video/mp4',
    file_size: 12345678,
    size: 12345678,
    created_at: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
    content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x640_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=200&h=350&fit=crop',
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'media'
  },
  {
    id: 'demo-video-3',
    name: 'Product_Demo_4K.mov',
    original_name: 'Product_Demo_4K.mov',
    mime_type: 'video/quicktime',
    file_size: 89012345,
    size: 89012345,
    created_at: new Date(Date.now() - 777600000).toISOString(), // 9 days ago
    content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
    is_starred: true,
    isStarred: true,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'media',
    hasPassword: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Expires in 30 days
  },

  // Audio with metadata
  {
    id: 'demo-audio-1',
    name: 'NAKISO_-_.mp3',
    original_name: 'NAKISO_-_.mp3',
    mime_type: 'audio/mpeg',
    file_size: 8765432,
    size: 8765432,
    created_at: new Date(Date.now() - 777600000).toISOString(), // 9 days ago
    content: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408373313759219722/NAKISO_-_.mp3?ex=68a9815c&is=68a82fdc&hm=f33af4367697c580038c23e870ddbe03680cdfb1ca0686e9692b243ca935a260&',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    is_starred: true,
    isStarred: true,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'media',
    // Music metadata
    artist: 'NAKISO',
    album: 'Unknown Album',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
  },
  {
    id: 'demo-audio-2',
    name: 'Chill_Beats.wav',
    original_name: 'Chill_Beats.wav',
    mime_type: 'audio/wav',
    file_size: 23456789,
    size: 23456789,
    created_at: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
    content: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'media',
    hasPassword: true,
    artist: 'Various Artists',
    album: 'Chill Collection',
    albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop'
  },
  {
    id: 'demo-audio-3',
    name: 'Podcast_Tech_Talk.mp3',
    original_name: 'Podcast_Tech_Talk.mp3',
    mime_type: 'audio/mpeg',
    file_size: 15678901,
    size: 15678901,
    created_at: new Date(Date.now() - 950400000).toISOString(), // 11 days ago
    content: 'https://cdn.discordapp.com/attachments/1402528640108990502/1408373313759219722/NAKISO_-_.mp3?ex=68a9815c&is=68a82fdc&hm=f33af4367697c580038c23e870ddbe03680cdfb1ca0686e9692b243ca935a260&',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=300&fit=crop',
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'media',
    accessLimits: {
      maxViews: 200,
      maxDownloads: 50,
      currentViews: 87,
      currentDownloads: 12
    },
    artist: 'Tech Talk Radio',
    album: 'Episode 01',
    albumArt: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=300&fit=crop'
  },

  // Code Files
  {
    id: 'demo-code-1',
    name: 'main.py',
    original_name: 'main.py',
    mime_type: 'text/x-python',
    file_size: 12345,
    size: 12345,
    created_at: new Date(Date.now() - 950400000).toISOString(), // 11 days ago
    content: `import pandas as pd
import numpy as np

def analyze_data(file_path):
    """Analyze data from CSV file"""
    df = pd.read_csv(file_path)
    return df.describe()

if __name__ == "__main__":
    result = analyze_data("data.csv")
    print(result)`,
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'code'
  },
  {
    id: 'demo-code-2',
    name: 'App.tsx',
    original_name: 'App.tsx',
    mime_type: 'text/tsx',
    file_size: 5678,
    size: 5678,
    created_at: new Date(Date.now() - 1036800000).toISOString(), // 12 days ago
    content: `import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import FileManager from './components/FileManager'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/files" element={<FileManager />} />
        </Routes>
      </div>
    </Router>
  )
}`,
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'code'
  },
  {
    id: 'demo-code-3',
    name: 'config.json',
    original_name: 'config.json',
    mime_type: 'application/json',
    file_size: 2345,
    size: 2345,
    created_at: new Date(Date.now() - 1123200000).toISOString(), // 13 days ago
    content: `{
  "app": {
    "name": "YukiFiles",
    "version": "1.0.0",
    "port": 3000
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "yukifiles_db"
  },
  "features": {
    "fileSharing": true,
    "encryption": true,
    "analytics": true
  }
}`,
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'code'
  },

  // Archives
  {
    id: 'demo-archive-1',
    name: 'Project_Backup.zip',
    original_name: 'Project_Backup.zip',
    mime_type: 'application/zip',
    file_size: 34567890,
    size: 34567890,
    created_at: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
    content: 'Mock ZIP archive content',
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'archive',
    inArchive: false
  },
  {
    id: 'demo-archive-2',
    name: 'Documents.tar.gz',
    original_name: 'Documents.tar.gz',
    mime_type: 'application/gzip',
    file_size: 23456789,
    size: 23456789,
    created_at: new Date(Date.now() - 1296000000).toISOString(), // 15 days ago
    content: 'Mock TAR.GZ archive content',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'archive'
  },

  // Database
  {
    id: 'demo-db-1',
    name: 'users.db',
    original_name: 'users.db',
    mime_type: 'application/x-sqlite3',
    file_size: 5678901,
    size: 5678901,
    created_at: new Date(Date.now() - 1382400000).toISOString(), // 16 days ago
    content: 'Mock SQLite database content',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'database',
    hasPassword: true
  },
  {
    id: 'demo-db-2',
    name: 'analytics.sql',
    original_name: 'analytics.sql',
    mime_type: 'application/sql',
    file_size: 12345,
    size: 12345,
    created_at: new Date(Date.now() - 1468800000).toISOString(), // 17 days ago
    content: `-- Analytics Query
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_files,
  SUM(file_size) as total_size
FROM files 
WHERE created_at >= DATE('now', '-30 days')
GROUP BY DATE(created_at)
ORDER BY date DESC;`,
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'database'
  },

  // Other types
  {
    id: 'demo-other-1',
    name: 'README.md',
    original_name: 'README.md',
    mime_type: 'text/markdown',
    file_size: 3456,
    size: 3456,
    created_at: new Date(Date.now() - 1555200000).toISOString(), // 18 days ago
    content: `# YukiFiles Demo

## Features
- Secure file sharing
- Real-time collaboration
- Advanced analytics
- Mobile-first design

## Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## Usage
Upload files, share with team, collaborate in real-time.`,
    thumbnail: null,
    is_starred: true,
    isStarred: true,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'other'
  },
  {
    id: 'demo-other-2',
    name: 'certificate.pem',
    original_name: 'certificate.pem',
    mime_type: 'application/x-pem-file',
    file_size: 1234,
    size: 1234,
    created_at: new Date(Date.now() - 1641600000).toISOString(), // 19 days ago
    content: '-----BEGIN CERTIFICATE-----\nMIIBkTCB+wIJAKZ...\n-----END CERTIFICATE-----',
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'other',
    hasPassword: true,
    encryptedName: '***********'
  },
  {
    id: 'demo-other-3',
    name: 'Design_System.figma',
    original_name: 'Design_System.figma',
    mime_type: 'application/figma',
    file_size: 12345678,
    size: 12345678,
    created_at: new Date(Date.now() - 1728000000).toISOString(), // 20 days ago
    content: 'Mock Figma file content',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=200&fit=crop',
    is_starred: true,
    isStarred: true,
    is_public: true,
    isShared: true,
    owner: 'demo@yukifiles.com',
    category: 'other'
  },
  {
    id: 'demo-other-4',
    name: 'Meeting_Notes.txt',
    original_name: 'Meeting_Notes.txt',
    mime_type: 'text/plain',
    file_size: 2345,
    size: 2345,
    created_at: new Date(Date.now() - 1814400000).toISOString(), // 21 days ago
    content: `Meeting Notes - Q4 Planning
Date: December 15, 2024
Attendees: John, Sarah, Mike, Lisa

Agenda:
1. Q4 Goals Review
2. Budget Planning
3. New Features Discussion
4. Team Allocation

Action Items:
- John: Finalize budget proposal
- Sarah: Design new UI mockups
- Mike: Setup development environment
- Lisa: Prepare user research

Next Meeting: December 22, 2024`,
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'other'
  },
  {
    id: 'demo-other-5',
    name: 'Backup_Settings.xml',
    original_name: 'Backup_Settings.xml',
    mime_type: 'application/xml',
    file_size: 5678,
    size: 5678,
    created_at: new Date(Date.now() - 1900800000).toISOString(), // 22 days ago
    content: `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <backup>
    <frequency>daily</frequency>
    <retention>30</retention>
    <compression>true</compression>
    <encryption>AES256</encryption>
  </backup>
  <storage>
    <provider>AWS S3</provider>
    <region>us-east-1</region>
    <bucket>yukifiles-backup</bucket>
  </storage>
</configuration>`,
    thumbnail: null,
    is_starred: false,
    isStarred: false,
    is_public: false,
    isShared: false,
    owner: 'demo@yukifiles.com',
    category: 'other',
    hasPassword: true
  }
]

// Demo folders
export const demoFolders = [
  {
    id: 'folder-1',
    name: 'Project 2024',
    type: 'folder',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    file_count: 15,
    total_size: 125000000
  },
  {
    id: 'folder-2', 
    name: 'Images',
    type: 'folder',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    file_count: 8,
    total_size: 45000000
  },
  {
    id: 'folder-3',
    name: 'Important Documents',
    type: 'folder', 
    created_at: new Date(Date.now() - 259200000).toISOString(),
    file_count: 12,
    total_size: 78000000
  }
]

export function getFileIcon(file: FileItem, size: 'sm' | 'md' | 'lg' = 'md') {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
  
  if (file.mime_type === 'folder') {
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

export function getFileBadges(file: FileItem) {
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
    const isExpiringSoon = new Date(file.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 // 7 days
    badges.push(
      <Badge key="expires" className={`text-xs ${isExpiringSoon ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
        <AlertTriangle className="w-3 h-3 mr-1" />
        Expires
      </Badge>
    )
  }
  
  if (file.accessLimits) {
    const { maxViews, maxDownloads, currentViews, currentDownloads } = file.accessLimits
    const viewsUsed = (currentViews / maxViews) * 100
    const downloadsUsed = (currentDownloads / maxDownloads) * 100
    
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

export function getFileStats(files: FileItem[] = []) {
  const safeFiles = files || []
  const stats = {
    total: safeFiles.length,
    folders: safeFiles.filter(f => f?.mime_type === 'folder').length,
    files: safeFiles.filter(f => f?.mime_type !== 'folder').length,
    shared: safeFiles.filter(f => f?.is_public || f?.isShared).length,
    starred: safeFiles.filter(f => f?.is_starred || f?.isStarred).length,
    protected: safeFiles.filter(f => f?.hasPassword).length,
    archived: safeFiles.filter(f => f?.inArchive).length,
    totalSize: safeFiles.reduce((acc, f) => acc + (f?.size || 0), 0),
    categories: {
      documents: safeFiles.filter(f => f?.category === 'document').length,
      media: safeFiles.filter(f => f?.category === 'media').length,
      code: safeFiles.filter(f => f?.category === 'code').length,
      archives: safeFiles.filter(f => f?.category === 'archive').length,
      databases: safeFiles.filter(f => f?.category === 'database').length,
      other: safeFiles.filter(f => f?.category === 'other').length
    }
  }
  return stats
}
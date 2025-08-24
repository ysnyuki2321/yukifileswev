/**
 * YukiFiles V2.0 - Comprehensive Demo Data
 * 
 * This file contains realistic demo data that provides a full-featured
 * experience for users testing the platform capabilities.
 */

import { DemoFile, DemoUser, DemoActivity, DemoShareSettings } from './demo-architecture'

// ====================================================================
// DEMO USERS
// ====================================================================

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo_user_main',
    name: 'Demo User',
    email: 'demo@yukifiles.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=b6e3f4',
    role: 'premium',
    subscription: 'pro',
    joinDate: new Date('2024-01-01'),
    storageUsed: 1024 * 1024 * 1024, // 1GB
    storageLimit: 2 * 1024 * 1024 * 1024 // 2GB
  },
  {
    id: 'demo_user_team1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=ffd93d',
    role: 'user',
    subscription: 'pro',
    joinDate: new Date('2024-01-05'),
    storageUsed: 512 * 1024 * 1024,
    storageLimit: 1024 * 1024 * 1024
  },
  {
    id: 'demo_user_team2',
    name: 'Michael Chen',
    email: 'michael@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=6bcf7f',
    role: 'admin',
    subscription: 'enterprise',
    joinDate: new Date('2024-01-03'),
    storageUsed: 2048 * 1024 * 1024,
    storageLimit: 5 * 1024 * 1024 * 1024
  },
  {
    id: 'demo_user_team3',
    name: 'Emma Davis',
    email: 'emma@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma&backgroundColor=ffb3ba',
    role: 'user',
    subscription: 'free',
    joinDate: new Date('2024-01-10'),
    storageUsed: 256 * 1024 * 1024,
    storageLimit: 500 * 1024 * 1024
  }
]

// ====================================================================
// REALISTIC DEMO FILES
// ====================================================================

export const DEMO_FILES: DemoFile[] = [
  // 📁 Documents Folder
  {
    id: 'folder_documents',
    name: 'Documents',
    type: 'folder',
    mimeType: 'folder',
    size: 0,
    parentId: null,
    path: [],
    isStarred: true,
    isShared: false,
    isPublic: false,
    shareSettings: {} as DemoShareSettings,
    metadata: { version: 1, checksum: '', software: 'YukiFiles' },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-22'),
    lastAccessedAt: new Date(),
    downloadCount: 0,
    viewCount: 0,
    tags: ['work', 'important'],
    description: 'Work documents and important files'
  },
  
  // 📄 Resume PDF
  {
    id: 'file_resume_pdf',
    name: 'John_Doe_Resume_2024.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    size: 245760,
    content: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDMgMCBSCi9QYWdlcyA0IDAgUgo+PgplbmRvYmoK',
    thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/resume-thumbnail',
    parentId: 'folder_documents',
    path: ['Documents'],
    isStarred: true,
    isShared: true,
    isPublic: false,
    shareToken: 'resume_2024_secure_abc123',
    shareSettings: {
      isEnabled: true,
      token: 'resume_2024_secure_abc123',
      url: '/share/resume_2024_secure_abc123',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      maxDownloads: 25,
      currentDownloads: 3,
      password: '',
      allowDownload: true,
      allowView: true,
      allowComment: false,
      analytics: {
        totalViews: 12,
        totalDownloads: 3,
        uniqueVisitors: 8,
        countries: ['US', 'UK', 'CA'],
        devices: ['Desktop', 'Mobile'],
        referrers: ['Email', 'LinkedIn'],
        dailyStats: [
          { date: '2024-01-20', views: 4, downloads: 1 },
          { date: '2024-01-21', views: 5, downloads: 1 },
          { date: '2024-01-22', views: 3, downloads: 1 }
        ]
      }
    },
    metadata: { 
      version: 2, 
      checksum: 'sha256_resume_hash_abc123',
      author: 'John Doe',
      software: 'Adobe Acrobat',
      pages: 2,
      wordCount: 850
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    lastAccessedAt: new Date(),
    downloadCount: 3,
    viewCount: 12,
    tags: ['resume', 'professional', 'cv', 'job-search'],
    description: 'Professional resume for job applications'
  },
  
  // 📊 Project Proposal
  {
    id: 'file_project_proposal',
    name: 'Q1_2024_Marketing_Strategy.docx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1048576,
    content: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQDfpNJsWgEAACAFAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD',
    thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/docx-thumbnail',
    parentId: 'folder_documents',
    path: ['Documents'],
    isStarred: false,
    isShared: true,
    isPublic: false,
    shareToken: 'marketing_strategy_q1_xyz789',
    shareSettings: {
      isEnabled: true,
      token: 'marketing_strategy_q1_xyz789',
      url: '/share/marketing_strategy_q1_xyz789',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      maxDownloads: 10,
      currentDownloads: 5,
      password: 'team2024',
      allowDownload: true,
      allowView: true,
      allowComment: true,
      analytics: {
        totalViews: 28,
        totalDownloads: 5,
        uniqueVisitors: 15,
        countries: ['US', 'UK', 'CA', 'AU', 'DE'],
        devices: ['Desktop', 'Mobile', 'Tablet'],
        referrers: ['Email', 'Teams', 'Slack', 'Direct'],
        dailyStats: [
          { date: '2024-01-18', views: 8, downloads: 2 },
          { date: '2024-01-19', views: 12, downloads: 2 },
          { date: '2024-01-20', views: 8, downloads: 1 }
        ]
      }
    },
    metadata: { 
      version: 3, 
      checksum: 'sha256_marketing_hash_xyz789',
      author: 'Marketing Team',
      software: 'Microsoft Word',
      pages: 15,
      wordCount: 3250
    },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
    lastAccessedAt: new Date(),
    downloadCount: 5,
    viewCount: 28,
    tags: ['marketing', 'strategy', 'q1-2024', 'confidential', 'team'],
    description: 'Comprehensive marketing strategy document for Q1 2024'
  },
  
  // 🎬 Media Folder
  {
    id: 'folder_media',
    name: 'Media',
    type: 'folder',
    mimeType: 'folder',
    size: 0,
    parentId: null,
    path: [],
    isStarred: false,
    isShared: true,
    isPublic: true,
    shareSettings: {} as DemoShareSettings,
    metadata: { version: 1, checksum: '', software: 'YukiFiles' },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    lastAccessedAt: new Date(),
    downloadCount: 0,
    viewCount: 0,
    tags: ['media', 'public'],
    description: 'Public media files and assets'
  },
  
  // 🖼️ Company Logo
  {
    id: 'file_company_logo',
    name: 'YukiFiles_Logo_2024.png',
    type: 'file',
    mimeType: 'image/png',
    size: 512000,
    content: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=150',
    parentId: 'folder_media',
    path: ['Media'],
    isStarred: true,
    isShared: true,
    isPublic: true,
    shareToken: 'yukifiles_logo_public_2024',
    shareSettings: {
      isEnabled: true,
      token: 'yukifiles_logo_public_2024',
      url: '/share/yukifiles_logo_public_2024',
      currentDownloads: 45,
      allowDownload: true,
      allowView: true,
      allowComment: false,
      analytics: {
        totalViews: 234,
        totalDownloads: 45,
        uniqueVisitors: 156,
        countries: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN'],
        devices: ['Desktop', 'Mobile', 'Tablet'],
        referrers: ['Google', 'Direct', 'Social Media', 'Email'],
        dailyStats: [
          { date: '2024-01-20', views: 45, downloads: 8 },
          { date: '2024-01-21', views: 52, downloads: 12 },
          { date: '2024-01-22', views: 38, downloads: 6 }
        ]
      }
    },
    metadata: { 
      version: 1, 
      checksum: 'sha256_logo_hash_2024',
      author: 'Design Team',
      software: 'Adobe Photoshop',
      dimensions: { width: 2048, height: 1024 }
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    lastAccessedAt: new Date(),
    downloadCount: 45,
    viewCount: 234,
    tags: ['logo', 'branding', 'company', 'design', 'public'],
    description: 'Official YukiFiles company logo - high resolution'
  },
  
  // 🎵 Demo Audio File
  {
    id: 'file_demo_audio',
    name: 'NAKISO - Inspiration Track.mp3',
    type: 'file',
    mimeType: 'audio/mpeg',
    size: 8388608, // 8MB
    content: 'https://www.soundjay.com/misc/sounds-and-noises/sample-corporate-music.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200',
    parentId: 'folder_media',
    path: ['Media'],
    isStarred: false,
    isShared: true,
    isPublic: false,
    shareToken: 'nakiso_inspiration_track_demo',
    shareSettings: {
      isEnabled: true,
      token: 'nakiso_inspiration_track_demo',
      url: '/share/nakiso_inspiration_track_demo',
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      maxDownloads: 100,
      currentDownloads: 23,
      allowDownload: true,
      allowView: true,
      allowComment: true,
      analytics: {
        totalViews: 67,
        totalDownloads: 23,
        uniqueVisitors: 45,
        countries: ['US', 'UK', 'CA', 'JP', 'KR'],
        devices: ['Desktop', 'Mobile'],
        referrers: ['Spotify', 'SoundCloud', 'Direct', 'Social'],
        dailyStats: [
          { date: '2024-01-20', views: 15, downloads: 5 },
          { date: '2024-01-21', views: 22, downloads: 8 },
          { date: '2024-01-22', views: 18, downloads: 6 }
        ]
      }
    },
    metadata: { 
      version: 1, 
      checksum: 'sha256_audio_nakiso_hash',
      author: 'NAKISO',
      software: 'Logic Pro X',
      duration: 245 // 4:05 minutes
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    lastAccessedAt: new Date(),
    downloadCount: 23,
    viewCount: 67,
    tags: ['music', 'inspiration', 'nakiso', 'demo', 'background'],
    description: 'Inspirational background music by NAKISO - perfect for presentations'
  },
  
  // 🎥 Demo Video
  {
    id: 'file_demo_video',
    name: 'YukiFiles_Product_Demo.mp4',
    type: 'file',
    mimeType: 'video/mp4',
    size: 104857600, // 100MB
    content: 'https://sample-videos.com/zip/10/mp4/1080/sample-video-yukifiles-demo.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225',
    parentId: 'folder_media',
    path: ['Media'],
    isStarred: true,
    isShared: true,
    isPublic: true,
    shareToken: 'yukifiles_product_demo_2024',
    shareSettings: {
      isEnabled: true,
      token: 'yukifiles_product_demo_2024',
      url: '/share/yukifiles_product_demo_2024',
      currentDownloads: 89,
      allowDownload: true,
      allowView: true,
      allowComment: true,
      analytics: {
        totalViews: 456,
        totalDownloads: 89,
        uniqueVisitors: 312,
        countries: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN', 'BR', 'MX'],
        devices: ['Desktop', 'Mobile', 'Tablet', 'Smart TV'],
        referrers: ['YouTube', 'Website', 'Social Media', 'Email', 'Direct'],
        dailyStats: [
          { date: '2024-01-20', views: 85, downloads: 15 },
          { date: '2024-01-21', views: 126, downloads: 28 },
          { date: '2024-01-22', views: 92, downloads: 18 }
        ]
      }
    },
    metadata: { 
      version: 1, 
      checksum: 'sha256_video_demo_hash_2024',
      author: 'YukiFiles Team',
      software: 'Final Cut Pro',
      duration: 180, // 3 minutes
      dimensions: { width: 1920, height: 1080 }
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    lastAccessedAt: new Date(),
    downloadCount: 89,
    viewCount: 456,
    tags: ['demo', 'product', 'video', 'tutorial', 'public'],
    description: 'Complete product demonstration showcasing YukiFiles features'
  },
  
  // 📁 Projects Folder
  {
    id: 'folder_projects',
    name: 'Projects',
    type: 'folder',
    mimeType: 'folder',
    size: 0,
    parentId: null,
    path: [],
    isStarred: true,
    isShared: true,
    isPublic: false,
    shareSettings: {} as DemoShareSettings,
    metadata: { version: 1, checksum: '', software: 'YukiFiles' },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
    lastAccessedAt: new Date(),
    downloadCount: 0,
    viewCount: 0,
    tags: ['projects', 'work', 'collaboration'],
    description: 'Active projects and collaborative work'
  },
  
  // 📊 Project Analysis Spreadsheet
  {
    id: 'file_project_analysis',
    name: 'Project_Analysis_Q1_2024.xlsx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 2097152, // 2MB
    content: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQABgAIAAAAIQDNibJLagEAAI8DAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJSRz07DMBBF94X9h9I3IokJ',
    thumbnail: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/excel-thumbnail',
    parentId: 'folder_projects',
    path: ['Projects'],
    isStarred: true,
    isShared: true,
    isPublic: false,
    shareToken: 'project_analysis_q1_2024_secure',
    shareSettings: {
      isEnabled: true,
      token: 'project_analysis_q1_2024_secure',
      url: '/share/project_analysis_q1_2024_secure',
      expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
      maxDownloads: 15,
      currentDownloads: 7,
      password: 'analytics2024',
      allowDownload: true,
      allowView: true,
      allowComment: true,
      analytics: {
        totalViews: 34,
        totalDownloads: 7,
        uniqueVisitors: 19,
        countries: ['US', 'UK', 'CA', 'AU'],
        devices: ['Desktop', 'Tablet'],
        referrers: ['Email', 'Teams', 'Slack'],
        dailyStats: [
          { date: '2024-01-19', views: 8, downloads: 2 },
          { date: '2024-01-20', views: 12, downloads: 3 },
          { date: '2024-01-21', views: 9, downloads: 1 },
          { date: '2024-01-22', views: 5, downloads: 1 }
        ]
      }
    },
    metadata: { 
      version: 4, 
      checksum: 'sha256_analysis_hash_q1_2024',
      author: 'Analytics Team',
      software: 'Microsoft Excel',
      pages: 8
    },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-22'),
    lastAccessedAt: new Date(),
    downloadCount: 7,
    viewCount: 34,
    tags: ['analysis', 'project', 'q1-2024', 'data', 'confidential'],
    description: 'Comprehensive project analysis with KPIs and metrics for Q1 2024'
  },
  
  // 💾 Database File
  {
    id: 'file_customer_database',
    name: 'customer_data.db',
    type: 'file',
    mimeType: 'application/x-sqlite3',
    size: 5242880, // 5MB
    content: 'data:application/x-sqlite3;base64,U1FMaXRlIGZvcm1hdCAzAAQAAAABAAAAAAAAAAAAAAAAAAAAaG',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+',
    parentId: 'folder_projects',
    path: ['Projects'],
    isStarred: false,
    isShared: false,
    isPublic: false,
    shareSettings: {} as DemoShareSettings,
    metadata: { 
      version: 1, 
      checksum: 'sha256_database_hash_customer',
      author: 'Database Admin',
      software: 'SQLite',
      encoding: 'UTF-8'
    },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-21'),
    lastAccessedAt: new Date(),
    downloadCount: 0,
    viewCount: 0,
    tags: ['database', 'customer', 'private', 'sql'],
    description: 'Customer database with contact information and purchase history'
  },
  
  // 📁 Archive Folder
  {
    id: 'folder_archive',
    name: 'Archive',
    type: 'folder',
    mimeType: 'folder',
    size: 0,
    parentId: null,
    path: [],
    isStarred: false,
    isShared: false,
    isPublic: false,
    shareSettings: {} as DemoShareSettings,
    metadata: { version: 1, checksum: '', software: 'YukiFiles' },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    lastAccessedAt: new Date(),
    downloadCount: 0,
    viewCount: 0,
    tags: ['archive', 'old-files'],
    description: 'Archived files and historical documents'
  },
  
  // 📦 Compressed Archive
  {
    id: 'file_project_backup',
    name: 'Project_Backup_2023.zip',
    type: 'file',
    mimeType: 'application/zip',
    size: 52428800, // 50MB
    content: 'data:application/zip;base64,UEsDBAoAAAAAAMJoFEcAAAAAAAAAAAAAAAAJAAAAbXlmaWxlLnR4dFBLAQIUAAoAAAAAAMJoFEcAAAAA',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+',
    parentId: 'folder_archive',
    path: ['Archive'],
    isStarred: false,
    isShared: false,
    isPublic: false,
    shareSettings: {} as DemoShareSettings,
    metadata: { 
      version: 1, 
      checksum: 'sha256_backup_hash_2023',
      author: 'System Backup',
      software: 'YukiFiles Backup Tool'
    },
    createdAt: new Date('2023-12-31'),
    updatedAt: new Date('2023-12-31'),
    lastAccessedAt: new Date('2024-01-15'),
    downloadCount: 0,
    viewCount: 0,
    tags: ['backup', 'archive', '2023', 'compressed'],
    description: 'Complete project backup from 2023 - compressed archive'
  }
]

// ====================================================================
// DEMO ACTIVITIES
// ====================================================================

export const DEMO_ACTIVITIES: DemoActivity[] = [
  {
    id: 'activity_1',
    type: 'upload',
    userId: 'demo_user_main',
    userName: 'Demo User',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=b6e3f4',
    fileId: 'file_resume_pdf',
    fileName: 'John_Doe_Resume_2024.pdf',
    description: 'Uploaded professional resume',
    timestamp: new Date('2024-01-22T14:30:00'),
    metadata: { size: 245760, type: 'upload' }
  },
  {
    id: 'activity_2',
    type: 'share',
    userId: 'demo_user_team1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=ffd93d',
    fileId: 'file_project_proposal',
    fileName: 'Q1_2024_Marketing_Strategy.docx',
    description: 'Shared marketing strategy document with team',
    timestamp: new Date('2024-01-22T13:45:00'),
    metadata: { shareType: 'team', password: true }
  },
  {
    id: 'activity_3',
    type: 'view',
    userId: 'demo_user_team2',
    userName: 'Michael Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=6bcf7f',
    fileId: 'file_demo_video',
    fileName: 'YukiFiles_Product_Demo.mp4',
    description: 'Viewed product demonstration video',
    timestamp: new Date('2024-01-22T12:20:00'),
    metadata: { duration: 180, quality: '1080p' }
  },
  {
    id: 'activity_4',
    type: 'edit',
    userId: 'demo_user_main',
    userName: 'Demo User',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=b6e3f4',
    fileId: 'file_project_analysis',
    fileName: 'Project_Analysis_Q1_2024.xlsx',
    description: 'Updated project analysis spreadsheet',
    timestamp: new Date('2024-01-22T11:15:00'),
    metadata: { changes: 'Added Q1 projections', version: 4 }
  },
  {
    id: 'activity_5',
    type: 'download',
    userId: 'demo_user_team3',
    userName: 'Emma Davis',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma&backgroundColor=ffb3ba',
    fileId: 'file_company_logo',
    fileName: 'YukiFiles_Logo_2024.png',
    description: 'Downloaded company logo for presentation',
    timestamp: new Date('2024-01-22T10:30:00'),
    metadata: { format: 'PNG', resolution: '2048x1024' }
  },
  {
    id: 'activity_6',
    type: 'organize',
    userId: 'demo_user_team1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=ffd93d',
    fileId: 'folder_media',
    fileName: 'Media',
    description: 'Organized media files into albums',
    timestamp: new Date('2024-01-22T09:45:00'),
    metadata: { action: 'reorganize', items: 12 }
  }
]

// ====================================================================
// DEMO ANALYTICS DATA
// ====================================================================

export const DEMO_ANALYTICS = {
  totalFiles: DEMO_FILES.filter(f => f.type === 'file').length,
  totalFolders: DEMO_FILES.filter(f => f.type === 'folder').length,
  totalStorage: DEMO_FILES.reduce((sum, file) => sum + file.size, 0),
  totalShares: DEMO_FILES.filter(f => f.isShared).length,
  totalViews: DEMO_FILES.reduce((sum, file) => sum + file.viewCount, 0),
  totalDownloads: DEMO_FILES.reduce((sum, file) => sum + file.downloadCount, 0),
  
  storageBreakdown: [
    { type: 'Documents', size: 1558976, percentage: 35.2 },
    { type: 'Media', size: 113246208, percentage: 52.8 },
    { type: 'Archives', size: 52428800, percentage: 10.5 },
    { type: 'Other', size: 734567, percentage: 1.5 }
  ],
  
  sharePerformance: [
    { period: 'Last 7 days', shares: 15, views: 234, downloads: 67 },
    { period: 'Last 30 days', shares: 45, views: 856, downloads: 198 },
    { period: 'Last 90 days', shares: 128, views: 2340, downloads: 534 }
  ],
  
  popularFiles: DEMO_FILES
    .filter(f => f.type === 'file')
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5),
    
  recentActivity: DEMO_ACTIVITIES.slice(0, 10)
}

// ====================================================================
// DEMO DATA UTILITIES
// ====================================================================

export function getDemoFileById(id: string): DemoFile | undefined {
  return DEMO_FILES.find(file => file.id === id)
}

export function getDemoFilesByParent(parentId: string | null): DemoFile[] {
  return DEMO_FILES.filter(file => file.parentId === parentId)
}

export function getDemoFilesByType(type: 'file' | 'folder'): DemoFile[] {
  return DEMO_FILES.filter(file => file.type === type)
}

export function getDemoSharedFiles(): DemoFile[] {
  return DEMO_FILES.filter(file => file.isShared)
}

export function getDemoStarredFiles(): DemoFile[] {
  return DEMO_FILES.filter(file => file.isStarred)
}

export function getDemoRecentFiles(limit: number = 10): DemoFile[] {
  return DEMO_FILES
    .filter(f => f.type === 'file')
    .sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime())
    .slice(0, limit)
}

export function searchDemoFiles(query: string): DemoFile[] {
  const lowercaseQuery = query.toLowerCase()
  return DEMO_FILES.filter(file => 
    file.name.toLowerCase().includes(lowercaseQuery) ||
    file.description?.toLowerCase().includes(lowercaseQuery) ||
    file.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getDemoStorageStats() {
  const totalStorage = DEMO_FILES.reduce((sum, file) => sum + file.size, 0)
  const usedPercentage = (totalStorage / (2 * 1024 * 1024 * 1024)) * 100 // 2GB limit
  
  return {
    used: totalStorage,
    total: 2 * 1024 * 1024 * 1024, // 2GB
    percentage: Math.min(usedPercentage, 100),
    remaining: Math.max(0, (2 * 1024 * 1024 * 1024) - totalStorage)
  }
}

// ====================================================================
// DEMO DATA INITIALIZATION
// ====================================================================

export function initializeDemoData() {
  // This function can be called to set up initial demo state
  console.log('🎪 Demo Data Initialized')
  console.log(`📁 ${DEMO_FILES.length} files and folders loaded`)
  console.log(`👥 ${DEMO_USERS.length} demo users available`)
  console.log(`📊 ${DEMO_ACTIVITIES.length} recent activities`)
  console.log(`💾 Storage: ${(getDemoStorageStats().used / 1024 / 1024).toFixed(1)}MB used`)
  
  return {
    files: DEMO_FILES,
    users: DEMO_USERS,
    activities: DEMO_ACTIVITIES,
    analytics: DEMO_ANALYTICS
  }
}

export default {
  DEMO_FILES,
  DEMO_USERS,
  DEMO_ACTIVITIES,
  DEMO_ANALYTICS,
  getDemoFileById,
  getDemoFilesByParent,
  getDemoFilesByType,
  getDemoSharedFiles,
  getDemoStarredFiles,
  getDemoRecentFiles,
  searchDemoFiles,
  getDemoStorageStats,
  initializeDemoData
}
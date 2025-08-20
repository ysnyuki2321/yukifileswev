"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedFileManager } from "@/components/file-manager/enhanced-file-manager"
import { 
  Upload, FileText, Folder, Settings, User, ArrowLeft, 
  Plus, Search, Filter, Grid, List, Download, Share2, 
  Eye, Edit, Trash2, MoreHorizontal, Home
} from "lucide-react"
import Link from "next/link"

// Mock demo files
const demoFiles = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    size: 2048576,
    type: 'application/pdf',
    path: '/',
    lastModified: new Date('2024-01-15'),
    isFolder: false,
    mimeType: 'application/pdf'
  },
  {
    id: '2', 
    name: 'Images',
    size: 0,
    type: 'folder',
    path: '/',
    lastModified: new Date('2024-01-14'),
    isFolder: true,
    mimeType: 'folder'
  },
  {
    id: '3',
    name: 'presentation.pptx',
    size: 5242880,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    path: '/',
    lastModified: new Date('2024-01-13'),
    isFolder: false,
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  },
  {
    id: '4',
    name: 'logo.png',
    size: 1024000,
    type: 'image/png',
    path: '/Images/',
    lastModified: new Date('2024-01-12'),
    isFolder: false,
    mimeType: 'image/png'
  },
  {
    id: '5',
    name: 'banner.jpg',
    size: 2048000,
    type: 'image/jpeg',
    path: '/Images/',
    lastModified: new Date('2024-01-11'),
    isFolder: false,
    mimeType: 'image/jpeg'
  },
  {
    id: '6',
    name: 'Documents',
    size: 0,
    type: 'folder',
    path: '/',
    lastModified: new Date('2024-01-10'),
    isFolder: true,
    mimeType: 'folder'
  },
  {
    id: '7',
    name: 'contract.docx',
    size: 1536000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    path: '/Documents/',
    lastModified: new Date('2024-01-09'),
    isFolder: false,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  {
    id: '8',
    name: 'data.xlsx',
    size: 3072000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    path: '/Documents/',
    lastModified: new Date('2024-01-08'),
    isFolder: false,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
]

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'filemanager'>('overview')

  const handleFileSelect = (file: any) => {
    console.log('Demo: File selected:', file.name)
  }

  const handleFileEdit = (file: any) => {
    console.log('Demo: Edit file:', file.name)
  }

  const handleFileDelete = (file: any) => {
    console.log('Demo: Delete file:', file.name)
  }

  const handleFileShare = (file: any) => {
    console.log('Demo: Share file:', file.name)
  }

  const handleFileDownload = (file: any) => {
    console.log('Demo: Download file:', file.name)
  }

  const handleFileUpload = (files: FileList) => {
    console.log('Demo: Upload files:', Array.from(files).map(f => f.name))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">YukiFiles Demo</h1>
                  <p className="text-sm text-purple-200">Interactive File Manager Demo</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
              Demo Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10 bg-black/10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('overview')}
              className={`rounded-none border-b-2 ${
                activeTab === 'overview' 
                  ? 'border-purple-500 bg-purple-500/10 text-white' 
                  : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'filemanager' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('filemanager')}
              className={`rounded-none border-b-2 ${
                activeTab === 'filemanager' 
                  ? 'border-purple-500 bg-purple-500/10 text-white' 
                  : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Folder className="w-4 h-4 mr-2" />
              File Manager
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to YukiFiles Demo</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Explore our powerful file management system with this interactive demo. 
                All features are fully functional in demo mode.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Upload className="w-5 h-5 mr-2 text-purple-400" />
                    Upload Files
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Drag & drop or click to upload files instantly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setActiveTab('filemanager')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Try Upload
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Folder className="w-5 h-5 mr-2 text-blue-400" />
                    File Organization
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Create folders and organize your files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setActiveTab('filemanager')}
                    variant="outline" 
                    className="w-full border-blue-500 text-blue-300 hover:bg-blue-500/10"
                  >
                    Explore Files
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Share2 className="w-5 h-5 mr-2 text-green-400" />
                    Share & Collaborate
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Share files securely with customizable permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setActiveTab('filemanager')}
                    variant="outline" 
                    className="w-full border-green-500 text-green-300 hover:bg-green-500/10"
                  >
                    Try Sharing
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button
                size="lg"
                onClick={() => setActiveTab('filemanager')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4"
              >
                <Folder className="w-5 h-5 mr-2" />
                Open File Manager Demo
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'filemanager' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">File Manager Demo</h2>
              <Badge variant="outline" className="border-purple-500 text-purple-300">
                {demoFiles.length} Demo Files
              </Badge>
            </div>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-0">
                <EnhancedFileManager
                  files={demoFiles}
                  onFileSelect={handleFileSelect}
                  onFileEdit={handleFileEdit}
                  onFileDelete={handleFileDelete}
                  onFileShare={handleFileShare}
                  onFileDownload={handleFileDownload}
                  onFileUpload={handleFileUpload}
                  className="min-h-[600px]"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


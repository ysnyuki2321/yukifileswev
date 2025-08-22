"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Files, Search, Grid, List, Filter, SortAsc, 
  Plus, Upload, Download, Share2, Lock, Star,
  Archive, Database, Eye, Settings, RefreshCw,
  BarChart3, Users, HardDrive, Zap, Globe
} from "lucide-react"
import { EnhancedFileManager } from "@/components/file-manager/enhanced-file-manager"
import { comprehensiveDemoFiles, getFileStats, FileItem, demoFolders } from "./ComprehensiveDemoFiles"

export function UltimateFileManagerDemo() {
  const [demoFiles, setDemoFiles] = useState<FileItem[]>(comprehensiveDemoFiles)
  const [showStats, setShowStats] = useState(true)

  const stats = getFileStats(demoFiles)

  const handleFileCreate = (fileData: any) => {
    // Handle both new file creation and archive file addition
    if (fileData.name && typeof fileData.isFolder !== 'undefined') {
      // New file/folder creation
      const newFile: FileItem = {
        id: `new-${Date.now()}`,
        name: fileData.name,
        original_name: fileData.name,
        mime_type: fileData.isFolder ? 'folder' : 'text/plain',
        file_size: fileData.isFolder ? 0 : Math.floor(Math.random() * 1000000),
        size: fileData.isFolder ? 0 : Math.floor(Math.random() * 1000000),
        created_at: new Date().toISOString(),
        content: fileData.isFolder ? '' : 'New file content',
        thumbnail: null,
        is_starred: false,
        isStarred: false,
        is_public: false,
        isShared: false,
        owner: 'demo@yukifiles.com',
        hasPassword: false,
        inArchive: false,
        category: fileData.isFolder ? 'other' : 'document'
      }
      setDemoFiles(prev => [...prev, newFile])
    } else {
      // Archive file or extracted file addition
      const newFile: FileItem = {
        id: `archive-${Date.now()}`,
        name: fileData.name || 'New Archive File',
        original_name: fileData.name || 'New Archive File',
        mime_type: fileData.mime_type || 'application/octet-stream',
        file_size: fileData.size || Math.floor(Math.random() * 1000000),
        size: fileData.size || Math.floor(Math.random() * 1000000),
        created_at: new Date().toISOString(),
        content: fileData.content || 'Archive content',
        thumbnail: null,
        is_starred: false,
        isStarred: false,
        is_public: false,
        isShared: false,
        owner: 'demo@yukifiles.com',
        hasPassword: false,
        inArchive: fileData.inArchive || false,
        category: fileData.category || 'archive'
      }
      setDemoFiles(prev => [...prev, newFile])
    }
  }

  const handleFileUpdate = (updatedFile: FileItem) => {
    setDemoFiles(prev => prev.map(file => 
      file.id === updatedFile.id ? updatedFile : file
    ))
  }

  const handleFileDelete = (fileId: string) => {
    setDemoFiles(prev => prev.filter(file => file.id !== fileId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">File Manager</h2>
          <p className="text-gray-400">Comprehensive file management system</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowStats(!showStats)}
            variant="outline"
            size="sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showStats ? 'Hide' : 'Show'} Stats
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Files className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Files</p>
                  <p className="text-xl font-bold text-white">{stats.totalFiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Size</p>
                  <p className="text-xl font-bold text-white">{stats.totalSize}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Starred</p>
                  <p className="text-xl font-bold text-white">{stats.starredFiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Shared</p>
                  <p className="text-xl font-bold text-white">{stats.sharedFiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File Manager */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            Enhanced File Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedFileManager
            files={demoFiles}
            folders={demoFolders}
            onFileCreate={handleFileCreate}
            onFileUpdate={handleFileUpdate}
            onFileDelete={handleFileDelete}
            isDemoMode={true}
          />
        </CardContent>
      </Card>

      {/* Demo Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Upload className="w-5 h-5 text-blue-400" />
              <Badge variant="secondary">Demo Feature</Badge>
            </div>
            <h3 className="font-semibold text-white">Drag & Drop Upload</h3>
            <p className="text-sm text-gray-400">Upload files with drag and drop</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Archive className="w-5 h-5 text-green-400" />
              <Badge variant="secondary">Demo Feature</Badge>
            </div>
            <h3 className="font-semibold text-white">Archive Management</h3>
            <p className="text-sm text-gray-400">Extract and create archives</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="w-5 h-5 text-red-400" />
              <Badge variant="secondary">Demo Feature</Badge>
            </div>
            <h3 className="font-semibold text-white">Password Protection</h3>
            <p className="text-sm text-gray-400">Secure files with passwords</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
        id: fileData.id || `file-${Date.now()}`,
        name: fileData.name,
        original_name: fileData.name,
        mime_type: fileData.type || 'application/octet-stream',
        file_size: fileData.size || 0,
        size: fileData.size || 0,
        created_at: new Date().toISOString(),
        content: 'Extracted file content',
        thumbnail: null,
        is_starred: false,
        isStarred: false,
        is_public: false,
        isShared: false,
        owner: 'demo@yukifiles.com',
        hasPassword: false,
        inArchive: fileData.inArchive || false,
        category: 'other'
      }
      setDemoFiles(prev => [...prev, newFile])
    }
  }

  const handleFileEdit = (file: any) => {
    console.log('Editing file:', file.name)
  }

  const handleFileUpload = (files: File[]) => {
    const newFiles: FileItem[] = files.map(file => ({
      id: `upload-${Date.now()}-${Math.random()}`,
      name: file.name,
      original_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      size: file.size,
      created_at: new Date().toISOString(),
      content: 'Uploaded file content',
      thumbnail: null,
      is_starred: false,
      isStarred: false,
      is_public: false,
      isShared: false,
      owner: 'demo@yukifiles.com',
      hasPassword: false,
      inArchive: false,
      category: file.type.startsWith('image/') ? 'media' :
                file.type.startsWith('video/') ? 'media' :
                file.type.startsWith('audio/') ? 'media' :
                'document'
    }))
    
    setDemoFiles(prev => [...prev, ...newFiles])
  }

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">🗂️ Ultimate File Manager Demo</h2>
            <p className="text-gray-400">Test all file management features with {demoFiles.length} demo files</p>
          </div>
          <Button
            onClick={() => setShowStats(!showStats)}
            variant="outline"
            className="border-purple-500/30"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showStats ? 'Hide' : 'Show'} Stats
          </Button>
        </div>

        {/* Demo Stats */}
        {showStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t border-purple-500/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.total}</div>
              <div className="text-xs text-gray-400">Total Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.folders}</div>
              <div className="text-xs text-gray-400">Folders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.shared}</div>
              <div className="text-xs text-gray-400">Shared</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.protected}</div>
              <div className="text-xs text-gray-400">Protected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.archived}</div>
              <div className="text-xs text-gray-400">Archived</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{(stats.totalSize / 1024 / 1024).toFixed(0)}MB</div>
              <div className="text-xs text-gray-400">Total Size</div>
            </div>
          </div>
        )}
      </div>

      {/* Main File Manager */}
      <EnhancedFileManager
        files={demoFiles.map(file => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.mime_type,
          lastModified: new Date(file.created_at),
          isFolder: file.mime_type === 'folder',
          isStarred: file.is_starred,
          isShared: file.is_public,
          thumbnail: file.content,
          content: file.content,
          owner: file.owner,
          hasPassword: file.hasPassword,
          inArchive: file.inArchive,
          category: file.category,
          encryptedName: file.encryptedName,
          accessLimits: file.accessLimits ? {
            views: file.accessLimits.currentViews,
            downloads: file.accessLimits.currentDownloads,
            maxViews: file.accessLimits.maxViews,
            maxDownloads: file.accessLimits.maxDownloads
          } : undefined,
          expiresAt: file.expiresAt ? new Date(file.expiresAt) : undefined
        }))}
        onFileUpload={handleFileUpload}
        onFileCreate={handleFileCreate}
        isAdmin={true}
      />

      {/* Demo Feature Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-black/40 border border-purple-500/20 rounded-xl p-6">
          <div className="space-y-2">
            <h4 className="text-purple-400 font-medium">🎯 File Management</h4>
            <ul className="text-gray-400 space-y-1 text-sm">
              <li>• Upload → Drag & drop multiple files</li>
              <li>• Preview → Images, videos, audio, code</li>
              <li>• Edit → Syntax highlighting editor</li>
              <li>• Context menu → Right-click/long-press</li>
            </ul>
          </div>
        </div>

        <div className="bg-black/40 border border-purple-500/20 rounded-xl p-6">
          <div className="space-y-2">
            <h4 className="text-green-400 font-medium">🔗 Sharing & Security</h4>
            <ul className="text-gray-400 space-y-1 text-sm">
              <li>• Share → Advanced security options</li>
              <li>• Password protection toggle</li>
              <li>• Access limits & expiration</li>
              <li>• Filename encryption</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-black/40 border border-purple-500/20 rounded-xl p-6">
          <div className="space-y-2">
            <h4 className="text-orange-400 font-medium">📦 Advanced Features</h4>
            <ul className="text-gray-400 space-y-1 text-sm">
              <li>• Compress → Professional overlay</li>
              <li>• Search → Enhanced với highlighting</li>
              <li>• Breadcrumb → Windows-style navigation</li>
              <li>• Multi-select → Bulk operations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
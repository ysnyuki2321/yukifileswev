"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

interface MobileLayoutProps {
  files: FileItem[]
  filteredAndSortedFiles: FileItem[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterType: 'all' | 'images' | 'videos' | 'audio' | 'documents' | 'code'
  setFilterType: (type: 'all' | 'images' | 'videos' | 'audio' | 'documents' | 'code') => void
  showAnalytics: boolean
  setShowAnalytics: (show: boolean) => void
  handleCreateFile: () => void
  handleCreateFolder: () => void
  setShowUploadProgress: (show: boolean) => void
  handleFileClick: (file: FileItem) => void
  handleRightClick: (file: FileItem, event: React.MouseEvent) => void
  handleShare: (file: FileItem) => void
  handleAdvancedShare: (file: FileItem) => void
  selectedFiles: Set<string>
  toggleMultiSelect: (fileId: string) => void
  clearMultiSelect: () => void
  multiSelectMode: boolean
  showMultiActions: boolean
  setShowMultiActions: (show: boolean) => void
  handleTouchStart: (file: FileItem) => void
  handleTouchEnd: () => void
  getFileCategory: (filename: string) => string
  getFileIcon: (file: FileItem) => React.ReactNode
}

export function MobileLayout({
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
  handleRightClick,
  handleShare,
  handleAdvancedShare,
  selectedFiles,
  toggleMultiSelect,
  clearMultiSelect,
  multiSelectMode,
  showMultiActions,
  setShowMultiActions,
  handleTouchStart,
  handleTouchEnd,
  getFileCategory,
  getFileIcon
}: MobileLayoutProps) {
  const formatBytes = (bytes: number, decimals = 2, isFolder = false) => {
    if (isFolder) return "Folder"
    if (bytes === 0) return "0 Bytes"
    
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4 p-4 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Files</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="text-gray-400 hover:text-white"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-gray-400 h-12 text-base"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'images', 'videos', 'audio', 'documents', 'code'].map((type) => (
          <Button
            key={type}
            variant={filterType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(type as any)}
            className={`whitespace-nowrap ${
              filterType === type 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0" 
                : "bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-700/50"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleCreateFile}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white h-12"
        >
          <FilePlus className="w-4 h-4 mr-2" />
          New File
        </Button>
        <Button
          onClick={handleCreateFolder}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12"
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          New Folder
        </Button>
        <Button
          onClick={() => setShowUploadProgress(true)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white h-12"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Multi-select Actions */}
      {showMultiActions && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">
                {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
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
                className="flex-1 bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600/50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600/50"
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

      {/* Files Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {filteredAndSortedFiles.map((file) => {
          const isSelected = selectedFiles.has(file.id)
          const isFolder = file.isFolder
          
          return (
            <Card
              key={file.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? "ring-2 ring-blue-500 bg-blue-500/10" 
                  : "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
              }`}
              onClick={() => {
                if (multiSelectMode) {
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
                <div className="text-center w-full">
                  <p className="text-sm text-white font-medium truncate max-w-full" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {formatBytes(file.size || 0, 2, isFolder)}
                  </p>
                </div>

                {/* Selection Indicator */}
                {multiSelectMode && (
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

      {/* Empty State */}
      {filteredAndSortedFiles.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <File className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No files found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery ? `No files match "${searchQuery}"` : "Create your first file to get started"}
            </p>
            {!searchQuery && (
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleCreateFile}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <FilePlus className="w-4 h-4 mr-2" />
                  New File
                </Button>
                <Button
                  onClick={handleCreateFolder}
                  variant="outline"
                  className="border-slate-600 text-gray-300 hover:bg-slate-700/50"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analytics Panel */}
      {showAnalytics && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
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
            
            <div className="mt-4">
              <h4 className="text-white font-medium mb-2">Storage Usage</h4>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Used</span>
                  <span className="text-white">{formatBytes(files.reduce((acc, f) => acc + (f.size || 0), 0))}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
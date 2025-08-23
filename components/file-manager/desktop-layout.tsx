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

interface DesktopLayoutProps {
  files: FileItem[]
  filteredAndSortedFiles: FileItem[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterType: 'all' | 'images' | 'videos' | 'audio' | 'documents' | 'code'
  setFilterType: (type: 'all' | 'images' | 'videos' | 'audio' | 'documents' | 'code') => void
  sortBy: 'name' | 'size' | 'date'
  setSortBy: (sort: 'name' | 'size' | 'date') => void
  sortOrder: 'asc' | 'desc'
  setSortOrder: (order: 'asc' | 'desc') => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
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
  getFileCategory: (filename: string) => string
  getFileIcon: (file: FileItem) => React.ReactNode
}

export function DesktopLayout({
  files,
  filteredAndSortedFiles,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
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
  getFileCategory,
  getFileIcon
}: DesktopLayoutProps) {
  const formatBytes = (bytes: number, decimals = 2, isFolder = false) => {
    if (isFolder) return "Folder"
    if (bytes === 0) return "0 Bytes"
    
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Desktop Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">File Manager</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="text-gray-400 hover:text-white"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setShowUploadProgress(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Search and Filters Row */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-800/50 border-slate-700 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="images">Images</option>
            <option value="videos">Videos</option>
            <option value="audio">Audio</option>
            <option value="documents">Documents</option>
            <option value="code">Code</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800/50 border-slate-700 text-white rounded-md px-3 py-2 text-sm"
          >
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="date">Date</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="border-slate-600 text-gray-300 hover:bg-slate-700/50"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleCreateFile}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <FilePlus className="w-4 h-4 mr-2" />
          New File
        </Button>
        <Button
          onClick={handleCreateFolder}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          New Folder
        </Button>
      </div>

      {/* Multi-select Actions */}
      {showMultiActions && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
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
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600/50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600/50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600/50"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAndSortedFiles.map((file) => {
            const isSelected = selectedFiles.has(file.id)
            const isFolder = file.isFolder
            
            return (
              <Card
                key={file.id}
                className={`relative cursor-pointer transition-all duration-200 group ${
                  isSelected 
                    ? "ring-2 ring-blue-500 bg-blue-500/10" 
                    : "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600"
                }`}
                onClick={() => {
                  if (multiSelectMode) {
                    toggleMultiSelect(file.id)
                  } else {
                    handleFileClick(file)
                  }
                }}
                onContextMenu={(e) => handleRightClick(file, e)}
              >
                <CardContent className="p-4">
                  {/* File Icon */}
                  <div className="w-full h-24 mb-3 flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                  
                  {/* File Name */}
                  <div className="text-center">
                    <p className="text-sm text-white font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatBytes(file.size || 0, 2, isFolder)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(file.created_at)}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  {multiSelectMode && (
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? "bg-blue-500 border-blue-500" 
                        : "bg-transparent border-gray-400"
                    }`}>
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  )}

                  {/* File Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-slate-700/80 text-gray-300 border-0"
                    >
                      {getFileCategory(file.name)}
                    </Badge>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFileClick(file)
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShare(file)
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMultiSelect(file.id)
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedFiles.map((file) => {
            const isSelected = selectedFiles.has(file.id)
            const isFolder = file.isFolder
            
            return (
              <Card
                key={file.id}
                className={`cursor-pointer transition-all duration-200 ${
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
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Selection Checkbox */}
                    {multiSelectMode && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleMultiSelect(file.id)}
                          className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                        />
                      </div>
                    )}
                    
                    {/* File Icon */}
                    <div className="w-12 h-12 flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium truncate">{file.name}</p>
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-slate-700/80 text-gray-300 border-0"
                        >
                          {getFileCategory(file.name)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {formatBytes(file.size || 0, 2, isFolder)} • {formatDate(file.created_at)}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFileClick(file)
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShare(file)
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRightClick(file, e)
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedFiles.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <File className="w-20 h-20 text-gray-500 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-300 mb-3">No files found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery ? `No files match "${searchQuery}"` : "Create your first file to get started"}
            </p>
            {!searchQuery && (
              <div className="flex gap-3 justify-center">
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
                <Button
                  onClick={() => setShowUploadProgress(true)}
                  variant="outline"
                  className="border-slate-600 text-gray-300 hover:bg-slate-700/50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analytics Panel */}
      {showAnalytics && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{files?.length || 0}</div>
                <div className="text-sm text-gray-400">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {files?.filter(f => getFileCategory(f.name) === 'images')?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Images</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {files?.filter(f => getFileCategory(f.name) === 'documents')?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Documents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {files?.filter(f => getFileCategory(f.name) === 'code')?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Code Files</div>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Storage Usage</h4>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400">Used</span>
                    <span className="text-white">{formatBytes(files.reduce((acc, f) => acc + (f.size || 0), 0))}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">45% of 10 GB used</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Recent Activity</h4>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Files uploaded today: {files.filter(f => 
                        new Date(f.created_at).toDateString() === new Date().toDateString()
                      ).length}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">Total downloads: 1,234</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Share2 className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400">Shared files: {files.filter(f => f.is_public).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
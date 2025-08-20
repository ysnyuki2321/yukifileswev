"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Filter, Upload, Download, Share2, Trash2, Edit, 
  Eye, MoreHorizontal, Grid, List, FileText, Image, Video, 
  Music, Archive, File, CheckSquare, Square, Calendar, 
  HardDrive, Users, Lock, Globe, Star
} from "lucide-react"
import { useToastHelpers } from "@/components/ui/toast"
import { formatBytes, formatDate } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  isPublic: boolean
  downloads: number
  shareToken: string
  thumbnail?: string
}

interface EnhancedFileManagerProps {
  files: FileItem[]
  onUpload: () => void
  onDelete: (ids: string[]) => void
  onRename: (id: string, newName: string) => void
  onToggleVisibility: (id: string) => void
  onRegenerateLink: (id: string) => void
  onDownload: (id: string) => void
  onShare: (id: string) => void
}

export default function EnhancedFileManager({
  files,
  onUpload,
  onDelete,
  onRename,
  onToggleVisibility,
  onRegenerateLink,
  onDownload,
  onShare
}: EnhancedFileManagerProps) {
  const toast = useToastHelpers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "size" | "date" | "downloads">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterType, setFilterType] = useState<string>("all")
  const [isRenaming, setIsRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")

  // File type categories
  const fileTypes = {
    image: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
    video: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
    audio: ["mp3", "wav", "flac", "aac", "ogg"],
    document: ["pdf", "doc", "docx", "txt", "rtf"],
    archive: ["zip", "rar", "7z", "tar", "gz"],
    other: []
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (fileTypes.image.includes(extension || "")) return <Image className="w-5 h-5 text-blue-400" />
    if (fileTypes.video.includes(extension || "")) return <Video className="w-5 h-5 text-red-400" />
    if (fileTypes.audio.includes(extension || "")) return <Music className="w-5 h-5 text-green-400" />
    if (fileTypes.document.includes(extension || "")) return <FileText className="w-5 h-5 text-yellow-400" />
    if (fileTypes.archive.includes(extension || "")) return <Archive className="w-5 h-5 text-purple-400" />
    return <File className="w-5 h-5 text-gray-400" />
  }

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (fileTypes.image.includes(extension || "")) return "image"
    if (fileTypes.video.includes(extension || "")) return "video"
    if (fileTypes.audio.includes(extension || "")) return "audio"
    if (fileTypes.document.includes(extension || "")) return "document"
    if (fileTypes.archive.includes(extension || "")) return "archive"
    return "other"
  }

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || getFileType(file.name) === filterType
      return matchesSearch && matchesType
    })

    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "size":
          aValue = a.size
          bValue = b.size
          break
        case "date":
          aValue = new Date(a.uploadedAt).getTime()
          bValue = new Date(b.uploadedAt).getTime()
          break
        case "downloads":
          aValue = a.downloads
          bValue = b.downloads
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [files, searchTerm, filterType, sortBy, sortOrder])

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredAndSortedFiles.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(filteredAndSortedFiles.map(f => f.id)))
    }
  }

  const handleSelectFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    setSelectedFiles(newSelected)
  }

  const handleBulkDelete = () => {
    if (selectedFiles.size === 0) {
      toast.warning("No files selected", "Please select files to delete")
      return
    }
    
    onDelete(Array.from(selectedFiles))
    setSelectedFiles(new Set())
    toast.success("Files deleted", `${selectedFiles.size} files have been deleted`)
  }

  const handleRename = (file: FileItem) => {
    setIsRenaming(file.id)
    setRenameValue(file.name)
  }

  const saveRename = () => {
    if (isRenaming && renameValue.trim()) {
      onRename(isRenaming, renameValue.trim())
      setIsRenaming(null)
      setRenameValue("")
      toast.success("File renamed", "File name has been updated")
    }
  }

  const cancelRename = () => {
    setIsRenaming(null)
    setRenameValue("")
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">File Manager</CardTitle>
              <p className="text-gray-400 mt-1">
                {filteredAndSortedFiles.length} of {files.length} files
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {formatBytes(files.reduce((sum, f) => sum + f.size, 0))}
                </div>
                <div className="text-sm text-gray-400">Total Storage</div>
              </div>
              <Button onClick={onUpload} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-black/30 border border-gray-600 text-white rounded-lg px-3 py-2 focus:border-purple-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
                <option value="archive">Archives</option>
                <option value="other">Other</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field as any)
                  setSortOrder(order as any)
                }}
                className="bg-black/30 border border-gray-600 text-white rounded-lg px-3 py-2 focus:border-purple-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="size-desc">Largest First</option>
                <option value="size-asc">Smallest First</option>
                <option value="downloads-desc">Most Downloaded</option>
              </select>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="bg-black/30 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="bg-black/30 border-gray-600 text-white hover:bg-gray-700"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedFiles.size > 0 && (
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">
                  {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Select All
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    Array.from(selectedFiles).forEach(id => onDownload(id))
                    toast.success("Download started", "Files are being downloaded")
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    Array.from(selectedFiles).forEach(id => onShare(id))
                    toast.success("Share links copied", "Share links have been copied to clipboard")
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              isSelected={selectedFiles.has(file.id)}
              onSelect={() => handleSelectFile(file.id)}
              onRename={() => handleRename(file)}
              onDelete={() => onDelete([file.id])}
              onDownload={() => onDownload(file.id)}
              onShare={() => onShare(file.id)}
              onToggleVisibility={() => onToggleVisibility(file.id)}
              onRegenerateLink={() => onRegenerateLink(file.id)}
              getFileIcon={getFileIcon}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.size === filteredAndSortedFiles.length && filteredAndSortedFiles.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-600 bg-black/30 text-purple-500 focus:ring-purple-500"
                      />
                    </th>
                    <th className="text-left p-4 text-gray-300">File</th>
                    <th className="text-left p-4 text-gray-300">Size</th>
                    <th className="text-left p-4 text-gray-300">Uploaded</th>
                    <th className="text-left p-4 text-gray-300">Downloads</th>
                    <th className="text-left p-4 text-gray-300">Status</th>
                    <th className="text-left p-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedFiles.map((file) => (
                    <tr key={file.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.id)}
                          onChange={() => handleSelectFile(file.id)}
                          className="rounded border-gray-600 bg-black/30 text-purple-500 focus:ring-purple-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.name)}
                          <div>
                            <div className="text-white font-medium">{file.name}</div>
                            <div className="text-gray-400 text-sm">{getFileType(file.name)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{formatBytes(file.size)}</td>
                      <td className="p-4 text-gray-300">{formatDate(file.uploadedAt)}</td>
                      <td className="p-4 text-gray-300">{file.downloads}</td>
                      <td className="p-4">
                        <Badge variant={file.isPublic ? "default" : "secondary"}>
                          {file.isPublic ? "Public" : "Private"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload(file.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onShare(file.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRename(file)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete([file.id])}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredAndSortedFiles.length === 0 && (
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No files found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterType !== "all" 
                ? "Try adjusting your search or filters" 
                : "Upload your first file to get started"
              }
            </p>
            {!searchTerm && filterType === "all" && (
              <Button onClick={onUpload} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// File Card Component
function FileCard({ 
  file, 
  isSelected, 
  onSelect, 
  onRename, 
  onDelete, 
  onDownload, 
  onShare, 
  onToggleVisibility, 
  onRegenerateLink,
  getFileIcon 
}: {
  file: FileItem
  isSelected: boolean
  onSelect: () => void
  onRename: () => void
  onDelete: () => void
  onDownload: () => void
  onShare: () => void
  onToggleVisibility: () => void
  onRegenerateLink: () => void
  getFileIcon: (name: string) => React.ReactNode
}) {
  return (
    <Card className={`bg-black/40 backdrop-blur-lg border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 ${
      isSelected ? 'ring-2 ring-purple-500' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="mt-1 rounded border-gray-600 bg-black/30 text-purple-500 focus:ring-purple-500"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {getFileIcon(file.name)}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex items-center justify-between">
                <span>{formatBytes(file.size)}</span>
                <Badge variant={file.isPublic ? "default" : "secondary"} className="text-xs">
                  {file.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>{formatDate(file.uploadedAt)}</span>
                <span>{file.downloads} downloads</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownload}
                className="text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRename}
                className="text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
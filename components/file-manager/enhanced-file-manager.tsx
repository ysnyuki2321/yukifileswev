"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Upload, FolderPlus, FilePlus, Search, Grid, List,
  File, Folder, Star, Share2, MoreHorizontal, Trash2,
  Download, Eye, Edit3, Copy
} from "lucide-react"
import { FileEditor } from "@/components/file-editor/file-editor"
import { formatBytes } from "@/lib/utils"

export interface FileItem {
  id: string
  name: string
  type: string
  size: number
  lastModified: Date
  isFolder: boolean
  content?: string
  thumbnail?: string
  isStarred?: boolean
  isShared?: boolean
  owner?: string
  path?: string
}

interface EnhancedFileManagerProps {
  files: FileItem[]
  onFileUpload?: (files: File[]) => void
  onFileEdit?: (file: FileItem) => void
  onFileDelete?: (fileId: string) => void
  onFileSave?: (file: FileItem, content: string, name?: string) => void
  onFileCreate?: (name: string, type: string) => void
  onFolderCreate?: (name: string) => void
  uploadProgress?: { [key: string]: number }
  uploadingFiles?: string[]
  isAdmin?: boolean
}

export function EnhancedFileManager({
  files = [],
  onFileUpload,
  onFileEdit,
  onFileDelete,
  onFileSave,
  onFileCreate,
  onFolderCreate,
  uploadProgress = {},
  uploadingFiles = [],
  isAdmin = false
}: EnhancedFileManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFileClick = (file: FileItem) => {
    if (file.isFolder) {
      // Handle folder navigation
      return
    }
    
    if (isTextFile(file.name)) {
      setSelectedFile(file)
      setShowEditor(true)
      onFileEdit?.(file)
    }
  }

  const isTextFile = (filename: string): boolean => {
    const textExtensions = [
      'txt', 'md', 'json', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss',
      'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift', 'kt',
      'xml', 'yaml', 'yml', 'sql', 'csv', 'log'
    ]
    const ext = filename.split('.').pop()?.toLowerCase()
    return textExtensions.includes(ext || '')
  }

  const getFileIcon = (file: FileItem) => {
    if (file.isFolder) {
      return <Folder className="w-8 h-8 text-blue-400" />
    }
    return <File className="w-8 h-8 text-gray-400" />
  }

  const handleCreateFile = () => {
    const name = prompt("Enter file name:")
    if (name) {
      onFileCreate?.(name, "text")
    }
  }

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:")
    if (name) {
      onFolderCreate?.(name)
    }
  }

  const closeEditor = () => {
    setShowEditor(false)
    setSelectedFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">File Manager</h1>
          <p className="text-gray-400">{filteredFiles.length} items</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCreateFile} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
            <FilePlus className="w-4 h-4 mr-2" />
            New File
          </Button>
          <Button onClick={handleCreateFolder} size="sm" variant="outline">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-purple-500/20 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* File Grid/List */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardContent className="p-6">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold text-white mb-2">No files found</h3>
              <p className="text-gray-400">
                {searchQuery ? "Try adjusting your search query" : "Upload your first file to get started"}
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              : "space-y-2"
            }>
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group cursor-pointer rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-200 ${
                    viewMode === "grid"
                      ? "p-4 text-center bg-slate-800/30 hover:bg-slate-800/50"
                      : "p-3 flex items-center gap-3 bg-slate-800/20 hover:bg-slate-800/40"
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  {viewMode === "grid" ? (
                    <>
                      <div className="mb-3">
                        {getFileIcon(file)}
                      </div>
                      <p className="text-sm text-white font-medium truncate mb-1">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {file.isFolder ? "Folder" : formatBytes(file.size)}
                      </p>
                      {file.isStarred && (
                        <Star className="w-3 h-3 text-yellow-400 mx-auto mt-1" />
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        {getFileIcon(file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {file.isFolder ? "Folder" : `${formatBytes(file.size)} • ${file.lastModified.toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {file.isStarred && (
                          <Star className="w-4 h-4 text-yellow-400" />
                        )}
                        {file.isShared && (
                          <Share2 className="w-4 h-4 text-green-400" />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle more actions
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Editor Modal */}
      {showEditor && selectedFile && (
        <div className="fixed inset-0 z-50">
          <FileEditor
            file={{
              id: selectedFile.id,
              name: selectedFile.name,
              content: selectedFile.content || '',
              type: selectedFile.type,
              size: selectedFile.size,
              lastModified: selectedFile.lastModified
            }}
            onSave={(file, content, name) => {
              onFileSave?.(selectedFile, content, name)
              closeEditor()
            }}
            onClose={closeEditor}
          />
        </div>
      )}
    </div>
  )
}
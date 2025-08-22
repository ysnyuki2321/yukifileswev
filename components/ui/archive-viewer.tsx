"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Archive, X, File, Folder, Download, Eye, 
  FileText, Image, Video, Music, Code, Database,
  Package, Zap, HardDrive, Clock, CheckCircle
} from "lucide-react"

interface ArchiveFile {
  name: string
  size: number
  path: string[]
  type: 'file' | 'folder'
  compressed: boolean
  originalSize?: number
}

interface ArchiveViewerProps {
  isOpen: boolean
  onClose: () => void
  archiveFile: {
    id: string
    name: string
    size: number
    type: string
  }
}

export function ArchiveViewer({ isOpen, onClose, archiveFile }: ArchiveViewerProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [extracting, setExtracting] = useState(false)
  const [extractProgress, setExtractProgress] = useState(0)

  // Mock archive contents
  const mockArchiveContents: ArchiveFile[] = [
    { name: 'documents', size: 0, path: [], type: 'folder', compressed: false },
    { name: 'project-proposal.pdf', size: 2048576, path: ['documents'], type: 'file', compressed: true, originalSize: 3145728 },
    { name: 'presentation.pptx', size: 8388608, path: ['documents'], type: 'file', compressed: true, originalSize: 12582912 },
    { name: 'media', size: 0, path: [], type: 'folder', compressed: false },
    { name: 'demo-video.mp4', size: 52428800, path: ['media'], type: 'file', compressed: true, originalSize: 104857600 },
    { name: 'background-music.mp3', size: 4194304, path: ['media'], type: 'file', compressed: true, originalSize: 6291456 },
    { name: 'source-code', size: 0, path: [], type: 'folder', compressed: false },
    { name: 'app.js', size: 65536, path: ['source-code'], type: 'file', compressed: true, originalSize: 131072 },
    { name: 'database.sqlite', size: 12582912, path: [], type: 'file', compressed: true, originalSize: 25165824 }
  ]

  const getCurrentContents = () => {
    return mockArchiveContents.filter(item => {
      const itemPath = item.path
      return itemPath.length === selectedPath.length && 
             itemPath.every((segment, index) => segment === selectedPath[index])
    })
  }

  const getFileIcon = (fileName: string, isFolder: boolean) => {
    if (isFolder) return <Folder className="w-4 h-4 text-purple-400" />
    
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-400" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-4 h-4 text-green-400" />
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-4 h-4 text-red-400" />
      case 'mp3':
      case 'wav':
      case 'flac':
        return <Music className="w-4 h-4 text-yellow-400" />
      case 'js':
      case 'ts':
      case 'py':
      case 'java':
        return <Code className="w-4 h-4 text-purple-400" />
      case 'db':
      case 'sqlite':
        return <Database className="w-4 h-4 text-cyan-400" />
      default:
        return <File className="w-4 h-4 text-gray-400" />
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getCompressionRatio = (original: number, compressed: number): string => {
    const ratio = ((original - compressed) / original) * 100
    return `${ratio.toFixed(1)}%`
  }

  const handleExtract = async () => {
    setExtracting(true)
    setExtractProgress(0)

    // Simulate extraction progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setExtractProgress(i)
    }

    setExtracting(false)
    console.log('Archive extracted successfully')
  }

  const navigateToFolder = (folderName: string) => {
    setSelectedPath([...selectedPath, folderName])
  }

  const navigateUp = () => {
    if (selectedPath.length > 0) {
      setSelectedPath(selectedPath.slice(0, -1))
    }
  }

  const currentContents = getCurrentContents()
  const totalFiles = mockArchiveContents.filter(item => item.type === 'file').length
  const totalOriginalSize = mockArchiveContents.reduce((acc, item) => acc + (item.originalSize || item.size), 0)
  const totalCompressedSize = mockArchiveContents.reduce((acc, item) => acc + item.size, 0)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-purple-500/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Archive className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Archive Viewer</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400">{archiveFile.name}</p>
                    <Badge className="bg-orange-500/20 text-orange-400 text-xs">In Archive</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleExtract}
                  disabled={extracting}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {extracting ? (
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Extract All
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Archive Stats */}
          <div className="px-6 py-4 border-b border-purple-500/10 flex-shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/20 rounded-lg p-3 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <File className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Files</span>
                </div>
                <p className="text-lg font-bold text-white">{totalFiles}</p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Original</span>
                </div>
                <p className="text-lg font-bold text-white">{formatBytes(totalOriginalSize)}</p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Compressed</span>
                </div>
                <p className="text-lg font-bold text-white">{formatBytes(totalCompressedSize)}</p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-gray-400">Saved</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {getCompressionRatio(totalOriginalSize, totalCompressedSize)}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-6 py-3 border-b border-purple-500/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              {selectedPath.length > 0 && (
                <Button
                  onClick={navigateUp}
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  ← Back
                </Button>
              )}
              
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Archive className="w-4 h-4" />
                <span>{archiveFile.name}</span>
                {selectedPath.map((segment, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span>/</span>
                    <button
                      onClick={() => setSelectedPath(selectedPath.slice(0, index + 1))}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      {segment}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content List */}
          <div className="flex-1 p-6 overflow-y-auto">
            {extracting ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Archive className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2">Extracting Archive</h3>
                  <p className="text-gray-400 mb-4">Please wait while we extract your files...</p>
                  <div className="w-64 bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-200" 
                      style={{ width: `${extractProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">{extractProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {currentContents.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all cursor-pointer"
                    onClick={() => {
                      if (item.type === 'folder') {
                        navigateToFolder(item.name)
                      } else {
                        console.log('Preview file:', item.name)
                      }
                    }}
                  >
                    <div className="flex-shrink-0">
                      {getFileIcon(item.name, item.type === 'folder')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium truncate">{item.name}</p>
                        <Badge className="bg-orange-500/20 text-orange-400 text-xs">In Archive</Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span>{item.type === 'folder' ? 'Folder' : formatBytes(item.size)}</span>
                        {item.originalSize && (
                          <>
                            <span>•</span>
                            <span className="text-green-400">
                              {getCompressionRatio(item.originalSize, item.size)} smaller
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>{selectedPath.length > 0 ? selectedPath.join('/') + '/' : ''}archive root</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('Preview:', item.name)
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('Extract:', item.name)
                        }}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                
                {currentContents.length === 0 && (
                  <div className="text-center py-12">
                    <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">This folder is empty</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-purple-500/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                <span>{currentContents.length} items in current folder</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                  onClick={() => console.log('Download archive:', archiveFile.name)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Archive
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
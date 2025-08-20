"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, FileImage, FileVideo, FileAudio, FileCode, FileArchive,
  Download, Share2, Eye, X, Play, Pause, Volume2, VolumeX,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FilePreviewProps {
  file: {
    id: string
    name: string
    size: number
    mimeType?: string
    content?: string
    url?: string
  }
  isOpen: boolean
  onClose: () => void
}

export function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const getFileType = () => {
    if (!file.mimeType) return 'unknown'
    if (file.mimeType.startsWith('image/')) return 'image'
    if (file.mimeType.startsWith('video/')) return 'video'
    if (file.mimeType.startsWith('audio/')) return 'audio'
    if (file.mimeType.includes('pdf')) return 'pdf'
    if (file.mimeType.includes('text') || file.mimeType.includes('javascript') || file.mimeType.includes('json')) return 'text'
    if (file.mimeType.includes('zip') || file.mimeType.includes('rar')) return 'archive'
    return 'unknown'
  }

  const getFileIcon = () => {
    const type = getFileType()
    switch (type) {
      case 'image': return FileImage
      case 'video': return FileVideo
      case 'audio': return FileAudio
      case 'pdf': return FileText
      case 'text': return FileCode
      case 'archive': return FileArchive
      default: return FileText
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const renderPreview = () => {
    const type = getFileType()
    
    switch (type) {
      case 'image':
        return (
          <div className="relative flex items-center justify-center min-h-[400px] bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={file.url || '/placeholder-image.jpg'}
              alt={file.name}
              className="max-w-full max-h-full object-contain"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
            />
            
            {/* Image Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="text-white hover:bg-white/20"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm px-2">{Math.round(zoom * 100)}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                className="text-white hover:bg-white/20"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRotation(rotation + 90)}
                className="text-white hover:bg-white/20"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )
        
      case 'video':
        return (
          <div className="relative">
            <video
              src={file.url}
              controls
              className="w-full max-h-[500px] rounded-lg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Video Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )
        
      case 'audio':
        return (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <FileAudio className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <audio
              src={file.url}
              controls
              className="w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        )
        
      case 'pdf':
        return (
          <div className="bg-gray-900 rounded-lg p-4">
            <iframe
              src={file.url}
              className="w-full h-[600px] rounded-lg"
              title={file.name}
            />
          </div>
        )
        
      case 'text':
        return (
          <div className="bg-gray-900 rounded-lg p-4">
            <pre className="text-sm text-gray-300 overflow-auto max-h-[500px] whitespace-pre-wrap">
              {file.content || 'No content available'}
            </pre>
          </div>
        )
        
      case 'archive':
        return (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <FileArchive className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Archive File</h3>
            <p className="text-gray-400 mb-4">
              This is a compressed archive file. Download to extract contents.
            </p>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <Download className="w-4 h-4 mr-2" />
              Download Archive
            </Button>
          </div>
        )
        
      default:
        return (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">File Preview Not Available</h3>
            <p className="text-gray-400 mb-4">
              This file type cannot be previewed. Download to view.
            </p>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <getFileIcon() className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <DialogTitle className="text-white">{file.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {getFileType().toUpperCase()}
                  </Badge>
                  <span className="text-gray-400 text-sm">{formatFileSize(file.size)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
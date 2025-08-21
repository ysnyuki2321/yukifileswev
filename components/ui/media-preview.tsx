"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VideoPlayer } from "@/components/ui/video-player"
import { 
  Download, Copy, ExternalLink, Maximize2, RotateCw, 
  ZoomIn, ZoomOut, Image, Video, Sparkles, Eye
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MediaPreviewProps {
  file: {
    id: string
    name: string
    type: string
    size: number
    thumbnail?: string
  }
  onClose: () => void
}

export function MediaPreview({ file, onClose }: MediaPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp)$/i)
  const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i)
  const isAudio = file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|flac|aac|ogg|m4a)$/i)

  const handleDownload = () => {
    if (file.thumbnail) {
      const link = document.createElement('a')
      link.href = file.thumbnail
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleCopy = () => {
    if (file.thumbnail) {
      navigator.clipboard.writeText(file.thumbnail)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-4 bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              {isImage ? <Image className="w-5 h-5 text-white" /> : 
               isVideo ? <Video className="w-5 h-5 text-white" /> : 
               <Sparkles className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-white font-semibold">{file.name}</h2>
              <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <Button
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-300"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm">{zoom}%</span>
                <Button
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-300"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-300"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button
              onClick={handleDownload}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={onClose} size="sm" variant="ghost" className="text-gray-400">
              ×
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          {isImage && file.thumbnail ? (
            <div className="h-full flex items-center justify-center">
              <img
                src={file.thumbnail}
                alt={file.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>
          ) : isVideo && file.thumbnail ? (
            <div className="h-full flex items-center justify-center">
              <VideoPlayer
                src={file.thumbnail}
                title={file.name}
                className="max-w-full max-h-full"
                aspectRatio="auto"
              />
            </div>
          ) : isAudio && file.thumbnail ? (
            <div className="h-full flex items-center justify-center">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-8 max-w-md">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{file.name}</h3>
                  <audio controls className="w-full">
                    <source src={file.thumbnail} type={file.type} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-300 font-medium">Preview not available</p>
                <p className="text-gray-400 text-sm mt-2">File content cannot be displayed</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/10 bg-slate-900/30 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Type: {file.type}</span>
            <span>Size: {formatFileSize(file.size)}</span>
            {isImage && (
              <span>Zoom: {zoom}% • Rotation: {rotation}°</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
              className="border-purple-500/30 text-purple-300"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy URL
            </Button>
            <Button
              onClick={() => window.open(file.thumbnail, '_blank')}
              size="sm"
              variant="outline"
              className="border-purple-500/30 text-purple-300"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Original
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
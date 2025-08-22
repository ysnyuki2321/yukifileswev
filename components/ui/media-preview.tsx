'use client'

import { useState, useEffect } from 'react'
import { ResponsiveVideoPlayer } from './responsive-video-player'
import { MusicPlayer } from './music-player'
import { PopoutMusicPlayer } from './popout-music-player'
import { VideoPlayer } from './video-player'
import { Download, Share2, RotateCcw, ZoomIn, ZoomOut, Star, X, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MediaPreviewProps {
  file: {
    id: string
    name: string
    type: string
    content: string
    thumbnail?: string | null
    size: number
    artist?: string
    album?: string
    albumArt?: string
  }
  onDownload?: () => void
  onShare?: () => void
  onLike?: () => void
  onClose?: () => void
  className?: string
}

export function MediaPreview({ file, onDownload, onShare, onLike, onClose, className = '' }: MediaPreviewProps) {
  const [imageRotation, setImageRotation] = useState(0)
  const [imageZoom, setImageZoom] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getAspectRatio = () => {
    if (file.type.startsWith('video/')) {
      // Detect vertical video (TikTok style)
      if (file.name.toLowerCase().includes('tiktok') || file.name.toLowerCase().includes('vertical')) {
        return '9:16'
      }
      return '16:9'
    }
    return '16:9'
  }

  // Video files - use inline display
  if (file.type.startsWith('video/')) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{file.name}</h2>
                <p className="text-sm text-gray-400">Video Player</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onDownload}
                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onShare}
                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-colors border border-green-500/30"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onLike}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors border border-red-500/30"
                title="Like"
              >
                <Star className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg text-gray-400 hover:text-gray-300 transition-colors border border-gray-500/30"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Content */}
        <div className="p-4">
          <VideoPlayer
            src={file.content}
            poster={file.thumbnail || undefined}
            title={file.name}
            onDownload={onDownload}
            onShare={onShare}
            onLike={onLike}
            className="w-full"
          />
        </div>
      </div>
    )
  }

  // Audio files - use inline display
  if (file.type.startsWith('audio/')) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{file.name}</h2>
                <p className="text-sm text-gray-400">Audio Player</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onDownload}
                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onShare}
                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-colors border border-green-500/30"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onLike}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors border border-red-500/30"
                title="Like"
              >
                <Star className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg text-gray-400 hover:text-gray-300 transition-colors border border-gray-500/30"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Audio Content */}
        <div className="p-4">
          <PopoutMusicPlayer
            src={file.content}
            title={file.name}
            artist={file.artist}
            album={file.album}
            albumArt={file.albumArt || file.thumbnail || undefined}
            onDownload={onDownload}
            onShare={onShare}
            onLike={onLike}
          />
        </div>
      </div>
    )
  }

  // Image files - use inline display
  if (file.type.startsWith('image/')) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{file.name}</h2>
                <p className="text-sm text-gray-400">Image Viewer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setImageRotation(prev => prev + 90)}
                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30"
                title="Rotate"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImageZoom(prev => Math.min(3, prev + 0.5))}
                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.5))}
                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={onDownload}
                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onShare}
                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-colors border border-green-500/30"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onLike}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors border border-red-500/30"
                title="Like"
              >
                <Star className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg text-gray-400 hover:text-gray-300 transition-colors border border-gray-500/30"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Content */}
        <div className="p-4">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
            <img
              src={file.content}
              alt={file.name}
              className="w-full h-full object-contain transition-transform duration-300"
              style={{
                transform: `rotate(${imageRotation}deg) scale(${imageZoom})`
              }}
            />
          </div>
          
          {/* Image Info */}
          <div className="mt-4 p-4 bg-black/20 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">{file.name}</h3>
                <p className="text-gray-400 text-sm">
                  Image • {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <div className="text-sm text-gray-400">
                Zoom: {imageZoom.toFixed(1)}x • Rotation: {imageRotation}°
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default fallback
  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">File Preview</h2>
              <p className="text-sm text-gray-400">Unsupported File Type</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onShare}
              className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-colors border border-green-500/30"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg text-gray-400 hover:text-gray-300 transition-colors border border-gray-500/30"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-white text-xl font-semibold mb-2">Unsupported File Type</h3>
        <p className="text-gray-400">
          This file type ({file.type}) cannot be previewed.
        </p>
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors"
          >
            Download
          </button>
          <button
            onClick={onShare}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
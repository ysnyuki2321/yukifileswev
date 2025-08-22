'use client'

import { useState, useEffect } from 'react'
import { ResponsiveVideoPlayer } from './responsive-video-player'
import { MusicPlayer } from './music-player'
import { PopoutMusicPlayer } from './popout-music-player'
import { VideoPlayer } from './video-player'
import { Download, Share2, RotateCcw, ZoomIn, ZoomOut, Star } from 'lucide-react'

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
  className?: string
}

export function MediaPreview({ file, onDownload, onShare, onLike, className = '' }: MediaPreviewProps) {
  const [imageRotation, setImageRotation] = useState(0)
  const [imageZoom, setImageZoom] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [showPopoutPlayer, setShowPopoutPlayer] = useState(false)

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

  // Video files - use new VideoPlayer
  if (file.type.startsWith('video/')) {
    return (
      <VideoPlayer
        src={file.content}
        poster={file.thumbnail || undefined}
        title={file.name}
        onDownload={onDownload}
        onShare={onShare}
        onLike={onLike}
        className={className}
      />
    )
  }

  // Audio files - use MusicPlayer
  if (file.type.startsWith('audio/')) {
    return (
      <div className={`bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 ${className}`}>
        <MusicPlayer
          file={file}
          onDownload={onDownload}
          onShare={onShare}
          onLike={onLike}
          isMobile={isMobile}
        />
      </div>
    )
  }

  // Image files
  if (file.type.startsWith('image/')) {
    return (
      <div className={`bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 ${className}`}>
        {/* Image Container */}
        <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
          <img
            src={file.content}
            alt={file.name}
            className="w-full h-full object-contain transition-transform duration-300"
            style={{
              transform: `rotate(${imageRotation}deg) scale(${imageZoom})`
            }}
          />
          
          {/* Image Controls Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setImageRotation(prev => prev + 90)}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setImageZoom(prev => Math.min(3, prev + 0.5))}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.5))}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Info */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg truncate">{file.name}</h3>
              <p className="text-gray-400 text-sm">
                Image • {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onDownload}
                className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onShare}
                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onLike}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                title="Like"
              >
                <Star className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default fallback
  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 ${className}`}>
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
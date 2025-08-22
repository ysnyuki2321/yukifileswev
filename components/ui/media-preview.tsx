'use client'

import { useState, useEffect } from 'react'
import { ResponsiveVideoPlayer } from './responsive-video-player'
import { MobileVideoPlayer } from './mobile-video-player'
import { PopoutMusicPlayer } from './popout-music-player'
import { Download, Share2, RotateCcw, ZoomIn, ZoomOut, Star } from 'lucide-react'

interface MediaPreviewProps {
  file: {
    id: string
    name: string
    mime_type: string
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
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getAspectRatio = () => {
    if (file.mime_type.startsWith('video/')) {
      // Detect vertical video (TikTok style)
      if (file.name.toLowerCase().includes('tiktok') || file.name.toLowerCase().includes('vertical')) {
        return '9:16'
      }
      return '16:9'
    }
    return '16:9'
  }

  if (file.mime_type.startsWith('image/')) {
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
                onClick={onLike}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Star className="w-5 h-5" />
              </button>
              <button
                onClick={onShare}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={onDownload}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (file.mime_type.startsWith('video/')) {
    // Use MobileVideoPlayer for mobile, ResponsiveVideoPlayer for desktop
    if (isMobile) {
      return (
        <MobileVideoPlayer
          src={file.content}
          title={file.name}
          thumbnail={file.thumbnail || undefined}
          aspectRatio={getAspectRatio() as '16:9' | '9:16' | '1:1' | '4:3'}
          onDownload={onDownload}
          onShare={onShare}
          onLike={onLike}
          className={className}
        />
      )
    } else {
      return (
        <ResponsiveVideoPlayer
          src={file.content}
          title={file.name}
          thumbnail={file.thumbnail || undefined}
          aspectRatio={getAspectRatio() as '16:9' | '9:16' | '1:1' | '4:3'}
          onDownload={onDownload}
          onShare={onShare}
          className={className}
        />
      )
    }
  }

  if (file.mime_type.startsWith('audio/')) {
    return (
      <>
        {/* Audio Preview Card */}
        <div className={`bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center ${className}`}>
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <p className="text-white font-medium mb-2">{file.name}</p>
            <p className="text-sm mb-1">{file.artist || 'Unknown Artist'}</p>
            <p className="text-sm text-gray-500">{file.album || 'Unknown Album'}</p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowMusicPlayer(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15a2 2 0 012 2v0a2 2 0 01-2 2h-1.586a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 0010 14H9a2 2 0 01-2-2v0a2 2 0 012-2z" />
              </svg>
              <span>Play</span>
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={onShare}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Popout Music Player */}
        {showMusicPlayer && (
          <PopoutMusicPlayer
            src={file.content}
            title={file.name}
            artist={file.artist}
            album={file.album}
            albumArt={file.albumArt || file.thumbnail || undefined}
            onClose={() => setShowMusicPlayer(false)}
            onDownload={onDownload}
            onShare={onShare}
            onLike={onLike}
          />
        )}
      </>
    )
  }

  // Fallback for other file types
  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center ${className}`}>
      <div className="text-gray-400 mb-4">
        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-white font-medium mb-2">{file.name}</p>
        <p className="text-sm">Preview not available for this file type</p>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button
          onClick={onShare}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  )
}
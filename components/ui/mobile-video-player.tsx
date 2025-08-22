'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, 
  Maximize, Minimize, Settings, Download, Share2, Heart,
  MoreHorizontal, SkipBack, SkipForward, Repeat, Shuffle
} from 'lucide-react'

interface MobileVideoPlayerProps {
  src: string
  title?: string
  thumbnail?: string
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3'
  autoPlay?: boolean
  onDownload?: () => void
  onShare?: () => void
  onLike?: () => void
  className?: string
}

export function MobileVideoPlayer({
  src,
  title = 'Video',
  thumbnail,
  aspectRatio = '16:9',
  autoPlay = false,
  onDownload,
  onShare,
  onLike,
  className = ''
}: MobileVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [quality, setQuality] = useState('720p')
  const [isLiked, setIsLiked] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  const qualities = ['360p', '720p', '1080p']
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value) / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume > 0 ? volume : 0.5
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '9:16': return 'aspect-[9/16]'
      case '1:1': return 'aspect-square'
      case '4:3': return 'aspect-[4/3]'
      default: return 'aspect-video'
    }
  }

  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 ${className}`}>
      {/* Video Container */}
      <div className={`relative ${getAspectRatioClass()} bg-black rounded-t-2xl overflow-hidden`}>
        <video
          ref={videoRef}
          src={src}
          poster={thumbnail}
          className="w-full h-full object-cover"
          playsInline
          preload="metadata"
          autoPlay={autoPlay}
        />
        
        {/* Video Overlay - Minimal */}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white ml-1" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Controls Container - Spotify Style */}
      <div className="p-4 space-y-4">
        {/* Track Info */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
            <p className="text-gray-400 text-sm">Video • {quality}</p>
          </div>
          <button
            onClick={() => {
              setIsLiked(!isLiked)
              onLike?.()
            }}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${duration ? (currentTime / duration) * 100 : 0}%, #4B5563 ${duration ? (currentTime / duration) * 100 : 0}%, #4B5563 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setPlaybackRate(playbackRate === 2 ? 0.5 : playbackRate + 0.25)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={() => skip(-10)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => skip(-5)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => skip(5)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => skip(10)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPlaybackRate(playbackRate === 2 ? 1 : 2)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMute}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="w-20">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${isMuted ? 0 : volume * 100}%, #4B5563 ${isMuted ? 0 : volume * 100}%, #4B5563 100%)`
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
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
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium">Chất lượng</label>
                <div className="flex space-x-2 mt-2">
                  {qualities.map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        quality === q 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-white text-sm font-medium">Tốc độ phát</label>
                <div className="flex space-x-2 mt-2">
                  {speeds.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setPlaybackRate(speed)
                        if (videoRef.current) {
                          videoRef.current.playbackRate = speed
                        }
                      }}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        playbackRate === speed 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}
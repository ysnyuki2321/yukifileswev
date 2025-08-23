"use client"

import React, { useState, useRef, useEffect } from 'react'
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  SkipBack, SkipForward, RotateCcw, Settings, Download,
  Share2, Heart, MoreVertical, Fullscreen, FullscreenExit,
  ChevronLeft, ChevronRight, Loader2, AlertCircle, X,
  Smartphone, Monitor, Tablet, Laptop, Desktop
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface UltimateVideoPlayerProps {
  src: string
  poster?: string
  title?: string
  onDownload?: () => void
  onShare?: () => void
  onLike?: () => void
  className?: string
  autoPlay?: boolean
  loop?: boolean
}

export function UltimateVideoPlayer({ 
  src, 
  poster, 
  title = "Video Player",
  onDownload,
  onShare,
  onLike,
  className = "",
  autoPlay = false,
  loop = false
}: UltimateVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [quality, setQuality] = useState('auto')
  const [isLiked, setIsLiked] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [controlsTimeout, setControlsTimeout] = useState<number | null>(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-hide controls
  useEffect(() => {
    if (controlsTimeout) clearTimeout(controlsTimeout)
    
    if (isPlaying && showControls) {
      const timeout = window.setTimeout(() => setShowControls(false), 3000)
      setControlsTimeout(timeout)
    }
    
    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout)
    }
  }, [isPlaying, showControls])

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setError(null)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleWaiting = () => setBuffering(true)
    const handleCanPlay = () => setBuffering(false)
    const handleError = () => setError('Video playback error')

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const seekTime = (clickX / width) * duration
    
    videoRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (onLike) onLike()
  }

  const handleShare = () => {
    if (onShare) onShare()
  }

  const handleDownload = () => {
    if (onDownload) onDownload()
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    
    if (isPlaying) {
      const timeout = window.setTimeout(() => setShowControls(false), 3000)
      setControlsTimeout(timeout)
    }
  }

  if (error) {
    return (
      <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">Playback Error</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full bg-black rounded-xl overflow-hidden group",
        className
      )}
      onMouseMove={showControlsTemporarily}
      onTouchStart={showControlsTemporarily}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        loop={loop}
        onClick={togglePlay}
      />

      {/* Buffering Indicator */}
      {buffering && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-2" />
            <p className="text-white text-sm">Loading...</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
                <Badge className="bg-white/20 text-white border-0">
                  {isMobile ? 'Mobile' : 'Desktop'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {onDownload && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDownload}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                
                {onShare && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShare}
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <Button
                size="lg"
                variant="ghost"
                onClick={togglePlay}
                className="w-20 h-20 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
              {/* Progress Bar */}
              <div 
                ref={progressRef}
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-150"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = Math.max(0, currentTime - 10)
                      }
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = Math.min(duration, currentTime + 10)
                      }
                    }}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    
                    <div className="w-20">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>

                  {onLike && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleLike}
                      className={cn(
                        "text-white hover:bg-white/20",
                        isLiked && "text-red-400"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          
        )}
      

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute bottom-20 right-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[200px]">
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium block mb-2">Playback Speed</label>
                <div className="grid grid-cols-2 gap-2">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <Button
                      key={rate}
                      size="sm"
                      variant={playbackRate === rate ? "default" : "ghost"}
                      onClick={() => changePlaybackRate(rate)}
                      className="text-white h-8"
                    >
                      {rate}x
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white text-sm font-medium block mb-2">Quality</label>
                <div className="space-y-1">
                  {['auto', '1080p', '720p', '480p'].map((q) => (
                    <Button
                      key={q}
                      size="sm"
                      variant={quality === q ? "default" : "ghost"}
                      onClick={() => setQuality(q)}
                      className="w-full justify-start text-white h-8"
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          
        )}
      
    </div>
  )
}

// Badge component
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      className
    )}>
      {children}
    </span>
  )
}
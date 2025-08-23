"use client"

import React, { useState, useRef, useEffect } from 'react'
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  SkipBack, SkipForward, Settings, Download, Share2, Heart
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
  const [isLiked, setIsLiked] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
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

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full bg-black rounded-xl overflow-hidden group",
        className
      )}
      onMouseMove={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
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

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
          {/* Top Controls */}
          <div className={cn(
            "absolute top-0 left-0 right-0 flex items-center justify-between pointer-events-auto",
            isMobile ? "p-2" : "p-4"
          )}>
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "text-white font-semibold truncate",
                isMobile ? "text-sm" : "text-lg"
              )}>{title}</h3>
            </div>
            
            <div className={cn(
              "flex items-center",
              isMobile ? "gap-1" : "gap-2"
            )}>
              {onDownload && !isMobile && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
              
              {onShare && !isMobile && (
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
              className={cn(
                "bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm",
                isMobile ? "w-16 h-16" : "w-20 h-20"
              )}
            >
              {isPlaying ? (
                <Pause className={isMobile ? "w-6 h-6" : "w-8 h-8"} />
              ) : (
                <Play className={cn(
                  isMobile ? "w-6 h-6 ml-0.5" : "w-8 h-8 ml-1"
                )} />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 pointer-events-auto",
            isMobile ? "p-2" : "p-4"
          )}>
            {/* Progress Bar */}
            <div 
              ref={progressRef}
              className={cn(
                "w-full bg-white/20 rounded-full cursor-pointer",
                isMobile ? "h-1 mb-2" : "h-2 mb-4"
              )}
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-150"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className={cn(
                "flex items-center",
                isMobile ? "gap-1" : "gap-3"
              )}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                  ) : (
                    <Play className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                  )}
                </Button>

                {!isMobile && (
                  <>
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
                  </>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                    ) : (
                      <Volume2 className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                    )}
                  </Button>
                  
                  {!isMobile && (
                    <div className="w-20">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={cn(
                "flex items-center",
                isMobile ? "gap-1" : "gap-3"
              )}>
                <span className={cn(
                  "text-white font-mono",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  {formatTime(currentTime)}{!isMobile && ` / ${formatTime(duration)}`}
                </span>

                {!isMobile && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                )}

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
                    <Heart className={cn(
                      isLiked && "fill-current",
                      isMobile ? "w-4 h-4" : "w-5 h-5"
                    )} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && !isMobile && (
        <div className="absolute bottom-20 right-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[200px]">
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium block mb-2">Quality</label>
              <div className="space-y-1">
                {['auto', '1080p', '720p', '480p'].map((q) => (
                  <Button
                    key={q}
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start text-white h-8"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
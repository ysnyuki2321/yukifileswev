"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, 
  Fullscreen, FullscreenExit, RotateCcw, Settings, 
  Maximize2, Minimize2, RotateCcw as RotateCcwIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnhancedVideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
  onClose?: () => void
  isMobile?: boolean
}

export function EnhancedVideoPlayer({ 
  src, 
  poster, 
  title, 
  className, 
  onClose,
  isMobile = false 
}: EnhancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [buffered, setBuffered] = useState<TimeRanges | null>(null)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null)

  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleProgress = () => {
      setBuffered(video.buffered)
    }

    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('volumechange', handleVolumeChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('volumechange', handleVolumeChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    if (showControls) {
      if (controlsTimeout) clearTimeout(controlsTimeout)
      const timeout = setTimeout(() => setShowControls(false), 3000)
      setControlsTimeout(timeout)
    }
  }, [showControls])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0]
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
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

  const handleMouseMove = () => {
    setShowControls(true)
  }

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false)
    }
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-lg overflow-hidden group",
        isMobile ? "w-full h-auto" : "w-full h-full",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
      />

      {/* Overlay Controls */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          {title && (
            <h3 className="text-white font-medium text-sm truncate flex-1 mr-4">
              {title}
            </h3>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2 h-8 w-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                <RotateCcwIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={togglePlay}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 p-4 h-16 w-16 rounded-full bg-black/40 backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress Bar */}
          <div className="relative">
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration}
              step={0.1}
              className="w-full"
            />
            {buffered && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full overflow-hidden">
                {Array.from({ length: buffered.length }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full bg-white/50"
                    style={{
                      left: `${(buffered.start(i) / duration) * 100}%`,
                      width: `${((buffered.end(i) - buffered.start(i)) / duration) * 100}%`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <Button
                onClick={() => skipTime(-10)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => skipTime(10)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2 text-white text-xs">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2 h-8 w-8"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Fullscreen Button */}
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                {isFullscreen ? (
                  <FullscreenExit className="w-4 h-4" />
                ) : (
                  <Fullscreen className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 bg-slate-800 border border-purple-500/30 rounded-lg p-3 min-w-[200px]">
            <div className="space-y-3">
              <div>
                <label className="text-white text-xs block mb-2">Playback Speed</label>
                <div className="grid grid-cols-2 gap-1">
                  {playbackRates.map((rate) => (
                    <Button
                      key={rate}
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.playbackRate = rate
                          setPlaybackRate(rate)
                        }
                      }}
                      variant={playbackRate === rate ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "text-xs h-7",
                        playbackRate === rate 
                          ? "bg-purple-500 text-white" 
                          : "border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                      )}
                    >
                      {rate}x
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {!duration && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  )
}
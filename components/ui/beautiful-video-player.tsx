"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  SkipBack, SkipForward, RotateCcw, Settings, Download,
  Share2, Heart, MoreVertical, Fullscreen, FullscreenExit,
  ChevronLeft, ChevronRight, Loader2, AlertCircle, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface BeautifulVideoPlayerProps {
  src: string
  poster?: string
  title?: string
  onClose?: () => void
  onDownload?: () => void
  onShare?: () => void
  onLike?: () => void
  className?: string
  autoPlay?: boolean
  loop?: boolean
}

export function BeautifulVideoPlayer({ 
  src, 
  poster, 
  title = "Video Player",
  onClose,
  onDownload,
  onShare,
  onLike,
  className = "",
  autoPlay = false,
  loop = false
}: BeautifulVideoPlayerProps) {
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
    const handleError = () => setError('Failed to load video')
    const handleEnded = () => {
      setIsPlaying(false)
      if (!loop) setCurrentTime(0)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('ended', handleEnded)
    }
  }, [loop])

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
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

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted
      setIsMuted(newMuted)
      videoRef.current.muted = newMuted
      if (newMuted) {
        videoRef.current.volume = 0
        setVolume(0)
      } else {
        videoRef.current.volume = volume || 0.5
        setVolume(volume || 0.5)
      }
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0
  }

  const handleContainerClick = () => {
    setShowControls(true)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike?.()
  }

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/20 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg font-medium">Failed to load video</p>
          <p className="text-red-300 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl group",
        isFullscreen ? "fixed inset-0 z-[10000] rounded-none" : "aspect-video",
        className
      )}
      onClick={handleContainerClick}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        loop={loop}
        playsInline
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {buffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-lg">Loading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play Button Overlay */}
      <AnimatePresence>
        {!isPlaying && !buffering && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"
          >
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {onClose && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="text-white hover:bg-white/20 h-10 w-10 p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Center Controls */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-6">
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => skip(-10)}
                  className="text-white hover:bg-white/20 h-12 w-12 p-0 rounded-full"
                >
                  <SkipBack className="w-6 h-6" />
                </Button>
                
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 h-16 w-16 p-0 rounded-full"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </Button>
                
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => skip(10)}
                  className="text-white hover:bg-white/20 h-12 w-12 p-0 rounded-full"
                >
                  <SkipForward className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="w-full cursor-pointer"
                />
              </div>

              {/* Control Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    {!isMobile && (
                      <div className="w-20">
                        <Slider
                          value={[volume]}
                          max={1}
                          step={0.1}
                          onValueChange={handleVolumeChange}
                          className="cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  <span className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Action Buttons */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleLike}
                    className={cn(
                      "text-white hover:bg-white/20",
                      isLiked && "text-red-400"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                  </Button>

                  {onShare && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onShare}
                      className="text-white hover:bg-white/20"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  )}

                  {onDownload && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onDownload}
                      className="text-white hover:bg-white/20"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Settings */}
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>

                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[200px]"
                        >
                          <div className="space-y-3">
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
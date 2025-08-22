"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, SkipBack, SkipForward, Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ResponsiveVideoPlayerProps {
  src: string
  poster?: string
  title?: string
  aspectRatio?: '16:9' | '9:16' | '4:3' | '1:1'
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  onEnded?: () => void
}

export function ResponsiveVideoPlayer({
  src,
  poster,
  title,
  aspectRatio = '16:9',
  autoPlay = false,
  muted = false,
  loop = false,
  onEnded
}: ResponsiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([1])
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [quality, setQuality] = useState('auto')
  const [isLoading, setIsLoading] = useState(false)
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

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) return
    
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isPlaying, showControls])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('waiting', () => setIsLoading(true))
    video.addEventListener('canplay', () => setIsLoading(false))

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onEnded])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return
    
    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return
    
    const newVolume = value[0]
    video.volume = newVolume
    setVolume([newVolume])
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    
    if (isMuted) {
      video.volume = volume[0]
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

  const toggleFullscreen = async () => {
    const container = containerRef.current
    if (!container) return

    try {
      if (!isFullscreen) {
        await container.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return
    
    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowSettings(false)
  }

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video'
      case '9:16': return 'aspect-[9/16]'
      case '4:3': return 'aspect-[4/3]'
      case '1:1': return 'aspect-square'
      default: return 'aspect-video'
    }
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden ${getAspectRatioClass()} w-full max-w-full group`}
      onMouseMove={showControlsTemporarily}
      onTouchStart={showControlsTemporarily}
      onClick={isMobile ? togglePlay : showControlsTemporarily}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="w-full h-full object-cover"
        style={{ 
          objectFit: aspectRatio === '9:16' ? 'cover' : 'contain',
          maxHeight: isMobile ? '80vh' : 'none'
        }}
      />

      {/* Loading Spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play Button Overlay - Only show when paused */}
      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            onClick={togglePlay}
          >
            <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform`}>
              <Play className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white ml-1`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title Overlay */}
      {title && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2">
            <h3 className="text-white font-medium text-xs sm:text-sm truncate">
              {title}
            </h3>
          </div>
        </div>
      )}

      {/* Controls - Mobile First Design */}
      <AnimatePresence>
        {(showControls || !isPlaying) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
          >
            {/* Progress Bar */}
            <div className="px-2 sm:px-4 pt-4 pb-2">
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/80 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Mobile Controls */}
            {isMobile ? (
              <div className="px-3 pb-3 space-y-3">
                {/* Main playback controls */}
                <div className="flex items-center justify-center gap-6">
                  <Button
                    onClick={() => skip(-10)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 w-10 h-10 p-0 rounded-full"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={togglePlay}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-12 h-12 p-0 rounded-full"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </Button>
                  
                  <Button
                    onClick={() => skip(10)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 w-10 h-10 p-0 rounded-full"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Secondary controls */}
                <div className="flex items-center justify-between">
                  {/* Volume controls */}
                  <div className="flex items-center gap-2 flex-1">
                    <Button
                      onClick={toggleMute}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 w-8 h-8 p-0"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="flex-1 max-w-20">
                      <Slider
                        value={isMuted ? [0] : volume}
                        onValueChange={handleVolumeChange}
                        max={1}
                        min={0}
                        step={0.1}
                      />
                    </div>
                  </div>

                  {/* Settings and fullscreen */}
                  <div className="flex items-center gap-1">
                    <div className="relative">
                      <Button
                        onClick={() => setShowSettings(!showSettings)}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20 w-8 h-8 p-0"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      
                      {/* Mobile Settings Panel */}
                      <AnimatePresence>
                        {showSettings && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-full right-0 mb-2 bg-black/95 border border-purple-500/20 rounded-lg p-3 min-w-40 shadow-2xl z-50"
                          >
                            <div className="text-white text-xs font-medium mb-2">Playback Speed</div>
                            <div className="space-y-1">
                              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                <button
                                  key={rate}
                                  onClick={() => changePlaybackRate(rate)}
                                  className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                                    playbackRate === rate 
                                      ? 'bg-purple-600 text-white' 
                                      : 'text-gray-300 hover:bg-white/10'
                                  }`}
                                >
                                  {rate}x
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <Button
                      onClick={toggleFullscreen}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 w-8 h-8 p-0"
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Controls */
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => skip(-10)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={togglePlay}
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={() => skip(10)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={toggleMute}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="w-20">
                      <Slider
                        value={isMuted ? [0] : volume}
                        onValueChange={handleVolumeChange}
                        max={1}
                        min={0}
                        step={0.1}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Desktop Settings */}
                  <div className="relative">
                    <Button
                      onClick={() => setShowSettings(!showSettings)}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute bottom-full right-0 mb-2 bg-black/95 border border-purple-500/20 rounded-lg p-4 min-w-48 shadow-2xl z-50"
                        >
                          <div className="text-white text-sm font-medium mb-3">Playback Speed</div>
                          <div className="space-y-2">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => changePlaybackRate(rate)}
                                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                                  playbackRate === rate 
                                    ? 'bg-purple-600 text-white' 
                                    : 'text-gray-300 hover:bg-white/10'
                                }`}
                              >
                                {rate}x {rate === 1 && '(Normal)'}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
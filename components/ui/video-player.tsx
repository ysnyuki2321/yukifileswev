"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  SkipBack, SkipForward, RotateCcw, Settings, Download,
  Sparkles, Clock, Eye
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
  aspectRatio?: 'auto' | '16:9' | '9:16' | '1:1' | '4:3'
}

export function VideoPlayer({ src, poster, title, className, aspectRatio = 'auto' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([1])
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [quality, setQuality] = useState('auto')
  const [videoMetadata, setVideoMetadata] = useState<{ width: number, height: number } | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => {
      setDuration(video.duration)
      setVideoMetadata({ width: video.videoWidth, height: video.videoHeight })
      setIsLoading(false)
    }
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('loadstart', () => setIsLoading(true))
    video.addEventListener('canplay', () => setIsLoading(false))

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', handleEnded)
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

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return
    video.volume = value[0]
    setVolume(value)
    setIsMuted(value[0] === 0)
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

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement?.parentElement
    if (!document.fullscreenElement && container) {
      container.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
  }

  // Custom skip button component with number
  const SkipButton = ({ seconds, direction }: { seconds: number, direction: 'forward' | 'backward' }) => (
    <Button
      onClick={() => skip(direction === 'forward' ? seconds : -seconds)}
      size="sm"
      variant="ghost"
      className="text-white hover:bg-white/20 relative w-12 h-10"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-1">
          {direction === 'backward' ? <SkipBack className="w-3 h-3" /> : <SkipForward className="w-3 h-3" />}
          <span className="text-sm font-bold">{seconds}</span>
        </div>
        <span className="text-xs opacity-80">sec</span>
      </div>
    </Button>
  )

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowSettings(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getAspectRatioClass = () => {
    if (aspectRatio !== 'auto') {
      switch (aspectRatio) {
        case '16:9': return 'aspect-video'
        case '9:16': return 'aspect-[9/16]'
        case '1:1': return 'aspect-square'
        case '4:3': return 'aspect-[4/3]'
      }
    }
    
    // Auto-detect from video metadata
    if (videoMetadata) {
      const ratio = videoMetadata.width / videoMetadata.height
      if (ratio > 1.5) return 'aspect-video' // Landscape
      if (ratio < 0.8) return 'aspect-[9/16]' // Portrait (TikTok style)
      return 'aspect-square' // Square-ish
    }
    
    return 'aspect-video' // Default
  }

  return (
    <div 
      className={cn("relative bg-black rounded-lg overflow-hidden shadow-2xl", className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <div className={getAspectRatioClass()}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          onClick={togglePlay}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 flex items-center justify-center bg-black/30"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4"
          >
            {/* Progress Bar */}
            <div className="mb-4">
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

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                 <SkipButton seconds={5} direction="backward" />
                 
                 <Button
                   onClick={togglePlay}
                   size="sm"
                   className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                 >
                   {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                 </Button>
                 
                 <SkipButton seconds={5} direction="forward" />

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
                {/* Speed Control */}
                <div className="relative">
                  <Button
                    onClick={() => setShowSettings(!showSettings)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 border border-purple-500/20 rounded-lg p-3 min-w-40">
                      {/* Playback Speed */}
                      <div className="mb-4">
                        <div className="text-white text-xs font-medium mb-2">Playback Speed</div>
                        <div className="space-y-1">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={cn(
                                "w-full text-left px-2 py-1 text-xs rounded hover:bg-purple-500/20",
                                playbackRate === rate ? "text-purple-400 bg-purple-500/10" : "text-gray-300"
                              )}
                            >
                              {rate}x {rate === 1 ? '(Normal)' : ''}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quality Settings */}
                      <div className="border-t border-gray-700 pt-3">
                        <div className="text-white text-xs font-medium mb-2">Quality</div>
                        <div className="space-y-1">
                          {[
                            { value: 'auto', label: 'Auto (Best)' },
                            { value: '1080p', label: '1080p HD' },
                            { value: '720p', label: '720p HD' },
                            { value: '480p', label: '480p' },
                            { value: '360p', label: '360p' }
                          ].map((q) => (
                            <button
                              key={q.value}
                              onClick={() => setQuality(q.value)}
                              className={cn(
                                "w-full text-left px-2 py-1 text-xs rounded hover:bg-purple-500/20",
                                quality === q.value ? "text-purple-400 bg-purple-500/10" : "text-gray-300"
                              )}
                            >
                              {q.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Video Info */}
                      {videoMetadata && (
                        <div className="border-t border-gray-700 pt-3 mt-3">
                          <div className="text-white text-xs font-medium mb-2">Video Info</div>
                          <div className="text-gray-400 text-xs space-y-1">
                            <div>Resolution: {videoMetadata.width}×{videoMetadata.height}</div>
                            <div>Duration: {formatTime(duration)}</div>
                            <div>Aspect: {(videoMetadata.width / videoMetadata.height).toFixed(2)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title Overlay */}
      {title && (
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {title}
            </h3>
          </div>
        </div>
      )}
    </div>
  )
}
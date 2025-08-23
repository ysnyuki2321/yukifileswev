"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Repeat, Shuffle, Download, Share2, Heart, HeartOff,
  Music, Disc, Radio, Headphones, Minimize2, Maximize2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface MusicPlayerProps {
  src: string
  title?: string
  artist?: string
  album?: string
  albumArt?: string
  className?: string
  onDownload?: () => void
  onShare?: () => void
  onLike?: () => void
  onPopout?: () => void
}

export function MusicPlayer({ 
  src, 
  title = "Unknown Track", 
  artist = "Unknown Artist", 
  album = "Unknown Album",
  albumArt,
  className,
  onDownload,
  onShare,
  onLike,
  onPopout
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([0.8])
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [visualizerData, setVisualizerData] = useState<number[]>([])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        setIsPlaying(false)
      }
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    // Prevent audio from stopping when tab loses focus
    audio.addEventListener('visibilitychange', () => {
      if (document.hidden && isPlaying) {
        // Keep playing even when tab is hidden
        audio.play().catch(() => {})
      }
    })

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [isRepeat])

  // Audio visualizer effect
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const bars = Array.from({ length: 20 }, () => Math.random() * 100)
        setVisualizerData(bars)
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    
    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    
    const newVolume = value[0]
    audio.volume = newVolume
    setVolume([newVolume])
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    
    if (isMuted) {
      audio.volume = volume[0]
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-40 bg-black/90 backdrop-blur-lg border border-purple-500/30 rounded-lg p-3 shadow-2xl"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            {albumArt ? (
              <img src={albumArt} alt={title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Music className="w-5 h-5 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{title}</p>
            <p className="text-gray-400 text-xs truncate">{artist}</p>
          </div>

          <Button
            onClick={togglePlay}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 w-8 h-8 p-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            onClick={() => setIsMinimized(false)}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 w-8 h-8 p-0"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        <audio ref={audioRef} src={src} />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900",
        "border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden",
        "backdrop-blur-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <div className="flex items-center space-x-2">
          <Headphones className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium">Music Player</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsMinimized(true)}
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Album Art & Info */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-2xl">
              {albumArt ? (
                <img src={albumArt} alt={title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Disc className={cn("w-16 h-16 text-white", isPlaying ? "animate-spin" : "")} />
              )}
            </div>
            
            {/* Visualizer overlay */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-end justify-center space-x-1 p-2 rounded-lg">
                {visualizerData.slice(0, 8).map((height, index) => (
                  <motion.div
                    key={index}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.1 }}
                    className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full opacity-70"
                    style={{ minHeight: '4px' }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-purple-300 font-medium mb-1">{artist}</p>
            <p className="text-gray-400 text-sm">{album}</p>
            
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-4">
              <Button
                onClick={() => setIsLiked(!isLiked)}
                size="sm"
                variant="ghost"
                className={cn(
                  "text-white hover:bg-white/10",
                  isLiked ? "text-red-400" : "text-gray-400"
                )}
                onClick={() => {
                  setIsLiked(!isLiked)
                  onLike?.()
                }}
              >
                {isLiked ? <Heart className="w-4 h-4 fill-current" /> : <HeartOff className="w-4 h-4" />}
              </Button>
              
              {onShare && (
                <Button
                  onClick={onShare}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
              
              {onDownload && (
                <Button
                  onClick={onDownload}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
              
              {onPopout && (
                <Button
                  onClick={onPopout}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                  title="Open in popout player"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[duration ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Button
            onClick={() => setIsShuffle(!isShuffle)}
            size="sm"
            variant="ghost"
            className={cn(
              "text-white hover:bg-white/10",
              isShuffle ? "text-purple-400" : "text-gray-400"
            )}
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => skip(-10)}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            onClick={togglePlay}
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>

          <Button
            onClick={() => skip(10)}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => setIsRepeat(!isRepeat)}
            size="sm"
            variant="ghost"
            className={cn(
              "text-white hover:bg-white/10",
              isRepeat ? "text-purple-400" : "text-gray-400"
            )}
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={toggleMute}
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            {isMuted || volume[0] === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <div className="flex-1">
            <Slider
              value={isMuted ? [0] : volume}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
          
          <span className="text-xs text-gray-400 w-8 text-right">
            {Math.round((isMuted ? 0 : volume[0]) * 100)}%
          </span>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      )}
    </motion.div>
  )
}
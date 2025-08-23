'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Download, Share2, Repeat, Shuffle, List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface PopoutMusicPlayerProps {
  src: string
  title: string
  artist?: string
  album?: string
  albumArt?: string
  onClose?: () => void
  onDownload?: () => void
  onShare?: () => void
  onLike?: () => void
}

export function PopoutMusicPlayer({
  src,
  title,
  artist = 'Unknown Artist',
  album = 'Unknown Album',
  albumArt,
  onClose,
  onDownload,
  onShare,
  onLike
}: PopoutMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        setIsPlaying(false)
        setCurrentTime(0)
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [isRepeat])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 rounded-xl p-4 text-white">
      {/* Audio Element */}
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        {/* Album Art */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
          {albumArt ? (
            <img 
              src={albumArt} 
              alt={album} 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
          )}
        </div>
        
        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          <p className="text-gray-300 text-sm truncate">{artist}</p>
          <p className="text-gray-400 text-xs truncate">{album}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "text-gray-300 hover:text-red-500 hover:bg-red-500/20 h-8 w-8 p-0",
              isLiked && "text-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/20 h-8 w-8 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="text-gray-300 hover:text-green-400 hover:bg-green-500/20 h-8 w-8 p-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <Slider
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsShuffle(!isShuffle)}
          className={cn(
            "text-gray-300 hover:text-white hover:bg-white/20 h-8 w-8 p-0",
            isShuffle && "text-purple-400"
          )}
        >
          <Shuffle className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => skipTime(-10)}
          className="text-gray-300 hover:text-white hover:bg-white/20 h-8 w-8 p-0"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={togglePlay}
          size="lg"
          className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => skipTime(10)}
          className="text-gray-300 hover:text-white hover:bg-white/20 h-8 w-8 p-0"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsRepeat(!isRepeat)}
          className={cn(
            "text-gray-300 hover:text-white hover:bg-white/20 h-8 w-8 p-0",
            isRepeat && "text-purple-400"
          )}
        >
          <Repeat className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Bottom Controls */}
      <div className="flex items-center justify-between">
        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-gray-300 hover:text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          {!isMobile && (
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          )}
        </div>
        
        {/* Playlist Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="text-gray-300 hover:text-white hover:bg-white/20 h-8 w-8 p-0"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Playlist Panel */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-black/20 rounded-lg border border-purple-500/20"
          >
            <div className="text-center text-sm text-gray-400">
              Playlist feature coming soon...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
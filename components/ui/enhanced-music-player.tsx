"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, 
  Shuffle, Repeat, Repeat1, List, Heart, Download, Share2,
  RotateCcw, Settings, Maximize2, Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  src: string
  cover?: string
}

interface EnhancedMusicPlayerProps {
  tracks: Track[]
  initialTrackIndex?: number
  className?: string
  onClose?: () => void
  isMobile?: boolean
}

export function EnhancedMusicPlayer({ 
  tracks, 
  initialTrackIndex = 0,
  className, 
  onClose,
  isMobile = false 
}: EnhancedMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none')
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [showVisualizer, setShowVisualizer] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [shuffledTracks, setShuffledTracks] = useState<Track[]>([])

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    if (isShuffled) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5)
      setShuffledTracks(shuffled)
    }
  }, [isShuffled, tracks])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      handleNext()
    }

    const handleVolumeChange = () => {
      setVolume(audio.volume)
      setIsMuted(audio.muted)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('volumechange', handleVolumeChange)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrackIndex])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0]
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const handlePrevious = () => {
    if (currentTime > 3) {
      // If more than 3 seconds into track, restart
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    } else {
      // Go to previous track
      const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1
      setCurrentTrackIndex(newIndex)
    }
  }

  const handleNext = () => {
    let newIndex: number

    if (repeatMode === 'one') {
      newIndex = currentTrackIndex
    } else if (isShuffled) {
      const currentShuffledIndex = shuffledTracks.findIndex(t => t.id === currentTrack.id)
      newIndex = currentShuffledIndex < shuffledTracks.length - 1 ? currentShuffledIndex + 1 : 0
      const actualIndex = tracks.findIndex(t => t.id === shuffledTracks[newIndex].id)
      setCurrentTrackIndex(actualIndex)
      return
    } else {
      newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0
    }

    if (repeatMode === 'none' && newIndex === 0) {
      setIsPlaying(false)
      return
    }

    setCurrentTrackIndex(newIndex)
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all'
      if (prev === 'all') return 'one'
      return 'none'
    })
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'all': return <Repeat className="w-4 h-4" />
      case 'one': return <Repeat1 className="w-4 h-4" />
      default: return <Repeat className="w-4 h-4" />
    }
  }

  const getRepeatColor = () => {
    switch (repeatMode) {
      case 'all': return 'text-blue-400'
      case 'one': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className={cn(
      "bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl",
      isMobile ? "w-full" : "w-full max-w-md",
      className
    )}>
      {/* Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">Music Player</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowVisualizer(!showVisualizer)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2 h-8 w-8"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Album Cover */}
      <div className="p-6 text-center">
        <div className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          {currentTrack.cover ? (
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl text-purple-400">🎵</div>
            </div>
          )}
          
          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              onClick={togglePlay}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
          </div>
        </div>

        {/* Track Info */}
        <div className="mt-4 text-center">
          <h4 className="text-white font-semibold text-lg truncate">{currentTrack.title}</h4>
          <p className="text-gray-300 text-sm mt-1">{currentTrack.artist}</p>
          {currentTrack.album && (
            <p className="text-gray-400 text-xs mt-1">{currentTrack.album}</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            onValueChange={handleSeek}
            max={duration}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={toggleShuffle}
            variant="ghost"
            size="sm"
            className={cn(
              "text-white hover:bg-white/20 p-2 h-10 w-10",
              isShuffled && "text-blue-400"
            )}
          >
            <Shuffle className="w-5 h-5" />
          </Button>

          <Button
            onClick={handlePrevious}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2 h-12 w-12"
          >
            <SkipBack className="w-6 h-6" />
          </Button>

          <Button
            onClick={togglePlay}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 h-16 w-16 rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          <Button
            onClick={handleNext}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2 h-12 w-12"
          >
            <SkipForward className="w-6 h-6" />
          </Button>

          <Button
            onClick={toggleRepeat}
            variant="ghost"
            size="sm"
            className={cn(
              "text-white hover:bg-white/20 p-2 h-10 w-10",
              getRepeatColor()
            )}
          >
            {getRepeatIcon()}
          </Button>
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsLiked(!isLiked)}
              variant="ghost"
              size="sm"
              className={cn(
                "text-white hover:bg-white/20 p-2 h-8 w-8",
                isLiked && "text-red-400"
              )}
            >
              <Heart className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => setShowPlaylist(!showPlaylist)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2 h-8 w-8"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2 h-8 w-8"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2 h-8 w-8"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-3">
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
          
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.01}
            className="flex-1"
          />
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="border-t border-purple-500/20 bg-slate-800/50 max-h-64 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-white font-medium mb-3">Playlist</h4>
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => setCurrentTrackIndex(index)}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                    currentTrackIndex === index 
                      ? "bg-purple-500/20 text-purple-300" 
                      : "hover:bg-white/10 text-gray-300"
                  )}
                >
                  <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{track.title}</div>
                    <div className="text-xs text-gray-400 truncate">{track.artist}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(track.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visualizer */}
      {showVisualizer && (
        <div className="border-t border-purple-500/20 bg-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Audio Visualizer</h4>
            <Button
              onClick={() => setShowVisualizer(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2 h-6 w-6"
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-end justify-center gap-1 h-20">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                style={{
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
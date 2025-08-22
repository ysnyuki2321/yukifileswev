'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, 
  Repeat, Shuffle, Download, Share2, Heart, X, Minimize, Maximize,
  Music, User, Disc
} from 'lucide-react'

interface PopoutMusicPlayerProps {
  src: string
  title: string
  artist?: string
  album?: string
  albumArt?: string
  onClose: () => void
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
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value) / 100
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume > 0 ? volume : 0.5
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-black/90 backdrop-blur-lg border border-purple-500/30 rounded-lg p-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded overflow-hidden">
              {albumArt ? (
                <img src={albumArt} alt={album} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <button
              onClick={togglePlay}
              className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <div className="bg-black/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Now Playing</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Minimize className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Album Art & Info */}
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              {albumArt ? (
                <img src={albumArt} alt={album} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg truncate" title={title}>{title}</h3>
              <p className="text-gray-400 truncate" title={artist}>{artist}</p>
              <p className="text-gray-500 text-sm truncate" title={album}>{album}</p>
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
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${duration ? (currentTime / duration) * 100 : 0}%, #4B5563 ${duration ? (currentTime / duration) * 100 : 0}%, #4B5563 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 rounded transition-colors ${
                  isShuffle ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-2 rounded transition-colors ${
                  isRepeat ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Volume & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="flex-1 max-w-20">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${isMuted ? 0 : volume * 100}%, #4B5563 ${isMuted ? 0 : volume * 100}%, #4B5563 100%)`
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onShare}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onDownload}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <audio ref={audioRef} src={src} />
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MediaPreview } from '@/components/ui/media-preview'
import { 
  Download, Share2, Eye, Lock, Unlock, Calendar, 
  Users, AlertCircle, CheckCircle, FileText, 
  Music, Image, Video, File, Folder, Database,
  Home, ArrowLeft, Timer, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareData {
  token: string
  file: {
    id: string
    name: string
    type: string
    content: string
    size: number
    thumbnail?: string
    artist?: string
    album?: string
    albumArt?: string
  }
  password: string | null
  expiryDate: string | null
  maxViews: number | null
  maxDownloads: number | null
  allowPreview: boolean
  allowDownload: boolean
  isPublic: boolean
  createdAt: string
}

export default function DemoSharePage() {
  const params = useParams()
  const router = useRouter()
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [views, setViews] = useState(0)
  const [downloads, setDownloads] = useState(0)

  const token = params.token as string

  useEffect(() => {
    loadShareData()
  }, [token])

  const loadShareData = () => {
    setLoading(true)
    setError(null)

    try {
      // Get share data from sessionStorage
      const shareDataJson = sessionStorage.getItem(`share_${token}`)
      
      if (!shareDataJson) {
        setError('Share link not found or expired')
        setLoading(false)
        return
      }

      const data: ShareData = JSON.parse(shareDataJson)
      
      // Check expiry
      if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
        setError('This share link has expired')
        setLoading(false)
        return
      }

      setShareData(data)
      
      // Check if password is required
      if (!data.password) {
        setIsUnlocked(true)
      }
      
      // Load view/download stats
      const statsKey = `share_stats_${token}`
      const stats = localStorage.getItem(statsKey)
      if (stats) {
        const { views: savedViews, downloads: savedDownloads } = JSON.parse(stats)
        setViews(savedViews || 0)
        setDownloads(savedDownloads || 0)
      }
      
      setLoading(false)
    } catch (err) {
      setError('Failed to load share data')
      setLoading(false)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!shareData) return
    
    if (passwordInput === shareData.password) {
      setIsUnlocked(true)
      setPasswordInput('')
    } else {
      setError('Incorrect password')
    }
  }

  const handlePreview = () => {
    if (!shareData || !shareData.allowPreview) return
    
    // Increment view count
    const newViews = views + 1
    setViews(newViews)
    
    // Save stats
    const statsKey = `share_stats_${token}`
    const stats = { views: newViews, downloads }
    localStorage.setItem(statsKey, JSON.stringify(stats))
    
    setShowPreview(true)
  }

  const handleDownload = () => {
    if (!shareData || !shareData.allowDownload) return
    
    // Check download limits
    if (shareData.maxDownloads && downloads >= shareData.maxDownloads) {
      setError('Download limit exceeded')
      return
    }
    
    // Increment download count
    const newDownloads = downloads + 1
    setDownloads(newDownloads)
    
    // Save stats
    const statsKey = `share_stats_${token}`
    const stats = { views, downloads: newDownloads }
    localStorage.setItem(statsKey, JSON.stringify(stats))
    
    // Create download link
    const link = document.createElement('a')
    link.href = shareData.file.content
    link.download = shareData.file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFileIcon = () => {
    if (!shareData) return File
    
    const { type } = shareData.file
    if (type.startsWith('image/')) return Image
    if (type.startsWith('video/')) return Video
    if (type.startsWith('audio/')) return Music
    if (type === 'application/x-sqlite3') return Database
    if (type === 'folder') return Folder
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Share Link...</h2>
          <p className="text-gray-400">Please wait while we verify your link</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!shareData) return null

  // Password protection screen
  if (shareData.password && !isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Password Protected</h2>
            <p className="text-gray-400">This file is protected. Please enter the password to continue.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password..."
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
              autoFocus
            />
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={!passwordInput.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unlock File
            </Button>
          </form>
        </motion.div>
      </div>
    )
  }

  const IconComponent = getFileIcon()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => router.push('/demo')}
            variant="outline"
            size="sm"
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Demo
          </Button>
          
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            Demo Share Link
          </Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white mb-2">{shareData.file.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span>Size: {formatFileSize(shareData.file.size)}</span>
                <span>Shared: {formatDate(shareData.createdAt)}</span>
                {shareData.expiryDate && (
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    <span>Expires: {formatDate(shareData.expiryDate)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {shareData.password && (
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                  <Shield className="w-3 h-3 mr-1" />
                  Protected
                </Badge>
              )}
              {shareData.isPublic ? (
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  <Unlock className="w-3 h-3 mr-1" />
                  Public
                </Badge>
              ) : (
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-purple-500/20">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Eye className="w-4 h-4" />
              <span>{views} views</span>
              {shareData.maxViews && (
                <span className="text-gray-500">/ {shareData.maxViews}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Download className="w-4 h-4" />
              <span>{downloads} downloads</span>
              {shareData.maxDownloads && (
                <span className="text-gray-500">/ {shareData.maxDownloads}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {shareData.allowPreview && (
              <Button
                onClick={handlePreview}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                disabled={shareData.maxViews ? views >= shareData.maxViews : false}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview File
              </Button>
            )}
            
            {shareData.allowDownload && (
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                disabled={shareData.maxDownloads ? downloads >= shareData.maxDownloads : false}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            
            <Button
              onClick={() => navigator.share?.({ url: window.location.href })}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* File Preview */}
      {showPreview && (
        <div className="max-w-4xl mx-auto">
          <MediaPreview
            file={shareData.file}
            onDownload={shareData.allowDownload ? handleDownload : undefined}
            onShare={() => navigator.share?.({ url: window.location.href })}
            onLike={() => {}}
            onClose={() => setShowPreview(false)}
          />
        </div>
      )}

      {/* Demo Notice */}
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>
              <strong>Demo Mode:</strong> This is a demonstration. Share links work during this session but will be reset on page reload.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
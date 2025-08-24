"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Download, Eye, Lock, Calendar, Clock, Users, Share2, 
  FileText, Image, Video, Music, Archive, Code, 
  AlertTriangle, CheckCircle, X, Shield, Globe,
  MapPin, Smartphone, Monitor, Tablet, ExternalLink
} from 'lucide-react'

import { getDemoFileById, DEMO_FILES } from '@/lib/demo/demo-data'
import { DemoFile } from '@/lib/demo/demo-architecture'

// ====================================================================
// SHARE PAGE TYPES
// ====================================================================

interface SharePageData {
  file: DemoFile
  isPasswordProtected: boolean
  isExpired: boolean
  isDownloadLimitReached: boolean
  analytics: {
    totalViews: number
    totalDownloads: number
    recentActivity: Array<{
      time: Date
      action: string
      location: string
      device: string
    }>
  }
}

interface ShareAccessLog {
  timestamp: Date
  action: 'view' | 'download' | 'password_attempt'
  userAgent: string
  location: string
  device: string
  success: boolean
}

// ====================================================================
// MAIN SHARE PAGE COMPONENT
// ====================================================================

export default function SharePage() {
  const params = useParams()
  const token = params.token as string
  
  const [shareData, setShareData] = useState<SharePageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [downloadStarted, setDownloadStarted] = useState(false)

  useEffect(() => {
    loadShareData()
  }, [token])

  const loadShareData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Find file by share token (in demo mode, we'll use file IDs as tokens for simplicity)
      const file = findFileByToken(token)
      
      if (!file) {
        setError('Share link not found or has expired')
        setLoading(false)
        return
      }

      // Check if file has expired
      const isExpired = file.shareSettings?.expiresAt && 
                       new Date() > file.shareSettings.expiresAt

      if (isExpired) {
        setError('This share link has expired')
        setLoading(false)
        return
      }

      // Check download limit
      const isDownloadLimitReached = file.shareSettings?.maxDownloads && 
                                   file.shareSettings.currentDownloads >= file.shareSettings.maxDownloads

      // Check password protection
      const isPasswordProtected = !!file.shareSettings?.password

      const sharePageData: SharePageData = {
        file,
        isPasswordProtected,
        isExpired,
        isDownloadLimitReached,
        analytics: {
          totalViews: file.shareSettings?.analytics?.totalViews || 0,
          totalDownloads: file.shareSettings?.analytics?.totalDownloads || 0,
          recentActivity: generateRecentActivity()
        }
      }

      setShareData(sharePageData)

      // If password protected, show password prompt
      if (isPasswordProtected && !isAuthenticated) {
        setShowPasswordPrompt(true)
      } else {
        // Track view
        trackAccess('view')
      }

    } catch (err) {
      setError('Failed to load share data')
    } finally {
      setLoading(false)
    }
  }

  const findFileByToken = (token: string): DemoFile | null => {
    // For demo purposes, we'll match files by their share tokens or IDs
    for (const file of DEMO_FILES) {
      if (file.shareToken === token || 
          file.id === token ||
          file.name.toLowerCase().includes(token.toLowerCase())) {
        return file
      }
    }
    return null
  }

  const generateRecentActivity = () => {
    return [
      { time: new Date(Date.now() - 15 * 60 * 1000), action: 'Viewed', location: 'United States', device: 'Desktop' },
      { time: new Date(Date.now() - 30 * 60 * 1000), action: 'Downloaded', location: 'Canada', device: 'Mobile' },
      { time: new Date(Date.now() - 45 * 60 * 1000), action: 'Viewed', location: 'United Kingdom', device: 'Tablet' },
      { time: new Date(Date.now() - 60 * 60 * 1000), action: 'Shared', location: 'Australia', device: 'Desktop' },
    ]
  }

  const trackAccess = async (action: 'view' | 'download') => {
    if (!shareData) return

    // Simulate tracking API call
    console.log(`🔍 Share Analytics: ${action} tracked for ${shareData.file.name}`)
    
    // Update local analytics
    setShareData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        analytics: {
          ...prev.analytics,
          totalViews: action === 'view' ? prev.analytics.totalViews + 1 : prev.analytics.totalViews,
          totalDownloads: action === 'download' ? prev.analytics.totalDownloads + 1 : prev.analytics.totalDownloads,
          recentActivity: [
            {
              time: new Date(),
              action: action === 'view' ? 'Viewed' : 'Downloaded',
              location: 'Demo Location',
              device: getDeviceType()
            },
            ...prev.analytics.recentActivity.slice(0, 9)
          ]
        }
      }
    })
  }

  const getDeviceType = (): string => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.includes('mobile')) return 'Mobile'
      if (userAgent.includes('tablet')) return 'Tablet'
      return 'Desktop'
    }
    return 'Desktop'
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (!shareData || !shareData.file.shareSettings?.password) return

    // Check password
    if (password === shareData.file.shareSettings.password) {
      setIsAuthenticated(true)
      setShowPasswordPrompt(false)
      trackAccess('view')
    } else {
      setPasswordError('Incorrect password. Please try again.')
    }
  }

  const handleDownload = async () => {
    if (!shareData) return

    setDownloadStarted(true)
    trackAccess('download')

    // Simulate download
    setTimeout(() => {
      if (shareData.file.content) {
        // Create download link
        const link = document.createElement('a')
        link.href = shareData.file.content
        link.download = shareData.file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      setDownloadStarted(false)
    }, 2000)
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <Image className="w-8 h-8" />
    if (mimeType.includes('video')) return <Video className="w-8 h-8" />
    if (mimeType.includes('audio')) return <Music className="w-8 h-8" />
    if (mimeType.includes('archive') || mimeType.includes('zip')) return <Archive className="w-8 h-8" />
    if (mimeType.includes('code') || mimeType.includes('text')) return <Code className="w-8 h-8" />
    return <FileText className="w-8 h-8" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />
      case 'tablet': return <Tablet className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen theme-premium flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Share2 className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Loading Share Link...</h2>
          <p className="text-gray-300">Verifying access permissions...</p>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen theme-premium flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Go to Homepage
          </Button>
        </motion.div>
      </div>
    )
  }

  // Password prompt
  if (showPasswordPrompt && shareData) {
    return (
      <div className="min-h-screen theme-premium flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto p-8"
        >
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Password Protected</CardTitle>
              <p className="text-gray-300 text-sm">
                This file is password protected. Please enter the password to access it.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-slate-600/50 border-purple-500/30 text-white"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                  )}
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={!password}
                >
                  Access File
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Main share page
  if (!shareData) return null

  return (
    <div className="min-h-screen theme-premium">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">YukiFiles</span>
            </div>
            
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              Demo Share Link
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* File Info Card */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                  {getFileIcon(shareData.file.mimeType)}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{shareData.file.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      {formatFileSize(shareData.file.size)}
                    </Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                      {shareData.file.mimeType}
                    </Badge>
                  </div>
                  
                  {shareData.file.description && (
                    <p className="text-gray-300 text-lg mb-6">{shareData.file.description}</p>
                  )}

                  {/* File Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {shareData.file.shareSettings?.allowDownload && !shareData.isDownloadLimitReached && (
                      <Button
                        onClick={handleDownload}
                        disabled={downloadStarted}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8"
                      >
                        {downloadStarted ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 mr-2"
                          >
                            <Download className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        {downloadStarted ? 'Downloading...' : 'Download File'}
                      </Button>
                    )}
                    
                    {shareData.file.shareSettings?.allowView && shareData.file.content && (
                      <Button
                        onClick={() => window.open(shareData.file.content, '_blank')}
                        variant="outline"
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 px-8"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview File
                      </Button>
                    )}
                  </div>

                  {/* Download Limit Warning */}
                  {shareData.isDownloadLimitReached && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Download limit reached</span>
                      </div>
                      <p className="text-red-300 text-sm mt-1">
                        This file has reached its maximum download limit.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Details & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Details */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  File Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <div className="text-white">{formatDate(shareData.file.createdAt)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Modified:</span>
                    <div className="text-white">{formatDate(shareData.file.updatedAt)}</div>
                  </div>
                  {shareData.file.shareSettings?.expiresAt && (
                    <div>
                      <span className="text-gray-400">Expires:</span>
                      <div className="text-white">{formatDate(shareData.file.shareSettings.expiresAt)}</div>
                    </div>
                  )}
                  {shareData.file.shareSettings?.maxDownloads && (
                    <div>
                      <span className="text-gray-400">Download Limit:</span>
                      <div className="text-white">
                        {shareData.file.shareSettings.currentDownloads}/{shareData.file.shareSettings.maxDownloads}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {shareData.file.tags.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm block mb-2">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {shareData.file.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share Analytics */}
            <Card className="bg-black/40 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Share Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{shareData.analytics.totalViews}</div>
                    <div className="text-sm text-gray-400">Total Views</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{shareData.analytics.totalDownloads}</div>
                    <div className="text-sm text-gray-400">Downloads</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="text-white font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {shareData.analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-black/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(activity.device)}
                          <div>
                            <div className="text-white text-sm font-medium">{activity.action}</div>
                            <div className="text-gray-400 text-xs flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {activity.location}
                              <Clock className="w-3 h-3" />
                              {activity.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Share This File */}
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share This File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input
                  value={window.location.href}
                  readOnly
                  className="bg-slate-600/50 border-purple-500/30 text-white flex-1"
                />
                <Button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  Copy Link
                </Button>
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: shareData.file.name,
                        text: `Check out this file: ${shareData.file.name}`,
                        url: window.location.href
                      })
                    }
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security & Demo Notice */}
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Secure File Sharing</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    This file is shared securely via YukiFiles Platform. All downloads and views are tracked for security and analytics purposes.
                  </p>
                  <div className="text-xs text-gray-400">
                    <strong>Demo Mode:</strong> This is a demonstration. Share links work during this session but will be reset on page reload.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/20 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <Share2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-white font-semibold">YukiFiles</span>
          </div>
          <p className="text-gray-400 text-sm">
            Secure file sharing platform with advanced analytics and collaboration features.
          </p>
        </div>
      </footer>
    </div>
  )
}

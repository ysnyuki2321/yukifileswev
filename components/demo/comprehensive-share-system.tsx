"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  Share2, Copy, Link, Lock, Unlock, Users, Calendar, Clock, Download, Eye, EyeOff, X,
  CheckCircle, AlertCircle, Settings, Globe, Shield, BarChart3, Zap, QrCode,
  ExternalLink, MessageSquare, Bell, UserPlus, Mail, Smartphone, Monitor, Tablet,
  MapPin, TrendingUp, Activity, Palette, Edit3, Archive
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DemoFile, DemoShareSettings } from '@/lib/demo/demo-architecture'

// ====================================================================
// COMPREHENSIVE SHARE SYSTEM COMPONENT
// ====================================================================

interface ComprehensiveShareSystemProps {
  file: DemoFile
  onClose: () => void
  onShareCreated?: (shareSettings: DemoShareSettings) => void
  isDemo?: boolean
}

interface ShareLink {
  id: string
  token: string
  url: string
  name: string
  isActive: boolean
  expiresAt?: Date
  maxDownloads?: number
  currentDownloads: number
  password?: string
  allowDownload: boolean
  allowView: boolean
  allowComment: boolean
  createdAt: Date
  accessCount: number
  analytics: {
    totalViews: number
    totalDownloads: number
    uniqueVisitors: number
    countries: string[]
    devices: string[]
    referrers: string[]
    dailyStats: { date: string; views: number; downloads: number }[]
    recentActivity: { time: Date; action: string; user: string; location: string; device: string }[]
  }
}

export function ComprehensiveShareSystem({ 
  file, 
  onClose, 
  onShareCreated,
  isDemo = true 
}: ComprehensiveShareSystemProps) {
  const [activeTab, setActiveTab] = useState('create')
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [isCreatingLink, setIsCreatingLink] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  
  // New share link form state
  const [newLinkSettings, setNewLinkSettings] = useState({
    name: `Share: ${file.name}`,
    expiresIn: '7',
    maxDownloads: '100',
    password: '',
    allowDownload: true,
    allowView: true,
    allowComment: false,
    customMessage: '',
    requireEmail: false,
    notifyOnAccess: true,
    brandingEnabled: true
  })

  useEffect(() => {
    // Initialize with existing share if available
    if (file.isShared && file.shareSettings) {
      const existingLink: ShareLink = {
        id: '1',
        token: file.shareSettings.token,
        url: file.shareSettings.url,
        name: `Share: ${file.name}`,
        isActive: file.shareSettings.isEnabled,
        expiresAt: file.shareSettings.expiresAt,
        maxDownloads: file.shareSettings.maxDownloads,
        currentDownloads: file.shareSettings.currentDownloads,
        password: file.shareSettings.password,
        allowDownload: file.shareSettings.allowDownload,
        allowView: file.shareSettings.allowView,
        allowComment: file.shareSettings.allowComment,
        createdAt: new Date(),
        accessCount: file.shareSettings.analytics?.totalViews || 0,
        analytics: {
          totalViews: file.shareSettings.analytics?.totalViews || 0,
          totalDownloads: file.shareSettings.analytics?.totalDownloads || 0,
          uniqueVisitors: file.shareSettings.analytics?.uniqueVisitors || 0,
          countries: file.shareSettings.analytics?.countries || [],
          devices: file.shareSettings.analytics?.devices || [],
          referrers: file.shareSettings.analytics?.referrers || [],
          dailyStats: file.shareSettings.analytics?.dailyStats || [],
          recentActivity: generateRecentActivity()
        }
      }
      setShareLinks([existingLink])
    }
  }, [file])

  const generateRecentActivity = () => {
    const activities = [
      { time: new Date(Date.now() - 30 * 60 * 1000), action: 'Viewed', user: 'Anonymous', location: 'United States', device: 'Desktop' },
      { time: new Date(Date.now() - 45 * 60 * 1000), action: 'Downloaded', user: 'john@company.com', location: 'Canada', device: 'Mobile' },
      { time: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'Viewed', user: 'Anonymous', location: 'United Kingdom', device: 'Tablet' },
      { time: new Date(Date.now() - 3 * 60 * 60 * 1000), action: 'Shared', user: 'sarah@team.com', location: 'Australia', device: 'Desktop' },
      { time: new Date(Date.now() - 5 * 60 * 60 * 1000), action: 'Commented', user: 'mike@client.com', location: 'Germany', device: 'Mobile' },
    ]
    return activities
  }

  const generateShareLink = async () => {
    setIsCreatingLink(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const token = Math.random().toString(36).substr(2, 12) + 
                  Math.random().toString(36).substr(2, 12)
    
    const newLink: ShareLink = {
      id: Date.now().toString(),
      token,
      url: `${window.location.origin}/share/${token}`,
      name: newLinkSettings.name,
      isActive: true,
      expiresAt: newLinkSettings.expiresIn ? 
        new Date(Date.now() + parseInt(newLinkSettings.expiresIn) * 24 * 60 * 60 * 1000) : 
        undefined,
      maxDownloads: newLinkSettings.maxDownloads ? parseInt(newLinkSettings.maxDownloads) : undefined,
      currentDownloads: 0,
      password: newLinkSettings.password || undefined,
      allowDownload: newLinkSettings.allowDownload,
      allowView: newLinkSettings.allowView,
      allowComment: newLinkSettings.allowComment,
      createdAt: new Date(),
      accessCount: 0,
      analytics: {
        totalViews: 0,
        totalDownloads: 0,
        uniqueVisitors: 0,
        countries: [],
        devices: [],
        referrers: [],
        dailyStats: [],
        recentActivity: []
      }
    }
    
    setShareLinks(prev => [newLink, ...prev])
    setIsCreatingLink(false)
    setActiveTab('manage')
    
    // Reset form
    setNewLinkSettings({
      name: `Share: ${file.name}`,
      expiresIn: '7',
      maxDownloads: '100',
      password: '',
      allowDownload: true,
      allowView: true,
      allowComment: false,
      customMessage: '',
      requireEmail: false,
      notifyOnAccess: true,
      brandingEnabled: true
    })

    // Notify parent if provided
    if (onShareCreated) {
      const shareSettings: DemoShareSettings = {
        isEnabled: true,
        token: newLink.token,
        url: newLink.url,
        expiresAt: newLink.expiresAt,
        maxDownloads: newLink.maxDownloads,
        currentDownloads: 0,
        password: newLink.password,
        allowDownload: newLink.allowDownload,
        allowView: newLink.allowView,
        allowComment: newLink.allowComment,
        analytics: {
          totalViews: 0,
          totalDownloads: 0,
          uniqueVisitors: 0,
          countries: [],
          devices: [],
          referrers: [],
          dailyStats: []
        }
      }
      onShareCreated(shareSettings)
    }
  }

  const copyToClipboard = async (text: string, token: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const generateQRCode = (url: string) => {
    // In a real app, this would generate an actual QR code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
    setQrCodeUrl(qrUrl)
  }

  const toggleLinkStatus = (linkId: string) => {
    setShareLinks(links => 
      links.map(link => 
        link.id === linkId 
          ? { ...link, isActive: !link.isActive }
          : link
      )
    )
  }

  const deleteLink = (linkId: string) => {
    setShareLinks(links => links.filter(link => link.id !== linkId))
  }

  const getFileIcon = () => {
    const mimeType = file.mimeType.toLowerCase()
    if (mimeType.includes('image')) return '🖼️'
    if (mimeType.includes('video')) return '🎥'
    if (mimeType.includes('audio')) return '🎵'
    if (mimeType.includes('text') || mimeType.includes('code')) return '📝'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦'
    return '📄'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />
      case 'tablet': return <Tablet className="w-4 h-4" />
      case 'desktop': return <Monitor className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl">
                {getFileIcon()}
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">{file.name}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {formatFileSize(file.size)}
                  </Badge>
                  <Badge variant="outline" className="text-gray-300 border-gray-600">
                    {file.mimeType}
                  </Badge>
                  {isDemo && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Demo Mode
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/20">
              <TabsTrigger value="create" className="data-[state=active]:bg-purple-500/20">
                Create Link
              </TabsTrigger>
              <TabsTrigger value="manage" className="data-[state=active]:bg-purple-500/20">
                Manage ({shareLinks.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Create Link Tab */}
            <TabsContent value="create" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Link Configuration */}
                <div className="space-y-6">
                  <Card className="bg-slate-700/50 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Link className="w-5 h-5" />
                        Link Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-gray-300 text-sm block mb-2">Link Name</label>
                        <Input
                          value={newLinkSettings.name}
                          onChange={(e) => setNewLinkSettings(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-slate-600/50 border-purple-500/30 text-white"
                          placeholder="Enter a descriptive name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-300 text-sm block mb-2">Expires in (days)</label>
                          <Input
                            type="number"
                            value={newLinkSettings.expiresIn}
                            onChange={(e) => setNewLinkSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
                            className="bg-slate-600/50 border-purple-500/30 text-white"
                            min="1"
                            max="365"
                          />
                        </div>
                        <div>
                          <label className="text-gray-300 text-sm block mb-2">Max Downloads</label>
                          <Input
                            type="number"
                            value={newLinkSettings.maxDownloads}
                            onChange={(e) => setNewLinkSettings(prev => ({ ...prev, maxDownloads: e.target.value }))}
                            className="bg-slate-600/50 border-purple-500/30 text-white"
                            min="1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-300 text-sm block mb-2">Password (optional)</label>
                        <Input
                          type="password"
                          value={newLinkSettings.password}
                          onChange={(e) => setNewLinkSettings(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-slate-600/50 border-purple-500/30 text-white"
                          placeholder="Leave empty for no password"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 text-sm block mb-2">Custom Message</label>
                        <Textarea
                          value={newLinkSettings.customMessage}
                          onChange={(e) => setNewLinkSettings(prev => ({ ...prev, customMessage: e.target.value }))}
                          className="bg-slate-600/50 border-purple-500/30 text-white"
                          placeholder="Add a message for recipients"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Permissions & Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Allow Downloads</div>
                          <div className="text-gray-400 text-sm">Recipients can download the file</div>
                        </div>
                        <Switch
                          checked={newLinkSettings.allowDownload}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, allowDownload: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Allow Viewing</div>
                          <div className="text-gray-400 text-sm">Recipients can preview the file</div>
                        </div>
                        <Switch
                          checked={newLinkSettings.allowView}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, allowView: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Allow Comments</div>
                          <div className="text-gray-400 text-sm">Recipients can leave comments</div>
                        </div>
                        <Switch
                          checked={newLinkSettings.allowComment}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, allowComment: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Require Email</div>
                          <div className="text-gray-400 text-sm">Collect email before access</div>
                        </div>
                        <Switch
                          checked={newLinkSettings.requireEmail}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, requireEmail: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Notify on Access</div>
                          <div className="text-gray-400 text-sm">Get notified when someone accesses</div>
                        </div>
                        <Switch
                          checked={newLinkSettings.notifyOnAccess}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, notifyOnAccess: checked }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Preview & Actions */}
                <div className="space-y-6">
                  <Card className="bg-slate-700/50 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Link Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-lg">
                            {getFileIcon()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{newLinkSettings.name}</div>
                            <div className="text-gray-400 text-sm">{formatFileSize(file.size)}</div>
                          </div>
                        </div>

                        {newLinkSettings.customMessage && (
                          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="text-blue-300 text-sm">{newLinkSettings.customMessage}</div>
                          </div>
                        )}

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-400">
                            <span>Expires:</span>
                            <span>{newLinkSettings.expiresIn ? `${newLinkSettings.expiresIn} days` : 'Never'}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Max Downloads:</span>
                            <span>{newLinkSettings.maxDownloads || 'Unlimited'}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Password:</span>
                            <span>{newLinkSettings.password ? 'Protected' : 'None'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      onClick={generateShareLink}
                      disabled={isCreatingLink}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isCreatingLink ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 mr-2"
                        >
                          <Activity className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Share2 className="w-4 h-4 mr-2" />
                      )}
                      {isCreatingLink ? 'Creating Link...' : 'Create Share Link'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Manage Links Tab */}
            <TabsContent value="manage" className="space-y-6 mt-6">
              {shareLinks.length === 0 ? (
                <div className="text-center py-12">
                  <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">No Share Links Yet</h3>
                  <p className="text-gray-400 mb-6">Create your first share link to get started</p>
                  <Button
                    onClick={() => setActiveTab('create')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Create Share Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {shareLinks.map((link) => (
                    <Card key={link.id} className="bg-slate-700/50 border-purple-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-semibold">{link.name}</h3>
                              <Badge 
                                variant={link.isActive ? "default" : "secondary"}
                                className={link.isActive ? "bg-green-500" : "bg-gray-500"}
                              >
                                {link.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="text-gray-400 text-sm">
                              Created {formatDate(link.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => toggleLinkStatus(link.id)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              {link.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              onClick={() => generateQRCode(link.url)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              <QrCode className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => deleteLink(link.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Share URL */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Input
                              value={link.url}
                              readOnly
                              className="bg-slate-600/50 border-purple-500/30 text-white text-sm flex-1"
                            />
                            <Button
                              onClick={() => copyToClipboard(link.url, link.token)}
                              variant="outline"
                              size="sm"
                              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                            >
                              {copiedToken === link.token ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              onClick={() => window.open(link.url, '_blank')}
                              variant="outline"
                              size="sm"
                              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Link Stats */}
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="bg-black/20 rounded-lg p-3">
                              <div className="text-2xl font-bold text-blue-400">{link.analytics.totalViews}</div>
                              <div className="text-xs text-gray-400">Views</div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3">
                              <div className="text-2xl font-bold text-green-400">{link.analytics.totalDownloads}</div>
                              <div className="text-xs text-gray-400">Downloads</div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3">
                              <div className="text-2xl font-bold text-purple-400">{link.analytics.uniqueVisitors}</div>
                              <div className="text-xs text-gray-400">Visitors</div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3">
                              <div className="text-2xl font-bold text-orange-400">
                                {link.maxDownloads ? `${link.currentDownloads}/${link.maxDownloads}` : link.currentDownloads}
                              </div>
                              <div className="text-xs text-gray-400">Used/Limit</div>
                            </div>
                          </div>

                          {/* Link Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                            {link.expiresAt && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Expires {formatDate(link.expiresAt)}</span>
                              </div>
                            )}
                            {link.password && (
                              <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <span>Password Protected</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              <span>Downloads {link.allowDownload ? 'Allowed' : 'Disabled'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              <span>Comments {link.allowComment ? 'Enabled' : 'Disabled'}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6 mt-6">
              {shareLinks.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">No Analytics Data</h3>
                  <p className="text-gray-400">Create a share link to start collecting analytics</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {shareLinks.map((link) => (
                    <Card key={link.id} className="bg-slate-700/50 border-purple-500/20">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          {link.name} - Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Overall Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-400">{link.analytics.totalViews}</div>
                            <div className="text-xs text-gray-400">Total Views</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-400">{link.analytics.totalDownloads}</div>
                            <div className="text-xs text-gray-400">Downloads</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-400">{link.analytics.uniqueVisitors}</div>
                            <div className="text-xs text-gray-400">Unique Visitors</div>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Recent Activity
                          </h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {link.analytics.recentActivity.map((activity, index) => (
                              <div key={index} className="flex items-center justify-between py-2 px-3 bg-black/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                  {getDeviceIcon(activity.device)}
                                  <div>
                                    <div className="text-white text-sm font-medium">
                                      {activity.action} by {activity.user}
                                    </div>
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

                        {/* Device & Location Breakdown */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white font-medium mb-2">Top Devices</h4>
                            <div className="space-y-1">
                              {['Desktop', 'Mobile', 'Tablet'].map((device, index) => (
                                <div key={device} className="flex justify-between text-sm">
                                  <span className="text-gray-400">{device}</span>
                                  <span className="text-white">{Math.max(0, 5 - index * 2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-2">Top Countries</h4>
                            <div className="space-y-1">
                              {['United States', 'United Kingdom', 'Canada'].map((country, index) => (
                                <div key={country} className="flex justify-between text-sm">
                                  <span className="text-gray-400">{country}</span>
                                  <span className="text-white">{Math.max(0, 4 - index)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-700/50 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Default Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Auto-generate QR codes</div>
                        <div className="text-gray-400 text-sm">Automatically create QR codes for new links</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Email notifications</div>
                        <div className="text-gray-400 text-sm">Get notified when links are accessed</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Analytics tracking</div>
                        <div className="text-gray-400 text-sm">Collect detailed analytics data</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Branding & Customization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm block mb-2">Custom Domain</label>
                      <Input
                        placeholder="share.yourcompany.com"
                        className="bg-slate-600/50 border-purple-500/30 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-gray-300 text-sm block mb-2">Brand Color</label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 rounded border border-purple-500/30"></div>
                        <Input
                          value="#8B5CF6"
                          className="bg-slate-600/50 border-purple-500/30 text-white"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Show YukiFiles branding</div>
                        <div className="text-gray-400 text-sm">Display "Powered by YukiFiles"</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* QR Code Modal */}
        <AnimatePresence>
          {qrCodeUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setQrCodeUrl(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 border border-purple-500/30 rounded-2xl p-6 max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <h3 className="text-white font-bold text-lg mb-4">QR Code</h3>
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto" />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Scan this QR code to access the shared file
                  </p>
                  <Button
                    onClick={() => setQrCodeUrl(null)}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
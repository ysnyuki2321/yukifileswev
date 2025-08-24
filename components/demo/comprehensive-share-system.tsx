"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DemoFile, DemoShareSettings } from '@/lib/demo/demo-architecture'
import { 
  Copy, 
  ExternalLink, 
  QrCode, 
  Download, 
  Eye, 
  MessageSquare, 
  Lock, 
  Unlock, 
  Calendar, 
  Users, 
  BarChart3, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  MapPin, 
  Clock, 
  Trash2, 
  Edit3, 
  Bell, 
  Mail, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Info,
  X,
  Share2
} from 'lucide-react'

// ====================================================================
// COMPREHENSIVE SHARE SYSTEM COMPONENT
// ====================================================================

interface ShareLink {
  id: string
  name: string
  url: string
  token: string
  isActive: boolean
  createdAt: Date
  expiresAt?: Date
  maxDownloads?: number
  currentDownloads: number
  password?: string
  customMessage?: string
  permissions: {
    download: boolean
    view: boolean
    comment: boolean
  }
  analytics: {
    views: number
    downloads: number
    uniqueVisitors: number
    recentActivity: Array<{
      id: string
      action: 'view' | 'download' | 'comment'
      userAgent: string
      ip: string
      timestamp: Date
      device: string
      location: string
    }>
  }
}

interface ComprehensiveShareSystemProps {
  file: DemoFile
  onClose: () => void
  onShareCreated?: (shareSettings: DemoShareSettings) => void
  isDemo?: boolean
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
  const [newLinkSettings, setNewLinkSettings] = useState({
    name: '',
    expiresIn: '7',
    maxDownloads: '',
    password: '',
    customMessage: '',
    download: true,
    view: true,
    comment: false,
    emailRequired: false,
    notifications: true,
    branding: true
  })

  useEffect(() => {
    // Initialize with existing share if file is already shared
    if (file.isShared && file.shareToken) {
      const existingLink: ShareLink = {
        id: 'existing_share',
        name: `Share for ${file.name}`,
        url: `${window.location.origin}/share/${file.shareToken}`,
        token: file.shareToken,
        isActive: true,
        createdAt: file.createdAt,
        expiresAt: file.shareSettings?.expiresAt,
        maxDownloads: file.shareSettings?.maxDownloads,
        currentDownloads: file.downloadCount,
        password: file.shareSettings?.password,
        customMessage: file.shareSettings?.customMessage,
        permissions: {
          download: file.shareSettings?.allowDownload ?? true,
          view: file.shareSettings?.allowView ?? true,
          comment: file.shareSettings?.allowComment ?? false
        },
        analytics: {
          views: file.viewCount,
          downloads: file.downloadCount,
          uniqueVisitors: Math.floor(file.viewCount * 0.7),
          recentActivity: generateRecentActivity()
        }
      }
      setShareLinks([existingLink])
    }
  }, [file])

  const generateRecentActivity = () => {
    const activities = []
    const devices = ['Desktop', 'Mobile', 'Tablet']
    const locations = ['United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia']
    
    for (let i = 0; i < 5; i++) {
      activities.push({
        id: `activity_${i}`,
        action: Math.random() > 0.5 ? 'view' : 'download' as 'view' | 'download',
        userAgent: 'Mozilla/5.0 (Demo Browser)',
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        device: devices[Math.floor(Math.random() * devices.length)],
        location: locations[Math.floor(Math.random() * locations.length)]
      })
    }
    
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const generateShareLink = async () => {
    setIsCreatingLink(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const token = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newLink: ShareLink = {
      id: `link_${Date.now()}`,
      name: newLinkSettings.name || `Share for ${file.name}`,
      url: `${window.location.origin}/share/${token}`,
      token,
      isActive: true,
      createdAt: new Date(),
      expiresAt: newLinkSettings.expiresIn !== 'never' 
        ? new Date(Date.now() + parseInt(newLinkSettings.expiresIn) * 24 * 60 * 60 * 1000)
        : undefined,
      maxDownloads: newLinkSettings.maxDownloads ? parseInt(newLinkSettings.maxDownloads) : undefined,
      currentDownloads: 0,
      password: newLinkSettings.password || undefined,
      customMessage: newLinkSettings.customMessage || undefined,
      permissions: {
        download: newLinkSettings.download,
        view: newLinkSettings.view,
        comment: newLinkSettings.comment
      },
      analytics: {
        views: 0,
        downloads: 0,
        uniqueVisitors: 0,
        recentActivity: []
      }
    }
    
    setShareLinks(prev => [newLink, ...prev])
    setIsCreatingLink(false)
    
    // Reset form
    setNewLinkSettings({
      name: '',
      expiresIn: '7',
      maxDownloads: '',
      password: '',
      customMessage: '',
      download: true,
      view: true,
      comment: false,
      emailRequired: false,
      notifications: true,
      branding: true
    })
    
    // Notify parent component
    if (onShareCreated) {
      onShareCreated({
        token,
        url: newLink.url,
        expiresAt: newLink.expiresAt,
        maxDownloads: newLink.maxDownloads,
        password: newLink.password,
        customMessage: newLink.customMessage,
        allowDownload: newLink.permissions.download,
        allowView: newLink.permissions.view,
        allowComment: newLink.permissions.comment,
        emailRequired: newLinkSettings.emailRequired,
        notifications: newLinkSettings.notifications,
        branding: newLinkSettings.branding
      })
    }
  }

  const copyToClipboard = async (text: string, token: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const generateQRCode = (url: string) => {
    // In a real app, this would generate a QR code
    // For demo purposes, we'll just show the URL
    setQrCodeUrl(url)
  }

  const toggleLinkStatus = (linkId: string) => {
    setShareLinks(prev => 
      prev.map(link => 
        link.id === linkId ? { ...link, isActive: !link.isActive } : link
      )
    )
  }

  const deleteLink = (linkId: string) => {
    setShareLinks(prev => prev.filter(link => link.id !== linkId))
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile': return <Smartphone className="w-4 h-4" />
      case 'Tablet': return <Tablet className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-slate-800 border rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Share File</h2>
                <p className="text-gray-300">{file.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isDemo && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Demo Mode
                </Badge>
              )}
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/20">
              <TabsTrigger value="create">Create Link</TabsTrigger>
              <TabsTrigger value="manage">Manage ({shareLinks.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Create Link Tab */}
            <TabsContent value="create" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Link Configuration */}
                <div className="space-y-6">
                  <Card className="bg-black/40 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">Link Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Link Name</label>
                        <Input
                          value={newLinkSettings.name}
                          onChange={(e) => setNewLinkSettings(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter a name for this share link"
                          className="bg-slate-600/50 border-purple-500/30 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Expires In</label>
                        <select
                          value={newLinkSettings.expiresIn}
                          onChange={(e) => setNewLinkSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
                          className="w-full bg-slate-600/50 border border-purple-500/30 rounded-md px-3 py-2 text-white"
                        >
                          <option value="1">1 day</option>
                          <option value="7">7 days</option>
                          <option value="30">30 days</option>
                          <option value="90">90 days</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Max Downloads</label>
                        <Input
                          type="number"
                          value={newLinkSettings.maxDownloads}
                          onChange={(e) => setNewLinkSettings(prev => ({ ...prev, maxDownloads: e.target.value }))}
                          placeholder="Unlimited (leave empty)"
                          className="bg-slate-600/50 border-purple-500/30 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Password Protection</label>
                        <Input
                          type="password"
                          value={newLinkSettings.password}
                          onChange={(e) => setNewLinkSettings(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Leave empty for no password"
                          className="bg-slate-600/50 border-purple-500/30 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Custom Message</label>
                        <Textarea
                          value={newLinkSettings.customMessage}
                          onChange={(e) => setNewLinkSettings(prev => ({ ...prev, customMessage: e.target.value }))}
                          placeholder="Add a custom message for recipients"
                          className="bg-slate-600/50 border-purple-500/30 text-white"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">Permissions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5 text-purple-400" />
                          <span className="text-gray-300">Allow Download</span>
                        </div>
                        <Switch
                          checked={newLinkSettings.download}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, download: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-blue-400" />
                          <span className="text-gray-300">Allow View</span>
                        </div>
                        <Switch
                          checked={newLinkSettings.view}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, view: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">Allow Comments</span>
                        </div>
                        <Switch
                          checked={newLinkSettings.comment}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, comment: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-yellow-400" />
                          <span className="text-gray-300">Require Email</span>
                        </div>
                        <Switch
                          checked={newLinkSettings.emailRequired}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, emailRequired: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-pink-400" />
                          <span className="text-gray-300">Notifications</span>
                        </div>
                        <Switch
                          checked={newLinkSettings.notifications}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, notifications: checked }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-indigo-400" />
                          <span className="text-gray-300">Branding</span>
                        </div>
                        <Switch
                          checked={newLinkSettings.branding}
                          onCheckedChange={(checked) => setNewLinkSettings(prev => ({ ...prev, branding: checked }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Preview & Actions */}
                <div className="space-y-6">
                  <Card className="bg-black/40 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">Link Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-slate-700/50 rounded-lg border border-purple-500/20">
                        <div className="text-sm text-gray-400 mb-2">Share Link</div>
                        <div className="text-white font-mono text-sm break-all">
                          {shareLinks.length > 0 ? shareLinks[0].url : 'Link will be generated here...'}
                        </div>
                      </div>
                      
                      {newLinkSettings.password && (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">Password protected</span>
                        </div>
                      )}
                      
                      {newLinkSettings.expiresIn !== 'never' && (
                        <div className="flex items-center gap-2 text-orange-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            Expires in {newLinkSettings.expiresIn} day{parseInt(newLinkSettings.expiresIn) > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      
                      {newLinkSettings.maxDownloads && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Download className="w-4 h-4" />
                          <span className="text-sm">Max {newLinkSettings.maxDownloads} download{parseInt(newLinkSettings.maxDownloads) > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={generateShareLink}
                        disabled={isCreatingLink}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        size="lg"
                      >
                        {isCreatingLink ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Share Link...
                          </>
                        ) : (
                          <>
                            <Share2 className="w-5 h-5 mr-2" />
                            Create Share Link
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Manage Links Tab */}
            <TabsContent value="manage" className="space-y-6 mt-6">
              {shareLinks.length === 0 ? (
                <div className="text-center py-12">
                  <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">No share links yet</h3>
                  <p className="text-gray-400">Create your first share link to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {shareLinks.map(link => (
                    <Card key={link.id} className="bg-black/40 border-purple-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <h3 className="text-white font-semibold">{link.name}</h3>
                            {link.password && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                <Lock className="w-3 h-3 mr-1" />
                                Password
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => toggleLinkStatus(link.id)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              {link.isActive ? 'Deactivate' : 'Activate'}
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
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-black/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">{link.analytics.views}</div>
                            <div className="text-sm text-gray-400">Views</div>
                          </div>
                          
                          <div className="text-center p-3 bg-black/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">{link.analytics.downloads}</div>
                            <div className="text-sm text-gray-400">Downloads</div>
                          </div>
                          
                          <div className="text-center p-3 bg-black/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">{link.analytics.uniqueVisitors}</div>
                            <div className="text-sm text-gray-400">Unique Visitors</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Created: {formatDate(link.createdAt)}</span>
                            {link.expiresAt && (
                              <span>Expires: {formatDate(link.expiresAt)}</span>
                            )}
                            {link.maxDownloads && (
                              <span>Downloads: {link.currentDownloads}/{link.maxDownloads}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => copyToClipboard(link.url, link.id)}
                              variant="outline"
                              size="sm"
                              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                            >
                              {copiedToken === link.id ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copy Link
                                </>
                              )}
                            </Button>
                            
                            <Button
                              onClick={() => window.open(link.url, '_blank')}
                              variant="outline"
                              size="sm"
                              className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Test Link
                            </Button>
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
                  <h3 className="text-white text-xl font-semibold mb-2">No analytics available</h3>
                  <p className="text-gray-400">Create share links to see detailed analytics</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-black/40 border-purple-500/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {shareLinks.reduce((sum, link) => sum + link.analytics.views, 0)}
                        </div>
                        <div className="text-sm text-gray-400">Total Views</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/40 border-purple-500/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {shareLinks.reduce((sum, link) => sum + link.analytics.downloads, 0)}
                        </div>
                        <div className="text-sm text-gray-400">Total Downloads</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/40 border-purple-500/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {shareLinks.reduce((sum, link) => sum + link.analytics.uniqueVisitors, 0)}
                        </div>
                        <div className="text-sm text-gray-400">Unique Visitors</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/40 border-purple-500/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-pink-400">{shareLinks.length}</div>
                        <div className="text-sm text-gray-400">Active Links</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className="bg-black/40 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {shareLinks
                          .flatMap(link => link.analytics.recentActivity)
                          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                          .slice(0, 10)
                          .map((activity, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                {activity.action === 'view' && <Eye className="w-3 h-3 text-white" />}
                                {activity.action === 'download' && <Download className="w-3 h-3 text-white" />}
                                {activity.action === 'comment' && <MessageSquare className="w-3 h-3 text-white" />}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-medium">
                                  {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} from {activity.location}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  {formatTimeAgo(activity.timestamp)} • {activity.device}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                {getDeviceIcon(activity.device)}
                                <span>{activity.ip}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Default Settings */}
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Default Share Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Default Expiration</span>
                      <select className="bg-slate-600/50 border border-purple-500/30 rounded px-3 py-1 text-white text-sm">
                        <option value="7">7 days</option>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Default Max Downloads</span>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        className="w-24 bg-slate-600/50 border-purple-500/30 text-white text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Require Password by Default</span>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable Notifications</span>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                {/* Branding Options */}
                <Card className="bg-black/40 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Branding Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Show YukiFiles Branding</span>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Custom Logo</span>
                      <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300">
                        Upload
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Custom Colors</span>
                      <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300">
                        Configure
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Custom Domain</span>
                      <Input
                        placeholder="share.yourdomain.com"
                        className="bg-slate-600/50 border-purple-500/30 text-white text-sm"
                      />
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
              onClick={() => setQrCodeUrl(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <QrCode className="w-32 h-32 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">QR Code</h3>
                <p className="text-gray-400 mb-4">Scan this QR code to access the shared file</p>
                <div className="p-3 bg-slate-700/50 rounded-lg border border-purple-500/20 mb-6">
                  <div className="text-white font-mono text-sm break-all">{qrCodeUrl}</div>
                </div>
                <Button
                  onClick={() => setQrCodeUrl(null)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
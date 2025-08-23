"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Share2, Copy, Link, Lock, Unlock, Users, 
  Calendar, Clock, Download, Eye, EyeOff, X,
  CheckCircle, AlertCircle, Settings, Globe, Shield, BarChart3, Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ShareSystemProps {
  file: {
    id: string
    name: string
    mime_type: string
    size: number
    is_public: boolean
    created_at: string
  }
  onClose: () => void
  onToggleVisibility: (isPublic: boolean) => void
}

interface ShareLink {
  id: string
  token: string
  url: string
  isActive: boolean
  expiresAt?: Date
  maxDownloads?: number
  currentDownloads: number
  createdAt: Date
  accessCount: number
}

export function ShareSystem({ file, onClose, onToggleVisibility }: ShareSystemProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([
    {
      id: '1',
      token: 'abc123def456',
      url: `https://yukifiles.com/share/abc123def456`,
      isActive: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      maxDownloads: 100,
      currentDownloads: 23,
      createdAt: new Date(),
      accessCount: 45
    }
  ])
  
  const [showCreateLink, setShowCreateLink] = useState(false)
  const [newLinkSettings, setNewLinkSettings] = useState({
    expiresIn: '7',
    maxDownloads: '100',
    password: '',
    allowDownload: true
  })

  const generateShareLink = () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const newLink: ShareLink = {
      id: Date.now().toString(),
      token,
      url: `https://yukifiles.com/share/${token}`,
      isActive: true,
      expiresAt: new Date(Date.now() + parseInt(newLinkSettings.expiresIn) * 24 * 60 * 60 * 1000),
      maxDownloads: parseInt(newLinkSettings.maxDownloads),
      currentDownloads: 0,
      createdAt: new Date(),
      accessCount: 0
    }
    
    setShareLinks([...shareLinks, newLink])
    setShowCreateLink(false)
    setNewLinkSettings({
      expiresIn: '7',
      maxDownloads: '100',
      password: '',
      allowDownload: true
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Show success feedback
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
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
    const mimeType = file.mime_type.toLowerCase()
    if (mimeType.includes('image')) return '🖼️'
    if (mimeType.includes('video')) return '🎥'
    if (mimeType.includes('audio')) return '🎵'
    if (mimeType.includes('text') || mimeType.includes('code')) return '📝'
    if (mimeType.includes('database')) return '🗄️'
    return '📄'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                {getFileIcon()}
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{file.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {formatFileSize(file.size)}
                  </Badge>
                  <Badge variant="outline" className="text-gray-300 border-gray-600">
                    {file.mime_type}
                  </Badge>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Share Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">Share Links</h3>
                <Button
                  onClick={() => setShowCreateLink(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Create Link
                </Button>
              </div>

              {/* Existing Share Links */}
              <div className="space-y-3">
                {shareLinks.map((link) => (
                  <Card key={link.id} className="bg-slate-700/50 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={link.isActive ? "default" : "secondary"}
                            className={link.isActive ? "bg-green-500" : "bg-gray-500"}
                          >
                            {link.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-gray-400 text-xs">
                            Created {link.createdAt.toLocaleDateString()}
                          </span>
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
                            onClick={() => deleteLink(link.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            value={link.url}
                            readOnly
                            className="bg-slate-600/50 border-purple-500/30 text-white text-sm"
                          />
                          <Button
                            onClick={() => copyToClipboard(link.url)}
                            variant="outline"
                            size="sm"
                            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Download className="w-3 h-3" />
                            <span>{link.currentDownloads}/{link.maxDownloads || '∞'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Eye className="w-3 h-3" />
                            <span>{link.accessCount} views</span>
                          </div>
                          {link.expiresAt && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>Expires {link.expiresAt.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column - Settings & Stats */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Sharing Settings</h3>

              {/* File Visibility */}
              <Card className="bg-slate-700/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    File Visibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Public Access</span>
                    <Button
                      onClick={() => onToggleVisibility(!file.is_public)}
                      variant={file.is_public ? "default" : "outline"}
                      size="sm"
                      className={file.is_public ? "bg-green-500 hover:bg-green-600" : "border-purple-500/30 text-purple-300"}
                    >
                      {file.is_public ? (
                        <>
                          <Unlock className="w-4 h-4 mr-2" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Private
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {file.is_public 
                      ? "Anyone with the link can view this file"
                      : "Only you and people you share with can access this file"
                    }
                  </div>
                </CardContent>
              </Card>

              {/* Sharing Statistics */}
              <Card className="bg-slate-700/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Sharing Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{shareLinks.length}</div>
                      <div className="text-xs text-gray-400">Active Links</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {shareLinks.reduce((sum, link) => sum + link.accessCount, 0)}
                      </div>
                      <div className="text-xs text-gray-400">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {shareLinks.reduce((sum, link) => sum + link.currentDownloads, 0)}
                      </div>
                      <div className="text-xs text-gray-400">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {shareLinks.filter(link => link.isActive).length}
                      </div>
                      <div className="text-xs text-gray-400">Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-700/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Share with Specific People
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Set Password Protection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Create Link Modal */}
        {showCreateLink && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Create Share Link</h3>
                <Button
                  onClick={() => setShowCreateLink(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Expires in (days)</label>
                  <Input
                    type="number"
                    value={newLinkSettings.expiresIn}
                    onChange={(e) => setNewLinkSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
                    className="bg-slate-700/50 border-purple-500/30 text-white"
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
                    className="bg-slate-700/50 border-purple-500/30 text-white"
                    min="1"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">Password (optional)</label>
                  <Input
                    type="password"
                    value={newLinkSettings.password}
                    onChange={(e) => setNewLinkSettings(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-slate-700/50 border-purple-500/30 text-white"
                    placeholder="Leave empty for no password"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newLinkSettings.allowDownload}
                    onChange={(e) => setNewLinkSettings(prev => ({ ...prev, allowDownload: e.target.checked }))}
                    className="rounded border-purple-500/30 bg-slate-700/50"
                  />
                  <span className="text-gray-300 text-sm">Allow downloads</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={generateShareLink}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-1"
                  >
                    Create Link
                  </Button>
                  <Button
                    onClick={() => setShowCreateLink(false)}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
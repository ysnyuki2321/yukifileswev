"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfessionalDatePicker } from './professional-date-picker'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Copy, Check, Link, Lock, Unlock, Calendar, Users, 
  Download, Eye, Clock, Shield, QrCode, ExternalLink,
  Globe, Mail, MessageSquare, Twitter, Facebook, Linkedin, RefreshCw, X,
  Zap, Star, Settings, AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdvancedShareModalProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    size: number
  }
}

export function AdvancedShareModal({ isOpen, onClose, file }: AdvancedShareModalProps) {
  const [shareLink, setShareLink] = useState('')
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [maxViews, setMaxViews] = useState('')
  const [maxDownloads, setMaxDownloads] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [allowDownload, setAllowDownload] = useState(true)
  const [allowPreview, setAllowPreview] = useState(true)
  const [copied, setCopied] = useState(false)
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'social'>('link')
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate real share link when modal opens
  useEffect(() => {
    if (isOpen && file) {
      generateRealShareLink()
    }
  }, [isOpen, file])

  // Reset share links on page reload (demo behavior)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear all share data from sessionStorage
      const keys = Object.keys(sessionStorage)
      keys.forEach(key => {
        if (key.startsWith('share_')) {
          sessionStorage.removeItem(key)
        }
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const generateRealShareLink = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const baseUrl = window.location.origin
      const shareToken = generateShareToken()
      const link = `${baseUrl}/demo/share/${shareToken}`
      setShareLink(link)
      
      // Store share link data in sessionStorage for demo
      const shareData = {
        token: shareToken,
        file: file,
        password: isPasswordProtected ? password : null,
        expiryDate: expiryDate || null,
        maxViews: maxViews || null,
        maxDownloads: maxDownloads || null,
        allowPreview: allowPreview,
        allowDownload: allowDownload,
        isPublic: isPublic,
        createdAt: new Date().toISOString()
      }
      
      try {
        sessionStorage.setItem(`share_${shareToken}`, JSON.stringify(shareData))
      } catch (storageError) {
        console.warn('Failed to save to sessionStorage:', storageError)
      }
      
      setIsGenerating(false)
    } catch (error) {
      console.error('Error generating share link:', error)
      setShareLink('Error generating link')
      setIsGenerating(false)
    }
  }

  const generateShareToken = () => {
    // Generate a unique token for sharing
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2)
    return `${timestamp}-${random}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = () => {
    // In a real app, this would save the share settings to the backend
    console.log('Sharing file:', {
      fileId: file.id,
      link: shareLink,
      password: isPasswordProtected ? password : null,
      expiryDate,
      maxViews: maxViews ? parseInt(maxViews) : null,
      maxDownloads: maxDownloads ? parseInt(maxDownloads) : null,
      isPublic,
      allowDownload,
      allowPreview
    })
    
    // Show success message
    alert('Share link created successfully!')
  }

  const openSharePage = () => {
    window.open(shareLink, '_blank')
  }

  const shareToSocial = (platform: string) => {
    const text = `Check out this file: ${file.name}`
    const url = shareLink
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Shared file: ${file.name}`)}&body=${encodeURIComponent(`Check out this file: ${url}`)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Link className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Share "{file.name}"
                  </h2>
                  <p className="text-sm text-gray-400">
                    Create a secure share link for your file
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Share Method Tabs */}
            <div className="flex space-x-1 bg-black/30 rounded-xl p-1 border border-purple-500/20">
              {[
                { key: 'link', label: 'Link', icon: Link, color: 'from-purple-500 to-pink-500' },
                { key: 'email', label: 'Email', icon: Mail, color: 'from-blue-500 to-cyan-500' },
                { key: 'social', label: 'Social', icon: MessageSquare, color: 'from-green-500 to-emerald-500' }
              ].map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => setShareMethod(key as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    shareMethod === key
                      ? `bg-gradient-to-r ${color} text-white shadow-lg`
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Link Sharing */}
            {shareMethod === 'link' && (
              <div className="space-y-6">
                {/* Generated Link */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    Share Link
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input
                        value={shareLink}
                        readOnly
                        className="bg-black/30 border-purple-500/30 text-white font-mono text-sm pr-10"
                      />
                      <Link className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="min-w-[120px] border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={openSharePage}
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Share Page
                    </Button>
                    <Button
                      onClick={generateRealShareLink}
                      variant="outline"
                      size="sm"
                      disabled={isGenerating}
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                    >
                      {isGenerating ? (
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Security Settings
                  </h3>
                  
                  {/* Password Protection */}
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">Password Protection</p>
                        <p className="text-sm text-gray-400">
                          Require password to access shared file
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isPasswordProtected}
                      onCheckedChange={setIsPasswordProtected}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
                    />
                  </div>
                  
                  {isPasswordProtected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                      />
                    </motion.div>
                  )}

                  {/* Public/Private */}
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">Public Access</p>
                        <p className="text-sm text-gray-400">
                          Anyone with the link can access
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                      className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">Expiry Date</p>
                        <p className="text-sm text-gray-400">
                          Set when this link expires (optional)
                        </p>
                      </div>
                    </div>
                    <div className="w-64">
                      <ProfessionalDatePicker
                        label=""
                        value={expiryDate}
                        onChange={setExpiryDate}
                        placeholder="Select expiry date and time..."
                        minDate={new Date()}
                        includeTime={true}
                      />
                    </div>
                  </div>

                  {/* View/Download Limits */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <Eye className="w-4 h-4 text-purple-400" />
                        Max Views
                      </label>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        value={maxViews}
                        onChange={(e) => setMaxViews(e.target.value)}
                        className="bg-black/30 border-purple-500/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex items-center gap-2">
                        <Download className="w-4 h-4 text-purple-400" />
                        Max Downloads
                      </label>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        value={maxDownloads}
                        onChange={(e) => setMaxDownloads(e.target.value)}
                        className="bg-black/30 border-purple-500/30 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    Permissions
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-purple-500/20">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-purple-400" />
                        <span className="text-white">Allow Preview</span>
                      </div>
                      <Switch
                        checked={allowPreview}
                        onCheckedChange={setAllowPreview}
                        className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-purple-500/20">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-purple-400" />
                        <span className="text-white">Allow Download</span>
                      </div>
                      <Switch
                        checked={allowDownload}
                        onCheckedChange={setAllowDownload}
                        className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Sharing */}
            {shareMethod === 'email' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    Email Addresses
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email addresses (comma separated)"
                    className="w-full bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    Message (Optional)
                  </label>
                  <textarea
                    placeholder="Add a personal message..."
                    className="w-full h-24 px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-gray-400"
                  />
                </div>
                
                <Button onClick={handleShare} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Share Invitation
                </Button>
              </div>
            )}

            {/* Social Sharing */}
            {shareMethod === 'social' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => shareToSocial('twitter')}
                    variant="outline"
                    className="h-16 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-400"
                  >
                    <Twitter className="w-6 h-6 mr-2" />
                    Twitter
                  </Button>
                  
                  <Button
                    onClick={() => shareToSocial('facebook')}
                    variant="outline"
                    className="h-16 text-blue-500 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-400"
                  >
                    <Facebook className="w-6 h-6 mr-2" />
                    Facebook
                  </Button>
                  
                  <Button
                    onClick={() => shareToSocial('linkedin')}
                    variant="outline"
                    className="h-16 text-blue-600 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-400"
                  >
                    <Linkedin className="w-6 h-6 mr-2" />
                    LinkedIn
                  </Button>
                  
                  <Button
                    onClick={() => shareToSocial('email')}
                    variant="outline"
                    className="h-16 text-gray-400 border-purple-500/30 hover:bg-purple-500/20 hover:text-white"
                  >
                    <Mail className="w-6 h-6 mr-2" />
                    Email
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-400">
                  Share the generated link on your preferred social platform
                </div>
              </div>
            )}

            {/* QR Code */}
            <div className="border-t border-purple-500/20 pt-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-black/30 rounded-xl mx-auto mb-3 flex items-center justify-center border border-purple-500/20">
                  <QrCode className="w-16 h-16 text-purple-400" />
                </div>
                <p className="text-sm text-gray-400">
                  Scan QR code to access shared file
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-purple-500/10 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Secure sharing with YukiFiles</span>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20">
                  Cancel
                </Button>
                <Button onClick={handleShare} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Link className="w-4 h-4 mr-2" />
                  Create Share Link
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
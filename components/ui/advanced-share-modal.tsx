"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Copy, Check, Link, Lock, Unlock, Calendar, Users, 
  Download, Eye, Clock, Shield, QrCode, ExternalLink,
  Globe, Mail, MessageSquare, Twitter, Facebook, Linkedin, RefreshCw, X
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

  // Generate share link when modal opens
  useEffect(() => {
    if (isOpen && file) {
      const baseUrl = window.location.origin
      const shareToken = generateShareToken()
      const link = `${baseUrl}/share/${shareToken}`
      setShareLink(link)
    }
  }, [isOpen, file])

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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Link className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Share "{file.name}"
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create a secure share link for your file
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Share Method Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: 'link', label: 'Link', icon: Link },
                { key: 'email', label: 'Email', icon: Mail },
                { key: 'social', label: 'Social', icon: MessageSquare }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setShareMethod(key as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    shareMethod === key
                      ? "bg-white dark:bg-gray-700 text-purple-600 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Link Sharing */}
            {shareMethod === 'link' && (
              <div className="space-y-4">
                {/* Generated Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Share Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={shareLink}
                      readOnly
                      className="flex-1 bg-gray-50 dark:bg-gray-800"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="min-w-[100px]"
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
                  <div className="flex gap-2">
                    <Button
                      onClick={openSharePage}
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Share Page
                    </Button>
                    <Button
                      onClick={() => setShareLink(generateShareToken())}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Security Settings
                  </h3>
                  
                  {/* Password Protection */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Password Protection</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Require password to access shared file
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isPasswordProtected}
                      onCheckedChange={setIsPasswordProtected}
                    />
                  </div>
                  
                  {isPasswordProtected && (
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="max-w-xs"
                    />
                  )}

                  {/* Public/Private */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Public Access</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Anyone with the link can access
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Expiry Date (Optional)
                    </label>
                    <Input
                      type="datetime-local"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>

                  {/* View/Download Limits */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Max Views
                      </label>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        value={maxViews}
                        onChange={(e) => setMaxViews(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Max Downloads
                      </label>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        value={maxDownloads}
                        onChange={(e) => setMaxDownloads(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Permissions
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-900 dark:text-white">Allow Preview</span>
                      </div>
                      <Switch
                        checked={allowPreview}
                        onCheckedChange={setAllowPreview}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-900 dark:text-white">Allow Download</span>
                      </div>
                      <Switch
                        checked={allowDownload}
                        onCheckedChange={setAllowDownload}
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
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Addresses
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email addresses (comma separated)"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message (Optional)
                  </label>
                  <textarea
                    placeholder="Add a personal message..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <Button onClick={handleShare} className="w-full">
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
                    className="h-16 text-blue-500 border-blue-200 hover:bg-blue-50"
                  >
                    <Twitter className="w-6 h-6 mr-2" />
                    Twitter
                  </Button>
                  
                  <Button
                    onClick={() => shareToSocial('facebook')}
                    variant="outline"
                    className="h-16 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Facebook className="w-6 h-6 mr-2" />
                    Facebook
                  </Button>
                  
                  <Button
                    onClick={() => shareToSocial('linkedin')}
                    variant="outline"
                    className="h-16 text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    <Linkedin className="w-6 h-6 mr-2" />
                    LinkedIn
                  </Button>
                  
                  <Button
                    onClick={() => shareToSocial('email')}
                    variant="outline"
                    className="h-16 text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    <Mail className="w-6 h-6 mr-2" />
                    Email
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Share the generated link on your preferred social platform
                </div>
              </div>
            )}

            {/* QR Code */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Scan QR code to access shared file
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Secure sharing with YukiFiles</span>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleShare} className="bg-purple-600 hover:bg-purple-700">
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
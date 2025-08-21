"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { 
  Share2, Copy, ExternalLink, QrCode, Calendar, Clock, 
  Lock, Unlock, Eye, Download, Sparkles, Link2, Globe,
  CheckCircle, AlertCircle, Settings, Users
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    original_name: string
    file_size: number
    share_token: string
    created_at: string
  }
}

export function ShareModal({ isOpen, onClose, file }: ShareModalProps) {
  const [shareLink, setShareLink] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [hasPassword, setHasPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [expiresIn, setExpiresIn] = useState('never')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [tokenLength, setTokenLength] = useState([7])

  useEffect(() => {
    if (isOpen) {
      // Load existing settings or generate new link
      const existingSettings = localStorage.getItem(`share-${file.id}`)
      if (existingSettings) {
        const settings = JSON.parse(existingSettings)
        setShareLink(settings.shareLink || '')
        setIsPublic(settings.isPublic || false)
        setHasPassword(settings.hasPassword || false)
        setPassword(settings.password || '')
        setExpiresIn(settings.expiresIn || 'never')
        setTokenLength([settings.tokenLength || 7])
      } else {
        generateNewLink()
      }
    }
  }, [isOpen, file.id])

  const generateNewLink = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newToken = Math.random().toString(36).substring(2, 2 + tokenLength[0])
    const newLink = `${window.location.origin}/demo/share/${newToken}`
    setShareLink(newLink)
    
    // Save settings
    const settings = {
      shareLink: newLink,
      isPublic,
      hasPassword,
      password,
      expiresIn,
      fileName: file.original_name,
      tokenLength: tokenLength[0]
    }
    localStorage.setItem(`share-${file.id}`, JSON.stringify(settings))
    setIsGenerating(false)
  }

  const saveSettings = () => {
    const settings = {
      shareLink,
      isPublic,
      hasPassword,
      password,
      expiresIn,
      fileName: file.original_name,
      tokenLength: tokenLength[0]
    }
    localStorage.setItem(`share-${file.id}`, JSON.stringify(settings))
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>Share File</span>
              <p className="text-sm text-gray-400 font-normal">{file.original_name}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium truncate max-w-xs">{file.original_name}</p>
                  <p className="text-gray-400 text-sm">{formatFileSize(file.file_size)}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                Ready to Share
              </Badge>
            </div>
          </div>

          {/* Share Link */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Share Link</h3>
              <Button
                onClick={generateNewLink}
                size="sm"
                variant="outline"
                disabled={isGenerating}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Settings className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                <span className="ml-2">{isGenerating ? 'Generating...' : 'New Link'}</span>
              </Button>
            </div>

            <div className="relative">
              <Input
                value={shareLink}
                readOnly
                className="bg-slate-800/50 border-purple-500/20 text-white pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={() => window.open(shareLink, '_blank')}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-400 text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Link copied to clipboard!
              </motion.p>
            )}
          </div>

          {/* Share Settings */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Share Settings</h3>
            
            <div className="space-y-3">
              {/* Public Access */}
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe className="w-5 h-5 text-green-400" />
                  ) : (
                    <Lock className="w-5 h-5 text-orange-400" />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">Public Access</p>
                    <p className="text-gray-400 text-xs">Anyone with the link can view</p>
                  </div>
                </div>
                <Switch
                  checked={isPublic}
                  onCheckedChange={(checked) => {
                    setIsPublic(checked)
                    setTimeout(saveSettings, 100)
                  }}
                />
              </div>

              {/* Password Protection */}
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Password Protection</p>
                    <p className="text-gray-400 text-xs">Require password to access</p>
                  </div>
                </div>
                <Switch
                  checked={hasPassword}
                  onCheckedChange={(checked) => {
                    setHasPassword(checked)
                    setTimeout(saveSettings, 100)
                  }}
                />
              </div>

              {hasPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-8"
                >
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setTimeout(saveSettings, 500)
                    }}
                    className="bg-slate-800/50 border-purple-500/20 text-white"
                  />
                </motion.div>
              )}

              {/* Token Length */}
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Link2 className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Token Length</p>
                    <p className="text-gray-400 text-xs">Generate {tokenLength[0]} random characters</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Slider
                    value={tokenLength}
                    onValueChange={(value) => {
                      setTokenLength(value)
                      setTimeout(saveSettings, 100)
                    }}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1 char</span>
                    <span className="text-cyan-400 font-medium">{tokenLength[0]} characters</span>
                    <span>10 chars</span>
                  </div>
                </div>
              </div>

              {/* Expiration */}
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Link Expiration</p>
                    <p className="text-gray-400 text-xs">Set when this link expires</p>
                  </div>
                </div>
                <select
                  value={expiresIn}
                  onChange={(e) => {
                    setExpiresIn(e.target.value)
                    setTimeout(saveSettings, 100)
                  }}
                  className="w-full bg-slate-800/50 border border-purple-500/20 text-white text-sm rounded px-3 py-2"
                >
                  <option value="never">Never expires</option>
                  <option value="1hour">1 hour</option>
                  <option value="1day">1 day</option>
                  <option value="1week">1 week</option>
                  <option value="1month">1 month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Share Preview
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-purple-400">0</div>
                <div className="text-xs text-gray-400">Views</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">0</div>
                <div className="text-xs text-gray-400">Downloads</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-400">Active</div>
                <div className="text-xs text-gray-400">Status</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={copyToClipboard}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              onClick={() => window.open(shareLink, '_blank')}
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => {
                saveSettings()
                onClose()
              }}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
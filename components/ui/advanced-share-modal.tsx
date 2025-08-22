"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Share2, Copy, Link2, CheckCircle, X, Globe, Lock,
  Users, Calendar, Settings, ExternalLink, Shield,
  Eye, Download, Clock, Zap, AlertTriangle
} from "lucide-react"

interface AdvancedShareModalProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    size?: number
  }
}

export function AdvancedShareModal({ isOpen, onClose, file }: AdvancedShareModalProps) {
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareType, setShareType] = useState<'public' | 'private'>('public')
  const [password, setPassword] = useState('')
  
  // Advanced features
  const [encryptFileName, setEncryptFileName] = useState(false)
  const [accessLimit, setAccessLimit] = useState({ enabled: false, views: 10, downloads: 5 })
  const [timeLimit, setTimeLimit] = useState({ enabled: false, duration: '7d', custom: { value: 7, unit: 'day' } })
  const [showCustomTime, setShowCustomTime] = useState(false)
  
  // Auto-detect site URL
  const [siteUrl, setSiteUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteUrl(window.location.origin)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      generateShareLink()
    }
  }, [isOpen, file.id, shareType, encryptFileName, timeLimit, accessLimit])

  const generateShareLink = async () => {
    setIsGenerating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const token = Math.random().toString(36).substring(2, 15)
    const encryptedName = encryptFileName ? btoa(file.name).substring(0, 8) : file.name
    const link = `${siteUrl}/share/${token}${encryptFileName ? `?f=${encryptedName}` : ''}`
    setShareLink(link)
    setIsGenerating(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleTimePreset = (preset: string) => {
    if (preset === 'custom') {
      setShowCustomTime(true)
      setTimeLimit({ enabled: true, duration: 'custom', custom: { value: 1, unit: 'hour' } })
    } else if (preset === 'never') {
      setShowCustomTime(false)
      setTimeLimit({ enabled: false, duration: 'never', custom: { value: 0, unit: 'never' } })
    } else {
      setShowCustomTime(false)
      setTimeLimit({ enabled: true, duration: preset, custom: { value: 0, unit: 'day' } })
    }
  }

  const timePresets = [
    { value: '1h', label: '1 Hour' },
    { value: '3d', label: '3 Days' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'custom', label: 'Custom' },
    { value: 'never', label: 'Never' }
  ]

  const timeUnits = [
    { value: 'sec', label: 'Seconds' },
    { value: 'min', label: 'Minutes' },
    { value: 'hour', label: 'Hours' },
    { value: 'day', label: 'Days' },
    { value: 'month', label: 'Months' },
    { value: 'never', label: 'Never' }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Share2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Advanced Share</h3>
                  <p className="text-sm text-gray-400 truncate max-w-48">{file.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Share Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Access Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShareType('public')}
                  className={`flex-1 p-3 rounded-lg border transition-all ${
                    shareType === 'public'
                      ? 'border-purple-500 bg-purple-500/10 text-white'
                      : 'border-gray-700 bg-black/20 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Public</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Anyone with link</p>
                </button>
                
                <button
                  onClick={() => setShareType('private')}
                  className={`flex-1 p-3 rounded-lg border transition-all ${
                    shareType === 'private'
                      ? 'border-purple-500 bg-purple-500/10 text-white'
                      : 'border-gray-700 bg-black/20 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Private</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Password required</p>
                </button>
              </div>
            </div>

            {/* Password Input */}
            {shareType === 'private' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-white">Password Protection</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password for this file"
                  className="bg-black/30 border-gray-700 focus:border-purple-500/50 allow-select"
                />
                <p className="text-xs text-gray-400">Users will need this password to access the file</p>
              </motion.div>
            )}

            {/* Security Options */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-white">Security Options</label>
              
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-sm text-white">Encrypt Filename</p>
                    <p className="text-xs text-gray-400">Hide original filename in URL</p>
                  </div>
                </div>
                <Switch 
                  checked={encryptFileName}
                  onCheckedChange={setEncryptFileName}
                />
              </div>
            </div>

            {/* Time Expiration */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Expiration Time</label>
              
              <div className="grid grid-cols-3 gap-2">
                {timePresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleTimePreset(preset.value)}
                    className={`p-2 text-xs rounded-lg border transition-all ${
                      timeLimit.duration === preset.value
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-gray-700 bg-black/20 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Time Input with Animation */}
              <AnimatePresence>
                {showCustomTime && (
                  <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="flex gap-2"
                  >
                    <Input
                      type="number"
                      min="1"
                      value={timeLimit.custom.value}
                      onChange={(e) => setTimeLimit(prev => ({
                        ...prev,
                        custom: { ...prev.custom, value: parseInt(e.target.value) || 1 }
                      }))}
                      className="flex-1 bg-black/30 border-gray-700 allow-select"
                      placeholder="Duration"
                    />
                    <select
                      value={timeLimit.custom.unit}
                      onChange={(e) => setTimeLimit(prev => ({
                        ...prev,
                        custom: { ...prev.custom, unit: e.target.value as any }
                      }))}
                      className="bg-black/30 border border-gray-700 rounded-lg text-white px-3 py-2"
                    >
                      {timeUnits.filter(unit => unit.value !== 'never').map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Never Animation */}
              <AnimatePresence>
                {timeLimit.duration === 'never' && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Link will never expire</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Access Limits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Access Limits</label>
                <Switch 
                  checked={accessLimit.enabled}
                  onCheckedChange={(enabled) => setAccessLimit(prev => ({ ...prev, enabled }))}
                />
              </div>
              
              {accessLimit.enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Max Views</label>
                    <Input
                      type="number"
                      min="1"
                      value={accessLimit.views}
                      onChange={(e) => setAccessLimit(prev => ({ 
                        ...prev, 
                        views: parseInt(e.target.value) || 1 
                      }))}
                      className="bg-black/30 border-gray-700 allow-select"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Max Downloads</label>
                    <Input
                      type="number"
                      min="1"
                      value={accessLimit.downloads}
                      onChange={(e) => setAccessLimit(prev => ({ 
                        ...prev, 
                        downloads: parseInt(e.target.value) || 1 
                      }))}
                      className="bg-black/30 border-gray-700 allow-select"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Share Link */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Share Link</label>
              
              {isGenerating ? (
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-700">
                  <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-gray-400">Generating secure link...</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={shareLink}
                      readOnly
                      className="bg-black/30 border-gray-700 pr-10 font-mono text-sm allow-select"
                    />
                    <Link2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  
                  <Button
                    onClick={copyToClipboard}
                    className={`px-3 ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={() => window.open(shareLink, '_blank')}
                    variant="outline"
                    className="px-3 border-gray-600 text-gray-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Settings Summary */}
            <div className="bg-black/20 rounded-lg p-4 border border-gray-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Access Type</span>
                <Badge className={shareType === 'public' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {shareType === 'public' ? 'Public' : 'Password Protected'}
                </Badge>
              </div>
              
              {encryptFileName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Filename</span>
                  <Badge className="bg-purple-500/20 text-purple-400">Encrypted</Badge>
                </div>
              )}
              
              {timeLimit.enabled && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Expires</span>
                  <Badge className="bg-orange-500/20 text-orange-400">
                    {timeLimit.duration === 'custom' 
                      ? `${timeLimit.custom.value} ${timeLimit.custom.unit}${timeLimit.custom.value > 1 ? 's' : ''}`
                      : timeLimit.duration
                    }
                  </Badge>
                </div>
              )}
              
              {accessLimit.enabled && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Limits</span>
                  <Badge className="bg-red-500/20 text-red-400">
                    {accessLimit.views} views, {accessLimit.downloads} downloads
                  </Badge>
                </div>
              )}
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Secure link copied to clipboard!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Done
            </Button>
            <Button
              onClick={generateShareLink}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={isGenerating}
            >
              <Settings className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
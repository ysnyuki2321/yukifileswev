"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Share2, Copy, Link2, CheckCircle, X, Globe, Lock,
  Users, Calendar, Settings, ExternalLink
} from "lucide-react"

interface SimpleShareModalProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    size?: number
  }
}

export function SimpleShareModal({ isOpen, onClose, file }: SimpleShareModalProps) {
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareType, setShareType] = useState<'public' | 'private'>('public')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isOpen) {
      generateShareLink()
    }
  }, [isOpen, file.id])

  const generateShareLink = async () => {
    setIsGenerating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const token = Math.random().toString(36).substring(2, 15)
    const link = `https://yukifiles.com/share/${token}`
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

  const openInNewTab = () => {
    window.open(shareLink, '_blank')
  }

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
          className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl max-w-md w-full mx-auto overflow-hidden"
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
                  <h3 className="text-lg font-semibold text-white">Share File</h3>
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
          <div className="p-6 space-y-4">
            {/* Share Type Selection */}
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

             {/* Password Input for Private */}
             {shareType === 'private' && (
               <div className="space-y-2">
                 <label className="text-sm font-medium text-white">Password Protection</label>
                 <Input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Enter password for this file"
                   className="bg-black/30 border-gray-700 focus:border-purple-500/50 allow-select"
                 />
                 <p className="text-xs text-gray-400">Users will need this password to access the file</p>
               </div>
             )}

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
                    onClick={openInNewTab}
                    variant="outline"
                    className="px-3 border-gray-600 text-gray-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-700/50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">Access</span>
              </div>
              <Badge className={`${shareType === 'public' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {shareType === 'public' ? 'Public' : 'Password Protected'}
              </Badge>
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
                  <span className="text-sm text-green-400">Link copied to clipboard!</span>
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
              New Link
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
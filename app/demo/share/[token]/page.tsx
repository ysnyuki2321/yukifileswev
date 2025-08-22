"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, Eye, Calendar, HardDrive, Sparkles, ExternalLink, Share2, Lock, AlertCircle, CheckCircle, Image, Video } from "lucide-react"
import { motion } from "framer-motion"
import { ResponsiveVideoPlayer } from "@/components/ui/responsive-video-player"
import { ProfessionalDownload } from "@/components/ui/professional-download"

interface DemoSharePageProps {
  params: Promise<{
    token: string
  }>
}

export default function DemoSharePage({ params }: DemoSharePageProps) {
  const [token, setToken] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [password, setPassword] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)
  const [showCopySuccess, setShowCopySuccess] = useState(false)

  useEffect(() => {
    params.then(p => {
      setToken(p.token)
      
      // Check if this link has settings
      const allSettings = Object.keys(localStorage).filter(key => key.startsWith('share-'))
      const linkSettings = allSettings.find(key => {
        const settings = JSON.parse(localStorage.getItem(key) || '{}')
        return settings.shareLink && settings.shareLink.includes(p.token)
      })
      
              // Set demo file based on token
        const fileData = getDemoFileByToken(p.token)
        setDemoFile(fileData)
        
        if (linkSettings) {
          const settings = JSON.parse(localStorage.getItem(linkSettings) || '{}')
          setIsPrivate(!settings.isPublic)
          if (settings.fileName) {
            setDemoFile((prevDemoFile: any) => ({ ...prevDemoFile, original_name: settings.fileName }))
          }
        } else {
          // Simulate some links being private
          setIsPrivate(p.token.includes('private') || Math.random() > 0.7)
        }
    })
  }, [params])

  const getDemoFileByToken = (token: string) => {
    // Demo files với different types
    const demoFiles: { [key: string]: any } = {
      'abc123': {
        original_name: "Beautiful_Landscape.jpg",
        file_size: 2547893,
        created_at: "2024-01-15T10:30:00Z",
        download_count: 1247,
        mime_type: "image/jpeg",
        owner: "demo@yukifiles.com",
        preview_url: "https://cdn.discordapp.com/attachments/1402528640108990502/1408159531212472340/9a158cfef15faa3a2bb0d910d5bace0f.jpg?ex=68a8ba42&is=68a768c2&hm=2cc475eb3894f0b72b9497613b9465e92a4ea89e386f14b890defec176ca97d9&"
      },
      'def456': {
        original_name: "Demo_Video.mp4", 
        file_size: 15847392,
        created_at: "2024-01-14T15:20:00Z",
        download_count: 892,
        mime_type: "video/mp4",
        owner: "creator@yukifiles.com",
        preview_url: "https://cdn.discordapp.com/attachments/1402528640108990502/1408159523310538844/83cb90295730d846323a14bbd13dc777.mp4?ex=68a8ba40&is=68a768c0&hm=6d2fef08de6bd955520298bddd012bf7aaa2f82ab6c081738b80d5e2c2996ca2&"
      },
      'default': {
        original_name: "YukiFiles_Demo_Project.zip",
        file_size: 2547893,
        created_at: "2024-01-15T10:30:00Z",
        download_count: 1247,
        mime_type: "application/zip",
        owner: "demo@yukifiles.com"
      }
    }
    
    return demoFiles[token] || demoFiles['default']
  }

  const [demoFile, setDemoFile] = useState(getDemoFileByToken('default'))

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyToDemo = () => {
    // Simulate copying file to demo account
    setShowCopySuccess(true)
    setTimeout(() => setShowCopySuccess(false), 3000)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/demo-file.zip'
    link.download = demoFile.original_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePasswordSubmit = () => {
    if (password === 'demo123') {
      setAccessGranted(true)
    }
  }

  // Private Access Screen
  if (isPrivate && !accessGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-black/40 via-red-950/30 to-black/40 backdrop-blur-lg border border-red-500/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-white mb-2">Private File</CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              This file is private and requires permission to access
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-300 font-medium">Access Restricted</p>
                  <p className="text-red-400/80 text-sm">You don't have permission to view this file</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-white text-sm font-medium">Enter Password</label>
              <Input
                type="password"
                placeholder="Password required..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/50 border-red-500/20 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
              <p className="text-gray-400 text-xs">Demo password: demo123</p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handlePasswordSubmit}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                disabled={!password}
              >
                <Lock className="w-4 h-4 mr-2" />
                Access File
              </Button>
              <Button 
                onClick={() => window.open('/', '_blank')}
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-gray-700"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-black/40 via-purple-950/30 to-black/40 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-white mb-2">{demoFile.original_name}</CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            Shared securely via YukiFiles Platform
          </CardDescription>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <Eye className="w-3 h-3 mr-1" />
              Demo File
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              Shared by: {demoFile.owner}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Copy Success Notification */}
          {showCopySuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-300 font-medium">File copied successfully!</p>
                <p className="text-green-400/80 text-sm">File copied from {demoFile.owner} to your demo account</p>
              </div>
            </motion.div>
          )}

          {/* File Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-purple-500/10">
              <HardDrive className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{formatFileSize(demoFile.file_size)}</div>
              <div className="text-xs text-gray-400">File Size</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-purple-500/10">
              <Download className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{demoFile.download_count.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Downloads</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-purple-500/10">
              <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{formatDate(demoFile.created_at)}</div>
              <div className="text-xs text-gray-400">Uploaded</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-purple-500/10">
              <Share2 className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">Public</div>
              <div className="text-xs text-gray-400">Access</div>
            </div>
          </div>

          {/* File Preview */}
          {demoFile.preview_url && (
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                File Preview
              </h3>
              
              {demoFile.mime_type.startsWith('image/') ? (
                <div className="relative rounded-lg overflow-hidden bg-black/20">
                  <img
                    src={demoFile.preview_url}
                    alt={demoFile.original_name}
                    className="w-full h-auto max-h-96 object-contain rounded-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <Image className="w-3 h-3 mr-1" />
                      Image
                    </Badge>
                  </div>
                </div>
                             ) : demoFile.mime_type.startsWith('video/') ? (
                <div className="flex justify-center">
                  <ResponsiveVideoPlayer
                    src={demoFile.preview_url}
                    title={demoFile.original_name}
                    aspectRatio="16:9"
                  />
                </div>
               ) : (
                <div className="bg-slate-800/50 rounded-lg p-8 text-center">
                  <HardDrive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 font-medium">{demoFile.original_name}</p>
                  <p className="text-gray-400 text-sm mt-2">Preview not available for this file type</p>
                  <Badge variant="outline" className="mt-3 border-gray-500 text-gray-300">
                    {demoFile.mime_type}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <ProfessionalDownload
              url={demoFile.preview_url || '/demo-file.zip'}
              filename={demoFile.original_name}
              fileSize={demoFile.file_size}
              className="flex-1"
            />
            <Button 
              onClick={copyToDemo}
              variant="outline"
              className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to My Files
            </Button>
            <Button 
              onClick={copyLink}
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            <Button 
              onClick={() => window.open('/', '_blank')}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit YukiFiles
            </Button>
          </div>

          {/* Security Info */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-purple-500/10">
            <p>This file is shared securely via YukiFiles Platform</p>
            <p>End-to-end encrypted • Enterprise security • 99.9% uptime</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
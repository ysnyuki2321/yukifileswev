"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Download, CheckCircle, AlertCircle, Sparkles, 
  FileText, Shield, Zap, Clock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProfessionalDownloadProps {
  url: string
  filename: string
  fileSize?: number
  onComplete?: () => void
  className?: string
}

export function ProfessionalDownload({ 
  url, 
  filename, 
  fileSize, 
  onComplete,
  className 
}: ProfessionalDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatSpeed = (bytesPerSecond: number) => {
    return formatFileSize(bytesPerSecond) + '/s'
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  const simulateDownload = async () => {
    setIsDownloading(true)
    setProgress(0)
    setError(null)
    
    const totalSize = fileSize || 2547893
    const startTime = Date.now()
    
    // Simulate download progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setProgress(i)
      
      const elapsedTime = (Date.now() - startTime) / 1000
      const downloadedBytes = (totalSize * i) / 100
      const speed = downloadedBytes / elapsedTime
      const remaining = (totalSize - downloadedBytes) / speed
      
      setDownloadSpeed(speed)
      setTimeRemaining(remaining)
    }
    
    // Actual download
    try {
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setIsComplete(true)
      setTimeout(() => {
        onComplete?.()
        setIsDownloading(false)
        setIsComplete(false)
        setProgress(0)
      }, 2000)
    } catch (err) {
      setError('Download failed. Please try again.')
      setIsDownloading(false)
    }
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-green-300 font-semibold">Download Complete!</p>
            <p className="text-green-400/80 text-sm">{filename} has been downloaded successfully</p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-red-300 font-semibold">Download Failed</p>
            <p className="text-red-400/80 text-sm">{error}</p>
          </div>
          <Button 
            onClick={simulateDownload}
            size="sm"
            variant="outline"
            className="border-red-500/30 text-red-300"
          >
            Retry
          </Button>
        </div>
      </motion.div>
    )
  }

  if (isDownloading) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 ${className}`}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  y: [0, -3, 0],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Download className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            <div className="flex-1">
              <p className="text-purple-300 font-semibold">Downloading {filename}</p>
              <p className="text-purple-400/80 text-sm">Preparing secure download...</p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">{Math.round(progress)}%</span>
              <span className="text-gray-400">{formatFileSize((fileSize || 0) * progress / 100)} / {formatFileSize(fileSize || 0)}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {formatSpeed(downloadSpeed)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(timeRemaining)} remaining
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <Button 
      onClick={simulateDownload}
      className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 ${className}`}
    >
      <Download className="w-4 h-4 mr-2" />
      Download File
    </Button>
  )
}
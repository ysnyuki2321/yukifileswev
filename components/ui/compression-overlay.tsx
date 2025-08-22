"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Archive, X, CheckCircle, Clock, File, Folder,
  Zap, Package, HardDrive, Download, Eye
} from "lucide-react"

interface FileToCompress {
  id: string
  name: string
  size: number
  path: string[]
  progress: number
  status: 'waiting' | 'compressing' | 'completed' | 'error'
}

interface CompressionOverlayProps {
  isOpen: boolean
  onClose: () => void
  files: { id: string; name: string; size?: number; path?: string[] }[]
  onComplete?: (archiveName: string, compressionType: string) => void
}

export function CompressionOverlay({ isOpen, onClose, files, onComplete }: CompressionOverlayProps) {
  const [compressionType, setCompressionType] = useState<'zip' | 'tar.gz' | '7z'>('tar.gz')
  const [archiveName, setArchiveName] = useState('')
  const [compressionFiles, setCompressionFiles] = useState<FileToCompress[]>([])
  const [currentStep, setCurrentStep] = useState<'setup' | 'compressing' | 'completed'>('setup')
  const [overallProgress, setOverallProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState('')

  useEffect(() => {
    if (isOpen && files.length > 0) {
      // Initialize compression files
      const initFiles: FileToCompress[] = files.map(file => ({
        id: file.id,
        name: file.name,
        size: file.size || Math.random() * 10000000, // Mock size
        path: file.path || [],
        progress: 0,
        status: 'waiting'
      }))
      
      setCompressionFiles(initFiles)
      
      // Generate default archive name
      const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '')
      setArchiveName(`archive_${timestamp}`)
    }
  }, [isOpen, files])

  const startCompression = async () => {
    setCurrentStep('compressing')
    
    // Calculate estimated time
    const totalSize = compressionFiles.reduce((acc, file) => acc + file.size, 0)
    const estimatedSeconds = Math.ceil(totalSize / 1000000) // 1MB per second
    setEstimatedTime(`${estimatedSeconds}s`)

    // Compress files one by one
    for (let i = 0; i < compressionFiles.length; i++) {
      setCompressionFiles(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'compressing' } : file
      ))

      // Simulate compression progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        
        setCompressionFiles(prev => prev.map((file, index) => 
          index === i ? { ...file, progress } : file
        ))
        
        // Update overall progress
        const overallProg = ((i * 100 + progress) / (compressionFiles.length * 100)) * 100
        setOverallProgress(overallProg)
      }

      setCompressionFiles(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'completed' } : file
      ))
    }

    setCurrentStep('completed')
    setOverallProgress(100)
  }

  const getCompressionInfo = (type: string) => {
    switch (type) {
      case 'zip':
        return { 
          description: 'Universal compatibility, good compression',
          ratio: '~60%', 
          speed: 'Fast',
          icon: Package,
          color: 'text-blue-400'
        }
      case 'tar.gz':
        return { 
          description: 'Best compression ratio, Linux standard',
          ratio: '~40%', 
          speed: 'Medium',
          icon: Archive,
          color: 'text-purple-400'
        }
      case '7z':
        return { 
          description: 'Maximum compression, slower process',
          ratio: '~30%', 
          speed: 'Slow',
          icon: Zap,
          color: 'text-orange-400'
        }
      default:
        return { description: '', ratio: '', speed: '', icon: Archive, color: 'text-gray-400' }
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const totalSize = compressionFiles.reduce((acc, file) => acc + file.size, 0)
  const completedFiles = compressionFiles.filter(f => f.status === 'completed').length

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={currentStep === 'completed' ? onClose : undefined}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Archive className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {currentStep === 'setup' ? 'Compress Files' : 
                     currentStep === 'compressing' ? 'Compressing...' : 
                     'Compression Complete'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {currentStep === 'setup' ? `${files.length} files selected` :
                     currentStep === 'compressing' ? `${completedFiles}/${compressionFiles.length} files processed` :
                     `Archive created successfully`}
                  </p>
                </div>
              </div>
              {currentStep !== 'compressing' && (
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {currentStep === 'setup' && (
              <>
                {/* Archive Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Archive Name</label>
                  <input
                    type="text"
                    value={archiveName}
                    onChange={(e) => setArchiveName(e.target.value)}
                    className="w-full p-3 bg-black/30 border border-gray-700 rounded-lg text-white focus:border-purple-500/50 focus:outline-none allow-select"
                    placeholder="Enter archive name..."
                  />
                </div>

                {/* Compression Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Compression Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['zip', 'tar.gz', '7z'] as const).map((type) => {
                      const info = getCompressionInfo(type)
                      const Icon = info.icon
                      
                      return (
                        <button
                          key={type}
                          onClick={() => setCompressionType(type)}
                          className={`p-4 rounded-lg border transition-all text-left ${
                            compressionType === type
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-gray-700 bg-black/20 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className={`w-5 h-5 ${compressionType === type ? info.color : 'text-gray-400'}`} />
                            <span className={`font-medium ${compressionType === type ? 'text-white' : 'text-gray-400'}`}>
                              .{type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{info.description}</p>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Ratio: {info.ratio}</span>
                            <span className="text-gray-500">Speed: {info.speed}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* File Summary */}
                <div className="bg-black/20 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Total Size</span>
                    <span className="text-sm text-white font-medium">{formatBytes(totalSize)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Estimated Size</span>
                    <span className="text-sm text-purple-400 font-medium">
                      ~{formatBytes(totalSize * (compressionType === 'zip' ? 0.6 : compressionType === 'tar.gz' ? 0.4 : 0.3))}
                    </span>
                  </div>
                </div>
              </>
            )}

            {currentStep === 'compressing' && (
              <>
                {/* Overall Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-400">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{completedFiles} of {compressionFiles.length} files</span>
                    <span>Est. {estimatedTime} remaining</span>
                  </div>
                </div>

                {/* File Progress List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {compressionFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-2 bg-black/20 rounded-lg">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {file.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : file.status === 'compressing' ? (
                          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={file.progress} className="h-1 flex-1" />
                          <span className="text-xs text-gray-400">{file.progress}%</span>
                        </div>
                      </div>
                      
                      <span className="text-xs text-gray-400">{formatBytes(file.size)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentStep === 'completed' && (
              <>
                {/* Success Message */}
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Archive Created!</h4>
                    <p className="text-sm text-gray-400">
                      {compressionFiles.length} files compressed into {archiveName}.{compressionType}
                    </p>
                  </div>
                </div>

                {/* Archive Info */}
                <div className="bg-black/20 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Archive className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{archiveName}.{compressionType}</p>
                      <p className="text-xs text-gray-400">
                        {formatBytes(totalSize * (compressionType === 'zip' ? 0.6 : compressionType === 'tar.gz' ? 0.4 : 0.3))} 
                        <span className="ml-1">
                          ({Math.round((1 - (compressionType === 'zip' ? 0.6 : compressionType === 'tar.gz' ? 0.4 : 0.3)) * 100)}% smaller)
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        console.log('Downloading archive:', `${archiveName}.${compressionType}`)
                        onComplete?.(archiveName, compressionType)
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => {
                        console.log('Viewing archive:', `${archiveName}.${compressionType}`)
                        // Open archive viewer
                      }}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {currentStep === 'setup' && (
            <div className="p-6 pt-0 flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={startCompression}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={!archiveName.trim()}
              >
                <Archive className="w-4 h-4 mr-2" />
                Start Compression
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
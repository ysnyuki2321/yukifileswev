"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, Check, X, AlertCircle, FileText, Image, 
  Video, Music, Archive, Code, File,
  Plus, Trash2, Eye, Download, Share2, Edit3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  preview?: string
}

interface EnhancedUploadProps {
  onUpload?: (files: UploadFile[]) => void
  onConfirm?: (files: UploadFile[]) => void
  maxFileSize?: number
  allowedTypes?: string[]
  storageQuota?: number
  usedStorage?: number
  className?: string
}

const fileTypeIcons = {
  'image': Image,
  'video': Video,
  'audio': Music,
  'archive': Archive,
  'code': Code,
  'document': FileText,
  'text': FileText,
  'default': File
}

const getFileType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive'
  if (mimeType.includes('javascript') || mimeType.includes('python') || mimeType.includes('java') || 
      mimeType.includes('cpp') || mimeType.includes('csharp') || mimeType.includes('php') ||
      mimeType.includes('html') || mimeType.includes('css') || mimeType.includes('json') ||
      mimeType.includes('xml') || mimeType.includes('yaml') || mimeType.includes('sql')) return 'code'
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('excel') || 
      mimeType.includes('powerpoint')) return 'document'
  if (mimeType.includes('text/')) return 'text'
  return 'default'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function EnhancedUpload({ 
  onUpload, 
  onConfirm, 
  maxFileSize = 100 * 1024 * 1024, // 100MB
  allowedTypes = ['*/*'],
  storageQuota = 2 * 1024 * 1024 * 1024, // 2GB
  usedStorage = 0,
  className 
}: EnhancedUploadProps) {
  const [isUploadBoxVisible, setIsUploadBoxVisible] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Calculate storage usage
  const totalFileSize = uploadFiles.reduce((sum, file) => sum + file.size, 0)
  const newUsedStorage = usedStorage + totalFileSize
  const storageUsagePercent = (newUsedStorage / storageQuota) * 100
  const isOverQuota = newUsedStorage > storageQuota

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList) => {
    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending' as const
    }))

    // Validate files
    const validFiles: UploadFile[] = []
    const errors: string[] = []

    newFiles.forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large (max ${formatFileSize(maxFileSize)})`)
        return
      }

      // Check file type
      if (allowedTypes[0] !== '*/*') {
        const isAllowed = allowedTypes.some(type => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', ''))
          }
          return file.type === type
        })
        if (!isAllowed) {
          errors.push(`${file.name} is not an allowed file type`)
          return
        }
      }

      validFiles.push(file)
    })

    if (errors.length > 0) {
      setErrorMessage(errors.join(', '))
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
    }

    if (validFiles.length > 0) {
      setUploadFiles(prev => [...prev, ...validFiles])
      setIsUploadBoxVisible(true)
    }
  }, [maxFileSize, allowedTypes])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.add('border-purple-500', 'bg-purple-500/10')
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.remove('border-purple-500', 'bg-purple-500/10')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.remove('border-purple-500', 'bg-purple-500/10')
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect])

  // Simulate upload process
  const simulateUpload = useCallback(async (files: UploadFile[]) => {
    setIsUploading(true)
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Update file status to uploading
      setUploadFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading' } : f
      ))

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        
        setUploadFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ))
        
        setUploadProgress((i * 100 + progress) / files.length)
      }

      // Mark as completed
      setUploadFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f
      ))
    }

    setIsUploading(false)
    setShowSuccess(true)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setUploadFiles([])
      setIsUploadBoxVisible(false)
      setUploadProgress(0)
    }, 3000)
  }, [])

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (uploadFiles.length === 0) return

    if (onUpload) {
      onUpload(uploadFiles)
    } else {
      await simulateUpload(uploadFiles)
    }
  }, [uploadFiles, onUpload, simulateUpload])

  // Handle confirm
  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm(uploadFiles)
    }
    setUploadFiles([])
    setIsUploadBoxVisible(false)
  }, [uploadFiles, onConfirm])

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId))
    if (uploadFiles.length === 1) {
      setIsUploadBoxVisible(false)
    }
  }, [uploadFiles.length])

  // Get file icon
  const getFileIcon = (file: UploadFile) => {
    const fileType = getFileType(file.type)
    const Icon = fileTypeIcons[fileType] || fileTypeIcons.default
    return <Icon className="w-5 h-5" />
  }

  return (
    <div className={cn("relative", className)}>
      {/* Upload Icon Button */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (!isUploadBoxVisible) {
              fileInputRef.current?.click()
            }
          }}
          className={cn(
            "w-12 h-12 rounded-full transition-all duration-300",
            showSuccess 
              ? "bg-green-500 text-white" 
              : showError 
                ? "bg-red-500 text-white"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          )}
        >
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Check className="w-6 h-6" />
              </motion.div>
            ) : showError ? (
              <motion.div
                key="error"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : isUploading ? (
              <motion.div
                key="uploading"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <motion.div
                key="upload"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Progress Ring */}
        {isUploading && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-500/30"
            style={{
              background: `conic-gradient(from 0deg, #8b5cf6 ${uploadProgress * 3.6}deg, transparent ${uploadProgress * 3.6}deg)`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(',')}
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Box */}
      <AnimatePresence>
        {isUploadBoxVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-0 w-96 z-50"
          >
            <Card className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/20 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center justify-between">
                  <span>Upload Files</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUploadBoxVisible(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Storage Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Storage Usage</span>
                    <span className={cn(
                      "font-medium",
                      isOverQuota ? "text-red-400" : "text-gray-300"
                    )}>
                      {formatFileSize(newUsedStorage)} / {formatFileSize(storageQuota)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(storageUsagePercent, 100)} 
                    className={cn(
                      "h-2",
                      isOverQuota ? "bg-red-500/20" : "bg-gray-700"
                    )}
                  />
                  {isOverQuota && (
                    <div className="flex items-center space-x-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Storage quota exceeded. Please remove some files.</span>
                    </div>
                  )}
                </div>

                {/* Drop Zone */}
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-all duration-300",
                    "hover:border-purple-500 hover:bg-purple-500/10"
                  )}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400 text-sm mb-2">
                    Drag & drop files here or click to browse
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                  >
                    Choose Files
                  </Button>
                </div>

                {/* File List */}
                {uploadFiles.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {uploadFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg border border-purple-500/20"
                      >
                        <div className="flex-shrink-0 text-purple-400">
                          {getFileIcon(file)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-white text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400 text-xs">
                                {formatFileSize(file.size)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="text-gray-400 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {file.status === 'uploading' && (
                            <div className="mt-2">
                              <Progress value={file.progress} className="h-1" />
                              <span className="text-xs text-gray-400">
                                {file.progress}% uploaded
                              </span>
                            </div>
                          )}
                          
                          {file.status === 'completed' && (
                            <div className="flex items-center space-x-2 mt-1">
                              <Check className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-400">Uploaded</span>
                            </div>
                          )}
                          
                          {file.status === 'error' && (
                            <div className="flex items-center space-x-2 mt-1">
                              <X className="w-3 h-3 text-red-400" />
                              <span className="text-xs text-red-400">{file.error}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {uploadFiles.length > 0 && (
                  <div className="flex items-center space-x-2 pt-2 border-t border-purple-500/20">
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading || isOverQuota}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Files'}
                    </Button>
                    
                    {onConfirm && (
                      <Button
                        onClick={handleConfirm}
                        variant="outline"
                        className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                      >
                        Confirm
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-20 right-0 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
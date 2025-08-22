"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, FileCode, Save, X, AlertCircle, CheckCircle,
  Type, Code, File, Folder, Music, Image, Video, Database, Info,
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Indent, Outdent, Link, Image as ImageIcon, Table, Code2, Palette, Eye, EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fileName: string, content: string, fileType: string) => void
  initialFileName?: string
  initialContent?: string
  fileType?: 'text' | 'code' | 'folder' | 'audio' | 'image' | 'video' | 'database'
}

const ALLOWED_EXTENSIONS = {
  text: ['.txt', '.md', '.json', '.csv', '.log', '.rtf'],
  code: ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.swift', '.kt'],
  audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'],
  video: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'],
  database: ['.db', '.sqlite', '.sqlite3', '.sql'],
  folder: []
}

const FILE_TYPE_NAMES = {
  text: 'Text File',
  code: 'Code File', 
  audio: 'Audio File',
  image: 'Image File',
  video: 'Video File',
  database: 'Database File',
  folder: 'Folder'
}

const FILE_TYPE_ICONS = {
  text: FileText,
  code: FileCode,
  audio: Music,
  image: Image,
  video: Video,
  database: Database,
  folder: Folder
}

export function FileEditor({ 
  isOpen, 
  onClose, 
  onSave, 
  initialFileName = '', 
  initialContent = '', 
  fileType = 'text' 
}: FileEditorProps) {
  const [fileName, setFileName] = useState(initialFileName)
  const [content, setContent] = useState(initialContent)
  const [selectedType, setSelectedType] = useState(fileType)
  const [errors, setErrors] = useState<string[]>([])
  const [isValid, setIsValid] = useState(false)
  const [iconKey, setIconKey] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark')

  useEffect(() => {
    setFileName(initialFileName)
    setContent(initialContent)
    setSelectedType(fileType)
    setIconKey(prev => prev + 1)
  }, [initialFileName, initialContent, fileType])

  useEffect(() => {
    validateFileName()
  }, [fileName, selectedType])

  // Auto-detect file type from extension
  const detectFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    
    if (ALLOWED_EXTENSIONS.audio.includes(`.${ext}`)) return 'audio'
    if (ALLOWED_EXTENSIONS.image.includes(`.${ext}`)) return 'image'
    if (ALLOWED_EXTENSIONS.video.includes(`.${ext}`)) return 'video'
    if (ALLOWED_EXTENSIONS.database.includes(`.${ext}`)) return 'database'
    if (ALLOWED_EXTENSIONS.code.includes(`.${ext}`)) return 'code'
    if (ALLOWED_EXTENSIONS.text.includes(`.${ext}`)) return 'text'
    
    return 'text' // default
  }

  const handleFileNameChange = (newName: string) => {
    setFileName(newName)
    
    // Auto-detect and update file type with animation
    const detectedType = detectFileType(newName)
    if (detectedType !== selectedType) {
      setIconKey(prev => prev + 1)
      setSelectedType(detectedType)
    }
  }

  const validateFileName = () => {
    const newErrors: string[] = []
    
    // Check if filename is empty
    if (!fileName.trim()) {
      newErrors.push('File name is required')
    }
    
    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(fileName)) {
      newErrors.push('File name contains invalid characters')
    }
    
    // Check file extension
    if (fileName.includes('.')) {
      const extension = fileName.substring(fileName.lastIndexOf('.'))
      const allowedExtensions = ALLOWED_EXTENSIONS[selectedType as keyof typeof ALLOWED_EXTENSIONS]
      
      if (allowedExtensions && allowedExtensions.length > 0 && !allowedExtensions.includes(extension.toLowerCase())) {
        newErrors.push(`Invalid extension for ${FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}. Allowed: ${allowedExtensions.join(', ')}`)
      }
    } else {
      // No extension - add default based on type
      if (selectedType === 'text') {
        newErrors.push('Text files should have .txt extension')
      } else if (selectedType === 'code') {
        newErrors.push('Code files should have appropriate extension (.js, .ts, .html, etc.)')
      } else if (selectedType === 'audio') {
        newErrors.push('Audio files should have appropriate extension (.mp3, .wav, etc.)')
      } else if (selectedType === 'image') {
        newErrors.push('Image files should have appropriate extension (.jpg, .png, etc.)')
      } else if (selectedType === 'video') {
        newErrors.push('Video files should have appropriate extension (.mp4, .avi, etc.)')
      } else if (selectedType === 'database') {
        newErrors.push('Database files should have appropriate extension (.db, .sqlite, etc.)')
      }
    }
    
    setErrors(newErrors)
    setIsValid(newErrors.length === 0 && fileName.trim().length > 0)
  }

  const handleSave = () => {
    if (!isValid) return
    
    let finalFileName = fileName
    let finalContent = content
    
    // Add default extension if missing
    if (!fileName.includes('.')) {
      if (selectedType === 'text') {
        finalFileName = fileName + '.txt'
      } else if (selectedType === 'code') {
        finalFileName = fileName + '.js' // Default to .js
      } else if (selectedType === 'audio') {
        finalFileName = fileName + '.mp3' // Default to .mp3
      } else if (selectedType === 'image') {
        finalFileName = fileName + '.jpg' // Default to .jpg
      } else if (selectedType === 'video') {
        finalFileName = fileName + '.mp4' // Default to .mp4
      } else if (selectedType === 'database') {
        finalFileName = fileName + '.db' // Default to .db
      }
    }
    
    onSave(finalFileName, finalContent, selectedType)
    onClose()
  }

  const getFileIcon = () => {
    const IconComponent = FILE_TYPE_ICONS[selectedType as keyof typeof FILE_TYPE_ICONS] || File
    return <IconComponent className="w-6 h-6" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <motion.div
              key={iconKey}
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {FILE_TYPE_ICONS[selectedType as keyof typeof FILE_TYPE_ICONS] && React.createElement(FILE_TYPE_ICONS[selectedType as keyof typeof FILE_TYPE_ICONS], { className: "w-5 h-5 text-white" })}
            </motion.div>
            <span>Edit File</span>
            {selectedType !== 'folder' && (
              <Badge variant="secondary" className="ml-2">
                {FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* File Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(FILE_TYPE_NAMES).map(([type, name]) => {
              if (type === 'folder') return null
              const IconComponent = FILE_TYPE_ICONS[type as keyof typeof FILE_TYPE_ICONS]
              
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedType(type as any)
                    setIconKey(prev => prev + 1)
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border transition-all duration-200",
                    selectedType === type
                      ? "border-purple-500 bg-purple-500/10 text-purple-600"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{name}</span>
                </motion.button>
              )
            })}
          </div>

          {/* File Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">File Name</label>
            <Input
              value={fileName}
              onChange={(e) => handleFileNameChange(e.target.value)}
              placeholder="Enter file name with extension"
              className={cn(
                "transition-all duration-200",
                errors.length > 0 ? "border-red-500 focus:border-red-500" : ""
              )}
            />
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                {errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

                                {/* Content Editor */}
                      {selectedType !== 'folder' && (
                        <div className="space-y-4">
                          {/* Editor Toolbar */}
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Content</label>
                            <div className="flex items-center gap-2">
                              {/* Font Size */}
                              <select
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                              >
                                <option value={12}>12px</option>
                                <option value={14}>14px</option>
                                <option value={16}>16px</option>
                                <option value={18}>18px</option>
                                <option value={20}>20px</option>
                              </select>
                              
                              {/* Theme */}
                              <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value as any)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                              >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                              </select>
                              
                              {/* Preview Toggle */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-2"
                              >
                                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                              </Button>
                            </div>
                          </div>
                          
                          {/* Editor/Preview Toggle */}
                          {!showPreview ? (
                            <Textarea
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              placeholder={`Enter ${FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]} content...`}
                              className="min-h-[200px] font-mono text-sm"
                              style={{ fontSize: `${fontSize}px` }}
                            />
                          ) : (
                            <div className="min-h-[200px] p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto">
                              {selectedType === 'markdown' ? (
                                <div className="prose max-w-none">
                                  {/* Markdown preview would go here */}
                                  <pre className="whitespace-pre-wrap">{content}</pre>
                                </div>
                              ) : selectedType === 'code' ? (
                                <pre className="text-sm" style={{ fontSize: `${fontSize}px` }}>
                                  <code>{content}</code>
                                </pre>
                              ) : (
                                <div style={{ fontSize: `${fontSize}px` }}>
                                  {content}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

          {/* File Type Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>
                {selectedType === 'folder' 
                  ? 'Folders are used to organize files and cannot contain content.'
                  : `This file will be saved as a ${FILE_TYPE_NAMES[selectedType as keyof typeof FILE_TYPE_NAMES]}.`
                }
              </span>
            </div>
            {selectedType !== 'folder' && ALLOWED_EXTENSIONS[selectedType as keyof typeof ALLOWED_EXTENSIONS]?.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                <strong>Allowed extensions:</strong> {ALLOWED_EXTENSIONS[selectedType as keyof typeof ALLOWED_EXTENSIONS].join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isValid}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
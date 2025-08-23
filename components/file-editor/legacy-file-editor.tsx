"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, FileCode, Save, X, Code, File, Folder, Music, Image, Video, Database
} from "lucide-react"
import { cn } from "@/lib/utils"

interface LegacyFileEditorProps {
  file: {
    id: string
    name: string
    content: string
    type: string
    size: number
    lastModified: Date
  }
  onSave: (fileName: string, content: string, fileType: string) => void
  onClose: () => void
  readOnly?: boolean
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

const FILE_TYPE_NAMES = {
  text: 'Text File',
  code: 'Code File', 
  audio: 'Audio File',
  image: 'Image File',
  video: 'Video File',
  database: 'Database File',
  folder: 'Folder'
}

export function LegacyFileEditor({ file, onSave, onClose, readOnly = false }: LegacyFileEditorProps) {
  const [fileName, setFileName] = useState(file.name)
  const [content, setContent] = useState(file.content)
  const [fileType, setFileType] = useState(file.type || 'text')

  useEffect(() => {
    setFileName(file.name)
    setContent(file.content)
    setFileType(file.type || 'text')
  }, [file])

  const handleSave = () => {
    onSave(fileName, content, fileType)
  }

  const getFileIcon = () => {
    const IconComponent = FILE_TYPE_ICONS[fileType as keyof typeof FILE_TYPE_ICONS]
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <FileText className="w-5 h-5" />
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
            {getFileIcon()}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{fileName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {FILE_TYPE_NAMES[fileType as keyof typeof FILE_TYPE_NAMES] || 'Unknown'}
              </Badge>
              <span className="text-white/60 text-sm">
                {formatBytes(file.size)}
              </span>
              <span className="text-white/60 text-sm">
                {file.lastModified.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* File Info */}
      <div className="p-4 border-b border-white/10 bg-slate-800/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-white/60">Type:</span>
            <span className="text-white ml-2">{FILE_TYPE_NAMES[fileType as keyof typeof FILE_TYPE_NAMES] || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-white/60">Size:</span>
            <span className="text-white ml-2">{formatBytes(file.size)}</span>
          </div>
          <div>
            <span className="text-white/60">Lines:</span>
            <span className="text-white ml-2">{content.split('\n').length}</span>
          </div>
          <div>
            <span className="text-white/60">Characters:</span>
            <span className="text-white ml-2">{content.length}</span>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* File Name */}
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-medium mb-2">File Name</label>
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              disabled={readOnly}
              className="bg-slate-800 border-white/20 text-white"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <label className="block text-white/80 text-sm font-medium mb-2">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={readOnly}
              className="h-full min-h-[300px] bg-slate-800 border-white/20 text-white font-mono resize-none"
              placeholder="Enter file content..."
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      {!readOnly && (
        <div className="p-4 border-t border-white/10 bg-slate-800 flex justify-end gap-3">

          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save File
          </Button>
        </div>
      )}
    </div>
  )
}
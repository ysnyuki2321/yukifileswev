"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Download, Eye, Edit3, Share2, Star, Copy, Trash2, 
  MoreHorizontal, Lock, Unlock, Archive, FileText,
  FileImage, FileVideo, FileAudio, FileCode, Database,
  Folder, Link, RefreshCw, RotateCcw, Settings
} from 'lucide-react'

interface FileContextMenuProps {
  file: {
    id: string
    name: string
    mime_type: string
    is_starred: boolean
    is_public: boolean
    isFolder?: boolean
  }
  onOpen: () => void
  onEdit: () => void
  onDownload: () => void
  onShare: () => void
  onStar: () => void
  onCopy: () => void
  onDelete: () => void
  onArchive: () => void
  onToggleVisibility: () => void
  onRename: () => void
  onMove: () => void
  onCopyLink: () => void
  onRefresh: () => void
  onProperties: () => void
  position: { x: number; y: number }
  onClose: () => void
}

export function FileContextMenu({
  file,
  onOpen,
  onEdit,
  onDownload,
  onShare,
  onStar,
  onCopy,
  onDelete,
  onArchive,
  onToggleVisibility,
  onRename,
  onMove,
  onCopyLink,
  onRefresh,
  onProperties,
  position,
  onClose
}: FileContextMenuProps) {
  const getFileIcon = () => {
    if (file.isFolder) return <Folder className="w-4 h-4" />
    
    const mimeType = file.mime_type.toLowerCase()
    if (mimeType.includes('image')) return <FileImage className="w-4 h-4" />
    if (mimeType.includes('video')) return <FileVideo className="w-4 h-4" />
    if (mimeType.includes('audio')) return <FileAudio className="w-4 h-4" />
    if (mimeType.includes('text') || mimeType.includes('code')) return <FileCode className="w-4 h-4" />
    if (mimeType.includes('database')) return <Database className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const getFileCategory = () => {
    if (file.isFolder) return 'folder'
    
    const mimeType = file.mime_type.toLowerCase()
    if (mimeType.includes('image')) return 'image'
    if (mimeType.includes('video')) return 'video'
    if (mimeType.includes('audio')) return 'audio'
    if (mimeType.includes('text') || mimeType.includes('code')) return 'code'
    if (mimeType.includes('database')) return 'database'
    return 'document'
  }

  const canEdit = () => {
    const category = getFileCategory()
    return ['code', 'document', 'text'].includes(category)
  }

  const canPreview = () => {
    const category = getFileCategory()
    return ['image', 'video', 'audio', 'code', 'document'].includes(category)
  }

  return (
    <div 
      className="fixed z-50 bg-slate-800 border border-purple-500/30 rounded-lg shadow-2xl backdrop-blur-sm min-w-[200px]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {/* Header */}
      <div className="p-3 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm truncate">{file.name}</div>
            <div className="text-gray-400 text-xs capitalize">{getFileCategory()}</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2 space-y-1">
        {/* Primary Actions */}
        <Button
          onClick={onOpen}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <Eye className="w-4 h-4 mr-2" />
          Open
        </Button>

        {canEdit() && (
          <Button
            onClick={onEdit}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}

        {!file.isFolder && (
          <Button
            onClick={onDownload}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}

        {/* Share & Visibility */}
        <Button
          onClick={onShare}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>

        <Button
          onClick={onToggleVisibility}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          {file.is_public ? (
            <>
              <Unlock className="w-4 h-4 mr-2" />
              Make Private
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Make Public
            </>
          )}
        </Button>

        <Button
          onClick={onCopyLink}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <Link className="w-4 h-4 mr-2" />
          Copy Link
        </Button>

        {/* File Management */}
        <Button
          onClick={onStar}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <Star className={`w-4 h-4 mr-2 ${file.is_starred ? 'text-yellow-400 fill-current' : ''}`} />
          {file.is_starred ? 'Unstar' : 'Star'}
        </Button>

        <Button
          onClick={onCopy}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>

        <Button
          onClick={onRename}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <FileText className="w-4 h-4 mr-2" />
          Rename
        </Button>

        <Button
          onClick={onMove}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <Folder className="w-4 h-4 mr-2" />
          Move to...
        </Button>

        <Button
          onClick={onArchive}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <Archive className="w-4 h-4 mr-2" />
          Archive
        </Button>

        <Button
          onClick={onRefresh}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>

        <Button
          onClick={onProperties}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-purple-500/20 h-9 px-3"
        >
          <Settings className="w-4 h-4 mr-2" />
          Properties
        </Button>

        {/* Danger Zone */}
        <div className="border-t border-red-500/20 pt-2 mt-2">
          <Button
            onClick={onDelete}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-400 hover:bg-red-500/20 h-9 px-3"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Share2, Edit3, Trash2, Download, Copy, Eye, 
  Star, StarOff, Lock, Unlock, MoreVertical,
  FolderOpen, Link, Archive, CheckCircle, Package
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileContextMenuProps {
  file: any
  position: { x: number; y: number } | null
  onClose: () => void
  onShare?: (file: any) => void
  onRename?: (file: any) => void
  onDelete?: (file: any) => void
  onDownload?: (file: any) => void
  onCopy?: (file: any) => void
  onView?: (file: any) => void
  onToggleStar?: (file: any) => void
  onTogglePrivacy?: (file: any) => void
  onMoveToFolder?: (file: any) => void
  onArchive?: (file: any) => void
  onUnarchive?: (file: any) => void
  onSelect?: (file: any) => void
}

export function FileContextMenu({
  file,
  position,
  onClose,
  onShare,
  onRename,
  onDelete,
  onDownload,
  onCopy,
  onView,
  onToggleStar,
  onTogglePrivacy,
  onMoveToFolder,
  onArchive,
  onUnarchive,
  onSelect
}: FileContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (position) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [position, onClose])

  if (!position || !file) return null

  const menuItems = [
    {
      icon: Eye,
      label: "View",
      action: () => onView?.(file),
      color: "text-blue-400",
      shortcut: "Space"
    },
    {
      icon: CheckCircle,
      label: "Select",
      action: () => onSelect?.(file),
      color: "text-purple-400",
      shortcut: "Ctrl+A"
    },
    {
      icon: Share2,
      label: "Share",
      action: () => onShare?.(file),
      color: "text-green-400",
      shortcut: "Ctrl+S"
    },
    {
      icon: Download,
      label: "Download",
      action: () => onDownload?.(file),
      color: "text-purple-400",
      shortcut: "Ctrl+D"
    },
    {
      icon: Copy,
      label: "Copy Link",
      action: () => onCopy?.(file),
      color: "text-cyan-400",
      shortcut: "Ctrl+C"
    },
    { type: 'separator' },
    {
      icon: Edit3,
      label: "Rename",
      action: () => onRename?.(file),
      color: "text-yellow-400",
      shortcut: "F2"
    },
    {
      icon: file?.isStarred ? StarOff : Star,
      label: file?.isStarred ? "Unstar" : "Star",
      action: () => onToggleStar?.(file),
      color: file?.isStarred ? "text-gray-400" : "text-yellow-400",
      shortcut: "S"
    },
    {
      icon: file?.isShared ? Lock : Unlock,
      label: file?.isShared ? "Make Private" : "Make Public",
      action: () => onTogglePrivacy?.(file),
      color: file?.isShared ? "text-red-400" : "text-green-400",
      shortcut: "P"
    },
    { type: 'separator' },
    {
      icon: FolderOpen,
      label: "Move to Folder",
      action: () => onMoveToFolder?.(file),
      color: "text-orange-400",
      shortcut: "M"
    },
    {
      icon: Archive,
      label: "Archive",
      action: () => onArchive?.(file),
      color: "text-gray-400",
      shortcut: "A"
    },
    // Show unarchive for archive files
    ...(file?.name?.match(/\.(zip|tar\.gz|7z|rar)$/i) ? [{
      icon: Package,
      label: "Extract Archive",
      action: () => onUnarchive?.(file),
      color: "text-cyan-400",
      shortcut: "Ctrl+E"
    }] : []),
    { type: 'separator' },
    {
      icon: Trash2,
      label: "Delete",
      action: () => onDelete?.(file),
      color: "text-red-400",
      shortcut: "Del",
      dangerous: true
    }
  ]

  // Adjust position to keep menu in viewport
  const adjustedPosition = { ...position }
  if (menuRef.current) {
    const menuRect = menuRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    if (position.x + 250 > viewportWidth) {
      adjustedPosition.x = viewportWidth - 250 - 10
    }
    
    if (position.y + 400 > viewportHeight) {
      adjustedPosition.y = viewportHeight - 400 - 10
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed z-50 bg-black/90 backdrop-blur-lg border border-purple-500/30 rounded-lg shadow-2xl min-w-[240px] max-h-[80vh] overflow-y-auto overscroll-contain context-menu-scroll"
        style={{
          left: adjustedPosition.x,
          top: adjustedPosition.y,
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-lg">
                {file.type?.includes('image') ? '🖼️' : 
                 file.type?.includes('video') ? '🎥' : 
                 file.type?.includes('audio') ? '🎵' : '📄'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{file.name}</p>
              <p className="text-gray-400 text-xs">
                {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => {
            if (item.type === 'separator') {
              return (
                <div key={index} className="h-px bg-purple-500/20 mx-2 my-2" />
              )
            }

            const Icon = item.icon
            return (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation()
                  item.action?.()
                  onClose()
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors",
                  "hover:bg-purple-500/10 focus:bg-purple-500/10 focus:outline-none",
                  item.dangerous ? "hover:bg-red-500/10 focus:bg-red-500/10" : ""
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={cn("w-4 h-4", item.color)} />
                  <span className={cn(
                    "font-medium",
                    item.dangerous ? "text-red-400" : "text-white"
                  )}>
                    {item.label}
                  </span>
                </div>
                {item.shortcut && (
                  <span className="text-xs text-gray-500 font-mono">
                    {item.shortcut}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-purple-500/20 bg-purple-900/10">
          <p className="text-xs text-gray-500 text-center">
            Right-click or long-press for quick access
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
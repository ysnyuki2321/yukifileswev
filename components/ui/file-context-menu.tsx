import React from "react"
import { 
  Download, 
  Share2, 
  Edit, 
  Trash2, 
  Star, 
  Copy, 
  Eye,
  MoreHorizontal
} from "lucide-react"
import { Button } from "./button"

interface FileContextMenuProps {
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
  fileName: string
  onDownload?: () => void
  onShare?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onStar?: () => void
  onCopy?: () => void
  onPreview?: () => void
  className?: string
}

export function FileContextMenu({
  isOpen,
  onClose,
  position,
  fileName,
  onDownload,
  onShare,
  onEdit,
  onDelete,
  onStar,
  onCopy,
  onPreview,
  className = ""
}: FileContextMenuProps) {
  if (!isOpen) return null

  const menuItems = [
    { icon: Eye, label: "Preview", onClick: onPreview },
    { icon: Download, label: "Download", onClick: onDownload },
    { icon: Share2, label: "Share", onClick: onShare },
    { icon: Edit, label: "Rename", onClick: onEdit },
    { icon: Copy, label: "Copy Link", onClick: onCopy },
    { icon: Star, label: "Star", onClick: onStar },
    { icon: Trash2, label: "Delete", onClick: onDelete, danger: true }
  ].filter(item => item.onClick)

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div
        className={`fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] ${className}`}
        style={{
          left: position.x,
          top: position.y
        }}
      >
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
        </div>
        
        <div className="py-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.()
                onClose()
              }}
              className={`w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
              }`}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
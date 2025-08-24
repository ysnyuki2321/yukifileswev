import React from "react"
import { FileText, Image, Video, Music, Archive } from "lucide-react"

interface MediaPreviewProps {
  file: {
    name: string
    type: string
    size?: number
    url?: string
  }
  className?: string
}

export function MediaPreview({ file, className = "" }: MediaPreviewProps) {
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-8 h-8" />
    if (type.startsWith("video/")) return <Video className="w-8 h-8" />
    if (type.startsWith("audio/")) return <Music className="w-8 h-8" />
    if (type.includes("zip") || type.includes("rar")) return <Archive className="w-8 h-8" />
    return <FileText className="w-8 h-8" />
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className={`flex items-center space-x-3 p-4 border rounded-lg ${className}`}>
      <div className="flex-shrink-0 text-gray-500">
        {getFileIcon(file.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-sm text-gray-500">
          {file.type} • {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  )
}
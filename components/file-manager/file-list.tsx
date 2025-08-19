"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { File, ImageIcon, Video, Music, Download, Share2, Trash2, MoreVertical, Copy, Eye } from "lucide-react"
import { formatBytes, formatDate } from "@/lib/utils"

interface FileItem {
  id: string
  original_name: string
  file_size: number
  mime_type: string
  share_token: string
  download_count: number
  created_at: string
  is_public: boolean
}

interface FileListProps {
  files: FileItem[]
  onDelete: (fileId: string) => void
  onShare: (shareToken: string) => void
}

export default function FileList({ files, onDelete, onShare }: FileListProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-blue-400" />
    if (mimeType.startsWith("video/")) return <Video className="w-5 h-5 text-red-400" />
    if (mimeType.startsWith("audio/")) return <Music className="w-5 h-5 text-green-400" />
    return <File className="w-5 h-5 text-gray-400" />
  }

  const copyShareLink = async (shareToken: string) => {
    const shareUrl = `${window.location.origin}/share/${shareToken}`
    await navigator.clipboard.writeText(shareUrl)
    setCopiedToken(shareToken)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const downloadFile = (shareToken: string, filename: string) => {
    const downloadUrl = `/api/files/download/${shareToken}`
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (files.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
        <CardContent className="p-8 text-center">
          <File className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold text-white mb-2">No files yet</h3>
          <p className="text-gray-400">Upload your first file to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Your Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file.mime_type)}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{file.original_name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-400">{formatBytes(file.file_size)}</span>
                    <span className="text-sm text-gray-400">{formatDate(file.created_at)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {file.download_count} downloads
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadFile(file.share_token, file.original_name)}
                  className="text-gray-400 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyShareLink(file.share_token)}
                  className="text-gray-400 hover:text-white"
                >
                  {copiedToken === file.share_token ? (
                    <span className="text-green-400 text-xs">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 border-gray-700">
                    <DropdownMenuItem
                      onClick={() => copyShareLink(file.share_token)}
                      className="text-gray-300 hover:text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => window.open(`/share/${file.share_token}`, "_blank")}
                      className="text-gray-300 hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(file.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

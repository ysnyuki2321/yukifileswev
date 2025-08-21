"use client"

import { useCallback, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatBytes } from "@/lib/utils"
import { Copy, Link as LinkIcon, ExternalLink, FileText, Eye, Edit3, FileCode, FileImage, Music, Video, FileArchive, Database } from "lucide-react"
import Link from "next/link"
import { FileEditor } from "@/components/file-editor/file-editor"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LucideIcon } from "lucide-react"

export interface RecentFileItem {
  id: string
  original_name: string
  file_size: number
  share_token: string
  created_at: string
  content?: string
  type?: string
  mimeType?: string
}

// File type icons
const fileTypeIcons: { [key: string]: LucideIcon } = {
  'javascript': FileCode,
  'typescript': FileCode,
  'python': FileCode,
  'js': FileCode,
  'ts': FileCode,
  'jsx': FileCode,
  'tsx': FileCode,
  'py': FileCode,
  'java': FileCode,
  'cpp': FileCode,
  'c': FileCode,
  'php': FileCode,
  'rb': FileCode,
  'go': FileCode,
  'rs': FileCode,
  'html': FileCode,
  'css': FileCode,
  'scss': FileCode,
  'sass': FileCode,
  'json': FileText,
  'xml': FileText,
  'yaml': FileText,
  'yml': FileText,
  'md': FileText,
  'txt': FileText,
  'csv': FileText,
  'sql': Database,
  'jpg': FileImage,
  'jpeg': FileImage,
  'png': FileImage,
  'gif': FileImage,
  'svg': FileImage,
  'webp': FileImage,
  'mp3': Music,
  'wav': Music,
  'flac': Music,
  'mp4': Video,
  'avi': Video,
  'mov': Video,
  'zip': FileArchive,
  'rar': FileArchive,
  'tar': FileArchive,
  'default': FileText
}

const getFileIcon = (filename: string | undefined): LucideIcon => {
  if (!filename || typeof filename !== 'string') return fileTypeIcons['default']
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return fileTypeIcons[ext] || fileTypeIcons['default']
}

const isTextFile = (filename: string | undefined): boolean => {
  if (!filename || typeof filename !== 'string') return false
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const textExtensions = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'html', 'css', 'scss', 'sass', 'json', 'xml', 'yaml', 'yml', 'md', 'txt', 'csv', 'sql']
  return textExtensions.includes(ext)
}

export default function RecentFiles({ files }: { files: RecentFileItem[] }) {
  const [selectedFile, setSelectedFile] = useState<RecentFileItem | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  const copyShareLink = useCallback((token: string) => {
    const url = `${window.location.origin}/share/${token}`
    navigator.clipboard.writeText(url)
  }, [])

  const openFile = useCallback((file: RecentFileItem) => {
    if (isTextFile(file.original_name) && file.content) {
      setSelectedFile(file)
      setShowEditor(true)
    }
  }, [])

  const closeEditor = useCallback(() => {
    setShowEditor(false)
    setSelectedFile(null)
  }, [])

  return (
    <Card className="bg-black/40 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Recent Files</CardTitle>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No files yet</p>
            <p className="text-sm">Upload your first file to generate a share link.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.original_name)
              const canEdit = isTextFile(file.original_name) && file.content
              
              return (
                <li key={file.id} className="py-3 flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <FileIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white truncate">{file.original_name}</p>
                      <p className="text-xs text-gray-500">
                        {formatBytes(file.file_size)} · {new Date(file.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-300 hover:text-white"
                        onClick={() => openFile(file)}
                        title="Edit file"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-white"
                      onClick={() => copyShareLink(file.share_token)}
                      title="Copy share link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Link href={`/share/${file.share_token}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>

      {/* File Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-6xl h-[80vh] p-0 bg-slate-900 border-white/10">
          {selectedFile && (
            <FileEditor
              file={{
                id: selectedFile.id,
                name: selectedFile.original_name,
                content: selectedFile.content || '',
                type: selectedFile.type || 'text',
                size: selectedFile.file_size,
                lastModified: new Date(selectedFile.created_at)
              }}
              onClose={closeEditor}
              readOnly={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, FileCode, Save, X, AlertCircle, CheckCircle,
  Type, Code, File, Folder
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  content: string
  type: string
  size: number
  lastModified: Date
}

interface FileEditorProps {
  file: FileItem
  onSave: (file: FileItem, newContent: string, newName?: string, newType?: string) => void
  onClose: () => void
}

export function FileEditor({ file, onSave, onClose }: FileEditorProps) {
  const [fileName, setFileName] = useState(file.name || 'untitled.txt')
  const [content, setContent] = useState(file.content || '')
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    setFileName(file.name || 'untitled.txt')
    setContent(file.content || '')
    setIsModified(false)
  }, [file])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setIsModified(true)
  }

  const handleFileNameChange = (newName: string) => {
    setFileName(newName)
    setIsModified(true)
  }

  const handleSave = () => {
    onSave(file, content, fileName)
    setIsModified(false)
  }

  const getFileIcon = () => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const codeExtensions = ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'html', 'css', 'json', 'xml', 'yaml', 'sql', 'md']
    
    if (codeExtensions.includes(extension || '')) {
      return <FileCode className="w-5 h-5 text-purple-400" />
    }
    return <FileText className="w-5 h-5 text-blue-400" />
  }

  const getLanguage = () => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'sql': 'sql',
      'md': 'markdown'
    }
    return langMap[extension || ''] || 'text'
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-900 border-purple-500/20">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getFileIcon()}
              <DialogTitle className="text-white">
                Edit File
              </DialogTitle>
              {isModified && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  Modified
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSave}
                disabled={!isModified}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">File Name</label>
            <Input
              value={fileName}
              onChange={(e) => handleFileNameChange(e.target.value)}
              className="bg-slate-800 border-purple-500/20 text-white"
              placeholder="Enter file name..."
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Content</label>
              <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                {getLanguage()}
              </Badge>
            </div>
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-[400px] bg-slate-800 border-purple-500/20 text-white font-mono text-sm resize-none"
              placeholder="Enter file content..."
            />
          </div>

          {/* File Info */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Size: {content.length} characters</span>
              <span>Lines: {content.split('\n').length}</span>
            </div>
            <div>
              Last modified: {file.lastModified.toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
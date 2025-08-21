"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Search, Grid, List, MoreHorizontal, Plus, FolderPlus, FilePlus, Upload,
  FileText, FileCode, FileImage, Music, Video, FileArchive, Database,
  Eye, Download, Share2, Edit3, Trash2, Copy, Check, Star, StarOff,
  Folder, FolderOpen, X, AlertCircle, CheckCircle, Settings, User, Bell,
  CreditCard, Key, Shield, Globe, Palette, Zap, BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface DemoFile {
  id: string
  name: string
  type: 'file' | 'folder'
  size: number
  lastModified: Date
  content?: string
  mimeType?: string
  path: string
  isStarred?: boolean
  isPublic?: boolean
}

interface DemoSettings {
  notifications: {
    email: boolean
    push: boolean
    security: boolean
  }
  privacy: {
    publicProfile: boolean
    showEmail: boolean
    allowSharing: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    compactMode: boolean
    showAnimations: boolean
  }
  api: {
    enabled: boolean
    rateLimit: number
    webhooks: boolean
  }
  billing: {
    plan: 'free' | 'pro' | 'developer' | 'team' | 'enterprise'
    autoRenew: boolean
    usageAlerts: boolean
  }
}

// Enhanced demo files with more realistic content
const initialDemoFiles: DemoFile[] = [
  {
    id: '1',
    name: 'Projects',
    type: 'folder',
    size: 0,
    lastModified: new Date('2024-01-15'),
    path: '/',
    isStarred: true
  },
  // ... existing code ...
]

const initialSettings: DemoSettings = {
  notifications: {
    email: true,
    push: false,
    security: true
  },
  privacy: {
    publicProfile: false,
    showEmail: true,
    allowSharing: true
  },
  appearance: {
    theme: 'dark',
    compactMode: false,
    showAnimations: true
  },
  api: {
    enabled: false,
    rateLimit: 1000,
    webhooks: false
  },
  billing: {
    plan: 'pro',
    autoRenew: true,
    usageAlerts: true
  }
}

export function DemoFileManager() {
  const [files, setFiles] = useState<DemoFile[]>(initialDemoFiles)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<DemoSettings>(initialSettings)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFileIcon = (file: DemoFile) => {
    if (file.type === 'folder') return Folder
    if (file.mimeType?.includes('image')) return FileImage
    if (file.mimeType?.includes('video')) return Video
    if (file.mimeType?.includes('audio')) return Music
    if (file.mimeType?.includes('pdf')) return FileText
    if (file.mimeType?.includes('javascript') || file.mimeType?.includes('typescript')) return FileCode
    if (file.mimeType?.includes('zip') || file.mimeType?.includes('rar')) return FileArchive
    return FileText
  }

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, fileId: id })
  }

  const handleFileAction = (action: string, id: string) => {
    if (action === 'open') {
      // For demo, just select; in real app, navigate/open viewer
      setSelectedFiles([id])
      return
    }
    if (action === 'delete') {
      setFiles(prev => prev.filter(f => f.id !== id))
      return
    }
    if (action === 'star') {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, isStarred: !f.isStarred } : f))
      return
    }
  }

  const onCreateFolder = () => {
    const newFolder: DemoFile = {
      id: String(Date.now()),
      name: 'New Folder',
      type: 'folder',
      size: 0,
      lastModified: new Date(),
      path: '/',
      isStarred: false,
      isPublic: false
    }
    setFiles(prev => [newFolder, ...prev])
  }

  return (
    <div className="space-y-6" data-section="files">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">File Manager</h2>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            Demo Mode
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateFolder}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <input ref={fileInputRef} type="file" multiple className="hidden" />
          <div className="ml-2 flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-purple-500' : 'border-gray-600 text-gray-300'}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-purple-500' : 'border-gray-600 text-gray-300'}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Grid/List */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file)
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative"
                  >
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:bg-gray-800/50 select-none",
                        selectedFiles.includes(file.id) && "ring-2 ring-purple-500 bg-gray-800/50"
                      )}
                      onContextMenu={(e) => handleContextMenu(e, file.id)}
                      onDoubleClick={() => handleFileAction('open', file.id)}
                      onClick={() => setSelectedFiles(prev => 
                        prev.includes(file.id) 
                          ? prev.filter(id => id !== file.id)
                          : [...prev, file.id]
                      )}
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start justify-between mb-2 md:mb-3">
                          <Icon className="w-10 h-10 text-purple-400" />
                          <div className="flex items-center gap-1">
                            {file.isStarred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleFileAction('star', file.id)}>
                                  {file.isStarred ? <StarOff className="w-4 h-4 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                                  {file.isStarred ? 'Unstar' : 'Star'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFileAction('share', file.id)}>
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFileAction('download', file.id)}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFileAction('delete', file.id)} className="text-red-400">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="mt-1">
                          <h3 className="text-white text-sm md:text-base font-medium truncate">{file.name}</h3>
                          <p className="text-[10px] md:text-xs text-gray-400">{file.size} bytes</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file)
                return (
                  <motion.div key={file.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div
                      className={cn(
                        "grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50",
                        selectedFiles.includes(file.id) && "ring-2 ring-purple-500 bg-gray-800/50"
                      )}
                      onContextMenu={(e) => handleContextMenu(e, file.id)}
                      onDoubleClick={() => handleFileAction('open', file.id)}
                      onClick={() => setSelectedFiles(prev => 
                        prev.includes(file.id) 
                          ? prev.filter(id => id !== file.id)
                          : [...prev, file.id]
                      )}
                    >
                      <Icon className="w-5 h-5 text-purple-400" />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-400 truncate">{file.size} bytes</p>
                      </div>
                      <div className="text-xs text-gray-400">{file.lastModified.toLocaleDateString()}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Dialog ... rest unchanged */}
      {/* ... existing code ... */}
    </div>
  )
}
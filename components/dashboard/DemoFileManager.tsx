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
  {
    id: '2',
    name: 'app.js',
    type: 'file',
    size: 3456,
    lastModified: new Date('2024-01-14'),
    path: '/',
    mimeType: 'application/javascript',
    content: `// YukiFiles Demo Application
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ success: true, file: req.file });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    isStarred: false,
    isPublic: true
  },
  {
    id: '3',
    name: 'presentation.pptx',
    type: 'file',
    size: 2048576,
    lastModified: new Date('2024-01-13'),
    path: '/',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    isStarred: true,
    isPublic: false
  },
  {
    id: '4',
    name: 'logo.png',
    type: 'file',
    size: 153600,
    lastModified: new Date('2024-01-12'),
    path: '/',
    mimeType: 'image/png',
    isStarred: false,
    isPublic: true
  },
  {
    id: '5',
    name: 'document.pdf',
    type: 'file',
    size: 512000,
    lastModified: new Date('2024-01-11'),
    path: '/',
    mimeType: 'application/pdf',
    isStarred: false,
    isPublic: false
  }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleFileUpload = async () => {
    setUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }
    
    // Add new demo file
    const newFile: DemoFile = {
      id: Date.now().toString(),
      name: 'demo-upload.txt',
      type: 'file',
      size: 1024,
      lastModified: new Date(),
      path: '/',
      mimeType: 'text/plain',
      content: 'This is a demo upload file created to showcase the upload functionality.',
      isStarred: false,
      isPublic: false
    }
    
    setFiles(prev => [newFile, ...prev])
    setUploading(false)
    setUploadProgress(0)
    setShowUploadDialog(false)
  }

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, fileId })
  }

  const handleFileAction = (action: string, fileId: string) => {
    setContextMenu(null)
    
    switch (action) {
      case 'star':
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, isStarred: !f.isStarred } : f
        ))
        break
      case 'share':
        // Demo share action
        break
      case 'download':
        // Demo download action
        break
      case 'delete':
        setFiles(prev => prev.filter(f => f.id !== fileId))
        break
    }
  }

  const handleCreateFile = () => {
    const newFile: DemoFile = {
      id: Date.now().toString(),
      name: 'new-file.txt',
      type: 'file',
      size: 0,
      lastModified: new Date(),
      path: '/',
      mimeType: 'text/plain',
      content: 'This is a new demo file.',
      isStarred: false,
      isPublic: false
    }
    setFiles(prev => [newFile, ...prev])
  }

  return (
    <div className="space-y-6">
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
            onClick={handleCreateFile}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <FilePlus className="w-4 h-4 mr-2" />
            New File
          </Button>
          
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Demo
          </Button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-2">
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

      {/* File Grid/List */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                        "cursor-pointer transition-all duration-200 hover:bg-gray-800/50",
                        selectedFiles.includes(file.id) && "ring-2 ring-purple-500 bg-gray-800/50"
                      )}
                      onContextMenu={(e) => handleContextMenu(e, file.id)}
                      onClick={() => setSelectedFiles(prev => 
                        prev.includes(file.id) 
                          ? prev.filter(id => id !== file.id)
                          : [...prev, file.id]
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Icon className="w-8 h-8 text-purple-400" />
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
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleFileAction('delete', file.id)} className="text-red-400">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="font-medium text-white truncate">{file.name}</p>
                          <p className="text-sm text-gray-400">
                            {file.type === 'folder' ? 'Folder' : formatFileSize(file.size)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.lastModified.toLocaleDateString()}
                          </p>
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
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group"
                  >
                    <Card
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:bg-gray-800/50",
                        selectedFiles.includes(file.id) && "ring-2 ring-purple-500 bg-gray-800/50"
                      )}
                      onContextMenu={(e) => handleContextMenu(e, file.id)}
                      onClick={() => setSelectedFiles(prev => 
                        prev.includes(file.id) 
                          ? prev.filter(id => id !== file.id)
                          : [...prev, file.id]
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Icon className="w-6 h-6 text-purple-400" />
                            <div>
                              <p className="font-medium text-white">{file.name}</p>
                              <p className="text-sm text-gray-400">
                                {file.type === 'folder' ? 'Folder' : formatFileSize(file.size)} • {file.lastModified.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
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
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleFileAction('delete', file.id)} className="text-red-400">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Demo File</DialogTitle>
            <DialogDescription className="text-gray-400">
              This is a demo upload to showcase the upload functionality and animations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">Demo files up to 50MB</p>
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uploading...</span>
                  <span className="text-gray-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button 
              onClick={handleFileUpload}
              disabled={uploading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {uploading ? 'Uploading...' : 'Upload Demo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Demo Settings</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure your demo account settings and preferences.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800">
              <TabsTrigger value="account" className="data-[state=active]:bg-purple-500">Account</TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500">Notifications</TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-purple-500">Privacy</TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-purple-500">API</TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-purple-500">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input value="demo@yukifiles.com" disabled className="bg-gray-800 border-gray-600 text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-white">Display Name</Label>
                    <Input value="Demo User" className="bg-gray-800 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-white">Theme</Label>
                    <Select value={settings.appearance.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => 
                      setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, theme: value } }))
                    }>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Compact Mode</Label>
                      <p className="text-sm text-gray-400">Reduce spacing for more content</p>
                    </div>
                    <Switch 
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, compactMode: checked } }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Show Animations</Label>
                      <p className="text-sm text-gray-400">Enable smooth transitions</p>
                    </div>
                    <Switch 
                      checked={settings.appearance.showAnimations}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, showAnimations: checked } }))
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-gray-400">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, email: checked } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Push Notifications</Label>
                    <p className="text-sm text-gray-400">Browser push notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, push: checked } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Security Alerts</Label>
                    <p className="text-sm text-gray-400">Important security notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.security}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, security: checked } }))
                    }
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Public Profile</Label>
                    <p className="text-sm text-gray-400">Allow others to see your profile</p>
                  </div>
                  <Switch 
                    checked={settings.privacy.publicProfile}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, privacy: { ...prev.privacy, publicProfile: checked } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Show Email</Label>
                    <p className="text-sm text-gray-400">Display email in profile</p>
                  </div>
                  <Switch 
                    checked={settings.privacy.showEmail}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, privacy: { ...prev.privacy, showEmail: checked } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Allow File Sharing</Label>
                    <p className="text-sm text-gray-400">Let others share your files</p>
                  </div>
                  <Switch 
                    checked={settings.privacy.allowSharing}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, privacy: { ...prev.privacy, allowSharing: checked } }))
                    }
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">API Access</Label>
                    <p className="text-sm text-gray-400">Enable API for integrations</p>
                  </div>
                  <Switch 
                    checked={settings.api.enabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, api: { ...prev.api, enabled: checked } }))
                    }
                  />
                </div>
                {settings.api.enabled && (
                  <>
                    <div>
                      <Label className="text-white">Rate Limit (requests/hour)</Label>
                      <Input 
                        type="number" 
                        value={settings.api.rateLimit}
                        onChange={(e) => 
                          setSettings(prev => ({ ...prev, api: { ...prev.api, rateLimit: parseInt(e.target.value) } }))
                        }
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Webhooks</Label>
                        <p className="text-sm text-gray-400">Enable webhook notifications</p>
                      </div>
                      <Switch 
                        checked={settings.api.webhooks}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, api: { ...prev.api, webhooks: checked } }))
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Current Plan</Label>
                  <Select value={settings.billing.plan} onValueChange={(value: 'free' | 'pro' | 'developer' | 'team' | 'enterprise') => 
                    setSettings(prev => ({ ...prev, billing: { ...prev.billing, plan: value } }))
                  }>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free (2GB)</SelectItem>
                      <SelectItem value="pro">Pro (50GB) - $9.99/month</SelectItem>
                      <SelectItem value="developer">Developer (200GB) - $19.99/month</SelectItem>
                      <SelectItem value="team">Team (1TB) - $39.99/month</SelectItem>
                      <SelectItem value="enterprise">Enterprise (Unlimited)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Auto Renew</Label>
                    <p className="text-sm text-gray-400">Automatically renew subscription</p>
                  </div>
                  <Switch 
                    checked={settings.billing.autoRenew}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, billing: { ...prev.billing, autoRenew: checked } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Usage Alerts</Label>
                    <p className="text-sm text-gray-400">Notify when approaching limits</p>
                  </div>
                  <Switch 
                    checked={settings.billing.usageAlerts}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, billing: { ...prev.billing, usageAlerts: checked } }))
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button 
              onClick={() => setShowSettings(false)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-2 min-w-[200px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={() => setContextMenu(null)}
        >
          <DropdownMenuItem onClick={() => handleFileAction('star', contextMenu.fileId)}>
            <Star className="w-4 h-4 mr-2" />
            Star File
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileAction('share', contextMenu.fileId)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileAction('download', contextMenu.fileId)}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleFileAction('delete', contextMenu.fileId)} className="text-red-400">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </div>
      )}
    </div>
  )
}
"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Search, Grid, List, MoreHorizontal, Plus, FolderPlus, FilePlus, Upload,
  FileText, FileCode, FileImage, Music, Video, FileArchive, Database,
  Eye, Download, Share2, Edit3, Trash2, Copy, Check, Star, StarOff,
  Folder, FolderOpen, X, AlertCircle, CheckCircle, Settings, User, Bell,
  CreditCard, Key, Shield, Globe, Palette, Zap, BarChart3, Activity,
  Lock, Unlock, Calendar, Users, Crown, Sparkles, Globe2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { FileEditor } from "@/components/file-editor/FileEditor"
import { PlanSwitcher } from "@/components/plan-switcher/PlanSwitcher"
import { FilePreview } from "@/components/file-preview/FilePreview"

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
  shareToken?: string
  downloadCount?: number
  viewCount?: number
}

interface PricingPlan {
  id: string
  name: string
  price: string
  storage: string
  features: string[]
  popular?: boolean
  icon: any
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    storage: '2GB',
    features: ['Basic file sharing', 'Email support', 'Standard security'],
    icon: FileText
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99/month',
    storage: '50GB',
    features: ['Advanced sharing', 'Priority support', 'Enhanced security', 'Analytics'],
    popular: true,
    icon: Zap
  },
  {
    id: 'developer',
    name: 'Developer',
    price: '$19.99/month',
    storage: '200GB',
    features: ['API access', 'Webhooks', 'Advanced analytics', 'Custom branding'],
    icon: FileCode
  },
  {
    id: 'team',
    name: 'Team',
    price: '$39.99/month',
    storage: '1TB',
    features: ['Team management', 'Collaboration tools', 'Advanced permissions', 'SSO'],
    icon: Users
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    storage: 'Unlimited',
    features: ['Custom solutions', 'Dedicated support', 'On-premise option', 'SLA guarantee'],
    icon: Crown
  }
]

export function EnhancedDemoManager() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showPricingDialog, setShowPricingDialog] = useState(false)
  const [showFileEditor, setShowFileEditor] = useState(false)
  const [showPlanSwitcher, setShowPlanSwitcher] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('free')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [previewFile, setPreviewFile] = useState<DemoFile | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [demoFiles, setDemoFiles] = useState<DemoFile[]>([
    {
      id: '1',
      name: 'presentation.pptx',
      type: 'file',
      size: 2200000,
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2),
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      path: '/',
      isStarred: true,
      isPublic: true,
      shareToken: 'abc123',
      downloadCount: 15,
      viewCount: 45
    },
    {
      id: '2',
      name: 'document.pdf',
      type: 'file',
      size: 450000,
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 4),
      mimeType: 'application/pdf',
      path: '/',
      isStarred: false,
      isPublic: false,
      downloadCount: 8,
      viewCount: 23
    },
    {
      id: '3',
      name: 'image.jpg',
      type: 'file',
      size: 1800000,
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 6),
      mimeType: 'image/jpeg',
      path: '/',
      isStarred: true,
      isPublic: true,
      shareToken: 'def456',
      downloadCount: 23,
      viewCount: 67
    },
    {
      id: '4',
      name: 'video.mp4',
      type: 'file',
      size: 15200000,
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 8),
      mimeType: 'video/mp4',
      path: '/',
      isStarred: false,
      isPublic: false,
      downloadCount: 5,
      viewCount: 12
    },
    // Sample code/text files for syntax demo
    {
      id: '5',
      name: 'hello-world.js',
      type: 'file',
      content: `function greet(name) {\n  const message = ` + "`Hello, ${name}!`" + `\n  console.log(message)\n  return message\n}\n\nexport default greet\n\n// Try: greet('YukiFiles')`,
      size: new Blob([`function greet(name) {\n  const message = ` + "`Hello, ${name}!`" + `\n  console.log(message)\n  return message\n}\n\nexport default greet\n\n// Try: greet('YukiFiles')`]).size,
      lastModified: new Date(),
      mimeType: 'text/javascript',
      path: '/',
      isStarred: false,
      isPublic: false,
      downloadCount: 0,
      viewCount: 0
    },
    {
      id: '6',
      name: 'App.tsx',
      type: 'file',
      content: `import React from 'react'\n\ninterface Props {\n  title: string\n}\n\nexport const App: React.FC<Props> = ({ title }) => {\n  const [count, setCount] = React.useState<number>(0)\n\n  return (\n    <div className=\"p-4\">\n      <h1 className=\"text-2xl font-bold\">{title}</h1>\n      <button onClick={() => setCount(c => c + 1)} className=\"mt-2 px-3 py-1 bg-purple-600 text-white rounded\">\n        Clicked {count} times\n      </button>\n    </div>\n  )\n}`,
      size: new Blob([`import React from 'react'\n\ninterface Props {\n  title: string\n}\n\nexport const App: React.FC<Props> = ({ title }) => {\n  const [count, setCount] = React.useState<number>(0)\n\n  return (\n    <div className=\"p-4\">\n      <h1 className=\"text-2xl font-bold\">{title}</h1>\n      <button onClick={() => setCount(c => c + 1)} className=\"mt-2 px-3 py-1 bg-purple-600 text-white rounded\">\n        Clicked {count} times\n      </button>\n    </div>\n  )\n}`]).size,
      lastModified: new Date(),
      mimeType: 'text/typescript',
      path: '/',
      isStarred: true,
      isPublic: false,
      downloadCount: 0,
      viewCount: 0
    },
    {
      id: '7',
      name: 'README.md',
      type: 'file',
      content: `# YukiFiles Demo\n\n- Create files\n- Upload assets\n- Preview content\n\n> This is a demo README.`,
      size: new Blob([`# YukiFiles Demo\n\n- Create files\n- Upload assets\n- Preview content\n\n> This is a demo README.`]).size,
      lastModified: new Date(),
      mimeType: 'text/markdown',
      path: '/',
      isStarred: false,
      isPublic: false,
      downloadCount: 0,
      viewCount: 0
    }
  ])

  const handleFileUpload = async () => {
    setUploading(true)
    setUploadProgress(0)
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }
    
    setUploading(false)
    setUploadProgress(0)
    setShowUploadDialog(false)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    setShowUploadDialog(true)
  }, [])

  const handleCreateFile = (fileName: string, content: string, fileType: string) => {
    // Calculate proper file size in bytes
    const fileSize = new Blob([content]).size
    
    const newFile: DemoFile = {
      id: Date.now().toString(),
      name: fileName,
      type: fileType === 'folder' ? 'folder' : 'file',
      size: fileSize,
      lastModified: new Date(),
      content: content,
      mimeType: fileType === 'folder' ? undefined : 'text/plain',
      path: '/',
      isStarred: false,
      isPublic: false,
      downloadCount: 0,
      viewCount: 0
    }
    
    setDemoFiles(prev => [newFile, ...prev])
  }

  const handlePlanSwitch = (newPlan: string) => {
    setCurrentPlan(newPlan)
    setShowPlanSwitcher(false)
    
    // Show success animation
    setTimeout(() => {
      // You can add toast notification here
      console.log(`Switched to ${newPlan} plan`)
    }, 500)
  }

  const getPlanDisplayName = (planId: string) => {
    switch (planId) {
      case 'free': return 'Free'
      case 'pro': return 'Pro'
      case 'developer': return 'Developer'
      case 'team': return 'Team'
      case 'enterprise': return 'Enterprise'
      default: return 'Free'
    }
  }

  const isPaidPlan = (planId: string) => {
    return planId !== 'free'
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes <= 0) return '0 B'
    const kb = bytes / 1024
    if (kb < 1) return `${bytes} B`
    const mb = kb / 1024
    if (mb < 1) return `${Math.max(1, Math.round(kb))} KB`
    const gb = mb / 1024
    if (gb < 1) return `${mb.toFixed(1)} MB`
    return `${gb.toFixed(2)} GB`
  }

      return (
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden overflow-y-auto mobile-scrollbar">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">YukiFiles Demo</h2>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs sm:text-sm">
              {isPaidPlan(currentPlan) ? `${getPlanDisplayName(currentPlan)} Plan` : 'Free Plan'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowPlanSwitcher(true)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Switch Plan
            </Button>
            <Button
              onClick={() => setShowUploadDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs sm:text-sm flex-1 sm:flex-none"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Upload
            </Button>
          </div>
        </div>

      {/* Tab Navigation */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-3 sm:p-4 lg:p-6 mobile-scrollbar">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-800 mb-4 sm:mb-6 overflow-hidden gap-1 sm:gap-2 p-1">
                              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500 min-h-10 text-sm">
                  <Activity className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-purple-500 min-h-10 text-sm">
                  <Folder className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Files</span>
                </TabsTrigger>
                <TabsTrigger value="sharing" className="data-[state=active]:bg-purple-500 min-h-10 text-sm">
                  <Share2 className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sharing</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500 min-h-10 text-sm">
                  <Settings className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Analytics Dashboard */}
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        Analytics Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">1.2TB</div>
                          <div className="text-sm text-gray-400">Storage Used</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">2,847</div>
                          <div className="text-sm text-gray-400">Files Shared</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">15.2K</div>
                          <div className="text-sm text-gray-400">Downloads</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">98.5%</div>
                          <div className="text-sm text-gray-400">Uptime</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: 'File uploaded', file: 'presentation.pptx', time: '2 hours ago', icon: Upload },
                          { action: 'File shared', file: 'document.pdf', time: '4 hours ago', icon: Share2 },
                          { action: 'Download completed', file: 'image.jpg', time: '6 hours ago', icon: Download },
                          { action: 'Folder created', file: 'Projects', time: '1 day ago', icon: FolderPlus }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-white text-sm">{item.action}</div>
                              <div className="text-gray-400 text-xs">{item.file} • {item.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  {/* Storage Usage */}
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Storage Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-300">Used: 1.2TB</span>
                            <span className="text-gray-300">5TB Total</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Documents</div>
                            <div className="text-white">450MB</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Images</div>
                            <div className="text-white">2.1GB</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Videos</div>
                            <div className="text-white">850MB</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Other</div>
                            <div className="text-white">150MB</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => setShowUploadDialog(true)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Files
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <FolderPlus className="w-4 h-4 mr-2" />
                          Create Folder
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Files
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="files" data-section="files">
              <div className="space-y-6">
                {/* File Manager Header */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-white">File Manager</h3>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      Drag & Drop Enabled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search files..."
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 w-full sm:w-64"
                      />
                    </div>
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setShowFileEditor(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                  </div>
                </div>

                {/* Drag & Drop Area */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200",
                    dragOver 
                      ? "border-purple-500 bg-purple-500/10" 
                      : "border-gray-600 bg-gray-800/20"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {dragOver ? "Drop files here" : "Drag & drop files here"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Upload files up to 50MB each. Supports all file types.
                  </p>
                  <Button 
                    onClick={() => setShowUploadDialog(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>

                {/* File List */}
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      {demoFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                                                      <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => { setPreviewFile(file); setShowPreview(true) }}>
                              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                {file.type === 'folder' ? (
                                  <Folder className="w-5 h-5 text-purple-400" />
                                ) : file.mimeType?.startsWith('image/') ? (
                                  <FileImage className="w-5 h-5 text-purple-400" />
                                ) : file.mimeType?.startsWith('video/') ? (
                                  <Video className="w-5 h-5 text-purple-400" />
                                ) : file.mimeType?.startsWith('audio/') ? (
                                  <Music className="w-5 h-5 text-purple-400" />
                                ) : file.mimeType?.includes('pdf') ? (
                                  <FileText className="w-5 h-5 text-purple-400" />
                                ) : file.mimeType?.includes('code') || file.name.includes('.js') || file.name.includes('.ts') || file.name.includes('.html') || file.name.includes('.css') ? (
                                  <FileCode className="w-5 h-5 text-purple-400" />
                                ) : (
                                  <FileText className="w-5 h-5 text-purple-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-white font-medium text-ellipsis">{file.name}</div>
                                <div className="text-gray-400 text-sm text-ellipsis">
                                  {file.type === 'folder' ? 'Folder' : formatFileSize(file.size)} • {file.type}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {file.isPublic && (
                                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                                  <Share2 className="w-3 h-3 mr-1" />
                                  Shared
                                </Badge>
                              )}
                              <span className="text-gray-400 text-sm">{file.downloadCount} downloads</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-400">
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
              </div>
            </TabsContent>
            
            <TabsContent value="sharing">
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Smart Sharing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Shared Files</h4>
                        <div className="space-y-3">
                          {[
                            { name: 'presentation.pptx', link: 'yukifiles.com/s/abc123', views: 45, expires: '7 days' },
                            { name: 'document.pdf', link: 'yukifiles.com/s/def456', views: 23, expires: '30 days' },
                            { name: 'image.jpg', link: 'yukifiles.com/s/ghi789', views: 67, expires: 'Never' }
                          ].map((item, i) => (
                            <div key={i} className="p-3 bg-gray-700/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white font-medium">{item.name}</span>
                                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                                  Active
                                </Badge>
                              </div>
                              <div className="text-gray-400 text-sm mb-2">{item.link}</div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{item.views} views</span>
                                <span>Expires: {item.expires}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold">Sharing Options</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Password Protection</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Download Tracking</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Expiration Dates</span>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Public Links</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share New File
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Account Settings */}
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Account
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Email</Label>
                        <Input value="demo@yukifiles.com" disabled className="bg-gray-700 border-gray-600 text-gray-400" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Display Name</Label>
                        <Input value="Demo User" className="bg-gray-700 border-gray-600 text-white" />
                      </div>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        Update Profile
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Security Settings */}
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Two-Factor Auth</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Login Alerts</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Device Management</span>
                        <Switch defaultChecked />
                      </div>
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>

                  {/* API Settings */}
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        API Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Enable API</span>
                        <Switch />
                      </div>
                      <div>
                        <Label className="text-gray-300">API Key</Label>
                        <Input value="demo-api-key-12345" disabled className="bg-gray-700 border-gray-600 text-gray-400" />
                      </div>
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                        Regenerate Key
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Files</DialogTitle>
            <DialogDescription className="text-gray-400">
              Drag and drop files or click to browse. Maximum file size: 50MB
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">Supports all file types up to 50MB</p>
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
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Choose Your Plan</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select the perfect plan for your file sharing needs
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {pricingPlans.map((plan) => {
              const Icon = plan.icon
              return (
                <Card 
                  key={plan.id}
                  className={cn(
                    "bg-gray-800/50 border-gray-600 transition-all duration-200 hover:scale-105",
                    plan.popular && "border-purple-500 bg-purple-500/10"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-6 h-6 text-purple-400" />
                        <CardTitle className="text-white">{plan.name}</CardTitle>
                      </div>
                      {plan.popular && (
                        <Badge className="bg-purple-500 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-white">{plan.price}</div>
                    <div className="text-gray-400">{plan.storage} Storage</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <Check className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={cn(
                        "w-full",
                        plan.popular 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      )}
                    >
                      {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* File Editor */}
      <FileEditor
        isOpen={showFileEditor}
        onClose={() => setShowFileEditor(false)}
        onSave={handleCreateFile}
      />

      {/* Plan Switcher */}
      <PlanSwitcher
        isOpen={showPlanSwitcher}
        onClose={() => setShowPlanSwitcher(false)}
        onSwitch={handlePlanSwitch}
        currentPlan={currentPlan}
      />
      {/* File Preview */}
      {previewFile && (
        <FilePreview
          file={{
            id: previewFile.id,
            name: previewFile.name,
            size: previewFile.size,
            mimeType: previewFile.mimeType,
            content: previewFile.content
          }}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
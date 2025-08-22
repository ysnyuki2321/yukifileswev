"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Files, Search, Grid, List, Filter, SortAsc, 
  Plus, Upload, Download, Share2, Lock, Star,
  Archive, Database, Eye, Settings, RefreshCw,
  BarChart3, Users, HardDrive, Zap, Globe
} from "lucide-react"
import { EnhancedFileManager } from "@/components/file-manager/enhanced-file-manager"
import { comprehensiveDemoFiles, getFileStats, DemoFileItem } from "./ComprehensiveDemoFiles"

export function UltimateFileManagerDemo() {
  const [demoFiles, setDemoFiles] = useState<DemoFileItem[]>(comprehensiveDemoFiles)
  const [showStats, setShowStats] = useState(true)

  const stats = getFileStats(demoFiles)

  const handleFileCreate = (fileData: { name: string; isFolder: boolean }) => {
    const newFile: DemoFileItem = {
      id: `new-${Date.now()}`,
      name: fileData.name,
      size: fileData.isFolder ? 0 : Math.floor(Math.random() * 1000000),
      type: fileData.isFolder ? 'folder' : 'text/plain',
      lastModified: new Date(),
      isFolder: fileData.isFolder,
      isStarred: false,
      isShared: false,
      hasPassword: false,
      inArchive: false,
      category: fileData.isFolder ? 'folder' : 'document',
      path: []
    }
    
    setDemoFiles(prev => [...prev, newFile])
  }

  const handleFileEdit = (file: any) => {
    console.log('Editing file:', file.name)
  }

  const handleFileUpload = (files: File[]) => {
    const newFiles: DemoFileItem[] = files.map(file => ({
      id: `upload-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(),
      isFolder: false,
      isStarred: false,
      isShared: false,
      hasPassword: false,
      inArchive: false,
      category: file.type.startsWith('image/') ? 'image' :
                file.type.startsWith('video/') ? 'video' :
                file.type.startsWith('audio/') ? 'audio' :
                'document',
      path: []
    }))
    
    setDemoFiles(prev => [...prev, ...newFiles])
  }

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Ultimate File Manager Demo
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience all features: Advanced search, database editor, archive viewer, 
            compression system, password protection, and more!
          </p>
        </motion.div>

        {/* Quick Stats */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-6xl mx-auto"
          >
            <Card className="bg-black/40 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Files className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{stats.files}</p>
                <p className="text-xs text-gray-400">Files</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Share2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{stats.shared}</p>
                <p className="text-xs text-gray-400">Shared</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Lock className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{stats.protected}</p>
                <p className="text-xs text-gray-400">Protected</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Archive className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{stats.archived}</p>
                <p className="text-xs text-gray-400">Archived</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Database className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{stats.categories.databases}</p>
                <p className="text-xs text-gray-400">Databases</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{stats.starred}</p>
                <p className="text-xs text-gray-400">Starred</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <HardDrive className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{(stats.totalSize / 1024 / 1024).toFixed(1)}</p>
                <p className="text-xs text-gray-400">MB Total</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
        >
          <Badge className="bg-purple-500/20 text-purple-400">Enhanced Search</Badge>
          <Badge className="bg-blue-500/20 text-blue-400">Database Editor</Badge>
          <Badge className="bg-orange-500/20 text-orange-400">Archive Viewer</Badge>
          <Badge className="bg-green-500/20 text-green-400">Compression System</Badge>
          <Badge className="bg-red-500/20 text-red-400">Password Protection</Badge>
          <Badge className="bg-yellow-500/20 text-yellow-400">Access Limits</Badge>
          <Badge className="bg-pink-500/20 text-pink-400">File Encryption</Badge>
          <Badge className="bg-cyan-500/20 text-cyan-400">Breadcrumb Navigation</Badge>
        </motion.div>
      </div>

      {/* Enhanced File Manager */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <EnhancedFileManager
          files={demoFiles.map(file => ({
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            isFolder: file.isFolder,
            isStarred: file.isStarred,
            isShared: file.isShared,
            thumbnail: file.thumbnail
          }))}
          onFileCreate={handleFileCreate}
          onFileEdit={handleFileEdit}
          onFileUpload={handleFileUpload}
          uploadProgress={{}}
          uploadingFiles={[]}
          isAdmin={true}
        />
      </motion.div>

      {/* Demo Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6"
      >
        <h3 className="text-white font-semibold mb-4">🎯 Demo Features to Test:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="text-purple-400 font-medium">📁 File Operations</h4>
            <ul className="text-gray-400 space-y-1">
              <li>• Click database files → Database Editor</li>
              <li>• Click archive files → Archive Viewer</li>
              <li>• Right-click → Context menu</li>
              <li>• Multi-select → Bulk operations</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-green-400 font-medium">🔗 Sharing & Security</h4>
            <ul className="text-gray-400 space-y-1">
              <li>• Share → Advanced security options</li>
              <li>• Password protection toggle</li>
              <li>• Access limits & expiration</li>
              <li>• Filename encryption</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-orange-400 font-medium">📦 Advanced Features</h4>
            <ul className="text-gray-400 space-y-1">
              <li>• Compress → Professional overlay</li>
              <li>• Search → Enhanced với highlighting</li>
              <li>• Breadcrumb → Windows-style navigation</li>
              <li>• Profile → Slide-up screen</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
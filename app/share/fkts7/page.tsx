"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, Eye, Calendar, HardDrive, Sparkles, ExternalLink, Share2 } from "lucide-react"
import { useState } from "react"

export default function StaticDemoSharePage() {
  const [copied, setCopied] = useState(false)

  const demoFile = {
    original_name: "YukiFiles_Demo_Project.zip",
    file_size: 2547893, // ~2.5MB
    created_at: "2024-01-15T10:30:00Z",
    download_count: 1247,
    mime_type: "application/zip"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a')
    link.href = '/demo-file.zip' // Demo file
    link.download = demoFile.original_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-black/40 via-purple-950/30 to-black/40 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-white mb-2">{demoFile.original_name}</CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            Shared securely via YukiFiles Platform
          </CardDescription>
          <Badge className="mx-auto bg-green-500/20 text-green-300 border-green-500/30">
            <Eye className="w-3 h-3 mr-1" />
            Demo File
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-purple-500/10">
              <HardDrive className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{formatFileSize(demoFile.file_size)}</div>
              <div className="text-xs text-gray-400">File Size</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-purple-500/10">
              <Download className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{demoFile.download_count.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Downloads</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-purple-500/10">
              <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{formatDate(demoFile.created_at)}</div>
              <div className="text-xs text-gray-400">Uploaded</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-purple-500/10">
              <Share2 className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">Public</div>
              <div className="text-xs text-gray-400">Access</div>
            </div>
          </div>

          {/* File Preview */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              File Preview
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm text-gray-300">
              <div className="text-green-400">📁 YukiFiles_Demo_Project/</div>
              <div className="ml-4 text-blue-400">├── 📄 README.md</div>
              <div className="ml-4 text-yellow-400">├── ⚙️ package.json</div>
              <div className="ml-4 text-purple-400">├── 🎨 styles/</div>
              <div className="ml-8 text-pink-400">│   └── globals.css</div>
              <div className="ml-4 text-cyan-400">├── 📝 components/</div>
              <div className="ml-8 text-orange-400">│   ├── ui/</div>
              <div className="ml-8 text-red-400">│   └── dashboard/</div>
              <div className="ml-4 text-gray-400">└── 📊 demo-data.json</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
            <Button 
              onClick={copyLink}
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              {copied ? (
                <>
                  <Eye className="w-4 h-4 mr-2 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            <Button 
              onClick={() => window.open('/', '_blank')}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit YukiFiles
            </Button>
          </div>

          {/* Security Info */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-purple-500/10">
            <p>This file is shared securely via YukiFiles Platform</p>
            <p>End-to-end encrypted • Enterprise security • 99.9% uptime</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
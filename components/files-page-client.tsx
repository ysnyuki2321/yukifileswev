"use client"

import { useEffect, useState } from "react"
import { EnhancedFileManager } from "@/components/file-manager/enhanced-file-manager"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"
import { isDebugModeEnabled, getMockUserData } from "@/lib/services/debug-context"
import { getDebugFiles } from "@/lib/services/debug-user"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle, FileText, Code, Image, Video, Music, Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface User {
  email: string
  id: string
}

interface UserData {
  id: string
  email: string
  created_at: string
  updated_at: string
  subscription_type: string
  subscription_expires_at: string
  quota_used: number
  quota_limit: number
  password_hash: null
  is_admin: boolean
  is_active: boolean
}

interface FileItem {
  id: string
  name: string
  type: string
  size: number
  lastModified: Date
  isFolder: boolean
  content?: string
  thumbnail?: string
  isStarred?: boolean
  isShared?: boolean
  owner?: string
  path: string
}

export default function FilesPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(searchParams.get("demo") === "true")
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        // For now, always use debug mode
        console.log("[v0] Using debug mode for files page")
        setUser({ email: "debug@yukifiles.com", id: "debug-user-123" })
        setUserData(getMockUserData())
        const debugFiles = getDebugFiles()
        const transformedDebugFiles: FileItem[] = debugFiles.map((file: any) => ({
          id: file.id,
          name: file.name || 'untitled.txt',
          type: file.mime_type || 'application/octet-stream',
          size: file.size || 0,
          lastModified: new Date(file.uploaded_at || Date.now()),
          isFolder: false,
          content: file.content || '',
          thumbnail: file.thumbnail,
          isStarred: file.is_starred || false,
          isShared: file.is_public || false,
          owner: file.owner || 'debug@yukifiles.com',
          path: '/'
        }))
        setFiles(transformedDebugFiles)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const sp = new URLSearchParams(window.location.search)
    if (isDemoMode) {
      if (sp.get('demo') !== 'true') {
        sp.set('demo', 'true')
        router.replace(`/files?${sp.toString()}`)
      }
    } else if (sp.has('demo')) {
      sp.delete('demo')
      const q = sp.toString()
      router.replace(q ? `/files?${q}` : '/files')
    }
  }, [isDemoMode, router])

  const transformedFiles = files.map((file: any) => ({
    id: file.id,
    name: file.name || 'untitled.txt',
    type: file.mime_type || 'application/octet-stream',
    size: file.size || 0,
    lastModified: new Date(file.uploaded_at || Date.now()),
    isFolder: false,
    content: file.content || '',
    thumbnail: file.thumbnail,
    isStarred: file.is_starred || false,
    isShared: file.is_public || false,
    owner: file.owner || user?.email,
    path: '/'
  }))

  const testFiles = [
    {
      id: 'test-js',
      name: 'javascript-example.js',
      type: 'application/javascript',
      size: 15000,
      lastModified: new Date(),
      isFolder: false,
      content: `// JavaScript Example\nconsole.log("Hello from YukiFiles!");\nconst example = { name: "Test File", type: "JavaScript", content: "This is a test file for the editor" };\nexport default example;`,
      path: '/'
    },
    {
      id: 'test-lua',
      name: 'sample.lua',
      type: 'text/x-lua',
      size: 1200,
      lastModified: new Date(),
      isFolder: false,
      content: `-- Lua sample\nlocal msg = "Hello Lua";\nprint(msg)\n`,
      path: '/'
    },
    {
      id: 'test-txt',
      name: 'notes.txt',
      type: 'text/plain',
      size: 300,
      lastModified: new Date(),
      isFolder: false,
      content: `Quick notes\n- item 1\n- item 2`,
      path: '/'
    },
    {
      id: 'test-md',
      name: 'markdown-example.md',
      type: 'text/markdown',
      size: 8000,
      lastModified: new Date(),
      isFolder: false,
      content: `# YukiFiles Markdown Example\n\nThis is a **markdown** file for testing the file editor.\n\n## Features\n\n- *Syntax highlighting*\n- \`Code blocks\`\n- [Links](https://yukifiles.com)\n- Lists\n  - Item 1\n  - Item 2\n\n\`\`\`javascript\n// Code block example\nfunction hello() {\n  console.log("Hello World!");\n}\n\`\`\`\n\n> This is a blockquote\n\n---\n\n**Bold text** and *italic text*`,
      path: '/'
    },
    {
      id: 'test-json',
      name: 'config-example.json',
      type: 'application/json',
      size: 5000,
      lastModified: new Date(),
      isFolder: false,
      content: `{"name":"yukifiles-config","version":"1.0.0"}`,
      path: '/'
    }
  ]

  const demoFiles = [
    {
      id: 'demo-welcome',
      name: 'Welcome-to-YukiFiles.md',
      type: 'text/markdown',
      size: 2500,
      lastModified: new Date(),
      isFolder: false,
      content: `# Welcome to YukiFiles Demo! 🎉\n\n...`,
      path: '/'
    }
  ]

  const handleFakeUpload = async (files: File[]) => {
    for (const file of files) {
      const fileId = `fake-${Date.now()}-${Math.random()}`
      const fileName = file.name || 'untitled.txt'
      setUploadingFiles(prev => [...prev, fileId])
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadProgress(prev => ({ ...prev, [fileId]: i }))
      }
      const newFile: FileItem = {
        id: fileId,
        name: fileName,
        type: file.type || 'application/octet-stream',
        size: file.size,
        lastModified: new Date(),
        isFolder: false,
        content: '',
        path: '/'
      }
      setFiles(prev => [newFile, ...prev])
      setUploadingFiles(prev => prev.filter(id => id !== fileId))
      setUploadProgress(prev => { const n = { ...prev }; delete n[fileId]; return n })
    }
  }

  const handleFileEdit = (file: FileItem) => {
    console.log("File edit requested:", file)
  }

  const handleFileSave = (file: FileItem, newContent: string, newName?: string, newType?: string) => {
    setFiles(prevFiles => prevFiles.map(f => f.id === file.id ? { ...f, content: newContent || f.content, name: newName || f.name || 'untitled.txt', type: newType ? `text/${newType}` : f.type } : f))
  }

  const handleFileDelete = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId))
  }

  const allFiles = isDemoMode ? [...transformedFiles, ...testFiles, ...demoFiles] : [...transformedFiles, ...testFiles]

  if (loading) {
    return (
      <div className="min-h-screen theme-premium flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="flex">
        <Sidebar 
          isAdmin={Boolean(userData?.is_admin)}
          brandName="YukiFiles"
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab="files"
        />
        <div className="flex-1 min-w-0">
          <Topbar 
            userEmail={user?.email || "guest@yukifiles.com"}
            isPremium={userData?.subscription_type === "paid"}
            brandName="YukiFiles"
            isDemoMode={isDemoMode}
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="container mx-auto px-4 py-6 overflow-x-hidden">
        {/* Demo Mode Toggle */}
        <div className="mb-8">
          <Card className="premium-card border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">File Manager</h2>
                  </div>
                  {isDemoMode && (
                    <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
                      <PlayCircle className="w-3 h-3 mr-1" />
                      Demo Mode
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant={isDemoMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsDemoMode(!isDemoMode)}
                    className={isDemoMode 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" 
                      : "border-purple-500 text-purple-300 hover:bg-purple-500/10"
                    }
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {isDemoMode ? "Exit Demo" : "Try Demo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <EnhancedFileManager
          files={allFiles}
          onFileUpload={handleFakeUpload}
          onFileEdit={handleFileEdit}
          onFileDelete={handleFileDelete}
          onFileSave={handleFileSave}
          onFileCreate={(nf) => {
            const created: FileItem = {
              id: `new-${Date.now()}`,
              name: nf.name,
              type: `text/${nf.type}`,
              size: new Blob([nf.content]).size,
              lastModified: new Date(),
              isFolder: false,
              content: nf.content,
              path: nf.path,
            }
            setFiles(prev => [created, ...prev])
          }}
          onFolderCreate={(fd) => {
            const created: FileItem = {
              id: `folder-${Date.now()}`,
              name: fd.name,
              type: 'folder',
              size: 0,
              lastModified: new Date(),
              isFolder: true,
              path: fd.path,
            }
            setFiles(prev => [created, ...prev])
          }}
          uploadProgress={uploadProgress}
          uploadingFiles={uploadingFiles}
          isAdmin={Boolean(userData?.is_admin)}
          userQuota={{
            used: userData?.quota_used || 0,
            limit: userData?.quota_limit || 0
          }}
          isDemoMode={isDemoMode}
        />
          </main>
        </div>
      </div>
    </div>
  )
}
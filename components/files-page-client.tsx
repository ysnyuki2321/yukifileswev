"use client"

import { useEffect, useState } from "react"
import { EnhancedFileManager } from "@/components/file-manager/enhanced-file-manager"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"
import { isDebugModeEnabled, getMockUserData } from "@/lib/services/debug-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle, FileText, Code, Image, Video, Music, Sparkles } from "lucide-react"

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
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
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
        
        // Transform debug files to match FileItem interface
        const res = await fetch('/api/debug/files', { cache: 'no-store' })
        const data = await res.json()
        const debugFiles = Array.isArray(data.files) ? data.files : []
        // Replace untitled placeholders with curated sample files
        const samples: FileItem[] = [
          { id: 's1', name: 'app.tsx', type: 'text/tsx', size: 1520, lastModified: new Date(), isFolder: false, content: `import React from 'react'\nexport default function App(){\n  return <div>Hello YukiFiles</div>\n}` , path: '/' },
          { id: 's2', name: 'server.js', type: 'application/javascript', size: 2440, lastModified: new Date(), isFolder: false, content: `const http=require('http')\nhttp.createServer((_,res)=>{res.end('OK')}).listen(3000)` , path: '/' },
          { id: 's3', name: 'style.css', type: 'text/css', size: 980, lastModified: new Date(), isFolder: false, content: `body{font-family:system-ui;background:#0b1020;color:#fff}` , path: '/' },
          { id: 's4', name: 'README.md', type: 'text/markdown', size: 1200, lastModified: new Date(), isFolder: false, content: `# YukiFiles\n\nDemo file manager samples.` , path: '/' }
        ]
        const transformedDebugFiles: FileItem[] = debugFiles.map((file: any) => ({
          id: file.id,
          name: file.original_name || file.name || 'sample.txt',
          type: file.mime_type || 'application/octet-stream',
          size: file.file_size || file.size || 0,
          lastModified: new Date(file.created_at || file.uploaded_at || Date.now()),
          isFolder: false,
          content: file.content || '',
          thumbnail: file.thumbnail,
          isStarred: Boolean(file.is_starred),
          isShared: Boolean(file.is_public),
          owner: file.owner || 'debug@yukifiles.com',
          path: '/'
        }))
        setFiles([...samples, ...transformedDebugFiles])
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Transform files to match EnhancedFileManager interface
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

  // Add test files for editor
  const testFiles = [
    {
      id: 'test-js',
      name: 'javascript-example.js',
      type: 'application/javascript',
      size: 15000,
      lastModified: new Date(),
      isFolder: false,
      content: `// JavaScript Example
console.log("Hello from YukiFiles!");

const example = {
  name: "Test File",
  type: "JavaScript",
  content: "This is a test file for the editor"
};

export default example;`,
      path: '/'
    },
    {
      id: 'test-md',
      name: 'markdown-example.md',
      type: 'text/markdown',
      size: 8000,
      lastModified: new Date(),
      isFolder: false,
      content: `# YukiFiles Markdown Example

This is a **markdown** file for testing the file editor.

## Features

- *Syntax highlighting*
- \`Code blocks\`
- [Links](https://yukifiles.com)
- Lists
  - Item 1
  - Item 2

\`\`\`javascript
// Code block example
function hello() {
  console.log("Hello World!");
}
\`\`\`

> This is a blockquote

---

**Bold text** and *italic text*`,
      path: '/'
    },
    {
      id: 'test-json',
      name: 'config-example.json',
      type: 'application/json',
      size: 5000,
      lastModified: new Date(),
      isFolder: false,
      content: `{
  "name": "yukifiles-config",
  "version": "1.0.0",
  "description": "Example configuration file",
  "settings": {
    "theme": "premium",
    "autoSave": true,
    "maxFileSize": "100MB",
    "supportedFormats": [
      "image/*",
      "video/*",
      "audio/*",
      "text/*",
      ".pdf",
      ".doc",
      ".docx"
    ]
  },
  "features": {
    "fileEditor": true,
    "dragAndDrop": true,
    "progressTracking": true,
    "storageQuota": "2GB"
  }
}`,
      path: '/'
    }
  ]

  // Demo files with rich content for testing
  const demoFiles = [
    {
      id: 'demo-welcome',
      name: 'Welcome-to-YukiFiles.md',
      type: 'text/markdown',
      size: 2500,
      lastModified: new Date(),
      isFolder: false,
      content: `# Welcome to YukiFiles Demo! 🎉

## What is YukiFiles?

YukiFiles is a **premium file management platform** designed for modern developers and teams. This demo showcases all our powerful features in action.

### ✨ Key Features

- **🎨 Advanced File Editor** - Edit code with syntax highlighting
- **📁 Smart File Management** - Organize files with ease
- **☁️ Cloud Storage** - Secure and fast file storage
- **🔄 Real-time Collaboration** - Work together seamlessly
- **📊 Analytics Dashboard** - Track your file usage
- **🔒 Enterprise Security** - Bank-level encryption

### 🚀 Getting Started

1. **Upload Files** - Drag & drop or click the upload button
2. **Edit Content** - Click on any text file to open our editor
3. **Organize** - Create folders and manage your files
4. **Share** - Generate secure sharing links
5. **Collaborate** - Invite team members

### 💎 Premium Features

This demo includes all **premium features**:

- ✅ Unlimited storage
- ✅ Advanced file editor
- ✅ Real-time collaboration
- ✅ Custom branding
- ✅ API access
- ✅ Priority support

### 🛠️ Technical Specifications

\`\`\`typescript
const yukiFiles = {
  storage: "Unlimited",
  bandwidth: "1TB/month",
  fileTypes: "All formats supported",
  api: "RESTful API",
  security: "AES-256 encryption",
  uptime: "99.9% SLA"
}
\`\`\`

---

**Ready to get started?** [Sign up for free](/auth/register) and experience the power of YukiFiles!`,
      path: '/'
    },
    {
      id: 'demo-javascript',
      name: 'demo-script.js',
      type: 'application/javascript',
      size: 1800,
      lastModified: new Date(),
      isFolder: false,
      content: `// YukiFiles Demo Script
// This file demonstrates JavaScript syntax highlighting

console.log("Welcome to YukiFiles Demo!");

// File Management Class
class FileManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.files = [];
    this.uploadQueue = [];
  }

  // Upload a file
  async uploadFile(file) {
    try {
      console.log(\`Uploading: \${file.name}\`);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        this.files.push(result.file);
        console.log('Upload successful!', result);
        return result;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Get all files
  async getFiles() {
    try {
      const response = await fetch('/api/files', {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`
        }
      });
      
      const data = await response.json();
      this.files = data.files;
      return this.files;
    } catch (error) {
      console.error('Failed to fetch files:', error);
      return [];
    }
  }

  // Delete a file
  async deleteFile(fileId) {
    try {
      const response = await fetch(\`/api/files/\${fileId}\`, {
        method: 'DELETE',
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`
        }
      });
      
      if (response.ok) {
        this.files = this.files.filter(f => f.id !== fileId);
        console.log(\`File \${fileId} deleted successfully\`);
        return true;
      }
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }
}

// Usage example
const fileManager = new FileManager('your-api-key-here');

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
  console.log('YukiFiles Demo loaded!');
  
  // Load existing files
  const files = await fileManager.getFiles();
  console.log('Current files:', files);
  
  // Setup file upload
  const uploadInput = document.getElementById('file-upload');
  if (uploadInput) {
    uploadInput.addEventListener('change', async (event) => {
      const files = Array.from(event.target.files);
      
      for (const file of files) {
        try {
          await fileManager.uploadFile(file);
        } catch (error) {
          alert(\`Failed to upload \${file.name}\`);
        }
      }
    });
  }
});

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') return '';
  return filename.split('.').pop()?.toLowerCase() || '';
};

const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename));
};

// Export for use in other modules
export { FileManager, formatFileSize, getFileExtension, isImageFile };`,
      path: '/'
    },
    {
      id: 'demo-python',
      name: 'data_analyzer.py',
      type: 'text/x-python',
      size: 2200,
      lastModified: new Date(),
      isFolder: false,
      content: `#!/usr/bin/env python3
"""
YukiFiles Demo - Python Data Analyzer
Demonstrates Python syntax highlighting in the file editor
"""

import json
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any

class FileAnalytics:
    """Analytics engine for file management insights"""
    
    def __init__(self):
        self.data = []
        self.reports = {}
    
    def load_data(self, source: str = "api") -> bool:
        """Load file data from various sources"""
        try:
            if source == "api":
                # Simulate API call
                self.data = self._generate_sample_data()
                print(f"Loaded {len(self.data)} records from API")
                return True
            elif source == "file":
                # Load from JSON file
                with open("file_data.json", "r") as f:
                    self.data = json.load(f)
                return True
        except Exception as e:
            print(f"Error loading data: {e}")
            return False
    
    def _generate_sample_data(self) -> List[Dict[str, Any]]:
        """Generate sample file data for demo"""
        import random
        
        file_types = ['.txt', '.pdf', '.jpg', '.png', '.mp4', '.docx']
        users = ['alice', 'bob', 'charlie', 'diana', 'eve']
        
        data = []
        for i in range(100):
            file_record = {
                'id': f'file_{i:03d}',
                'name': f'document_{i}{random.choice(file_types)}',
                'size': random.randint(1024, 10*1024*1024),  # 1KB to 10MB
                'created_at': datetime.now().isoformat(),
                'downloads': random.randint(0, 50),
                'user': random.choice(users),
                'is_shared': random.choice([True, False])
            }
            data.append(file_record)
        
        return data
    
    def analyze_file_types(self) -> Dict[str, int]:
        """Analyze distribution of file types"""
        type_counts = {}
        
        for record in self.data:
            # Extract file extension
            name = record.get('name', '')
            ext = name.split('.')[-1] if '.' in name else 'unknown'
            type_counts[ext] = type_counts.get(ext, 0) + 1
        
        # Sort by count (descending)
        sorted_types = dict(sorted(type_counts.items(), 
                                 key=lambda x: x[1], reverse=True))
        
        self.reports['file_types'] = sorted_types
        return sorted_types
    
    def analyze_storage_usage(self) -> Dict[str, float]:
        """Calculate storage usage statistics"""
        if not self.data:
            return {}
        
        total_size = sum(record.get('size', 0) for record in self.data)
        avg_size = total_size / len(self.data)
        
        # Size by user
        user_sizes = {}
        for record in self.data:
            user = record.get('user', 'unknown')
            size = record.get('size', 0)
            user_sizes[user] = user_sizes.get(user, 0) + size
        
        storage_stats = {
            'total_gb': total_size / (1024**3),
            'average_mb': avg_size / (1024**2),
            'user_distribution': user_sizes
        }
        
        self.reports['storage'] = storage_stats
        return storage_stats
    
    def generate_report(self) -> str:
        """Generate comprehensive analytics report"""
        
        # Run analyses
        file_types = self.analyze_file_types()
        storage = self.analyze_storage_usage()
        
        report = f"""
YukiFiles Analytics Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
{'='*50}

📊 OVERVIEW
Total Files: {len(self.data):,}
Total Storage: {storage.get('total_gb', 0):.2f} GB
Average File Size: {storage.get('average_mb', 0):.2f} MB

📁 FILE TYPES
"""
        
        for file_type, count in list(file_types.items())[:5]:
            percentage = (count / len(self.data)) * 100
            report += f"  {file_type}: {count:,} files ({percentage:.1f}%)\\n"
        
        report += f"""
👥 TOP USERS BY STORAGE
"""
        
        user_sizes = storage.get('user_distribution', {})
        sorted_users = sorted(user_sizes.items(), key=lambda x: x[1], reverse=True)
        
        for user, size in sorted_users[:5]:
            size_mb = size / (1024**2)
            report += f"  {user}: {size_mb:.1f} MB\\n"
        
        report += f"""
{'='*50}
✅ Report generation complete!
"""
        
        return report

# Usage example
if __name__ == "__main__":
    print("🚀 Starting YukiFiles Analytics Demo...")
    
    # Initialize analytics engine
    analytics = FileAnalytics()
    
    # Load and analyze data
    if analytics.load_data():
        print("\\n📈 Generating analytics report...")
        report = analytics.generate_report()
        print(report)
        
        # Save report to file
        with open("analytics_report.txt", "w") as f:
            f.write(report)
        
        print("💾 Report saved to 'analytics_report.txt'")
    else:
        print("❌ Failed to load data")`,
      path: '/'
    },
    {
      id: 'demo-config',
      name: 'app-config.json',
      type: 'application/json',
      size: 1200,
      lastModified: new Date(),
      isFolder: false,
      content: `{
  "app": {
    "name": "YukiFiles Demo",
    "version": "2.1.0",
    "description": "Premium file management platform",
    "environment": "demo"
  },
  "features": {
    "fileEditor": {
      "enabled": true,
      "supportedLanguages": [
        "javascript", "typescript", "python", "html", "css",
        "json", "markdown", "sql", "yaml", "xml", "php"
      ],
      "maxFileSize": "100MB",
      "autoSave": true,
      "syntaxHighlighting": true,
      "lineNumbers": true,
      "wordWrap": true,
      "search": true,
      "replace": true
    },
    "fileUpload": {
      "enabled": true,
      "dragAndDrop": true,
      "multipleFiles": true,
      "progressTracking": true,
      "maxFileSize": "500MB",
      "allowedTypes": ["*/*"],
      "storageQuota": "10GB"
    },
    "fileSharing": {
      "enabled": true,
      "passwordProtection": true,
      "expirationDates": true,
      "downloadLimits": true,
      "analytics": true
    }
  },
  "ui": {
    "theme": {
      "default": "premium",
      "options": ["light", "dark", "premium"],
      "customization": true
    },
    "layout": {
      "gridView": true,
      "listView": true,
      "defaultView": "grid"
    },
    "animations": {
      "enabled": true,
      "duration": 300,
      "easing": "ease-in-out"
    }
  },
  "demo": {
    "sampleFiles": 5,
    "mockData": true,
    "fullFeatures": true,
    "limitations": {
      "maxUploadSize": "10MB",
      "maxFiles": 20,
      "sessionTimeout": "30min"
    }
  }
}`,
      path: '/'
    },
    {
      id: 'demo-readme',
      name: 'README.txt',
      type: 'text/plain',
      size: 800,
      lastModified: new Date(),
      isFolder: false,
      content: `YukiFiles Demo Environment
=========================

Welcome to the YukiFiles interactive demo!

This demo showcases all the premium features of our file management platform:

✨ FEATURES INCLUDED:
- Advanced file editor with syntax highlighting
- Smart file upload with progress tracking
- Drag & drop file management
- Real-time file editing
- Multiple view modes (grid/list)
- Search and filter capabilities
- File sharing and collaboration tools

🎯 WHAT TO TRY:
1. Click on any file to open the advanced editor
2. Try uploading files using the upload button
3. Switch between grid and list views
4. Use the search functionality
5. Right-click files for context menu options
6. Test the responsive mobile interface

📝 SAMPLE FILES:
- Welcome-to-YukiFiles.md: Markdown with formatting
- demo-script.js: JavaScript with syntax highlighting
- data_analyzer.py: Python script example
- app-config.json: JSON configuration file
- README.txt: This plain text file

🔧 TECHNICAL NOTES:
- All data is simulated for demo purposes
- File editor supports 10+ programming languages
- Upload functionality is fully interactive
- Mobile-responsive design optimized for all devices

💡 NEXT STEPS:
Ready to experience the full power of YukiFiles?
- Sign up for a free account
- Import your existing files
- Invite team members
- Start collaborating!

For more information, visit: https://yukifiles.com
Support: support@yukifiles.com

Thank you for trying YukiFiles! 🚀`,
      path: '/'
    }
  ]

  // Fake upload function for demo
  const handleFakeUpload = async (files: File[]) => {
    for (const file of files) {
      const fileId = `fake-${Date.now()}-${Math.random()}`
      const fileName = file.name || 'untitled.txt'
      
      setUploadingFiles(prev => [...prev, fileId])
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadProgress(prev => ({ ...prev, [fileId]: i }))
      }
      
      // Add file to list
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
      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[fileId]
        return newProgress
      })
    }
  }

  const handleFileEdit = (file: FileItem) => {
    // This will be handled by the file editor component
    console.log("File edit requested:", file)
  }

  const handleFileSave = (file: FileItem, newContent: string, newName?: string, newType?: string) => {
    setFiles(prevFiles =>
      prevFiles.map(f =>
        f.id === file.id
          ? {
              ...f,
              content: newContent || f.content,
              name: newName || f.name || 'untitled.txt',
              type: newType ? `text/${newType}` : f.type
            }
          : f
      )
    )
  }

  const handleFileDelete = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId))
  }

  const handleFileCreate = (newFile: { name: string, type: string, content: string, path: string }) => {
    const fileItem: FileItem = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newFile.name,
      type: `text/${newFile.type}`,
      size: newFile.content.length,
      lastModified: new Date(),
      isFolder: false,
      content: newFile.content,
      path: newFile.path,
      isStarred: false,
      isShared: false,
      owner: 'demo@yukifiles.com'
    }
    setFiles(prevFiles => [...prevFiles, fileItem])
  }

  const handleFolderCreate = (newFolder: { name: string, path: string }) => {
    const folderItem: FileItem = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newFolder.name,
      type: 'folder',
      size: 0,
      lastModified: new Date(),
      isFolder: true,
      path: newFolder.path,
      isStarred: false,
      isShared: false,
      owner: 'demo@yukifiles.com'
    }
    setFiles(prevFiles => [...prevFiles, folderItem])
  }

  const allFiles = isDemoMode ? demoFiles : [...transformedFiles, ...testFiles]

  if (loading) {
    return (
      <div className="min-h-screen theme-premium flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const brandName = isDemoMode ? "YukiFiles Demo" : "YukiFiles"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="flex">
        <Sidebar 
          isAdmin={Boolean(userData?.is_admin)}
          brandName={brandName}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab="files"
        />
        <div className="flex-1 min-w-0">
          <Topbar 
            user={user}
            userData={userData}
            onMenuClick={() => setIsSidebarOpen(true)}
            showUpgrade={false}
          />
          <main className="p-6">
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
                  
                  {isDemoMode && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-purple-400" />
                          <span>Advanced Editor</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Code className="w-4 h-4 text-pink-400" />
                          <span>Syntax Highlighting</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Image className="w-4 h-4 text-blue-400" />
                          <span>All File Types</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Video className="w-4 h-4 text-green-400" />
                          <span>Real-time Preview</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Music className="w-4 h-4 text-yellow-400" />
                          <span>Smart Upload</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Click on any demo file to experience our advanced file editor with syntax highlighting and real-time editing capabilities.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <EnhancedFileManager
              files={transformedFiles}
              onFileUpload={handleFakeUpload}
              onFileEdit={handleFileEdit}
              onFileDelete={handleFileDelete}
              onFileSave={handleFileSave}
              onFileCreate={handleFileCreate}
              onFolderCreate={handleFolderCreate}
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
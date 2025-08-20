"use client"

import { useEffect, useState } from "react"
import { EnhancedFileManager } from "@/components/file-manager/enhanced-file-manager"
import { NavigationWrapper } from "@/components/ui/navigation-wrapper"
import { isDebugModeEnabled, getMockUserData } from "@/lib/services/debug-context"
import { getDebugFiles } from "@/lib/services/debug-user"

export default function FilesPageClient() {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // For now, always use debug mode
        console.log("[v0] Using debug mode for files page")
        setUser({ email: "debug@yukifiles.com", id: "debug-user-123" })
        setUserData(getMockUserData())
        setFiles(getDebugFiles())
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
    name: file.name,
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

  const allFiles = [...transformedFiles, ...testFiles]

  if (loading) {
    return (
      <div className="min-h-screen theme-premium flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen theme-premium">
      <NavigationWrapper 
        brandName="YukiFiles" 
        isAuthenticated={true} 
        isAdmin={Boolean(userData?.is_admin)} 
      />
      
      <main className="container mx-auto px-4 py-6 pt-24">
        <EnhancedFileManager 
          files={allFiles}
          onFileSelect={(file) => console.log('File selected:', file)}
          onFileEdit={(file) => console.log('File edit:', file)}
          onFileDelete={(fileId) => console.log('File delete:', fileId)}
          onFileShare={(fileId) => console.log('File share:', fileId)}
          onFileDownload={(fileId) => console.log('File download:', fileId)}
          onFileUpload={(files) => console.log('Files upload:', files)}
        />
      </main>
    </div>
  )
}
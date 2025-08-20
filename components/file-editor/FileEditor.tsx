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

interface FileEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fileName: string, content: string, fileType: string) => void
  initialFileName?: string
  initialContent?: string
  fileType?: 'text' | 'code' | 'folder'
}

const ALLOWED_EXTENSIONS = {
  text: ['.txt', '.md', '.json', '.csv', '.log'],
  code: ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs', '.swift', '.kt'],
  folder: []
}

const FILE_TYPE_NAMES = {
  text: 'Text File',
  code: 'Code File', 
  folder: 'Folder'
}

export function FileEditor({ 
  isOpen, 
  onClose, 
  onSave, 
  initialFileName = '', 
  initialContent = '', 
  fileType = 'text' 
}: FileEditorProps) {
  const [fileName, setFileName] = useState(initialFileName)
  const [content, setContent] = useState(initialContent)
  const [selectedType, setSelectedType] = useState(fileType)
  const [errors, setErrors] = useState<string[]>([])
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    validateFileName()
  }, [fileName, selectedType])

  const validateFileName = () => {
    const newErrors: string[] = []
    
    // Check if filename is empty
    if (!fileName.trim()) {
      newErrors.push('File name is required')
    }
    
    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(fileName)) {
      newErrors.push('File name contains invalid characters')
    }
    
    // Check file extension
    if (fileName.includes('.')) {
      const extension = fileName.substring(fileName.lastIndexOf('.'))
      const allowedExtensions = ALLOWED_EXTENSIONS[selectedType]
      
      if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension.toLowerCase())) {
        newErrors.push(`Invalid extension for ${FILE_TYPE_NAMES[selectedType]}. Allowed: ${allowedExtensions.join(', ')}`)
      }
    } else {
      // No extension - add default based on type
      if (selectedType === 'text') {
        newErrors.push('Text files should have .txt extension')
      } else if (selectedType === 'code') {
        newErrors.push('Code files should have appropriate extension (.js, .ts, .html, etc.)')
      }
    }
    
    setErrors(newErrors)
    setIsValid(newErrors.length === 0 && fileName.trim().length > 0)
  }

  const handleSave = () => {
    if (!isValid) return
    
    let finalFileName = fileName
    let finalContent = content
    
    // Add default extension if missing
    if (!fileName.includes('.')) {
      if (selectedType === 'text') {
        finalFileName = fileName + '.txt'
      } else if (selectedType === 'code') {
        finalFileName = fileName + '.js' // Default to .js
      }
    }
    
    onSave(finalFileName, finalContent, selectedType)
    handleClose()
  }

  const handleClose = () => {
    setFileName('')
    setContent('')
    setSelectedType('text')
    setErrors([])
    setIsValid(false)
    onClose()
  }

  const getFileIcon = () => {
    switch (selectedType) {
      case 'code': return FileCode
      case 'folder': return Folder
      default: return FileText
    }
  }

  const getSampleContent = () => {
    switch (selectedType) {
      case 'text':
        return `# Sample Text File

This is a sample text file created in YukiFiles.

You can write any text content here:
- Notes
- Documentation
- Lists
- And more...

Created: ${new Date().toLocaleDateString()}
`
      case 'code':
        return `// Sample JavaScript File
// Created in YukiFiles Demo

function greetUser(name) {
  return \`Hello, \${name}! Welcome to YukiFiles.\`;
}

// Example usage
const message = greetUser('Demo User');
console.log(message);

// You can write any code here
class FileManager {
  constructor() {
    this.files = [];
  }
  
  addFile(file) {
    this.files.push(file);
  }
  
  getFiles() {
    return this.files;
  }
}

export default FileManager;
`
      default:
        return ''
    }
  }

  const insertSampleContent = () => {
    setContent(getSampleContent())
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                {(() => {
                  const Icon = getFileIcon()
                  return <Icon className="w-5 h-5 text-purple-400" />
                })()}
              </div>
              <div>
                <DialogTitle className="text-white">Create New {FILE_TYPE_NAMES[selectedType]}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {FILE_TYPE_NAMES[selectedType]}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Type className="w-4 h-4 mr-2" />
                Sample
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClose} className="text-gray-400">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* File Type Selection */}
          <div className="space-y-3">
            <label className="text-white font-medium">File Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(['text', 'code', 'folder'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border transition-all",
                    selectedType === type
                      ? "border-purple-500 bg-purple-500/20 text-white"
                      : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500"
                  )}
                >
                  {type === 'text' && <FileText className="w-4 h-4" />}
                  {type === 'code' && <FileCode className="w-4 h-4" />}
                  {type === 'folder' && <Folder className="w-4 h-4" />}
                  <span className="text-sm font-medium">{FILE_TYPE_NAMES[type]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Name Input */}
          <div className="space-y-3">
            <label className="text-white font-medium">File Name</label>
            <div className="space-y-2">
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder={selectedType === 'folder' ? 'Enter folder name' : 'Enter file name with extension'}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
              
              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Valid File Name */}
              {isValid && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Valid file name
                </div>
              )}
            </div>
          </div>

          {/* File Extensions Help */}
          {selectedType !== 'folder' && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Allowed Extensions</h4>
              <div className="flex flex-wrap gap-2">
                {ALLOWED_EXTENSIONS[selectedType].map((ext) => (
                  <Badge key={ext} variant="secondary" className="bg-gray-700 text-gray-300">
                    {ext}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Content Editor */}
          {selectedType !== 'folder' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-white font-medium">Content</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={insertSampleContent}
                  className="border-gray-600 text-gray-300"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Insert Sample
                </Button>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter file content here..."
                className="min-h-[300px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 font-mono text-sm"
              />
            </div>
          )}

          {/* Folder Creation */}
          {selectedType === 'folder' && (
            <div className="bg-gray-800/50 rounded-lg p-6 text-center">
              <Folder className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Create Folder</h3>
              <p className="text-gray-400">
                This will create a new empty folder in your file manager.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <div className="text-gray-400 text-sm">
            {selectedType === 'folder' ? 'Folder will be created empty' : 'File will be saved with your content'}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {selectedType === 'folder' ? 'Create Folder' : 'Save File'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Edit3, Eye, Save, Search, X
} from 'lucide-react'

interface SimpleFileEditorProps {
  file: {
    id: string
    name: string
    content: string
    type: string
    size: number
    lastModified: Date
  }
  onSave: (fileName: string, content: string, fileType: string) => void
  onClose: () => void
  readOnly?: boolean
}

export function SimpleFileEditor({ file, onSave, onClose, readOnly = false }: SimpleFileEditorProps) {
  const [fileName, setFileName] = useState(file.name)
  const [content, setContent] = useState(file.content)
  const [activeTab, setActiveTab] = useState('editor')
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')

  const handleReplace = () => {
    if (searchQuery) {
      const newContent = content.replace(new RegExp(searchQuery, 'g'), replaceQuery)
      setContent(newContent)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="bg-transparent border-0 text-lg font-semibold text-white p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Enter file name..."
            />
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Text Document
              </Badge>
              <span className="text-sm text-gray-400">
                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onSave(fileName, content, file.type)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save File
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-purple-500/20 p-0">
            <TabsTrigger 
              value="editor" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 p-4 min-h-0">
            <div className="relative h-full">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your content here..."
                className="w-full h-full resize-none bg-slate-800/50 border-purple-500/30 text-white font-mono focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-0"
                style={{ fontSize: '16px' }}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 p-4 min-h-0">
            <div className="h-full overflow-y-auto bg-slate-800/50 border border-purple-500/30 rounded-lg p-4">
              <div className="prose prose-invert max-w-none">
                <h1>Preview</h1>
                <div className="whitespace-pre-wrap">{content}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="flex-1 p-4 min-h-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm">Search for</label>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter search term..."
                    className="bg-slate-700/50 border-purple-500/30 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm">Replace with</label>
                  <Input
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    placeholder="Enter replacement text..."
                    className="bg-slate-700/50 border-purple-500/30 text-white mt-1"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleReplace}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  Replace All
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setReplaceQuery('')
                  }}
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  Clear
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-800/50 border-t border-purple-500/20 p-2 text-sm text-gray-400">
        <div className="flex items-center justify-between">
          <span>File: {fileName}</span>
          <span>Characters: {content.length}</span>
          <span>Lines: {content.split('\n').length}</span>
        </div>
      </div>
    </div>
  )
}
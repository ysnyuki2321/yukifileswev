"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Edit3, Eye, Save, Search, X, Undo2, Redo2, 
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Code, 
  FileText, Settings, Download, Share2, Lock, Unlock,
  Palette, Type, Zap, Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProfessionalFileEditorProps {
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

export function ProfessionalFileEditor({ file, onSave, onClose, readOnly = false }: ProfessionalFileEditorProps) {
  const [fileName, setFileName] = useState(file.name)
  const [content, setContent] = useState(file.content)
  const [activeTab, setActiveTab] = useState('editor')
  const [searchQuery, setSearchQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState('dark')
  const [wordWrap, setWordWrap] = useState(true)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [history, setHistory] = useState<string[]>([file.content])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newContent)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setContent(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setContent(history[historyIndex + 1])
    }
  }

  const handleReplace = () => {
    if (searchQuery) {
      const newContent = content.replace(new RegExp(searchQuery, 'g'), replaceQuery)
      handleContentChange(newContent)
    }
  }

  const formatText = (format: string) => {
    // Mock text formatting
    console.log('Formatting text:', format)
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <Code className="w-5 h-5" />
      case 'md':
        return <FileText className="w-5 h-5" />
      case 'json':
        return <FileText className="w-5 h-5" />
      case 'txt':
        return <FileText className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getFileTypeName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'js': return 'JavaScript'
      case 'ts': return 'TypeScript'
      case 'jsx': return 'React JSX'
      case 'tsx': return 'React TSX'
      case 'md': return 'Markdown'
      case 'json': return 'JSON'
      case 'txt': return 'Text'
      default: return 'Text Document'
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Header - Professional Style */}
      <div className={`border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 ${
        isMobile ? 'p-3' : 'p-4'
      }`}>
        <div className={`flex items-center justify-between ${
          isMobile ? 'flex-col gap-3' : 'gap-4'
        }`}>
          {/* File Info */}
          <div className={`flex items-center gap-3 min-w-0 flex-1 ${
            isMobile ? 'w-full' : ''
          }`}>
            <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
              {getFileIcon(file.type)}
            </div>
            <div className="flex-1 min-w-0">
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-transparent border-0 text-white p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-semibold"
                placeholder="Enter file name..."
              />
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                  {getFileTypeName(file.type)}
                </Badge>
                <span className="text-gray-400 text-xs">
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                </span>
                <span className="text-gray-400 text-xs">
                  {file.lastModified.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className={`flex items-center gap-2 ${
            isMobile ? 'w-full justify-center' : ''
          }`}>
            <Button
              onClick={() => onSave(fileName, content, file.type)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs"
              size={isMobile ? "sm" : "default"}
            >
              <Save className="w-4 h-4 mr-2" />
              {isMobile ? "Save" : "Save File"}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-xs"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar - Professional Features */}
      <div className="border-b border-purple-500/20 bg-slate-800/50 p-2">
        <div className={`flex items-center gap-2 ${
          isMobile ? 'flex-wrap justify-center' : 'justify-between'
        }`}>
          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Button
              onClick={() => formatText('bold')}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-purple-500/20 p-1 h-8 w-8"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => formatText('italic')}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-purple-500/20 p-1 h-8 w-8"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => formatText('underline')}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-purple-500/20 p-1 h-8 w-8"
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>

          {/* Editor Settings */}
          <div className="flex items-center gap-2">
            <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
              <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white text-xs w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-purple-500/30">
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setWordWrap(!wordWrap)}
              variant="ghost"
              size="sm"
              className={`text-xs p-1 h-8 ${wordWrap ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:text-white'}`}
            >
              Wrap
            </Button>

            <Button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              variant="ghost"
              size="sm"
              className={`text-xs p-1 h-8 ${showLineNumbers ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:text-white'}`}
            >
              Lines
            </Button>
          </div>

          {/* History Controls */}
          <div className="flex items-center gap-1">
            <Button
              onClick={undo}
              disabled={historyIndex === 0}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-purple-500/20 p-1 h-8 w-8 disabled:opacity-50"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-purple-500/20 p-1 h-8 w-8 disabled:opacity-50"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          {/* Tabs */}
          <TabsList className="grid w-full grid-cols-4 bg-transparent border-b border-purple-500/20 p-0">
            <TabsTrigger 
              value="editor" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg text-xs px-3 py-2"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Editor
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg text-xs px-3 py-2"
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg text-xs px-3 py-2"
            >
              <Search className="w-3 h-3 mr-1" />
              Find
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg text-xs px-3 py-2"
            >
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="flex-1 min-h-0">
            {/* Editor Tab */}
            <TabsContent value="editor" className="h-full p-4">
              <div className="relative h-full">
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Start typing your content here..."
                  className="w-full h-full resize-none bg-slate-800/50 border-purple-500/30 text-white font-mono focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-0"
                  style={{ 
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.6',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                  }}
                />
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="h-full p-4">
              <div className="h-full overflow-y-auto bg-slate-800/50 border border-purple-500/30 rounded-lg p-4">
                <div className="prose prose-invert max-w-none">
                  <h1 className="text-xl mb-4">Preview</h1>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>
                </div>
              </div>
            </TabsContent>

            {/* Search Tab */}
            <TabsContent value="search" className="h-full p-4">
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">Search for</label>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter search term..."
                      className="bg-slate-700/50 border-purple-500/30 text-white h-12 text-base"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">Replace with</label>
                    <Input
                      value={replaceQuery}
                      onChange={(e) => setReplaceQuery(e.target.value)}
                      placeholder="Enter replacement text..."
                      className="bg-slate-700/50 border-purple-500/30 text-white h-12 text-base"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleReplace}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs"
                    size="sm"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find & Replace
                  </Button>
                  <Button
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-xs"
                  >
                    Clear
                  </Button>
                </div>

                <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 text-sm">Search Results</h4>
                  <div className="text-gray-400 text-sm">
                    {searchQuery ? `Found ${(content.match(new RegExp(searchQuery, 'g')) || []).length} matches` : 'Enter a search term to find matches'}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="h-full p-4">
              <div className="space-y-4">
                <Card className="bg-slate-800/50 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Editor Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 text-sm block mb-2">Font Size</label>
                        <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
                          <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-purple-500/30">
                            <SelectItem value="12">12px</SelectItem>
                            <SelectItem value="14">14px</SelectItem>
                            <SelectItem value="16">16px</SelectItem>
                            <SelectItem value="18">18px</SelectItem>
                            <SelectItem value="20">20px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm block mb-2">Theme</label>
                        <Select value={theme} onValueChange={setTheme}>
                          <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-purple-500/30">
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="high-contrast">High Contrast</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={wordWrap}
                          onChange={(e) => setWordWrap(e.target.checked)}
                          className="rounded border-purple-500/30 bg-slate-700/50"
                        />
                        <span className="text-gray-300 text-sm">Word Wrap</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showLineNumbers}
                          onChange={(e) => setShowLineNumbers(e.target.checked)}
                          className="rounded border-purple-500/30 bg-slate-700/50"
                        />
                        <span className="text-gray-300 text-sm">Line Numbers</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
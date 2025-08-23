"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Database, Table, Search, Play, Download, 
  Columns, RowsIcon, Filter, SortAsc, SortDesc,
  X, Eye, Edit3, Trash2, Plus, Save, RefreshCw,
  Zap, Settings, FileText, Code, Globe, Lock, Unlock,
  Key, Hash, Calendar, User, Shield, Activity, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SimpleDatabaseEditorProps {
  file: {
    id: string
    name: string
    size?: number
  }
  onClose: () => void
  readOnly?: boolean
}

export function SimpleDatabaseEditor({ file, onClose, readOnly = false }: SimpleDatabaseEditorProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'query'>('overview')
  const [queryText, setQueryText] = useState('SELECT * FROM users LIMIT 10;')
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const executeQuery = async () => {
    // Mock query execution
    console.log('Executing query:', queryText)
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{file.name}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  SQLITE
                </Badge>
                {file.size && (
                  <Badge variant="outline" className="text-gray-300 border-gray-600">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                )}
                <Badge variant="outline" className="text-green-300 border-green-600">
                  2 Tables
                </Badge>
              </div>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Tabs */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-purple-500/20">
          <div className="overflow-x-auto">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full min-w-[600px]">
              <TabsList className="grid w-full grid-cols-3 bg-transparent border-0 p-0">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="tables" 
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
                >
                  <Table className="w-4 h-4 mr-2" />
                  Tables
                </TabsTrigger>
                <TabsTrigger 
                  value="query" 
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Query
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto h-full">
          <div className="overflow-x-auto min-w-full">
            <TabsContent value="overview" className="space-y-6 min-w-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[600px]">
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-purple-300 flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Database Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white font-medium">SQLITE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tables:</span>
                      <span className="text-white font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white font-medium">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-300 flex items-center gap-2">
                      <Table className="w-5 h-5" />
                      Tables
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-white font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Users:</span>
                      <span className="text-white font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Products:</span>
                      <span className="text-white font-medium">1</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-green-300 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-medium">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Connections:</span>
                      <span className="text-white font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime:</span>
                      <span className="text-white font-medium">24h</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tables" className="space-y-6 min-w-[600px]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Database Tables</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-300 flex items-center gap-2">
                      <Table className="w-5 h-5" />
                      users
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Columns:</span>
                      <span className="text-white">4</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rows:</span>
                      <span className="text-white">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Primary Key:</span>
                      <span className="text-white">id</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-green-300 flex items-center gap-2">
                      <Table className="w-5 h-5" />
                      products
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Columns:</span>
                      <span className="text-white">4</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rows:</span>
                      <span className="text-white">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Primary Key:</span>
                      <span className="text-white">id</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="query" className="space-y-6 min-w-[600px]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">SQL Query Editor</h3>
                <Button
                  onClick={executeQuery}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size={isMobile ? "sm" : "default"}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">SQL Query</label>
                  <Textarea
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Enter your SQL query here..."
                    className={`bg-slate-800/50 border-purple-500/30 text-white font-mono ${
                      isMobile ? 'h-32 text-sm' : 'h-40 text-base'
                    }`}
                  />
                </div>

                <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Query Results</h4>
                  <div className="text-gray-400 text-sm">
                    Click "Execute" to run your query and see results here.
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  )
}
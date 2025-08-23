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
  Key, Hash, Calendar, User, Shield, Activity, BarChart3,
  DatabaseIcon, Table2, Column, RowInsertBottom, RowDelete
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SQLiteGUIEditorProps {
  file: {
    id: string
    name: string
    size?: number
  }
  onClose: () => void
  readOnly?: boolean
}

interface TableSchema {
  name: string
  columns: Column[]
  rowCount: number
}

interface Column {
  name: string
  type: string
  nullable: boolean
  primaryKey: boolean
  defaultValue?: string
}

export function SQLiteGUIEditor({ file, onClose, readOnly = false }: SQLiteGUIEditorProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'query' | 'schema'>('overview')
  const [queryText, setQueryText] = useState('SELECT * FROM users LIMIT 10;')
  const [isMobile, setIsMobile] = useState(false)
  const [showCreateTable, setShowCreateTable] = useState(false)
  const [newTableName, setNewTableName] = useState('')
  const [newColumns, setNewColumns] = useState<Column[]>([
    { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
    { name: 'name', type: 'TEXT', nullable: false, primaryKey: false }
  ])

  // Mock database data
  const [tables, setTables] = useState<TableSchema[]>([
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
        { name: 'username', type: 'TEXT', nullable: false, primaryKey: false },
        { name: 'email', type: 'TEXT', nullable: false, primaryKey: false },
        { name: 'created_at', type: 'DATETIME', nullable: true, primaryKey: false, defaultValue: 'CURRENT_TIMESTAMP' }
      ],
      rowCount: 3
    },
    {
      name: 'products',
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
        { name: 'name', type: 'TEXT', nullable: false, primaryKey: false },
        { name: 'price', type: 'REAL', nullable: false, primaryKey: false },
        { name: 'stock', type: 'INTEGER', nullable: false, primaryKey: false, defaultValue: '0' }
      ],
      rowCount: 3
    }
  ])

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
    console.log('Executing query:', queryText)
  }

  const createTable = () => {
    if (newTableName.trim()) {
      const newTable: TableSchema = {
        name: newTableName.trim(),
        columns: [...newColumns],
        rowCount: 0
      }
      setTables([...tables, newTable])
      setNewTableName('')
      setNewColumns([
        { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
        { name: 'name', type: 'TEXT', nullable: false, primaryKey: false }
      ])
      setShowCreateTable(false)
    }
  }

  const addColumn = () => {
    setNewColumns([...newColumns, { name: '', type: 'TEXT', nullable: true, primaryKey: false }])
  }

  const removeColumn = (index: number) => {
    setNewColumns(newColumns.filter((_, i) => i !== index))
  }

  const updateColumn = (index: number, field: keyof Column, value: any) => {
    const updated = [...newColumns]
    updated[index] = { ...updated[index], [field]: value }
    setNewColumns(updated)
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl h-full">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-white font-semibold text-base truncate">{file.name}</h2>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                  SQLITE
                </Badge>
                {file.size && (
                  <Badge variant="outline" className="text-gray-300 border-gray-600 text-xs">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                )}
                <Badge variant="outline" className="text-green-300 border-green-600 text-xs">
                  {tables.length} Tables
                </Badge>
              </div>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full flex flex-col">
          {/* Tabs Header */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-purple-500/20">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-4 bg-transparent border-0 p-0 min-w-[600px]">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg text-xs px-2 py-2"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="tables" 
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg text-xs px-2 py-2"
                >
                  <Table2 className="w-3 h-3 mr-1" />
                  Tables
                </TabsTrigger>
                <TabsTrigger 
                  value="schema" 
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg text-xs px-2 py-2"
                >
                  <DatabaseIcon className="w-3 h-3 mr-1" />
                  Schema
                </TabsTrigger>
                <TabsTrigger 
                  value="query" 
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg text-xs px-2 py-2"
                >
                  <Code className="w-3 h-3 mr-1" />
                  Query
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Overview Tab - Mobile Optimized */}
            <TabsContent value="overview" className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-purple-300 flex items-center gap-2 text-sm">
                      <Database className="w-4 h-4" />
                      Database Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white font-medium">SQLITE</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Tables:</span>
                      <span className="text-white font-medium">{tables.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white font-medium">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown'}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-300 flex items-center gap-2 text-sm">
                      <Table2 className="w-4 h-4" />
                      Tables
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-white font-medium">{tables.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Users:</span>
                      <span className="text-white font-medium">{tables.find(t => t.name === 'users')?.rowCount || 0}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Products:</span>
                      <span className="text-white font-medium">{tables.find(t => t.name === 'products')?.rowCount || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-300 flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4" />
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-medium">Active</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Version:</span>
                      <span className="text-white font-medium">3.42.0</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Uptime:</span>
                      <span className="text-white font-medium">24h</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tables Tab */}
            <TabsContent value="tables" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Database Tables</h3>
                <Button
                  onClick={() => setShowCreateTable(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs"
                  size="sm"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  New Table
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tables.map((table) => (
                  <Card key={table.name} className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-blue-300 flex items-center gap-2 text-sm">
                        <Table2 className="w-4 h-4" />
                        {table.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Columns:</span>
                        <span className="text-white">{table.columns.length}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Rows:</span>
                        <span className="text-white">{table.rowCount}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Primary Key:</span>
                        <span className="text-white">{table.columns.find(c => c.primaryKey)?.name || 'None'}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Schema Tab */}
            <TabsContent value="schema" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Database Schema</h3>
                <Button
                  onClick={() => setShowCreateTable(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-xs"
                  size="sm"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Create Table
                </Button>
              </div>

              {tables.map((table) => (
                <Card key={table.name} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center gap-2 text-sm">
                      <Table2 className="w-4 h-4" />
                      {table.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-purple-500/30">
                            <th className="text-left p-2 text-purple-300">Column</th>
                            <th className="text-left p-2 text-purple-300">Type</th>
                            <th className="text-left p-2 text-purple-300">Nullable</th>
                            <th className="text-left p-2 text-purple-300">Primary Key</th>
                            <th className="text-left p-2 text-purple-300">Default</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map((column, idx) => (
                            <tr key={idx} className="border-b border-purple-500/20">
                              <td className="p-2 text-white">{column.name}</td>
                              <td className="p-2 text-blue-300">{column.type}</td>
                              <td className="p-2 text-white">{column.nullable ? 'Yes' : 'No'}</td>
                              <td className="p-2 text-white">{column.primaryKey ? 'Yes' : 'No'}</td>
                              <td className="p-2 text-gray-400">{column.defaultValue || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Query Tab */}
            <TabsContent value="query" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">SQL Query Editor</h3>
                <Button
                  onClick={executeQuery}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs"
                  size="sm"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Execute
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-gray-300 text-xs block mb-2">SQL Query</label>
                  <Textarea
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Enter your SQL query here..."
                    className={`bg-slate-800/50 border-purple-500/30 text-white font-mono text-xs ${
                      isMobile ? 'h-24' : 'h-32'
                    }`}
                  />
                </div>

                <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-3">
                  <h4 className="text-white font-medium mb-2 text-sm">Query Results</h4>
                  <div className="text-gray-400 text-xs">
                    Click "Execute" to run your query and see results here.
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Create Table Modal */}
      {showCreateTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Create New Table</h3>
              <Button
                onClick={() => setShowCreateTable(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Table Name</label>
                <Input
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Enter table name..."
                  className="bg-slate-700/50 border-purple-500/30 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm block mb-2">Columns</label>
                <div className="space-y-2">
                  {newColumns.map((column, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={column.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        placeholder="Column name"
                        className="bg-slate-700/50 border-purple-500/30 text-white text-xs flex-1"
                      />
                      <Select
                        value={column.type}
                        onValueChange={(value) => updateColumn(index, 'type', value)}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white text-xs w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-purple-500/30">
                          <SelectItem value="INTEGER">INT</SelectItem>
                          <SelectItem value="TEXT">TEXT</SelectItem>
                          <SelectItem value="REAL">REAL</SelectItem>
                          <SelectItem value="BLOB">BLOB</SelectItem>
                          <SelectItem value="DATETIME">DATETIME</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => removeColumn(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/20 p-1 h-8 w-8"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={addColumn}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Column
                </Button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={createTable}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs flex-1"
                >
                  Create Table
                </Button>
                <Button
                  onClick={() => setShowCreateTable(false)}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
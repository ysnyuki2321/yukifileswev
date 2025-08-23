"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Database, Table, Search, Play, Download, 
  Columns, RowsIcon, Filter, SortAsc, SortDesc,
  X, Eye, Edit3, Trash2, Plus, Save, RefreshCw,
  Zap, Settings, FileText, Code, Globe, Lock, Unlock,
  Key, Hash, Calendar, User, Shield, Activity, BarChart3,
  Database as DatabaseIcon, Table as TableIcon, Plus as PlusIcon,
  FileCode, HardDrive, Users, Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface AdvancedDatabaseEditorProps {
  file: {
    id: string
    name: string
    size?: number
  }
  onClose: () => void
  readOnly?: boolean
}

interface TableData {
  name: string
  columns: Column[]
  rows: any[][]
  rowCount: number
  primaryKey?: string
  indexes?: string[]
  constraints?: string[]
}

interface Column {
  name: string
  type: string
  nullable: boolean
  defaultValue?: string
  primaryKey?: boolean
  unique?: boolean
  foreignKey?: string
  description?: string
}

const DATABASE_TYPES = [
  { value: 'sqlite', label: 'SQLite', icon: Database, description: 'Lightweight, serverless database' },
  { value: 'mysql', label: 'MySQL', icon: Database, description: 'Popular open-source RDBMS' },
  { value: 'postgresql', label: 'PostgreSQL', icon: Database, description: 'Advanced open-source database' },
  { value: 'mongodb', label: 'MongoDB', icon: Database, description: 'NoSQL document database' },
  { value: 'redis', label: 'Redis', icon: Database, description: 'In-memory data structure store' },
  { value: 'sqlserver', label: 'SQL Server', icon: Database, description: 'Microsoft enterprise database' },
  { value: 'oracle', label: 'Oracle', icon: Database, description: 'Enterprise-grade RDBMS' }
]

const COLUMN_TYPES = {
  sqlite: ['INTEGER', 'REAL', 'TEXT', 'BLOB', 'BOOLEAN', 'DATE', 'DATETIME'],
  mysql: ['INT', 'BIGINT', 'VARCHAR', 'TEXT', 'BLOB', 'BOOLEAN', 'DATE', 'DATETIME', 'DECIMAL'],
  postgresql: ['INTEGER', 'BIGINT', 'VARCHAR', 'TEXT', 'BYTEA', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'NUMERIC'],
  mongodb: ['String', 'Number', 'Boolean', 'Date', 'ObjectId', 'Array', 'Object'],
  redis: ['String', 'Hash', 'List', 'Set', 'Sorted Set', 'Stream'],
  sqlserver: ['INT', 'BIGINT', 'VARCHAR', 'NVARCHAR', 'TEXT', 'BIT', 'DATE', 'DATETIME', 'DECIMAL'],
  oracle: ['NUMBER', 'VARCHAR2', 'NVARCHAR2', 'CLOB', 'BLOB', 'DATE', 'TIMESTAMP', 'NUMBER']
}

export function AdvancedDatabaseEditor({ file, onClose, readOnly = false }: AdvancedDatabaseEditorProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'query' | 'schema' | 'data' | 'security' | 'performance'>('overview')
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null)
  const [queryText, setQueryText] = useState('SELECT * FROM users LIMIT 10;')
  const [queryResults, setQueryResults] = useState<any[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [selectedDatabaseType, setSelectedDatabaseType] = useState('sqlite')
  const [showDatabaseSelector, setShowDatabaseSelector] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTable, setEditingTable] = useState<TableData | null>(null)
  const [editingColumn, setEditingColumn] = useState<Column | null>(null)
  const [showAddTable, setShowAddTable] = useState(false)
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [newTableName, setNewTableName] = useState('')
  const [newColumnName, setNewColumnName] = useState('')
  const [newColumnType, setNewColumnType] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  // Auto-detect database type from filename
  useEffect(() => {
    const detectDatabaseType = () => {
      const filename = file.name.toLowerCase()
      if (filename.includes('sqlite') || filename.includes('.db')) return 'sqlite'
      if (filename.includes('mysql') || filename.includes('.sql')) return 'mysql'
      if (filename.includes('postgres') || filename.includes('psql')) return 'postgresql'
      if (filename.includes('mongo') || filename.includes('.bson')) return 'mongodb'
      if (filename.includes('redis') || filename.includes('.rdb')) return 'redis'
      if (filename.includes('sqlserver') || filename.includes('.mdf')) return 'sqlserver'
      if (filename.includes('oracle') || filename.includes('.ora')) return 'oracle'
      return 'sqlite' // default
    }

    const detectedType = detectDatabaseType()
    setSelectedDatabaseType(detectedType)
  }, [file.name])

  // Generate mock tables
  useEffect(() => {
    try {
      const mockTables: TableData[] = [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
            { name: 'username', type: 'VARCHAR(50)', nullable: false, unique: true },
            { name: 'email', type: 'VARCHAR(100)', nullable: false, unique: true },
            { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP' }
          ],
          rows: [
            [1, 'john_doe', 'john@example.com', '2024-01-15 10:30:00'],
            [2, 'jane_smith', 'jane@example.com', '2024-01-16 14:20:00'],
            [3, 'bob_wilson', 'bob@example.com', '2024-01-17 09:15:00']
          ],
          rowCount: 3,
          primaryKey: 'id',
          indexes: ['username_idx', 'email_idx'],
          constraints: ['username_unique', 'email_unique']
        },
        {
          name: 'products',
          columns: [
            { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
            { name: 'name', type: 'VARCHAR(100)', nullable: false },
            { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
            { name: 'category', type: 'VARCHAR(50)', nullable: true }
          ],
          rows: [
            [1, 'Laptop Pro', 1299.99, 'Electronics'],
            [2, 'Wireless Mouse', 29.99, 'Accessories'],
            [3, 'USB Cable', 9.99, 'Accessories']
          ],
          rowCount: 3,
          primaryKey: 'id'
        }
      ]
      setSelectedTable(mockTables[0])
    } catch (error) {
      console.error('Error generating mock tables:', error)
    }
  }, [])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const getDatabaseIcon = (type: string) => {
    const icons = {
      sqlite: <Database className="w-6 h-6 text-white" />,
      mysql: <Database className="w-6 h-6 text-white" />,
      postgresql: <Database className="w-6 h-6 text-white" />,
      mongodb: <Database className="w-6 h-6 text-white" />,
      redis: <Database className="w-6 h-6 text-white" />,
      sqlserver: <Database className="w-6 h-6 text-white" />,
      oracle: <Database className="w-6 h-6 text-white" />
    }
    return icons[type as keyof typeof icons] || icons.sqlite
  }

  const getDatabaseColor = (type: string) => {
    switch (type) {
      case 'sqlite': return 'from-blue-500 to-cyan-500'
      case 'mysql': return 'from-orange-500 to-red-500'
      case 'postgresql': return 'from-blue-600 to-indigo-600'
      case 'mongodb': return 'from-green-500 to-emerald-500'
      case 'redis': return 'from-red-500 to-pink-500'
      case 'sqlserver': return 'from-purple-500 to-pink-500'
      case 'oracle': return 'from-red-600 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const executeQuery = async () => {
    if (!queryText.trim()) return
    
    setIsExecuting(true)
    try {
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock results based on query
      if (queryText.toLowerCase().includes('select')) {
        setQueryResults(selectedTable?.rows || [])
      } else {
        setQueryResults([{ message: 'Query executed successfully', affectedRows: 1 }])
      }
    } catch (error) {
      setQueryResults([{ error: 'Query execution failed', details: error.message }])
    } finally {
      setIsExecuting(false)
    }
  }

  const handleAddTable = () => {
    if (!newTableName.trim()) return
    
    const newTable: TableData = {
      name: newTableName,
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Primary key' }
      ],
      rows: [],
      rowCount: 0,
      primaryKey: 'id'
    }
    
    // In real app, add to database
    setNewTableName('')
    setShowAddTable(false)
  }

  const handleAddColumn = () => {
    if (!newColumnName.trim() || !newColumnType.trim()) return
    
    const newColumn: Column = {
      name: newColumnName,
      type: newColumnType,
      nullable: true,
      description: 'New column'
    }
    
    // In real app, add to database
    setNewColumnName('')
    setNewColumnType('')
    setShowAddColumn(false)
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${getDatabaseColor(selectedDatabaseType)} rounded-lg flex items-center justify-center`}>
              {getDatabaseIcon(selectedDatabaseType)}
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{file.name}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {selectedDatabaseType.toUpperCase()}
                </Badge>
                {file.size && (
                  <Badge variant="outline" className="text-gray-300 border-gray-600">
                    {formatBytes(file.size)}
                  </Badge>
                )}
                <Badge variant="outline" className="text-green-300 border-green-600">
                  {selectedTable ? 2 : 0} Tables
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Database Type Selector */}
            <Select value={selectedDatabaseType} onValueChange={setSelectedDatabaseType}>
              <SelectTrigger className="w-28 sm:w-32 md:w-40 bg-black/30 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto w-full min-w-[200px]">
                {DATABASE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="truncate">
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAddTable(true)}
              className="text-white hover:bg-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              {!isMobile && "Add Table"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Tabs */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-purple-500/20">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-transparent border-0 p-0">
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
              <TabsTrigger 
                value="schema" 
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Schema
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
              >
                <RowsIcon className="w-4 h-4 mr-2" />
                Data
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/30 text-gray-400 hover:text-white border-b-2 border-transparent data-[state=active]:border-purple-500/30 rounded-none rounded-t-lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto h-full overflow-x-auto">
          <TabsContent value="overview" className="space-y-6 min-w-[800px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[800px]">
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
                    <span className="text-white font-medium">{selectedDatabaseType.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tables:</span>
                    <span className="text-white font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size:</span>
                    <span className="text-white font-medium">{file.size ? formatBytes(file.size) : 'Unknown'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center gap-2">
                    <Table className="w-5 h-5" />
                    Table Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Rows:</span>
                    <span className="text-white font-medium">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Columns:</span>
                    <span className="text-white font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Indexes:</span>
                    <span className="text-white font-medium">3</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Query Time:</span>
                    <span className="text-white font-medium">~2ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cache Hit:</span>
                    <span className="text-white font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Connections:</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border-purple-500/20 min-w-[800px]">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Table 'users' created</span>
                    <span className="text-gray-500 text-sm ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Index 'username_idx' added</span>
                    <span className="text-gray-500 text-sm ml-auto">1 hour ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">Query executed: SELECT * FROM users</span>
                    <span className="text-gray-500 text-sm ml-auto">30 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="space-y-6 min-w-[800px]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Database Tables</h3>
              <Button
                onClick={() => setShowAddTable(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Users Table */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-400/40 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedTable({
                  name: 'users',
                  columns: [
                    { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
                    { name: 'username', type: 'VARCHAR(50)', nullable: false, unique: true },
                    { name: 'email', type: 'VARCHAR(100)', nullable: false, unique: true },
                    { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP' }
                  ],
                  rows: [
                    [1, 'john_doe', 'john@example.com', '2024-01-15 10:30:00'],
                    [2, 'jane_smith', 'jane@example.com', '2024-01-16 14:20:00'],
                    [3, 'bob_wilson', 'bob@example.com', '2024-01-17 09:15:00']
                  ],
                  rowCount: 3,
                  primaryKey: 'id',
                  indexes: ['username_idx', 'email_idx'],
                  constraints: ['username_unique', 'email_unique']
                })}>
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
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                      Has Indexes
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      Has Constraints
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Products Table */}
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 hover:border-green-400/40 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedTable({
                  name: 'products',
                  columns: [
                    { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
                    { name: 'name', type: 'VARCHAR(100)', nullable: false },
                    { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
                    { name: 'category', type: 'VARCHAR(50)', nullable: true }
                  ],
                  rows: [
                    [1, 'Laptop Pro', 1299.99, 'Electronics'],
                    [2, 'Wireless Mouse', 29.99, 'Accessories'],
                    [3, 'USB Cable', 9.99, 'Accessories']
                  ],
                  rowCount: 3,
                  primaryKey: 'id'
                })}>
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
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      Simple Structure
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="query" className="space-y-6 min-w-[800px]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">SQL Query Editor</h3>
              <Button
                onClick={executeQuery}
                disabled={isExecuting}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute Query
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Query Input */}
              <Card className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Query</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="Enter your SQL query here..."
                    className="min-h-[200px] font-mono text-sm bg-slate-800/50 border-purple-500/30 text-white"
                  />
                </CardContent>
              </Card>

              {/* Query Results */}
              <Card className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {queryResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            {Object.keys(queryResults[0]).map((key) => (
                              <th key={key} className="text-left p-2 text-purple-300 font-medium">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResults.map((row, index) => (
                            <tr key={index} className="border-b border-slate-800">
                              {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex} className="p-2 text-white">
                                  {String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Code className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p>No results yet. Execute a query to see results.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schema" className="space-y-6 min-w-[800px]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Database Schema</h3>
              <Button
                onClick={() => setShowAddColumn(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Column
              </Button>
            </div>

            {selectedTable && (
              <Card className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Table className="w-5 h-5" />
                    {selectedTable.name} Schema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-3 text-purple-300 font-medium">Column</th>
                          <th className="text-left p-3 text-purple-300 font-medium">Type</th>
                          <th className="text-left p-3 text-purple-300 font-medium">Nullable</th>
                          <th className="text-left p-3 text-purple-300 font-medium">Default</th>
                          <th className="text-left p-3 text-purple-300 font-medium">Key</th>
                          <th className="text-left p-3 text-purple-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTable.columns.map((column, index) => (
                          <tr key={index} className="border-b border-slate-800">
                            <td className="p-3 text-white font-medium">{column.name}</td>
                            <td className="p-3 text-white">{column.type}</td>
                            <td className="p-3">
                              <Badge variant={column.nullable ? "secondary" : "destructive"}>
                                {column.nullable ? "YES" : "NO"}
                              </Badge>
                            </td>
                            <td className="p-3 text-white">{column.defaultValue || "-"}</td>
                            <td className="p-3">
                              {column.primaryKey && (
                                <Badge variant="default" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                                  PRIMARY
                                </Badge>
                              )}
                              {column.unique && (
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                  UNIQUE
                                </Badge>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="text-blue-300 hover:bg-blue-500/20">
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-300 hover:bg-red-500/20">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-6 min-w-[800px]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Table Data</h3>
              <Button
                onClick={() => setShowAddColumn(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Row
              </Button>
            </div>

            {selectedTable && (
              <Card className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <RowsIcon className="w-5 h-5" />
                    {selectedTable.name} Data ({selectedTable.rowCount} rows)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          {selectedTable.columns.map((column) => (
                            <th key={column.name} className="text-left p-3 text-purple-300 font-medium">
                              {column.name}
                            </th>
                          ))}
                          <th className="text-left p-3 text-purple-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTable.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-slate-800">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="p-3 text-white">
                                {String(cell)}
                              </td>
                            ))}
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="text-blue-300 hover:bg-blue-500/20">
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-300 hover:bg-red-500/20">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-6 min-w-[800px]">
            <h3 className="text-xl font-semibold text-white">Security & Access Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-300 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    User Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Admin Access:</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Read Access:</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Write Access:</span>
                    <Switch checked={false} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-orange-300 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Encryption
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Data Encryption:</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Connection SSL:</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Backup Encryption:</span>
                    <Switch checked={false} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 min-w-[800px]">
            <h3 className="text-xl font-semibold text-white">Performance & Optimization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Query Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Query Time:</span>
                    <span className="text-white font-medium">2.3ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Slow Queries:</span>
                    <span className="text-white font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cache Hit Rate:</span>
                    <span className="text-white font-medium">95%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">CPU Usage:</span>
                    <span className="text-white font-medium">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Memory Usage:</span>
                    <span className="text-white font-medium">1.2GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Disk I/O:</span>
                    <span className="text-white font-medium">Low</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddTable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Add New Table</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tableName" className="text-gray-300">Table Name</Label>
                <Input
                  id="tableName"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Enter table name"
                  className="bg-slate-700/50 border-purple-500/30 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (newTableName.trim()) {
                      // Handle table creation
                      setShowAddTable(false)
                      setNewTableName('')
                    }
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Create Table
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddTable(false)
                    setNewTableName('')
                  }}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Column Modal */}
      {showAddColumn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Add New Column</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="columnName" className="text-gray-300">Column Name</Label>
                <Input
                  id="columnName"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Enter column name"
                  className="bg-slate-700/50 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="columnType" className="text-gray-300">Data Type</Label>
                <Select value={newColumnType} onValueChange={setNewColumnType}>
                  <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLUMN_TYPES[selectedDatabaseType as keyof typeof COLUMN_TYPES]?.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (newColumnName.trim() && newColumnType) {
                      // Handle column creation
                      setShowAddColumn(false)
                      setNewColumnName('')
                      setNewColumnType('')
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  Add Column
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddColumn(false)
                    setNewColumnName('')
                    setNewColumnType('')
                  }}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
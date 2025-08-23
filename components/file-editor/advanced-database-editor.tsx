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
  Database as DatabaseIcon, Table as TableIcon, Plus as PlusIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [selectedTable, setSelectedTable] = useState<string>('')
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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mock database structure based on type
  const getMockTables = (dbType: string): TableData[] => {
    try {
      switch (dbType) {
        case 'sqlite':
          return [
            {
              name: 'users',
              columns: [
                { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Primary key' },
                { name: 'email', type: 'TEXT', nullable: false, unique: true, description: 'User email' },
                { name: 'name', type: 'TEXT', nullable: false, description: 'Full name' },
                { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation date' },
                { name: 'plan', type: 'TEXT', nullable: true, description: 'Subscription plan' }
              ],
              rows: [
                [1, 'john@example.com', 'John Doe', '2024-01-15', 'premium'],
                [2, 'jane@example.com', 'Jane Smith', '2024-01-14', 'free'],
                [3, 'bob@example.com', 'Bob Wilson', '2024-01-13', 'enterprise']
              ],
              rowCount: 3,
              primaryKey: 'id',
              indexes: ['idx_users_email', 'idx_users_created_at'],
              constraints: ['UNIQUE(email)', 'NOT NULL(name)']
            },
            {
              name: 'files',
              columns: [
                { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true, description: 'Primary key' },
                { name: 'filename', type: 'TEXT', nullable: false, description: 'File name' },
                { name: 'size', type: 'INTEGER', nullable: false, description: 'File size in bytes' },
                { name: 'user_id', type: 'INTEGER', nullable: false, foreignKey: 'users.id', description: 'Owner user' },
                { name: 'uploaded_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Upload date' }
              ],
              rows: [
                [1, 'document.pdf', 2048576, 1, '2024-01-15 10:30:00'],
                [2, 'image.jpg', 1024000, 2, '2024-01-15 11:45:00'],
                [3, 'video.mp4', 52428800, 1, '2024-01-15 14:20:00']
              ],
              rowCount: 3,
              primaryKey: 'id',
              indexes: ['idx_files_user_id', 'idx_files_uploaded_at'],
              constraints: ['FOREIGN KEY(user_id) REFERENCES users(id)']
            }
          ]
        
        case 'mysql':
          return [
            {
              name: 'users',
              columns: [
                { name: 'id', type: 'BIGINT', nullable: false, primaryKey: true, description: 'Primary key' },
                { name: 'email', type: 'VARCHAR(255)', nullable: false, unique: true, description: 'User email' },
                { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Full name' },
                { name: 'created_at', type: 'DATETIME', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation date' }
              ],
              rows: [
                [1, 'john@example.com', 'John Doe', '2024-01-15'],
                [2, 'jane@example.com', 'Jane Smith', '2024-01-14']
              ],
              rowCount: 2,
              primaryKey: 'id',
              indexes: ['idx_users_email'],
              constraints: ['UNIQUE(email)']
            }
          ]
        
        default:
          return []
      }
    } catch (error) {
      console.error('Error generating mock tables:', error)
      return []
    }
  }

  const tables = getMockTables(selectedDatabaseType)
  const selectedTableData = tables.find(t => t.name === selectedTable)

  const handleExecuteQuery = async () => {
    if (!queryText.trim()) return
    
    setIsExecuting(true)
    try {
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock results based on query
      if (queryText.toLowerCase().includes('select')) {
        setQueryResults(selectedTableData?.rows || [])
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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getDatabaseIcon = (type: string) => {
    const dbType = DATABASE_TYPES.find(t => t.value === type)
    return dbType ? <dbType.icon className="w-4 h-4" /> : <Database className="w-4 h-4" />
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
                  {tables.length} Tables
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
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className={cn(
            "bg-black/20 border border-white/10",
            isMobile ? "p-1" : "p-2"
          )}>
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="tables" className="text-white">Tables</TabsTrigger>
            <TabsTrigger value="query" className="text-white">Query</TabsTrigger>
            <TabsTrigger value="schema" className="text-white">Schema</TabsTrigger>
            <TabsTrigger value="data" className="text-white">Data</TabsTrigger>
            <TabsTrigger value="security" className="text-white">Security</TabsTrigger>
            <TabsTrigger value="performance" className="text-white">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Database Stats */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <DatabaseIcon className="w-6 h-6 text-blue-400" />
                  <h3 className="text-white font-semibold">Database Info</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Type:</span>
                    <span className="text-white">{selectedDatabaseType.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Tables:</span>
                    <span className="text-white">{tables.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Rows:</span>
                    <span className="text-white">{tables.reduce((acc, t) => acc + t.rowCount, 0)}</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-6 h-6 text-green-400" />
                  <h3 className="text-white font-semibold">Recent Activity</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-white/60">Last query: 2 minutes ago</div>
                  <div className="text-white/60">Tables modified: 0</div>
                  <div className="text-white/60">Backup: 1 day ago</div>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <h3 className="text-white font-semibold">Performance</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-white/60">Query time: &lt; 1ms</div>
                  <div className="text-white/60">Cache hit: 95%</div>
                  <div className="text-white/60">Connections: 1</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tables" className="mt-4">
            <div className="space-y-4">
              {tables.map((table) => (
                <div key={table.name} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <TableIcon className="w-6 h-6 text-green-400" />
                      <h3 className="text-white font-semibold">{table.name}</h3>
                      <Badge variant="outline" className="text-gray-300">
                        {table.rowCount} rows
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTable(table.name)
                          setActiveTab('data')
                        }}
                        className="text-white hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingTable(table)
                          setActiveTab('schema')
                        }}
                        className="text-white hover:bg-white/10"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white/80 font-medium mb-2">Columns</h4>
                      <div className="space-y-1">
                        {table.columns.map((col) => (
                          <div key={col.name} className="flex items-center gap-2 text-sm">
                            <span className="text-white/60">{col.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {col.type}
                            </Badge>
                            {col.primaryKey && (
                              <Badge variant="outline" className="text-yellow-300 text-xs">
                                PK
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/80 font-medium mb-2">Indexes</h4>
                      <div className="space-y-1">
                        {table.indexes?.map((index) => (
                          <div key={index} className="text-sm text-white/60">
                            {index}
                          </div>
                        )) || <div className="text-sm text-white/40">No indexes</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="query" className="mt-4">
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3">SQL Query Editor</h3>
                <Textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Enter your SQL query..."
                  className="bg-black/30 border-white/20 text-white font-mono h-32 resize-none"
                />
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    onClick={handleExecuteQuery}
                    disabled={isExecuting}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    {isExecuting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Execute Query
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setQueryText('')}
                    className="text-white border-white/20"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {queryResults.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-3">Results</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          {Object.keys(queryResults[0] || {}).map((key) => (
                            <th key={key} className="text-left p-2 text-white/80 font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResults.map((row, index) => (
                          <tr key={index} className="border-b border-white/5">
                            {Object.values(row).map((value, colIndex) => (
                              <td key={colIndex} className="p-2 text-white/60">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="schema" className="mt-4">
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3">Database Schema</h3>
                <div className="space-y-4">
                  {tables.map((table) => (
                    <div key={table.name} className="border border-white/10 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <TableIcon className="w-5 h-5" />
                        {table.name}
                      </h4>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left p-2 text-white/80">Column</th>
                              <th className="text-left p-2 text-white/80">Type</th>
                              <th className="text-left p-2 text-white/80">Nullable</th>
                              <th className="text-left p-2 text-white/80">Default</th>
                              <th className="text-left p-2 text-white/80">Key</th>
                              <th className="text-left p-2 text-white/80">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {table.columns.map((col) => (
                              <tr key={col.name} className="border-b border-white/5">
                                <td className="p-2 text-white/60">{col.name}</td>
                                <td className="p-2 text-white/60">
                                  <Badge variant="secondary" className="text-xs">
                                    {col.type}
                                  </Badge>
                                </td>
                                <td className="p-2 text-white/60">
                                  <Badge variant={col.nullable ? "outline" : "secondary"} className="text-xs">
                                    {col.nullable ? "YES" : "NO"}
                                  </Badge>
                                </td>
                                <td className="p-2 text-white/60">{col.defaultValue || "-"}</td>
                                <td className="p-2 text-white/60">
                                  {col.primaryKey && <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">PK</Badge>}
                                  {col.unique && <Badge className="bg-blue-500/20 text-blue-300 text-xs">UNIQUE</Badge>}
                                </td>
                                <td className="p-2 text-white/60">{col.description || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            {selectedTableData ? (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">Table: {selectedTableData.name}</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-white/20"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Row
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-white/20"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          {selectedTableData.columns.map((col) => (
                            <th key={col.name} className="text-left p-2 text-white/80 font-medium">
                              {col.name}
                            </th>
                          ))}
                          <th className="text-left p-2 text-white/80 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTableData.rows.map((row, index) => (
                          <tr key={index} className="border-b border-white/5">
                            {row.map((value, colIndex) => (
                              <td key={colIndex} className="p-2 text-white/60">
                                {String(value)}
                              </td>
                            ))}
                            <td className="p-2">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <TableIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Select a Table</h3>
                <p className="text-white/60">Choose a table from the Tables tab to view its data</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="security" className="mt-4">
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Security Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white/80 font-medium mb-2">Access Control</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-400" />
                        <span className="text-white/60">Database encrypted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-white/60">1 active user</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/60">Password protected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white/80 font-medium mb-2">Permissions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="text-white/60">Read: All tables</div>
                      <div className="text-white/60">Write: All tables</div>
                      <div className="text-white/60">Admin: Full access</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">95%</div>
                    <div className="text-white/60 text-sm">Cache Hit Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">&lt;1ms</div>
                    <div className="text-white/60 text-sm">Avg Query Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">1</div>
                    <div className="text-white/60 text-sm">Active Connections</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Table Modal */}
      {showAddTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-white font-semibold text-lg mb-4">Add New Table</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm block mb-2">Table Name</label>
                <Input
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Enter table name..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTable} className="flex-1">
                  Create Table
                </Button>
                <Button variant="outline" onClick={() => setShowAddTable(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Column Modal */}
      {showAddColumn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-white font-semibold text-lg mb-4">Add New Column</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm block mb-2">Column Name</label>
                <Input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Enter column name..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm block mb-2">Data Type</label>
                <Select value={newColumnType} onValueChange={setNewColumnType}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select type" />
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
                <Button onClick={handleAddColumn} className="flex-1">
                  Add Column
                </Button>
                <Button variant="outline" onClick={() => setShowAddColumn(false)} className="flex-1">
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
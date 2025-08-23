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

  const mockTables = getMockTables(selectedDatabaseType)
  const selectedTableData = mockTables.find(t => t.name === selectedTable?.name)

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
    <div className="h-full flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white truncate">
              {file.name}
            </span>
          </div>
          <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-500/30">
            {selectedDatabaseType}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddTable(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
            size={isMobile ? "sm" : "default"}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isMobile ? "Add Table" : "Add New Table"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Desktop Only */}
        {!isMobile && (
          <div className="w-64 bg-slate-800/50 border-r border-slate-700 p-4">
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Database Info</h3>
              
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="text-white">{selectedDatabaseType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tables:</span>
                    <span className="text-white">{mockTables.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="text-white">{formatBytes(file.size || 0)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddTable(true)}
                    className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Table
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('query')}
                    className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Run Query
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('schema')}
                    className="w-full justify-start border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <FileCode className="w-4 h-4 mr-2" />
                    View Schema
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="bg-slate-800/50 border-b border-slate-700 rounded-none">
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="tables" className="data-[state=active]:bg-slate-700">
                <Table className="w-4 h-4 mr-2" />
                Tables
              </TabsTrigger>
              <TabsTrigger value="query" className="data-[state=active]:bg-slate-700">
                <Database className="w-4 h-4 mr-2" />
                Query
              </TabsTrigger>
              <TabsTrigger value="schema" className="data-[state=active]:bg-slate-700">
                <FileCode className="w-4 h-4 mr-2" />
                Schema
              </TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:bg-slate-700">
                <FileText className="w-4 h-4 mr-2" />
                Data
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">
                <Zap className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex-1 p-4 min-h-0">
              <div className="space-y-6">
                {/* Database Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{mockTables.length}</div>
                      <div className="text-sm text-gray-400">Total Tables</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">1,247</div>
                      <div className="text-sm text-gray-400">Total Records</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <HardDrive className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{formatBytes(file.size || 0)}</div>
                      <div className="text-sm text-gray-400">Database Size</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                      <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">99.9%</div>
                      <div className="text-sm text-gray-400">Uptime</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { action: 'Table created', table: 'users', time: '2 minutes ago', icon: Plus, color: 'text-green-400' },
                        { action: 'Data inserted', table: 'products', time: '5 minutes ago', icon: FileText, color: 'text-blue-400' },
                        { action: 'Query executed', table: 'orders', time: '10 minutes ago', icon: Database, color: 'text-purple-400' },
                        { action: 'Backup created', table: 'all', time: '1 hour ago', icon: Shield, color: 'text-yellow-400' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium">{activity.action}</div>
                            <div className="text-sm text-gray-400">
                              Table: {activity.table} • {activity.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tables" className="flex-1 p-4 min-h-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Database Tables</h3>
                  <Button
                    onClick={() => setShowAddTable(true)}
                    className="bg-green-600 hover:bg-green-700"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Table
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockTables.map((table) => (
                    <Card 
                      key={table.name}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedTable(table)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Table className="w-6 h-6 text-blue-400" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{table.name}</h4>
                            <p className="text-sm text-gray-400">{table.rowCount} records</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {table.columns.slice(0, 3).map((column, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-400 truncate">{column.name}</span>
                              <Badge variant="secondary" className="bg-slate-600/50 text-gray-300 border-0">
                                {column.type}
                              </Badge>
                            </div>
                          ))}
                          {table.columns.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{table.columns.length - 3} more columns
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="query" className="flex-1 p-4 min-h-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">SQL Query Editor</h3>
                  <Button
                    onClick={handleExecuteQuery}
                    disabled={isExecuting}
                    className="bg-blue-600 hover:bg-blue-700"
                    size={isMobile ? "sm" : "default"}
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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300 mb-2">Query</Label>
                    <Textarea
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      placeholder="SELECT * FROM users WHERE active = true;"
                      className="h-32 bg-slate-800 border-slate-600 text-white placeholder-gray-400 font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-300 mb-2">Results</Label>
                    <div className="h-32 bg-slate-800 border border-slate-600 rounded-md p-3 overflow-auto">
                      {queryResults.length > 0 ? (
                        <div className="text-sm text-white">
                          <div className="text-green-400 mb-2">Query executed successfully!</div>
                          <div className="text-gray-400">
                            {queryResults.length} row{queryResults.length !== 1 ? 's' : ''} returned
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          Query results will appear here...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Sample Queries */}
                <div>
                  <h4 className="text-white font-medium mb-3">Sample Queries</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      'SELECT * FROM users LIMIT 10;',
                      'SELECT COUNT(*) FROM products;',
                      'SELECT * FROM orders WHERE status = "pending";',
                      'DESCRIBE users;',
                      'SHOW TABLES;',
                      'SELECT AVG(price) FROM products;'
                    ].map((query, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setQueryText(query)}
                        className="justify-start text-left border-slate-600 text-gray-300 hover:bg-slate-700 font-mono text-xs"
                      >
                        {query}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schema" className="flex-1 p-4 min-h-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Database Schema</h3>
                
                {selectedTable ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">Table: {selectedTable.name}</h4>
                      <Button
                        onClick={() => setShowAddColumn(true)}
                        className="bg-green-600 hover:bg-green-700"
                        size={isMobile ? "sm" : "default"}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Column
                      </Button>
                    </div>
                    
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-600">
                                <th className="text-left p-2 text-gray-300">Column</th>
                                <th className="text-left p-2 text-gray-300">Type</th>
                                <th className="text-left p-2 text-gray-300">Null</th>
                                <th className="text-left p-2 text-gray-300">Key</th>
                                <th className="text-left p-2 text-gray-300">Default</th>
                                <th className="text-left p-2 text-gray-300">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedTable.columns.map((column, index) => (
                                <tr key={index} className="border-b border-slate-700/50">
                                  <td className="p-2 text-white">{column.name}</td>
                                  <td className="p-2 text-gray-300">{column.type}</td>
                                  <td className="p-2 text-gray-300">{column.nullable ? 'YES' : 'NO'}</td>
                                  <td className="p-2 text-gray-300">{column.primaryKey ? 'PK' : column.unique ? 'UNIQUE' : '-'}</td>
                                  <td className="p-2 text-gray-300">{column.defaultValue || '-'}</td>
                                  <td className="p-2">
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setEditingColumn(column)
                                          setShowAddColumn(true)
                                        }}
                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                      >
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
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Table className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Select a Table</h4>
                    <p className="text-gray-400">Choose a table from the Tables tab to view its schema</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="data" className="flex-1 p-4 min-h-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Data Viewer</h3>
                
                {selectedTable ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">Table: {selectedTable.name}</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-gray-300 hover:bg-slate-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-gray-300 hover:bg-slate-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Insert Row
                        </Button>
                      </div>
                    </div>
                    
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-600">
                                {selectedTable.columns.map((column, index) => (
                                  <th key={index} className="text-left p-2 text-gray-300">
                                    {column.name}
                                  </th>
                                ))}
                                <th className="text-left p-2 text-gray-300">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.from({ length: Math.min(5, selectedTable.rowCount) }, (_, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-slate-700/50">
                                  {selectedTable.columns.map((column, colIndex) => (
                                    <td key={colIndex} className="p-2 text-gray-300">
                                      {column.type === 'VARCHAR' ? `Sample ${column.name} ${rowIndex + 1}` :
                                       column.type === 'INT' ? Math.floor(Math.random() * 1000) :
                                       column.type === 'BOOLEAN' ? (Math.random() > 0.5 ? 'true' : 'false') :
                                       column.type === 'DATE' ? new Date().toISOString().split('T')[0] :
                                       'Sample data'}
                                    </td>
                                  ))}
                                  <td className="p-2">
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="mt-4 text-center text-sm text-gray-400">
                          Showing 5 of {selectedTable.rowCount} records
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Select a Table</h4>
                    <p className="text-gray-400">Choose a table from the Tables tab to view its data</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="security" className="flex-1 p-4 min-h-0">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Security & Access Control</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Permissions */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">User Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { user: 'admin@company.com', role: 'Administrator', permissions: ['ALL'] },
                          { user: 'dev@company.com', role: 'Developer', permissions: ['SELECT', 'INSERT', 'UPDATE'] },
                          { user: 'readonly@company.com', role: 'Read Only', permissions: ['SELECT'] }
                        ].map((user, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium truncate">{user.user}</div>
                              <div className="text-sm text-gray-400">{user.role}</div>
                            </div>
                            <div className="flex gap-1">
                              {user.permissions.map((perm, permIndex) => (
                                <Badge key={permIndex} variant="secondary" className="bg-slate-600/50 text-gray-300 border-0">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Security Settings */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">SSL Connection</span>
                          <Switch checked={true} className="data-[state=checked]:bg-green-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Password Authentication</span>
                          <Switch checked={true} className="data-[state=checked]:bg-green-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Two-Factor Auth</span>
                          <Switch checked={false} className="data-[state=checked]:bg-green-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Audit Logging</span>
                          <Switch checked={true} className="data-[state=checked]:bg-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Access Logs */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Access Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { user: 'admin@company.com', action: 'SELECT', table: 'users', time: '2 minutes ago', ip: '192.168.1.100' },
                        { user: 'dev@company.com', action: 'INSERT', table: 'products', time: '5 minutes ago', ip: '192.168.1.101' },
                        { user: 'readonly@company.com', action: 'SELECT', table: 'orders', time: '10 minutes ago', ip: '192.168.1.102' }
                      ].map((log, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium">{log.user}</div>
                            <div className="text-sm text-gray-400">
                              {log.action} on {log.table} • {log.time} • {log.ip}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="flex-1 p-4 min-h-0">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Performance Monitoring</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Query Response Time</span>
                            <span className="text-white">45ms</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Connection Pool</span>
                            <span className="text-white">12/20</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Cache Hit Rate</span>
                            <span className="text-white">87%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Slow Queries */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Slow Queries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { query: 'SELECT * FROM orders WHERE date > "2024-01-01"', time: '2.3s', table: 'orders' },
                          { query: 'JOIN users ON orders.user_id = users.id', time: '1.8s', table: 'orders, users' },
                          { query: 'COUNT(*) FROM products GROUP BY category', time: '1.2s', table: 'products' }
                        ].map((slowQuery, index) => (
                          <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                            <div className="text-white font-medium text-sm truncate">{slowQuery.query}</div>
                            <div className="text-sm text-gray-400">
                              {slowQuery.time} • Table: {slowQuery.table}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Optimization Suggestions */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Optimization Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { suggestion: 'Add index on users.email column', impact: 'High', effort: 'Low' },
                        { suggestion: 'Optimize JOIN queries with proper indexes', impact: 'Medium', effort: 'Medium' },
                        { suggestion: 'Consider partitioning large tables by date', impact: 'High', effort: 'High' }
                      ].map((suggestion, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-yellow-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium">{suggestion.suggestion}</div>
                            <div className="text-sm text-gray-400">
                              Impact: {suggestion.impact} • Effort: {suggestion.effort}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-300">Table Name</Label>
                <Input
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Enter table name..."
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAddTable}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  {editingTable ? 'Update Table' : 'Create Table'}
                </Button>
                <Button
                  onClick={() => {
                    setShowAddTable(false)
                    setEditingTable(null)
                    setNewTableName('')
                  }}
                  variant="outline"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {editingColumn ? 'Edit Column' : 'Add New Column'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-300">Column Name</Label>
                <Input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Enter column name..."
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-300">Data Type</Label>
                <Select value={newColumnType} onValueChange={setNewColumnType}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="VARCHAR">VARCHAR</SelectItem>
                    <SelectItem value="INT">INT</SelectItem>
                    <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                    <SelectItem value="DATE">DATE</SelectItem>
                    <SelectItem value="TEXT">TEXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleAddColumn}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  {editingColumn ? 'Update Column' : 'Add Column'}
                </Button>
                <Button
                  onClick={() => {
                    setShowAddColumn(false)
                    setEditingColumn(null)
                    setNewColumnName('')
                    setNewColumnType('VARCHAR')
                  }}
                  variant="outline"
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
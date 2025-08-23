"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Database, Table, Search, Play, Download, 
  Columns, RowsIcon, Filter, SortAsc, SortDesc,
  X, Eye, Edit3, Trash2, Plus, Save, RefreshCw,
  Zap, Settings, FileText, Code, Globe
} from "lucide-react"

interface DatabaseEditorProps {
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
  columns: string[]
  rows: any[][]
  rowCount: number
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

export function DatabaseEditor({ file, onClose, readOnly = false }: DatabaseEditorProps) {
  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'schema'>('tables')
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [queryText, setQueryText] = useState('SELECT * FROM users LIMIT 10;')
  const [queryResults, setQueryResults] = useState<any[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [selectedDatabaseType, setSelectedDatabaseType] = useState('sqlite')
  const [showDatabaseSelector, setShowDatabaseSelector] = useState(false)

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

  // Mock database structure based on type
  const getMockTables = (dbType: string): TableData[] => {
    try {
      switch (dbType) {
        case 'sqlite':
          return [
            {
              name: 'users',
              columns: ['id', 'email', 'name', 'created_at', 'plan'],
              rows: [
                [1, 'john@example.com', 'John Doe', '2024-01-15', 'premium'],
                [2, 'jane@example.com', 'Jane Smith', '2024-01-14', 'free'],
                [3, 'bob@example.com', 'Bob Wilson', '2024-01-13', 'enterprise']
              ],
              rowCount: 3
            },
            {
              name: 'files',
              columns: ['id', 'filename', 'size', 'user_id', 'uploaded_at'],
              rows: [
                [1, 'document.pdf', 2048576, 1, '2024-01-15 10:30:00'],
                [2, 'image.jpg', 1024000, 2, '2024-01-15 11:45:00'],
                [3, 'video.mp4', 52428800, 1, '2024-01-15 14:20:00']
              ],
              rowCount: 3
            }
          ]
        
        case 'mysql':
          return [
            {
              name: 'customers',
              columns: ['customer_id', 'first_name', 'last_name', 'email', 'status'],
              rows: [
                [1, 'Alice', 'Johnson', 'alice@example.com', 'active'],
                [2, 'Bob', 'Brown', 'bob@example.com', 'inactive'],
                [3, 'Carol', 'Davis', 'carol@example.com', 'active']
              ],
              rowCount: 3
            }
          ]
        
        case 'postgresql':
          return [
            {
              name: 'products',
              columns: ['product_id', 'name', 'price', 'category', 'stock'],
              rows: [
                [1, 'Laptop', 999.99, 'Electronics', 50],
                [2, 'Mouse', 29.99, 'Accessories', 200],
                [3, 'Keyboard', 79.99, 'Accessories', 100]
              ],
              rowCount: 3
            }
          ]
        
        case 'mongodb':
          return [
            {
              name: 'documents',
              columns: ['_id', 'title', 'content', 'tags', 'created_at'],
              rows: [
                ['507f1f77bcf86cd799439011', 'Sample Doc', 'Content here', '["tag1", "tag2"]', '2024-01-15'],
                ['507f1f77bcf86cd799439012', 'Another Doc', 'More content', '["tag3"]', '2024-01-16']
              ],
              rowCount: 2
            }
          ]
        
        default:
          return [
            {
              name: 'data',
              columns: ['id', 'value', 'timestamp'],
              rows: [
                [1, 'Sample data', '2024-01-15 10:00:00'],
                [2, 'More data', '2024-01-15 11:00:00']
              ],
              rowCount: 2
            }
          ]
      }
    } catch (error) {
      console.error('Error generating mock tables:', error)
      return [
        {
          name: 'error_table',
          columns: ['id', 'error'],
          rows: [['error', 'Failed to generate mock data']],
          rowCount: 1
        }
      ]
    }
  }

  const mockTables = getMockTables(selectedDatabaseType)

  const executeQuery = async () => {
    setIsExecuting(true)
    
    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock query results based on query text and database type
    if (queryText.toLowerCase().includes('users') || queryText.toLowerCase().includes('customers')) {
      setQueryResults(mockTables[0].rows.map(row => {
        const columns = mockTables[0].columns
        return columns.reduce((obj, col, index) => {
          obj[col] = row[index]
          return obj
        }, {} as any)
      }))
    } else if (queryText.toLowerCase().includes('files') || queryText.toLowerCase().includes('products')) {
      setQueryResults(mockTables[1]?.rows.map(row => {
        const columns = mockTables[1].columns
        return columns.reduce((obj, col, index) => {
          obj[col] = row[index]
          return obj
        }, {} as any)
      }) || [])
    } else {
      setQueryResults([{ result: 'Query executed successfully', rows_affected: 3, database_type: selectedDatabaseType }])
    }
    
    setIsExecuting(false)
  }

  const formatBytes = (bytes: number): string => {
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
    <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl">
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
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Database Type Selector */}
            <Select value={selectedDatabaseType} onValueChange={setSelectedDatabaseType}>
              <SelectTrigger className="w-32 sm:w-40 bg-black/30 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30 max-h-60 overflow-y-auto">
                {DATABASE_TYPES.map((dbType) => (
                  <SelectItem key={dbType.value} value={dbType.value} className="text-white hover:bg-purple-500/20">
                    <div className="flex items-center gap-2">
                      <dbType.icon className="w-4 h-4" />
                      <span className="truncate">{dbType.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-purple-500/20">
        {[
          { key: 'tables', label: 'Tables', icon: Table },
          { key: 'query', label: 'Query Editor', icon: Code },
          { key: 'schema', label: 'Schema', icon: Columns }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Database Tables</h3>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {mockTables.length} tables
              </Badge>
            </div>
            
            <div className="grid gap-4">
              {mockTables.map((table) => (
                <motion.div
                  key={table.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/20 border border-purple-500/20 rounded-xl p-4 hover:bg-black/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Table className="w-5 h-5 text-purple-400" />
                      <h4 className="text-white font-medium">{table.name}</h4>
                      <Badge variant="outline" className="text-gray-300 border-gray-600">
                        {table.rowCount} rows
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTable(table.name)
                        setActiveTab('query')
                        setQueryText(`SELECT * FROM ${table.name} LIMIT 10;`)
                      }}
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Data
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Columns:</div>
                    <div className="flex flex-wrap gap-2">
                      {table.columns.map((column) => (
                        <Badge key={column} variant="outline" className="text-gray-300 border-gray-600 text-xs">
                          {column}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Query Editor Tab */}
        {activeTab === 'query' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Query Editor</h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {selectedDatabaseType.toUpperCase()}
                </Badge>
                <Button
                  onClick={executeQuery}
                  disabled={isExecuting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isExecuting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Execute Query
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">SQL Query</label>
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  className="w-full h-32 px-3 py-2 bg-black/30 border border-purple-500/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white font-mono text-sm"
                  placeholder="Enter your SQL query here..."
                />
              </div>
              
              {queryResults.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Results</label>
                  <div className="bg-black/30 border border-purple-500/30 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-purple-500/20">
                          <tr>
                            {Object.keys(queryResults[0]).map((key) => (
                              <th key={key} className="px-4 py-2 text-left text-purple-300 font-medium">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResults.map((row, index) => (
                            <tr key={index} className="border-t border-purple-500/10 hover:bg-purple-500/5">
                              {Object.values(row).map((value, colIndex) => (
                                <td key={colIndex} className="px-4 py-2 text-gray-300">
                                  {typeof value === 'string' && value.length > 50 
                                    ? value.substring(0, 50) + '...' 
                                    : String(value)
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schema Tab */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Database Schema</h3>
            
            <div className="grid gap-4">
              {mockTables.map((table) => (
                <div key={table.name} className="bg-black/20 border border-purple-500/20 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Table className="w-5 h-5 text-purple-400" />
                    {table.name}
                  </h4>
                  
                  <div className="space-y-2">
                    {table.columns.map((column, index) => (
                      <div key={column} className="flex items-center justify-between p-2 bg-black/20 rounded">
                        <span className="text-gray-300">{column}</span>
                        <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                          {index === 0 ? 'PRIMARY KEY' : 'VARCHAR(255)'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
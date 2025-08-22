"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Database, Table, Search, Play, Download, 
  Columns, RowsIcon, Filter, SortAsc, SortDesc,
  X, Eye, Edit3, Trash2, Plus, Save, RefreshCw
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

export function DatabaseEditor({ file, onClose, readOnly = false }: DatabaseEditorProps) {
  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'schema'>('tables')
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [queryText, setQueryText] = useState('SELECT * FROM users LIMIT 10;')
  const [queryResults, setQueryResults] = useState<any[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  // Mock database structure
  const mockTables: TableData[] = [
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
    },
    {
      name: 'shares',
      columns: ['id', 'file_id', 'token', 'expires_at', 'password_protected'],
      rows: [
        [1, 1, 'abc123xyz', '2024-01-22 10:30:00', false],
        [2, 2, 'def456uvw', '2024-01-18 11:45:00', true],
        [3, 3, 'ghi789rst', null, false]
      ],
      rowCount: 3
    }
  ]

  const executeQuery = async () => {
    setIsExecuting(true)
    
    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock query results based on query text
    if (queryText.toLowerCase().includes('users')) {
      setQueryResults(mockTables[0].rows.map(row => ({
        id: row[0], email: row[1], name: row[2], created_at: row[3], plan: row[4]
      })))
    } else if (queryText.toLowerCase().includes('files')) {
      setQueryResults(mockTables[1].rows.map(row => ({
        id: row[0], filename: row[1], size: row[2], user_id: row[3], uploaded_at: row[4]
      })))
    } else {
      setQueryResults([{ result: 'Query executed successfully', rows_affected: 3 }])
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

  const renderTablesTab = () => (
    <div className="space-y-4">
      {/* Tables List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockTables.map((table) => (
          <motion.button
            key={table.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTable(table.name)}
            className={`p-4 rounded-lg border text-left transition-all ${
              selectedTable === table.name
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-700 bg-black/20 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Table className="w-4 h-4 text-purple-400" />
              <span className="font-medium text-white">{table.name}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Columns className="w-3 h-3" />
                <span>{table.columns.length} columns</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <RowsIcon className="w-3 h-3" />
                <span>{table.rowCount} rows</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Table Data */}
      {selectedTable && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 rounded-lg border border-gray-700"
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Table: {selectedTable}</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="border-gray-600">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh
                </Button>
                {!readOnly && (
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Row
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  {mockTables.find(t => t.name === selectedTable)?.columns.map((column) => (
                    <th key={column} className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {column}
                    </th>
                  ))}
                  {!readOnly && <th className="p-3 text-left text-xs font-medium text-gray-300">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {mockTables.find(t => t.name === selectedTable)?.rows.map((row, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-black/20">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-3 text-sm text-gray-300">
                        {typeof cell === 'number' && cell > 1000000 ? formatBytes(cell) : String(cell)}
                      </td>
                    ))}
                    {!readOnly && (
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="w-6 h-6 p-0">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="w-6 h-6 p-0 text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )

  const renderQueryTab = () => (
    <div className="space-y-4">
      {/* Query Editor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">SQL Query</label>
        <div className="relative">
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className="w-full h-32 p-3 bg-black/30 border border-gray-700 rounded-lg text-white font-mono text-sm resize-none allow-select"
            placeholder="Enter your SQL query here..."
            readOnly={readOnly}
          />
          {!readOnly && (
            <Button
              onClick={executeQuery}
              disabled={isExecuting || !queryText.trim()}
              className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              {isExecuting ? (
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
              ) : (
                <Play className="w-3 h-3 mr-1" />
              )}
              Execute
            </Button>
          )}
        </div>
      </div>

      {/* Query Results */}
      {queryResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 rounded-lg border border-gray-700"
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Query Results</h3>
              <Badge className="bg-green-500/20 text-green-400">
                {queryResults.length} rows
              </Badge>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-64">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  {Object.keys(queryResults[0] || {}).map((key) => (
                    <th key={key} className="p-3 text-left text-xs font-medium text-gray-300 uppercase">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResults.map((row, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-black/20">
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="p-3 text-sm text-gray-300">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )

  const renderSchemaTab = () => (
    <div className="space-y-4">
      {mockTables.map((table) => (
        <motion.div
          key={table.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 rounded-lg border border-gray-700 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Table className="w-4 h-4 text-purple-400" />
            <h3 className="text-white font-medium">{table.name}</h3>
            <Badge className="bg-purple-500/20 text-purple-400 text-xs">
              {table.rowCount} rows
            </Badge>
          </div>
          
          <div className="space-y-2">
            {table.columns.map((column, index) => (
              <div key={column} className="flex items-center justify-between p-2 bg-black/20 rounded">
                <div className="flex items-center gap-2">
                  <Columns className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-white font-mono">{column}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {index === 0 ? 'PRIMARY KEY' : 
                   column.includes('email') ? 'VARCHAR' :
                   column.includes('id') ? 'INTEGER' :
                   column.includes('at') ? 'DATETIME' :
                   column.includes('size') ? 'BIGINT' : 'TEXT'}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-purple-500/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Database className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Database Editor</h2>
                  <p className="text-sm text-gray-400">{file.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {readOnly && (
                  <Badge className="bg-yellow-500/20 text-yellow-400">Read Only</Badge>
                )}
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 py-4 border-b border-purple-500/10 flex-shrink-0">
            <div className="flex gap-2">
              {[
                { key: 'tables', label: 'Tables', icon: Table },
                { key: 'query', label: 'Query', icon: Play },
                { key: 'schema', label: 'Schema', icon: Columns }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === key
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'tables' && renderTablesTab()}
                {activeTab === 'query' && renderQueryTab()}
                {activeTab === 'schema' && renderSchemaTab()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-purple-500/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{mockTables.length} tables</span>
                <span>{mockTables.reduce((acc, t) => acc + t.rowCount, 0)} total rows</span>
                <span>{file.size ? formatBytes(file.size) : 'Unknown size'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
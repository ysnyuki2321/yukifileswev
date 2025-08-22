"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Server, Users, CreditCard, Database, Settings, 
  Plus, Trash2, Edit3, Eye, Shield, Zap,
  HardDrive, Cpu, MemoryStick, Network, Terminal,
  DollarSign, TrendingUp, AlertTriangle, CheckCircle,
  Monitor, Globe, Lock, Key, UserCheck, UserX,
  Archive, Download, Upload, RefreshCw, Search,
  Filter, SortAsc, Activity, BarChart3, PieChart
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NodeInfo {
  id: string
  name: string
  ip: string
  status: 'online' | 'offline' | 'maintenance'
  cpu: number
  memory: number
  disk: number
  location: string
  users: number
}

interface UserInfo {
  id: string
  email: string
  name: string
  plan: 'free' | 'premium' | 'enterprise'
  storage: { used: number; total: number }
  status: 'active' | 'suspended' | 'pending'
  lastLogin: string
  joinDate: string
}

interface Transaction {
  id: string
  user: string
  amount: number
  type: 'subscription' | 'storage' | 'bandwidth'
  status: 'completed' | 'pending' | 'failed'
  date: string
  method: 'stripe' | 'paypal' | 'crypto'
}

export function AdminDemo() {
  const [activeTab, setActiveTab] = useState<'nodes' | 'users' | 'payments' | 'analytics'>('nodes')
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null)
  const [showNodeModal, setShowNodeModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const nodes: NodeInfo[] = [
    { id: '1', name: 'US-East-1', ip: '192.168.1.10', status: 'online', cpu: 45, memory: 67, disk: 23, location: 'New York', users: 1250 },
    { id: '2', name: 'EU-West-1', ip: '192.168.1.11', status: 'online', cpu: 32, memory: 54, disk: 78, location: 'London', users: 890 },
    { id: '3', name: 'Asia-1', ip: '192.168.1.12', status: 'maintenance', cpu: 0, memory: 0, disk: 45, location: 'Singapore', users: 0 },
    { id: '4', name: 'US-West-1', ip: '192.168.1.13', status: 'offline', cpu: 0, memory: 0, disk: 12, location: 'California', users: 0 }
  ]

  const users: UserInfo[] = [
    { id: '1', email: 'john@example.com', name: 'John Doe', plan: 'premium', storage: { used: 2.5, total: 100 }, status: 'active', lastLogin: '2 hours ago', joinDate: '2023-01-15' },
    { id: '2', email: 'jane@example.com', name: 'Jane Smith', plan: 'enterprise', storage: { used: 45.2, total: 500 }, status: 'active', lastLogin: '1 day ago', joinDate: '2022-11-22' },
    { id: '3', email: 'bob@example.com', name: 'Bob Wilson', plan: 'free', storage: { used: 0.8, total: 5 }, status: 'suspended', lastLogin: '1 week ago', joinDate: '2024-01-03' }
  ]

  const transactions: Transaction[] = [
    { id: 'tx_001', user: 'john@example.com', amount: 9.99, type: 'subscription', status: 'completed', date: '2024-01-15', method: 'stripe' },
    { id: 'tx_002', user: 'jane@example.com', amount: 49.99, type: 'subscription', status: 'completed', date: '2024-01-14', method: 'paypal' },
    { id: 'tx_003', user: 'bob@example.com', amount: 2.99, type: 'storage', status: 'pending', date: '2024-01-13', method: 'crypto' }
  ]

  const handleAddNode = () => {
    setSelectedNode(null)
    setShowNodeModal(true)
  }

  const handleEditNode = (node: NodeInfo) => {
    setSelectedNode(node)
    setShowNodeModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': case 'active': case 'completed': return 'bg-green-500'
      case 'offline': case 'suspended': case 'failed': return 'bg-red-500'
      case 'maintenance': case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const renderNodesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Server Nodes</h3>
          <p className="text-gray-400">Manage your distributed server infrastructure</p>
        </div>
        <Button onClick={handleAddNode} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Node
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Server className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Online Nodes</p>
                <p className="text-xl font-bold text-white">{nodes.filter(n => n.status === 'online').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-xl font-bold text-white">{nodes.reduce((acc, n) => acc + n.users, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <HardDrive className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg Disk Usage</p>
                <p className="text-xl font-bold text-white">{Math.round(nodes.reduce((acc, n) => acc + n.disk, 0) / nodes.length)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Cpu className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg CPU Usage</p>
                <p className="text-xl font-bold text-white">{Math.round(nodes.reduce((acc, n) => acc + n.cpu, 0) / nodes.length)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nodes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {nodes.map((node) => (
          <Card key={node.id} className="bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`} />
                  <div>
                    <CardTitle className="text-white text-lg">{node.name}</CardTitle>
                    <p className="text-sm text-gray-400">{node.ip} • {node.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditNode(node)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Terminal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">CPU</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all" 
                        style={{ width: `${node.cpu}%` }}
                      />
                    </div>
                    <span className="text-white font-medium">{node.cpu}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400">Memory</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{ width: `${node.memory}%` }}
                      />
                    </div>
                    <span className="text-white font-medium">{node.memory}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400">Disk</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all" 
                        style={{ width: `${node.disk}%` }}
                      />
                    </div>
                    <span className="text-white font-medium">{node.disk}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-sm text-gray-400">{node.users} active users</span>
                <Badge variant="outline" className={`${getStatusColor(node.status)} text-white border-0`}>
                  {node.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">User Management</h3>
          <p className="text-gray-400">Manage user accounts and subscriptions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                         <Input 
               placeholder="Search users..." 
               className="pl-10 bg-black/30 border-gray-700 allow-select"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr className="text-left">
                  <th className="p-4 text-gray-300 font-medium">User</th>
                  <th className="p-4 text-gray-300 font-medium">Plan</th>
                  <th className="p-4 text-gray-300 font-medium">Storage</th>
                  <th className="p-4 text-gray-300 font-medium">Status</th>
                  <th className="p-4 text-gray-300 font-medium">Last Login</th>
                  <th className="p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-black/20">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        className={`${
                          user.plan === 'enterprise' ? 'bg-purple-500' : 
                          user.plan === 'premium' ? 'bg-blue-500' : 'bg-gray-500'
                        } text-white`}
                      >
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${(user.storage.used / user.storage.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {user.storage.used}GB / {user.storage.total}GB
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(user.status)} text-white border-0`}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-300">{user.lastLogin}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                          <UserX className="w-4 h-4" />
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
  )

  const renderPaymentsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Payment & Transactions</h3>
          <p className="text-gray-400">Monitor revenue and transaction history</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Monthly Revenue</p>
                <p className="text-xl font-bold text-white">$12,450</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Growth</p>
                <p className="text-xl font-bold text-white">+23.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Transactions</p>
                <p className="text-xl font-bold text-white">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-xl font-bold text-white">{transactions.filter(t => t.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr className="text-left">
                  <th className="p-4 text-gray-300 font-medium">Transaction ID</th>
                  <th className="p-4 text-gray-300 font-medium">User</th>
                  <th className="p-4 text-gray-300 font-medium">Amount</th>
                  <th className="p-4 text-gray-300 font-medium">Type</th>
                  <th className="p-4 text-gray-300 font-medium">Method</th>
                  <th className="p-4 text-gray-300 font-medium">Status</th>
                  <th className="p-4 text-gray-300 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-800 hover:bg-black/20">
                    <td className="p-4 text-white font-mono text-sm">{tx.id}</td>
                    <td className="p-4 text-gray-300">{tx.user}</td>
                    <td className="p-4 text-white font-medium">${tx.amount}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-gray-300">
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-300 capitalize">{tx.method}</td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(tx.status)} text-white border-0`}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-300">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">System Analytics</h3>
          <p className="text-gray-400">Monitor system performance and usage metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-white">1,234,567</p>
              </div>
              <Archive className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Bandwidth</p>
                <p className="text-2xl font-bold text-white">45.2 TB</p>
              </div>
              <Network className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-white">892 GB</p>
              </div>
              <Database className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">API Calls</p>
                <p className="text-2xl font-bold text-white">2.1M</p>
              </div>
              <Activity className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Traffic Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">Chart visualization would be here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Resource Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-400">Pie chart would be here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-black/40 rounded-lg border border-purple-500/20">
        {[
          { key: 'nodes', label: 'Server Nodes', icon: Server },
          { key: 'users', label: 'Users', icon: Users },
          { key: 'payments', label: 'Payments', icon: CreditCard },
          { key: 'analytics', label: 'Analytics', icon: BarChart3 }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === key
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-black/40'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'nodes' && renderNodesTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </motion.div>
      </AnimatePresence>

      {/* Node Modal */}
      <AnimatePresence>
        {showNodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowNodeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black/90 border border-purple-500/30 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {selectedNode ? 'Edit Node' : 'Add New Node'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Node Name</label>
                                     <Input 
                     placeholder="e.g., US-East-2" 
                     className="bg-black/30 border-gray-700 allow-select"
                    defaultValue={selectedNode?.name}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">IP Address</label>
                  <Input 
                    placeholder="192.168.1.10" 
                    className="bg-black/30 border-gray-700"
                    defaultValue={selectedNode?.ip}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Location</label>
                  <Input 
                    placeholder="New York" 
                    className="bg-black/30 border-gray-700"
                    defaultValue={selectedNode?.location}
                  />
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <Button 
                    onClick={() => setShowNodeModal(false)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {selectedNode ? 'Update Node' : 'Add Node'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNodeModal(false)}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
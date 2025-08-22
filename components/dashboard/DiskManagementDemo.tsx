"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  HardDrive, Server, Terminal, Globe, Zap, Shield,
  Database, Cloud, Cpu, MemoryStick, Wifi, Activity,
  Settings, RefreshCw, AlertTriangle, CheckCircle,
  Sparkles, TrendingUp, BarChart3
} from "lucide-react"
import { motion } from "framer-motion"

interface DiskManagementDemoProps {
  isDemoMode?: boolean
}

interface ServerNode {
  id: string
  name: string
  location: string
  ip: string
  status: 'online' | 'offline' | 'maintenance'
  cpu: number
  memory: number
  disk: number
  bandwidth: number
  uptime: string
  users: number
}

interface StorageAllocation {
  userId: string
  userName: string
  allocated: number
  used: number
  plan: string
  lastAccess: string
}

export default function DiskManagementDemo({ isDemoMode = true }: DiskManagementDemoProps) {
  const [selectedNode, setSelectedNode] = useState<string>('node-1')
  const [isConnecting, setIsConnecting] = useState(false)
  const [showAllocations, setShowAllocations] = useState(false)
  const [sshCommand, setSshCommand] = useState('')

  const serverNodes: ServerNode[] = [
    {
      id: 'node-1',
      name: 'US-East-1',
      location: 'Virginia, USA',
      ip: '192.168.1.100',
      status: 'online',
      cpu: 45,
      memory: 67,
      disk: 78,
      bandwidth: 34,
      uptime: '99.9%',
      users: 1247
    },
    {
      id: 'node-2', 
      name: 'EU-West-1',
      location: 'Frankfurt, Germany',
      ip: '192.168.1.101',
      status: 'online',
      cpu: 23,
      memory: 45,
      disk: 56,
      bandwidth: 67,
      uptime: '99.8%',
      users: 892
    },
    {
      id: 'node-3',
      name: 'Asia-Pacific',
      location: 'Singapore',
      ip: '192.168.1.102', 
      status: 'maintenance',
      cpu: 0,
      memory: 0,
      disk: 89,
      bandwidth: 12,
      uptime: '98.5%',
      users: 634
    }
  ]

  const storageAllocations: StorageAllocation[] = [
    {
      userId: 'user_001',
      userName: 'alice@company.com',
      allocated: 50, // GB
      used: 32.5,
      plan: 'Pro',
      lastAccess: '2 hours ago'
    },
    {
      userId: 'user_002',
      userName: 'bob@startup.io',
      allocated: 2,
      used: 1.8,
      plan: 'Free',
      lastAccess: '1 day ago'
    },
    {
      userId: 'user_003',
      userName: 'carol@enterprise.com',
      allocated: 1000,
      used: 567,
      plan: 'Enterprise',
      lastAccess: '5 minutes ago'
    }
  ]

  const simulateSSHConnection = async () => {
    setIsConnecting(true)
    
    const commands = [
      'Connecting to server...',
      'SSH connection established',
      'Checking disk usage...',
      'df -h /var/lib/yukifiles',
      'Filesystem      Size  Used Avail Use% Mounted on',
      '/dev/sda1       2.0T  1.2T  800G  60% /var/lib/yukifiles',
      'Analyzing user storage...',
      'Connection complete'
    ]
    
    for (const command of commands) {
      setSshCommand(prev => prev + command + '\n')
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsConnecting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400'
      case 'offline': return 'text-red-400' 
      case 'maintenance': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'offline': return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'maintenance': return <Settings className="w-4 h-4 text-yellow-400" />
      default: return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const selectedNodeData = serverNodes.find(node => node.id === selectedNode)

  return (
    <div className="space-y-6">
      {/* Server Nodes Overview */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Server className="w-5 h-5" />
            Server Infrastructure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {serverNodes.map((node) => (
              <motion.button
                key={node.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedNode(node.id)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  selectedNode === node.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{node.name}</h3>
                  {getStatusIcon(node.status)}
                </div>
                
                <p className="text-gray-400 text-sm mb-2">{node.location}</p>
                <p className="text-gray-500 text-xs mb-3">IP: {node.ip}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">CPU</span>
                    <span className={getStatusColor(node.status)}>{node.cpu}%</span>
                  </div>
                  <Progress value={node.cpu} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Memory</span>
                    <span className={getStatusColor(node.status)}>{node.memory}%</span>
                  </div>
                  <Progress value={node.memory} className="h-1" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Disk</span>
                    <span className={getStatusColor(node.status)}>{node.disk}%</span>
                  </div>
                  <Progress value={node.disk} className="h-1" />
                </div>
                
                <div className="mt-3 flex justify-between text-xs">
                  <span className="text-gray-400">Users: {node.users}</span>
                  <span className="text-gray-400">Uptime: {node.uptime}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* SSH Terminal */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                SSH Connection to {selectedNodeData?.name}
              </h4>
              <Button
                onClick={simulateSSHConnection}
                disabled={isConnecting}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-500"
              >
                {isConnecting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Wifi className="w-3 h-3" />
                  </motion.div>
                ) : (
                  <Terminal className="w-3 h-3 mr-2" />
                )}
                {isConnecting ? 'Connecting...' : 'Connect SSH'}
              </Button>
            </div>
            
            <div className="bg-black rounded-lg p-3 font-mono text-sm text-green-400 min-h-32 max-h-48 overflow-y-auto">
              <div className="text-gray-500">root@{selectedNodeData?.name.toLowerCase()}:~$ </div>
              <pre className="whitespace-pre-wrap">{sshCommand}</pre>
              {isConnecting && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-green-400 ml-1"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Allocation */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Storage Allocation
            </CardTitle>
            <Button
              onClick={() => setShowAllocations(!showAllocations)}
              size="sm"
              variant="outline"
              className="border-purple-500/30 text-purple-300"
            >
              {showAllocations ? 'Hide' : 'Show'} Users
            </Button>
          </div>
        </CardHeader>
        
        {showAllocations && (
          <CardContent>
            <div className="space-y-4">
              {storageAllocations.map((allocation) => (
                <div key={allocation.userId} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <HardDrive className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{allocation.userName}</p>
                      <p className="text-gray-400 text-sm">
                        {allocation.used}GB / {allocation.allocated}GB used
                      </p>
                      <p className="text-gray-500 text-xs">Last access: {allocation.lastAccess}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {allocation.plan}
                    </Badge>
                    <div className="w-24">
                      <Progress value={(allocation.used / allocation.allocated) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Storage Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">2.1TB</div>
                <div className="text-xs text-gray-400">Total Allocated</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">1.3TB</div>
                <div className="text-xs text-gray-400">Currently Used</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">800GB</div>
                <div className="text-xs text-gray-400">Available</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">62%</div>
                <div className="text-xs text-gray-400">Utilization</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Real-time Monitoring */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-time Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">System Resources</h4>
              <div className="space-y-4">
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm">CPU Usage</span>
                  </div>
                  <Progress value={selectedNodeData?.cpu || 0} className="mb-2" />
                  <p className="text-gray-400 text-xs">{selectedNodeData?.cpu}% of 16 cores</p>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MemoryStick className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">Memory Usage</span>
                  </div>
                  <Progress value={selectedNodeData?.memory || 0} className="mb-2" />
                  <p className="text-gray-400 text-xs">{selectedNodeData?.memory}% of 64GB RAM</p>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">Disk Usage</span>
                  </div>
                  <Progress value={selectedNodeData?.disk || 0} className="mb-2" />
                  <p className="text-gray-400 text-xs">{selectedNodeData?.disk}% of 2TB SSD</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Network & Performance</h4>
              <div className="space-y-4">
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-sm">Bandwidth Usage</span>
                  </div>
                  <Progress value={selectedNodeData?.bandwidth || 0} className="mb-2" />
                  <p className="text-gray-400 text-xs">{selectedNodeData?.bandwidth}% of 10Gbps</p>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-orange-400" />
                    <span className="text-white text-sm">Active Users</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{selectedNodeData?.users}</div>
                  <p className="text-gray-400 text-xs">Connected users</p>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">Uptime</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-1">{selectedNodeData?.uptime}</div>
                  <p className="text-gray-400 text-xs">Last 30 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex gap-3 flex-wrap">
            <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-300">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Stats
            </Button>
            <Button size="sm" variant="outline" className="border-green-500/30 text-green-300">
              <Database className="w-4 h-4 mr-2" />
              Backup Data
            </Button>
            <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-300">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button size="sm" variant="outline" className="border-red-500/30 text-red-300">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Auto-scaling Configuration */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Auto-scaling Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">Scaling Rules</h4>
              <div className="space-y-3">
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">CPU Threshold</span>
                    <span className="text-white font-medium">80%</span>
                  </div>
                  <Progress value={80} className="mt-2 h-1" />
                </div>
                
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Memory Threshold</span>
                    <span className="text-white font-medium">85%</span>
                  </div>
                  <Progress value={85} className="mt-2 h-1" />
                </div>
                
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Disk Threshold</span>
                    <span className="text-white font-medium">90%</span>
                  </div>
                  <Progress value={90} className="mt-2 h-1" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Scaling History</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Scaled up +2 nodes</span>
                  <span className="text-gray-500 ml-auto">2h ago</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Storage expanded +500GB</span>
                  <span className="text-gray-500 ml-auto">1d ago</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">Load balancer updated</span>
                  <span className="text-gray-500 ml-auto">3d ago</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
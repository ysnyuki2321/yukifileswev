"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, MessageSquare, Video, Share2, Clock, 
  Sparkles, Eye, Edit3, UserPlus, Bell, Zap,
  MousePointer, FileText, Globe, Shield
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CollaborationDemoProps {
  isDemoMode?: boolean
}

interface ActiveUser {
  id: string
  name: string
  email: string
  avatar: string
  status: 'online' | 'away' | 'busy'
  cursor: { x: number, y: number }
  currentFile?: string
  lastSeen: string
}

interface Activity {
  id: string
  user: string
  action: string
  file: string
  timestamp: string
  type: 'edit' | 'comment' | 'share' | 'upload'
}

export default function CollaborationDemo({ isDemoMode = true }: CollaborationDemoProps) {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([
    {
      id: '1',
      name: 'Alice Chen',
      email: 'alice@company.com',
      avatar: '👩‍💼',
      status: 'online',
      cursor: { x: 120, y: 80 },
      currentFile: 'Project_Report.pdf',
      lastSeen: 'now'
    },
    {
      id: '2', 
      name: 'Bob Wilson',
      email: 'bob@company.com',
      avatar: '👨‍💻',
      status: 'online',
      cursor: { x: 200, y: 150 },
      currentFile: 'Design_Assets.zip',
      lastSeen: '2 min ago'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@company.com', 
      avatar: '👩‍🎨',
      status: 'away',
      cursor: { x: 80, y: 120 },
      lastSeen: '5 min ago'
    }
  ])

  const [recentActivity, setRecentActivity] = useState<Activity[]>([
    {
      id: '1',
      user: 'Alice Chen',
      action: 'edited',
      file: 'Project_Report.pdf',
      timestamp: '2 minutes ago',
      type: 'edit'
    },
    {
      id: '2',
      user: 'Bob Wilson', 
      action: 'shared',
      file: 'Design_Assets.zip',
      timestamp: '5 minutes ago',
      type: 'share'
    },
    {
      id: '3',
      user: 'Carol Davis',
      action: 'commented on',
      file: 'Meeting_Notes.md',
      timestamp: '8 minutes ago',
      type: 'comment'
    },
    {
      id: '4',
      user: 'David Kim',
      action: 'uploaded',
      file: 'Budget_Q4.xlsx',
      timestamp: '12 minutes ago',
      type: 'upload'
    }
  ])

  const [messages, setMessages] = useState([
    {
      id: '1',
      user: 'Alice Chen',
      message: 'Just finished updating the project report. Please review! 📄',
      timestamp: '2:34 PM',
      avatar: '👩‍💼'
    },
    {
      id: '2',
      user: 'Bob Wilson',
      message: 'Design assets are ready for download. Let me know if you need any changes! 🎨',
      timestamp: '2:31 PM', 
      avatar: '👨‍💻'
    },
    {
      id: '3',
      user: 'Carol Davis',
      message: 'Great work everyone! The client will love this. 🚀',
      timestamp: '2:28 PM',
      avatar: '👩‍🎨'
    }
  ])

  const [newMessage, setNewMessage] = useState('')

  // Simulate real-time cursor movements
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          cursor: {
            x: Math.max(50, Math.min(300, user.cursor.x + (Math.random() - 0.5) * 20)),
            y: Math.max(50, Math.min(200, user.cursor.y + (Math.random() - 0.5) * 20))
          }
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    const message = {
      id: Date.now().toString(),
      user: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '🧑‍💼'
    }
    
    setMessages(prevMessages => [...prevMessages, message])
    setNewMessage('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400'
      case 'away': return 'bg-yellow-400'
      case 'busy': return 'bg-red-400'
      default: return 'bg-gray-400'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'edit': return <Edit3 className="w-4 h-4 text-blue-400" />
      case 'comment': return <MessageSquare className="w-4 h-4 text-green-400" />
      case 'share': return <Share2 className="w-4 h-4 text-purple-400" />
      case 'upload': return <FileText className="w-4 h-4 text-orange-400" />
      default: return <Eye className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Collaboration */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Live Cursors Demo */}
          <div className="relative bg-slate-800/30 rounded-lg p-6 mb-6 h-64 overflow-hidden">
            <div className="text-white text-sm mb-4 flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              Live Cursor Tracking
            </div>
            
            {/* Simulated workspace */}
            <div className="absolute inset-4 bg-slate-900/50 rounded border border-purple-500/20">
              <div className="p-4 text-gray-400 text-xs">
                Shared Document: Project_Report.pdf
              </div>
              
              {/* Live cursors */}
              {activeUsers.filter(user => user.status === 'online').map((user) => (
                <motion.div
                  key={user.id}
                  animate={{ x: user.cursor.x, y: user.cursor.y }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute pointer-events-none z-10"
                >
                  <div className="flex items-center gap-1">
                    <MousePointer className="w-4 h-4 text-purple-400" />
                    <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {user.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Users */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeUsers.map((user) => (
              <div key={user.id} className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                      {user.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-slate-800`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{user.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  </div>
                </div>
                
                {user.currentFile && (
                  <div className="bg-slate-900/50 rounded p-2 mb-2">
                    <p className="text-xs text-gray-400">Currently editing:</p>
                    <p className="text-white text-xs font-medium truncate">{user.currentFile}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className={`text-xs ${user.status === 'online' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                    {user.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{user.lastSeen}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Team Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium">{message.user}</span>
                      <span className="text-gray-500 text-xs">{message.timestamp}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{message.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="bg-slate-800/50 border-purple-500/20 text-white"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(recentActivity || []).map((activity) => activity && (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="text-purple-300">{activity.file}</span>
                    </p>
                    <p className="text-gray-500 text-xs">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 border-purple-500/30 text-purple-300">
                <Video className="w-4 h-4 mr-2" />
                Start Video Call
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-green-500/30 text-green-300">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Members
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collaboration Stats */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Collaboration Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">12</div>
              <div className="text-sm text-gray-400">Active Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">89</div>
              <div className="text-sm text-gray-400">Files Shared Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">156</div>
              <div className="text-sm text-gray-400">Comments Added</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">3.2h</div>
              <div className="text-sm text-gray-400">Avg Session Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
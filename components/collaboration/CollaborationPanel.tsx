"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, MessageCircle, Share2, Edit3, Eye, Lock, Unlock,
  UserPlus, Settings, Bell, BellOff, Video, Phone, MoreHorizontal, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface Collaborator {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'editor' | 'viewer'
  status: 'online' | 'offline' | 'away'
  lastSeen?: Date
}

interface CollaborationMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
  type: 'text' | 'file' | 'system'
}

interface CollaborationPanelProps {
  fileId: string
  fileName: string
  isOpen: boolean
  onClose: () => void
}

export function CollaborationPanel({ fileId, fileName, isOpen, onClose }: CollaborationPanelProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Demo User',
      email: 'demo@yukifiles.com',
      role: 'owner',
      status: 'online'
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'editor',
      status: 'online'
    },
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'viewer',
      status: 'away'
    }
  ])
  
  const [messages, setMessages] = useState<CollaborationMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Demo User',
      message: 'Hey team! I just uploaded the latest presentation.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'text'
    },
    {
      id: '2',
      userId: '2',
      userName: 'John Doe',
      message: 'Great! I can see it. Working on the edits now.',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      type: 'text'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Jane Smith',
      message: 'Perfect timing. I\'ll review it tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
      type: 'text'
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer')

  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    const message: CollaborationMessage = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'Demo User',
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    }
    
    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const inviteCollaborator = () => {
    if (!inviteEmail.trim()) return
    
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'offline'
    }
    
    setCollaborators(prev => [...prev, newCollaborator])
    setInviteEmail('')
    setShowInviteDialog(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-500'
      case 'editor': return 'bg-blue-500'
      case 'viewer': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 z-50"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Collaboration</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-400 text-sm truncate">{fileName}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button className="flex-1 py-3 text-sm font-medium text-white border-b-2 border-purple-500">
            <Users className="w-4 h-4 inline mr-2" />
            Team
          </button>
          <button className="flex-1 py-3 text-sm font-medium text-gray-400 hover:text-white">
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Chat
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Collaborators List */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">Collaborators ({collaborators.length})</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInviteDialog(true)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>

            <div className="space-y-3">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback className="bg-purple-500 text-white text-xs">
                          {collaborator.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900",
                        getStatusColor(collaborator.status)
                      )} />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{collaborator.name}</div>
                      <div className="text-gray-400 text-xs">{collaborator.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn("text-xs", getRoleColor(collaborator.role))}>
                      {collaborator.role}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-4 border-t border-gray-700">
            <div className="space-y-3 mb-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-purple-500 text-white text-xs">
                      {message.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium">{message.userName}</span>
                      <span className="text-gray-500 text-xs">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm bg-gray-800/50 rounded-lg p-2">
                      {message.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-purple-500 hover:bg-purple-600"
              >
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Video className="w-4 h-4 mr-2" />
                Video
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Invite Dialog */}
      {showInviteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-white font-semibold mb-4">Invite Collaborator</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Email</label>
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowInviteDialog(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={inviteCollaborator}
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
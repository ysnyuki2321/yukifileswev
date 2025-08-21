"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { Bell, LogOut, Menu, Sparkles, X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { motion, AnimatePresence } from "framer-motion"

interface TopbarProps {
  userEmail: string
  isPremium: boolean
  brandName?: string
  isDemoMode?: boolean
  onMenuToggle?: () => void
}

const mockNotifications = [
  {
    id: '1',
    type: 'success' as const,
    title: 'File Upload Complete',
    message: 'Your file "Project_Report.pdf" has been successfully uploaded and is ready to share.',
    time: '2 minutes ago',
    read: false
  },
  {
    id: '2', 
    type: 'info' as const,
    title: 'Storage Upgrade Available',
    message: 'You\'re using 85% of your storage. Consider upgrading to Pro for 50GB storage.',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'warning' as const,
    title: 'Share Link Expires Soon', 
    message: 'Your share link for "Design_Assets.zip" will expire in 2 days.',
    time: '3 hours ago',
    read: true
  }
]

export default function Topbar({ userEmail, isPremium, brandName = "YukiFiles", isDemoMode = false, onMenuToggle }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<typeof mockNotifications[0] | null>(null)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: typeof mockNotifications[0]) => {
    setSelectedNotification(notification)
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'info': return <Info className="w-5 h-5 text-blue-400" />
      default: return <Bell className="w-5 h-5 text-gray-400" />
    }
  }
  return (
    <header className="h-16 w-full border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
      <div className="h-full container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuToggle}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-300 hover:text-white hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>

        </div>

        <div className="flex-1 max-w-xl hidden sm:block">
          <Input placeholder="Search files, shares..." className="bg-black/30 border-gray-700" />
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode && (
            <span className="hidden sm:inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-2 py-1 rounded animate-pulse">
              DEMO MODE
            </span>
          )}
          {isPremium && !isDemoMode && (
            <span className="hidden sm:inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded premium-glow">
              PREMIUM
            </span>
          )}
          <span className="hidden md:inline text-gray-300 text-sm">{userEmail}</span>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-300 hover:text-white hover:bg-white/5 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{unreadCount}</span>
                </div>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-br from-slate-900/95 via-blue-950/40 to-slate-900/95 backdrop-blur-lg border border-blue-500/20 rounded-lg shadow-2xl z-50"
                >
                  <div className="p-4 border-b border-purple-500/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      <Button
                        onClick={() => setShowNotifications(false)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-gray-700/50 hover:bg-purple-500/10 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-purple-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-medium">{notification.title}</p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-purple-500/10">
                    <Button 
                      variant="ghost" 
                      className="w-full text-purple-300 hover:text-white hover:bg-purple-500/20 text-sm"
                    >
                      Mark All as Read
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="ghost" className="text-gray-300 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedNotification(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">{selectedNotification.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedNotification.message}</p>
                  <p className="text-gray-500 text-xs mt-3">{selectedNotification.time}</p>
                </div>
                <Button
                  onClick={() => setSelectedNotification(null)}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 pt-4 border-t border-purple-500/10">
                <Button 
                  onClick={() => setSelectedNotification(null)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Got it
                </Button>
                {selectedNotification.type === 'info' && (
                  <Button 
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    Learn More
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}


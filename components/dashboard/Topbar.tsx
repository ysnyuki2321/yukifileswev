"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, LogOut, Menu, User, Settings, CreditCard,
  X, CheckCircle, AlertCircle, Info, Wallet
} from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { motion, AnimatePresence } from "framer-motion"
import { EnhancedSearch } from "@/components/ui/enhanced-search"
import { DetailedProfileScreen } from "@/components/profile/DetailedProfileScreen"

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
    title: 'File uploaded successfully',
    message: 'document.pdf has been uploaded to your storage',
    type: 'success' as const,
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2', 
    title: 'Storage limit warning',
    message: 'You are approaching your storage limit (85% used)',
    type: 'warning' as const,
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    title: 'New share link created',
    message: 'presentation.pptx share link has been generated',
    type: 'info' as const,
    time: '3 hours ago',
    read: true
  }
]

export default function Topbar({ userEmail, isPremium, brandName = "YukiFiles", isDemoMode = false, onMenuToggle }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<typeof mockNotifications[0] | null>(null)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: typeof mockNotifications[0]) => {
    setSelectedNotification(notification)
    setShowNotifications(false)
    
    // Mark as read
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
      case 'warning': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
      case 'error': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
      case 'info': return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
      default: return <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
    }
  }

  return (
    <header className="h-16 w-full border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
      <div className="h-full container mx-auto px-3 sm:px-4 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuToggle}
            className="md:hidden mobile-menu-button text-gray-300 hover:text-white hover:bg-white/5 active:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <EnhancedSearch 
            placeholder="Search files, folders, features..."
            onResultClick={(result) => {
              console.log('Search result clicked:', result)
              if (result.type === 'feature') {
                window.location.href = `/dashboard?demo=true&tab=${result.name.toLowerCase().replace(' ', '')}`
              } else {
                window.location.href = `/files?path=${result.path.join('/')}&highlight=${result.name}`
              }
            }}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isDemoMode && (
            <span className="hidden sm:inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs px-2 py-1 rounded animate-pulse">
              DEMO
            </span>
          )}
          {isPremium && !isDemoMode && (
            <span className="hidden sm:inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded premium-glow">
              PRO
            </span>
          )}

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="mobile-menu-button text-gray-300 hover:text-white hover:bg-white/5 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
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
                  className="absolute right-0 top-full mt-2 w-64 sm:w-80 max-w-[calc(100vw-1rem)] bg-gradient-to-br from-slate-900 via-blue-950/60 to-slate-900 backdrop-blur-lg border border-blue-500/30 rounded-lg shadow-2xl z-50"
                  style={{ 
                    right: typeof window !== 'undefined' && window.innerWidth < 768 ? '0.5rem' : '0',
                    maxWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? 'calc(100vw - 1rem)' : 'auto'
                  }}
                >
                  <div className="p-3 sm:p-4 border-b border-purple-500/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Notifications</h3>
                      <Button
                        onClick={() => setShowNotifications(false)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white touch-manipulation"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-64 sm:max-h-80 overflow-y-auto mobile-scroll">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-2 sm:p-3 border-b border-gray-700/50 hover:bg-purple-500/10 cursor-pointer transition-colors touch-manipulation ${
                          !notification.read ? 'bg-purple-500/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-xs sm:text-sm font-medium leading-tight">{notification.title}</p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">{notification.message}</p>
                            <p className="text-gray-500 text-xs mt-1.5">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {notifications.length === 0 && (
                    <div className="p-6 text-center">
                      <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No notifications</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="mobile-menu-button text-gray-300 hover:text-white hover:bg-white/5 relative"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-gradient-to-br from-slate-900 via-purple-950/60 to-slate-900 backdrop-blur-lg border border-purple-500/30 rounded-lg shadow-2xl z-50"
                >
                  {/* Balance */}
                  <div className="p-4 border-b border-purple-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Balance</p>
                        <p className="text-lg font-bold text-white">$24.50</p>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="p-4 border-b border-gray-700/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{userEmail}</p>
                        <p className="text-xs text-gray-400">
                          {isPremium ? 'Premium Account' : 'Free Account'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfile(false)
                        // Open profile screen with animation
                        const profileScreen = document.createElement('div')
                        profileScreen.id = 'profile-screen-mount'
                        document.body.appendChild(profileScreen)
                        
                        import('@/components/profile/DetailedProfileScreen').then(({ DetailedProfileScreen }) => {
                          const { createRoot } = require('react-dom/client')
                          const root = createRoot(profileScreen)
                          root.render(
                            <DetailedProfileScreen 
                              isOpen={true}
                              onClose={() => {
                                root.unmount()
                                document.body.removeChild(profileScreen)
                              }}
                              userEmail={userEmail}
                              isPremium={isPremium}
                            />
                          )
                        })
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-500/10 transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfile(false)
                        window.location.href = isDemoMode ? '/dashboard?demo=true&tab=settings' : '/settings'
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-500/10 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Settings</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-2 border-t border-gray-700/30">
                    <form action={signOut}>
                      <Button 
                        type="submit" 
                        variant="ghost" 
                        className="w-full justify-start text-gray-300 hover:text-white hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={() => setSelectedNotification(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl max-w-md w-full mx-auto p-6"
              style={{ margin: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                {getNotificationIcon(selectedNotification.type)}
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">{selectedNotification.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{selectedNotification.message}</p>
                  <p className="text-gray-500 text-xs">{selectedNotification.time}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => setSelectedNotification(null)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Got it
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
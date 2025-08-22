"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { Bell, LogOut, Menu, Sparkles, X, CheckCircle, AlertCircle, Info, Search, File, Folder, Image, Video, Music } from "lucide-react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const unreadCount = notifications.filter(n => !n.read).length

  // Mock search data
  const mockSearchData = [
    { id: '1', name: 'project-proposal.pdf', type: 'document', size: '2.5 MB', icon: File, path: '/documents' },
    { id: '2', name: 'vacation-photos', type: 'folder', size: '45 files', icon: Folder, path: '/photos' },
    { id: '3', name: 'presentation.pptx', type: 'presentation', size: '8.1 MB', icon: File, path: '/work' },
    { id: '4', name: 'demo-video.mp4', type: 'video', size: '125 MB', icon: Video, path: '/media' },
    { id: '5', name: 'background-music.mp3', type: 'audio', size: '4.2 MB', icon: Music, path: '/media' },
    { id: '6', name: 'profile-picture.jpg', type: 'image', size: '1.8 MB', icon: Image, path: '/photos' },
    { id: '7', name: 'app-source-code', type: 'folder', size: '23 files', icon: Folder, path: '/development' },
    { id: '8', name: 'financial-report.xlsx', type: 'spreadsheet', size: '3.7 MB', icon: File, path: '/reports' }
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (query.trim().length > 0) {
      // Filter results based on query
      const filtered = mockSearchData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        item.path.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered.slice(0, 6)) // Limit to 6 results
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

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
      <div className="h-full container mx-auto px-2 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuToggle}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-300 hover:text-white hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>

        </div>

        {/* Search Bar with Dropdown */}
        <div className="flex-1 max-w-xl hidden md:block relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search files, folders, shares..." 
              className="bg-black/30 border-gray-700 pl-10 focus:border-purple-500/50 focus:bg-black/50 transition-all"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length > 0) {
                  setShowSearchResults(true)
                }
              }}
              onBlur={() => {
                // Delay hiding to allow clicking on results
                setTimeout(() => setShowSearchResults(false), 150)
              }}
            />
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-lg border border-purple-500/30 rounded-lg shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-2">
                    <div className="text-xs text-gray-400 px-3 py-2 border-b border-purple-500/20">
                      Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    
                    {searchResults.map((result, index) => {
                      const Icon = result.icon
                      return (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                          onClick={() => {
                            setSearchQuery("")
                            setShowSearchResults(false)
                            // Navigate to file or open
                            console.log('Opening:', result.name)
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg hover:bg-purple-500/10 transition-colors"
                        >
                          <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-purple-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{result.name}</p>
                            <p className="text-gray-400 text-xs truncate">
                              {result.path} • {result.size}
                            </p>
                          </div>
                          
                          <div className="text-xs text-gray-500 capitalize">
                            {result.type}
                          </div>
                        </motion.button>
                      )
                    })}
                    
                    {searchQuery.trim().length > 0 && (
                      <div className="border-t border-purple-500/20 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setSearchQuery("")
                            setShowSearchResults(false)
                            // Navigate to advanced search
                            window.location.href = `/files?search=${encodeURIComponent(searchQuery)}`
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-purple-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
                        >
                          <Search className="w-4 h-4" />
                          <span className="text-sm">View all results for "{searchQuery}"</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* No Results */}
            <AnimatePresence>
              {showSearchResults && searchResults.length === 0 && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-lg border border-purple-500/30 rounded-lg shadow-2xl z-50 p-4 text-center"
                >
                  <div className="w-12 h-12 bg-gray-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-300 font-medium mb-1">No results found</p>
                  <p className="text-gray-500 text-sm">Try a different search term</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
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
          <span className="hidden lg:inline text-gray-300 text-sm truncate max-w-[150px]">{userEmail}</span>
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
                  className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-br from-slate-900 via-blue-950/60 to-slate-900 backdrop-blur-lg border border-blue-500/30 rounded-lg shadow-2xl z-50"
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


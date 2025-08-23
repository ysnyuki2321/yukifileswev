import React, { useState, useEffect } from 'react'
import { 
  Menu, 
  X, 
  Home, 
  FolderOpen, 
  Upload, 
  Settings, 
  User, 
  Bell,
  Search,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  GlassContainer, 
  AnimatedCard, 
  ResponsiveText, 
  InteractiveButton,
  StatusBadge,
  LoadingSpinner
} from './design-system'

interface UltraModernLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showHeader?: boolean
  showSidebar?: boolean
  showFooter?: boolean
  className?: string
}

export const UltraModernLayout: React.FC<UltraModernLayoutProps> = ({
  children,
  title,
  subtitle,
  showHeader = true,
  showSidebar = true,
  showFooter = true,
  className
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleTheme = () => setIsDark(!isDark)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      'text-white overflow-x-hidden',
      isDark ? 'dark' : 'light',
      className
    )}>
      {/* Global CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed);
        }
      `}</style>

      {/* Header */}
      {showHeader && (
        <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Y</span>
                  </div>
                  <div className="hidden sm:block">
                    <ResponsiveText variant="h4" className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      YukiFiles
                    </ResponsiveText>
                    {subtitle && (
                      <ResponsiveText variant="span" className="text-gray-400 text-xs">
                        {subtitle}
                      </ResponsiveText>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files, folders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-2">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <button className="flex items-center space-x-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside className={cn(
              'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}>
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <ResponsiveText variant="h5" className="font-semibold">
                      Navigation
                    </ResponsiveText>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="lg:hidden p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-6 space-y-2">
                  <NavItem icon={Home} label="Dashboard" href="/dashboard" active />
                  <NavItem icon={FolderOpen} label="Files" href="/files" />
                  <NavItem icon={Upload} label="Upload" href="/upload" />
                  <NavItem icon={Settings} label="Settings" href="/settings" />
                </nav>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-white/10">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <ResponsiveText variant="span" className="font-semibold">
                          Pro Plan
                        </ResponsiveText>
                        <ResponsiveText variant="span" className="text-gray-400 text-xs">
                          Unlimited storage
                        </ResponsiveText>
                      </div>
                    </div>
                    <InteractiveButton size="sm" className="w-full">
                      Upgrade
                    </InteractiveButton>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className={cn(
          'flex-1 min-h-screen',
          showSidebar && 'lg:ml-64'
        )}>
          {/* Page Header */}
          {title && (
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-7xl mx-auto">
                <div className="animate-fadeInUp">
                  <ResponsiveText variant="h1" className="font-bold mb-2">
                    {title}
                  </ResponsiveText>
                  {subtitle && (
                    <ResponsiveText variant="p" className="text-gray-400">
                      {subtitle}
                    </ResponsiveText>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-white/5 border-t border-white/10">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="animate-fadeInUp" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Y</span>
                    </div>
                    <ResponsiveText variant="h5" className="font-bold">
                      YukiFiles
                    </ResponsiveText>
                  </div>
                  <ResponsiveText variant="p" className="text-gray-400">
                    Secure file sharing platform with premium themes and anti-abuse protection.
                  </ResponsiveText>
                </div>

                <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                  <ResponsiveText variant="h6" className="font-semibold mb-4">
                    Product
                  </ResponsiveText>
                  <ul className="space-y-2 text-gray-400">
                    <li>Features</li>
                    <li>Pricing</li>
                    <li>API</li>
                    <li>Documentation</li>
                  </ul>
                </div>

                <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                  <ResponsiveText variant="h6" className="font-semibold mb-4">
                    Company
                  </ResponsiveText>
                  <ul className="space-y-2 text-gray-400">
                    <li>About</li>
                    <li>Blog</li>
                    <li>Careers</li>
                    <li>Contact</li>
                  </ul>
                </div>

                <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                  <ResponsiveText variant="h6" className="font-semibold mb-4">
                    Support
                  </ResponsiveText>
                  <ul className="space-y-2 text-gray-400">
                    <li>Help Center</li>
                    <li>Status</li>
                    <li>Security</li>
                    <li>Privacy</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <ResponsiveText variant="span" className="text-gray-400">
                    © 2024 YukiFiles. All rights reserved.
                  </ResponsiveText>
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Terms
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Privacy
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      Cookies
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

// Navigation Item Component
const NavItem: React.FC<{
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  active?: boolean
}> = ({ icon: Icon, label, href, active = false }) => {
  return (
    <a
      href={href}
      className={cn(
        'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
        'hover:bg-white/10 hover:scale-105',
        active ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </a>
  )
}

export default UltraModernLayout
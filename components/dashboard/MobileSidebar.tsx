"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Files, Home, CreditCard, Shield, Settings, Sparkles, BarChart3, Users, Server } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
  activeTab?: string
}

export function MobileSidebar({ isOpen, onClose, isAdmin = false, activeTab }: MobileSidebarProps) {
  const pathname = usePathname()
  const isDemoMode = pathname.includes('demo=true') || pathname.includes('/demo')

  const navItems = [
    { href: isDemoMode ? "/dashboard?demo=true" : "/dashboard", label: "Dashboard", icon: Home },
    { href: isDemoMode ? "/files?demo=true" : "/files", label: "Files", icon: Files },
  ]

  // Demo mode: Add all features to dashboard
  if (isDemoMode) {
    navItems.push(
      { href: "/dashboard?demo=true&tab=filemanager", label: "File Manager", icon: Files },
      { href: "/dashboard?demo=true&tab=analytics", label: "Analytics", icon: BarChart3 },
      { href: "/dashboard?demo=true&tab=collaboration", label: "Collaboration", icon: Users },
      { href: "/dashboard?demo=true&tab=ai", label: "AI Tools", icon: Sparkles },
      { href: "/dashboard?demo=true&tab=security", label: "Security", icon: Shield },
      { href: "/dashboard?demo=true&tab=pricing", label: "Pricing", icon: CreditCard },
      { href: "/dashboard?demo=true&tab=admin", label: "Admin", icon: Settings },
      { href: "/dashboard?demo=true&tab=settings", label: "Settings", icon: Settings },
      { href: "/dashboard?demo=true&tab=infrastructure", label: "Infrastructure", icon: Server }
    )
  } else {
    navItems.push({ href: "/pricing", label: "Pricing", icon: CreditCard })
    if (isAdmin) {
      navItems.push({ href: "/admin", label: "Admin", icon: Shield })
      navItems.push({ href: "/admin/settings", label: "Settings", icon: Settings })
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-black/95 backdrop-blur-xl border-r border-purple-500/20 transform transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
            <span className="text-xl font-bold text-white">YukiFiles</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors touch-target"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 scrollbar-mobile">
          <div className="px-6 space-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.label.toLowerCase().replace(' ', '') || 
                              pathname === item.href ||
                              (isDemoMode && item.href.includes('tab=') && activeTab === item.href.split('tab=')[1])
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 touch-target",
                    isActive
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white"
                      : "text-gray-300 hover:text-white hover:bg-purple-500/10"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Demo mode indicator */}
          {isDemoMode && (
            <div className="px-6 mt-8">
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">Demo Mode</h4>
                    <p className="text-xs text-gray-400">All features available</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-purple-500/20">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2024 YukiFiles
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Secure File Sharing
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
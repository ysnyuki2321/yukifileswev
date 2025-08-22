"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home, Files, CreditCard, Shield, Settings, X, Sparkles, 
  BarChart3, Users, Server
} from "lucide-react"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
  brandName?: string
}

export function MobileSidebar({ isOpen, onClose, isAdmin = false, brandName = "YukiFiles" }: MobileSidebarProps) {
  const pathname = usePathname()
  
  // Check if we're in demo mode
  const isDemoMode = pathname.includes('demo=true') || pathname.includes('/demo')
  
  const navItems = [
    { href: isDemoMode ? "/dashboard?demo=true" : "/dashboard", label: "Dashboard", icon: Home },
    { href: isDemoMode ? "/files?demo=true" : "/files", label: "Files", icon: Files },
  ]

  // Demo mode: Add all features to dashboard
  if (isDemoMode) {
    navItems.push({ href: "/dashboard?demo=true&tab=analytics", label: "Analytics", icon: BarChart3 })
    navItems.push({ href: "/dashboard?demo=true&tab=collaboration", label: "Collaboration", icon: Users })
    navItems.push({ href: "/dashboard?demo=true&tab=ai", label: "AI Tools", icon: Sparkles })
    navItems.push({ href: "/dashboard?demo=true&tab=security", label: "Security", icon: Shield })
    navItems.push({ href: "/dashboard?demo=true&tab=pricing", label: "Pricing", icon: CreditCard })
    navItems.push({ href: "/dashboard?demo=true&tab=admin", label: "Admin", icon: Settings })
    navItems.push({ href: "/dashboard?demo=true&tab=settings", label: "Settings", icon: Settings })
    navItems.push({ href: "/dashboard?demo=true&tab=infrastructure", label: "Infrastructure", icon: Server })
  } else {
    navItems.push({ href: "/pricing", label: "Pricing", icon: CreditCard })
    if (isAdmin) {
      navItems.push({ href: "/admin", label: "Admin", icon: Shield })
      navItems.push({ href: "/admin/settings", label: "Settings", icon: Settings })
    }
  }

  const handleNavClick = (href: string) => {
    onClose()
    
    // For demo tabs, handle client-side navigation
    if (href.includes('tab=')) {
      const url = new URL(href, window.location.origin)
      window.history.pushState({}, '', url.pathname + url.search)
      window.location.reload()
    } else {
      // Regular navigation
      window.location.href = href
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
                     {/* Backdrop */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.2 }}
             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] mobile-stable"
             onClick={onClose}
           />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                         className="fixed inset-y-0 left-0 z-[9999] w-64 bg-gradient-to-b from-slate-900/95 via-purple-950/60 to-slate-900/95 border-r border-purple-500/20 backdrop-blur-xl shadow-2xl mobile-stable"
          >
            {/* Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">{brandName}</span>
              </div>
              
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || 
                    (pathname.includes('/dashboard') && item.href.includes('dashboard')) ||
                    (pathname.includes('/files') && item.href.includes('files'))
                  
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 touch-manipulation ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg"
                          : "text-gray-300 hover:text-white hover:bg-white/5 active:bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-purple-500/10">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">
                  {isDemoMode ? "Demo Mode" : "Connected"}
                </span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
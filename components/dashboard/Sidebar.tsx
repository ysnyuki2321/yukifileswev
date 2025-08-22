"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Files, Home, CreditCard, Shield, Settings, X, Sparkles, BarChart3, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isAdmin?: boolean
  brandName?: string
  isOpen?: boolean
  onClose?: () => void
  activeTab?: string
}

export default function Sidebar({ isAdmin = false, brandName = "YukiFiles", isOpen = false, onClose, activeTab }: SidebarProps) {
  const pathname = usePathname()

  // Check if we're in demo mode or files page - MOVED UP to prevent hoisting
  const isDemoMode = pathname.includes('demo=true') || pathname.includes('/demo')
  const isFilesPage = pathname === '/files'

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
    if (isAdmin) {
      navItems.push({ href: "/dashboard?demo=true&tab=admin", label: "Admin", icon: Settings })
    }
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
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-black/40 border-r border-purple-500/20 backdrop-blur-lg transition-transform duration-300 ease-in-out",
        "md:flex md:flex-col md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 px-6 flex items-center justify-between border-b border-purple-500/20">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-2 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">{brandName}</span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (activeTab && activeTab === item.label.toLowerCase())
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
        </nav>
        <div className="px-4 py-4 text-xs text-gray-400 border-t border-purple-500/20">
          © {new Date().getFullYear()} YukiFiles
        </div>
      </aside>
    </>
  )
}


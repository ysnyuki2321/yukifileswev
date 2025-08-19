"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Files, Home, CreditCard, Shield, Settings } from "lucide-react"

interface SidebarProps {
  isAdmin?: boolean
  brandName?: string
}

export default function Sidebar({ isAdmin = false, brandName = "YukiFiles" }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/files", label: "Files", icon: Files },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
  ]

  if (isAdmin) {
    navItems.push({ href: "/admin", label: "Admin", icon: Shield })
    navItems.push({ href: "/admin/settings", label: "Settings", icon: Settings })
  }

  return (
    <aside className="hidden md:flex md:flex-col w-64 min-h-screen bg-black/40 border-r border-purple-500/20 backdrop-blur-lg">
      <div className="h-16 px-6 flex items-center border-b border-purple-500/20">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-2"></div>
        <span className="text-white font-bold text-lg">{brandName}</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
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
  )
}


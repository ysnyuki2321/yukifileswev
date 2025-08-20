"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, LogIn, UserPlus, BarChart3, Shield, Sparkles,
  FileText, Users, Settings, HelpCircle, MessageCircle, Globe, Zap
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { isDebugModeEnabled } from "@/lib/services/debug-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface DesktopNavigationProps {
  brandName?: string
  isAuthenticated?: boolean
  isAdmin?: boolean
}

const navigationItems = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" }
]

const megaDropdownItems = [
  {
    category: "Product",
    items: [
      { name: "File Management", href: "/#features", icon: FileText },
      { name: "Team Collaboration", href: "/#features", icon: Users },
      { name: "Security & Privacy", href: "/#features", icon: Shield },
      { name: "API & Integrations", href: "/#features", icon: Zap }
    ]
  },
  {
    category: "Support",
    items: [
      { name: "Help Center", href: "/help", icon: HelpCircle },
      { name: "Documentation", href: "/docs", icon: FileText },
      { name: "Contact Support", href: "/contact", icon: MessageCircle },
      { name: "Status Page", href: "/status", icon: Globe }
    ]
  }
]

function MegaDropdown({ isOpen, onClose, triggerRef }: { isOpen: boolean; onClose: () => void; triggerRef: React.RefObject<HTMLButtonElement> }) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 w-[600px] bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200"
    >
      <div className="p-6">
        <div className="grid grid-cols-2 gap-8">
          {megaDropdownItems.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {section.category}
              </h3>
              <div className="space-y-3">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                      onClick={onClose}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4 text-purple-300" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DesktopNavigation({ brandName = "YukiFiles", isAuthenticated = false, isAdmin = false }: DesktopNavigationProps) {
  const [isMegaDropdownOpen, setIsMegaDropdownOpen] = useState(false)
  const megaDropdownTriggerRef = useRef<HTMLButtonElement>(null)
  const [debugMode, setDebugMode] = useState(false)

  useEffect(() => {
    const checkDebugMode = async () => {
      try {
        const debug = await isDebugModeEnabled()
        setDebugMode(debug)
      } catch (error) {
        console.warn("Could not check debug mode:", error)
      }
    }
    checkDebugMode()
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-lg border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-purple-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                {brandName}
              </span>
              <span className="text-xs text-gray-400 -mt-1">File Management</span>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Mega Dropdown Trigger */}
            <div className="relative">
              <button
                ref={megaDropdownTriggerRef}
                onClick={() => setIsMegaDropdownOpen(!isMegaDropdownOpen)}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-purple-500/25">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">Explore</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Mega Dropdown */}
              <MegaDropdown
                isOpen={isMegaDropdownOpen}
                onClose={() => setIsMegaDropdownOpen(false)}
                triggerRef={megaDropdownTriggerRef}
              />
            </div>

            {/* Regular Navigation Items */}
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Auth Buttons */}
            {debugMode ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Debug Dashboard
                </Button>
              </Link>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10 transition-all duration-300">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800/30 hover:border-gray-500 transition-all duration-300">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
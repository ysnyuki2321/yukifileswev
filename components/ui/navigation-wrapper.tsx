"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, LogIn, UserPlus, BarChart3, Shield, Sparkles,
  FileText, Users, Settings, HelpCircle, MessageCircle, Globe, Zap,
  Menu, X
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { isDebugModeEnabled } from "@/lib/services/debug-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface NavigationWrapperProps {
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

export function NavigationWrapper({ brandName = "YukiFiles", isAuthenticated = false, isAdmin = false }: NavigationWrapperProps) {
  const [isMegaDropdownOpen, setIsMegaDropdownOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="w-32 h-8 bg-gray-700 rounded animate-pulse" />
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded animate-pulse" />
              <div className="w-20 h-8 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-purple-500/20">
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
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Navigation Items */}
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden glass-effect border-t border-purple-500/20">
            <div className="px-4 py-6 space-y-6">
              {/* Navigation Items */}
              <div className="space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mega Menu Items */}
              {megaDropdownItems.map((section) => (
                <div key={section.category} className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {section.category}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-purple-300" />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-gray-800/50">
                {debugMode ? (
                  <Link href="/dashboard" className="block">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Debug Dashboard
                    </Button>
                  </Link>
                ) : isAuthenticated ? (
                  <div className="space-y-3">
                    {isAdmin && (
                      <Link href="/admin" className="block">
                        <Button variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/10 transition-all duration-300">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Link href="/dashboard" className="block">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/login" className="block">
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800/30 hover:border-gray-500 transition-all duration-300">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="block">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
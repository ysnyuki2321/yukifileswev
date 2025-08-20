"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Menu, X, Sparkles, LogIn, UserPlus, Upload, 
  BarChart3, Crown, Mail, Download, HelpCircle, Github,
  Settings, User, Shield
} from "lucide-react"
import { isDebugModeEnabled } from "@/lib/services/debug-context"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"

interface MobileNavigationProps {
  brandName?: string
  isAuthenticated?: boolean
  isAdmin?: boolean
}

export function MobileNavigation({ 
  brandName = "YukiFiles", 
  isAuthenticated = false, 
  isAdmin = false 
}: MobileNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  useEffect(() => {
    const checkDebugMode = async () => {
      const debug = await isDebugModeEnabled()
      setDebugMode(debug)
    }
    checkDebugMode()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-lg border-b border-gray-800' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              {brandName}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="text-white hover:text-purple-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-black/95 backdrop-blur-lg border-t border-gray-800">
            <div className="px-4 py-6 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center hover:scale-105 transition-transform">
                    <LogIn className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <span className="text-sm font-medium text-white">Sign In</span>
                  </div>
                </Link>
                
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-center hover:scale-105 transition-transform">
                    <UserPlus className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <span className="text-sm font-medium text-white">Register</span>
                  </div>
                </Link>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                  Features
                </h3>
                <Link href="/files" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">File Management</span>
                  </div>
                </Link>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">Analytics</span>
                  </div>
                </Link>
                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Premium Plans</span>
                  </div>
                </Link>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block p-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Theme Switcher */}
              <div className="flex justify-center">
                <ThemeSwitcher size="md" variant="default" />
              </div>

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-gray-700">
                {debugMode ? (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Debug Dashboard
                    </Button>
                  </Link>
                ) : isAuthenticated ? (
                  <div className="space-y-3">
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/10">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
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
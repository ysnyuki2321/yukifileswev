"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Sparkles, LogIn, UserPlus, Upload, BarChart3, Crown } from "lucide-react"
import { isDebugModeEnabled } from "@/lib/services/debug-context"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { MegaDropdown } from "@/components/ui/mega-dropdown"

interface NavigationProps {
  brandName?: string
  isAuthenticated?: boolean
  isAdmin?: boolean
}

export default function Navigation({ brandName = "YukiFiles", isAuthenticated = false, isAdmin = false }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [isMegaDropdownOpen, setIsMegaDropdownOpen] = useState(false)
  const megaDropdownTriggerRef = useRef<HTMLButtonElement>(null)

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

  const productMenu = [
    { name: "File Sharing", href: "/files", description: "Upload and share files securely" },
    { name: "Analytics", href: "/analytics", description: "Track file performance and engagement" },
    { name: "API", href: "/api", description: "Integrate with our powerful API" },
    { name: "Integrations", href: "/integrations", description: "Connect with your favorite tools" },
  ]

  const companyMenu = [
    { name: "About Us", href: "/about", description: "Learn about our mission and team" },
    { name: "Blog", href: "/blog", description: "Latest updates and insights" },
    { name: "Careers", href: "/careers", description: "Join our growing team" },
    { name: "Contact", href: "/contact", description: "Get in touch with us" },
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
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{brandName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Mega Dropdown Trigger */}
            <div className="relative">
              <button
                ref={megaDropdownTriggerRef}
                onClick={() => setIsMegaDropdownOpen(!isMegaDropdownOpen)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">Menu</span>
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
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Switcher */}
            <ThemeSwitcher size="sm" variant="floating" />
            {debugMode ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Debug Dashboard
                </Button>
              </Link>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-white hover:text-purple-300">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-gray-800">
            <div className="px-4 py-6 space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center">
                    <LogIn className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <span className="text-sm font-medium text-white">Sign In</span>
                  </div>
                </Link>
                
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-center">
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
              <div className="flex justify-center mb-4">
                <ThemeSwitcher size="md" variant="default" />
              </div>

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-gray-700">
                {debugMode ? (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Debug Dashboard
                    </Button>
                  </Link>
                ) : isAuthenticated ? (
                  <div className="space-y-3">
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/10">
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
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
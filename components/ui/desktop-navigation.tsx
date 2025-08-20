"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Menu, X, ChevronDown, Sparkles, LogIn, UserPlus, Upload, 
  BarChart3, Crown, Mail, Download, HelpCircle, Github,
  Settings, Sun, Moon, Monitor, User, Shield, Globe
} from "lucide-react"
import { isDebugModeEnabled } from "@/lib/services/debug-context"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { MegaDropdown } from "@/components/ui/mega-dropdown"

interface DesktopNavigationProps {
  brandName?: string
  isAuthenticated?: boolean
  isAdmin?: boolean
}

export function DesktopNavigation({ 
  brandName = "YukiFiles", 
  isAuthenticated = false, 
  isAdmin = false 
}: DesktopNavigationProps) {
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-lg border-b border-gray-800' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
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
            {/* Theme Switcher */}
            <ThemeSwitcher isDesktop={true} />

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
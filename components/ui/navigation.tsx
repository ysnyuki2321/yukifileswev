"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import { isDebugModeEnabled } from "@/lib/services/debug-context"
import { Logo } from "@/components/ui/logo"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"

interface NavigationProps {
  brandName?: string
  isAuthenticated?: boolean
  isAdmin?: boolean
}

export default function Navigation({ brandName = "YukiFiles", isAuthenticated = false, isAdmin = false }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
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
          <Link href="/" className="flex items-center">
            <Logo size="md" variant="default" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Product Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <span>Product</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4 space-y-3">
                  {productMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <span>Company</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4 space-y-3">
                  {companyMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
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
              {/* Product Menu */}
              <div>
                <h3 className="text-white font-semibold mb-3">Product</h3>
                <div className="space-y-2">
                  {productMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Company Menu */}
              <div>
                <h3 className="text-white font-semibold mb-3">Company</h3>
                <div className="space-y-2">
                  {companyMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </Link>
                  ))}
                </div>
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
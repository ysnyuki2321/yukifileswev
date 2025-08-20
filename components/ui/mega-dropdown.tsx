"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  User, Settings, Sun, Moon, Monitor, LogIn, UserPlus, 
  Sparkles, Zap, Shield, Globe, Download, Upload, 
  BarChart3, CreditCard, HelpCircle, Mail, Github,
  ChevronDown, ChevronRight, Star, Crown, Rocket
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MegaDropdownProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement>
}

export function MegaDropdown({ isOpen, onClose, triggerRef }: MegaDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      
      {/* Mega Dropdown */}
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300"
      >
        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Authentication Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Account</h3>
              </div>
              
              <div className="space-y-4">
                <Link href="/auth/login" onClick={onClose}>
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <LogIn className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                          Sign In
                        </h4>
                        <p className="text-sm text-gray-400">
                          Access your account
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-purple-400 transition-colors" />
                    </div>
                  </div>
                </Link>

                <Link href="/auth/register" onClick={onClose}>
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserPlus className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          Create Account
                        </h4>
                        <p className="text-sm text-gray-400">
                          Get started with 2GB free
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Theme & Settings Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Appearance</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <button className="group p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 hover:scale-105">
                    <div className="flex flex-col items-center space-y-2">
                      <Sun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                      <span className="text-xs text-gray-300">Light</span>
                    </div>
                  </button>
                  
                  <button className="group p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105">
                    <div className="flex flex-col items-center space-y-2">
                      <Moon className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                      <span className="text-xs text-gray-300">Dark</span>
                    </div>
                  </button>
                  
                  <button className="group p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
                    <div className="flex flex-col items-center space-y-2">
                      <Monitor className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                      <span className="text-xs text-gray-300">System</span>
                    </div>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">Security Status</span>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">Performance</span>
                    </div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Features</h3>
              </div>
              
              <div className="space-y-3">
                <Link href="/files" onClick={onClose}>
                  <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <Upload className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    <span className="text-sm text-gray-300 group-hover:text-white">File Management</span>
                  </div>
                </Link>
                
                <Link href="/dashboard" onClick={onClose}>
                  <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <BarChart3 className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                    <span className="text-sm text-gray-300 group-hover:text-white">Analytics</span>
                  </div>
                </Link>
                
                <Link href="/pricing" onClick={onClose}>
                  <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <Crown className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" />
                    <span className="text-sm text-gray-300 group-hover:text-white">Premium Plans</span>
                  </div>
                </Link>
                
                <Link href="/contact" onClick={onClose}>
                  <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <Mail className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                    <span className="text-sm text-gray-300 group-hover:text-white">Support</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              </div>
              
              <div className="space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onClick={onClose}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-purple-500"
                  onClick={onClose}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-blue-500"
                    onClick={onClose}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-green-500"
                    onClick={onClose}
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">© 2024 YukiFiles</span>
                <div className="flex items-center space-x-2">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-sm text-gray-400">Premium Experience</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
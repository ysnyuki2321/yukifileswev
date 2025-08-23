"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Crown, 
  Zap,
  ChevronDown
} from "lucide-react"
import { cn } from "@/components/ui/utils"

interface TopbarProps {
  user: any
  userData: any
  isDemoMode?: boolean
  onMenuToggle: () => void
}

export function Topbar({ user, userData, isDemoMode = false, onMenuToggle }: TopbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const getUserInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase()
  }

  const getSubscriptionBadge = () => {
    if (!userData) return null
    
    if (userData.subscription_type === 'paid') {
      return (
        <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
          <Crown className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-purple-300 font-medium">Pro</span>
        </div>
      )
    }
    
    return (
      <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
        <span className="text-xs text-gray-300 font-medium">Free</span>
      </div>
    )
  }

  return (
    <header className="glass-effect border-b border-purple-500/20 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-purple-500/10 touch-target"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </Button>

          {/* Search bar */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 hidden md:block"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-32 pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 md:hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-3">
          {/* Demo mode indicator */}
          {isDemoMode && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-300 font-medium">DEMO</span>
            </div>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-purple-500/10 relative touch-target"
          >
            <Bell className="w-5 h-5 text-gray-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 p-2 hover:bg-purple-500/10 touch-target"
              >
                <Avatar className="w-8 h-8 border-2 border-purple-500/30">
                  <AvatarImage src={user?.avatar} alt={user?.email} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold">
                    {getUserInitials(user?.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex items-center space-x-1">
                  <span className="text-sm text-white font-medium">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-gray-900/95 backdrop-blur-xl border border-purple-500/20"
            >
              <DropdownMenuLabel className="text-white">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} alt={user?.email} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold">
                      {getUserInitials(user?.email || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="bg-gray-700" />
              
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-purple-500/10 cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-purple-500/10 cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-700" />
              
              <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Subscription badge */}
          {getSubscriptionBadge()}
        </div>
      </div>
    </header>
  )
}
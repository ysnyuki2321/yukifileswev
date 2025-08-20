"use client"

import { useState, useEffect, useRef } from "react"
import { Sun, Moon, Monitor, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme/theme-provider"

interface ThemeSwitcherProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "floating" | "minimal"
  isDesktop?: boolean
}

export function ThemeSwitcher({ 
  className, 
  size = "md", 
  variant = "default",
  isDesktop = false
}: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom")
  const containerRef = useRef<HTMLDivElement>(null)

  // Use theme context
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top
      
      // If there's not enough space below (200px for dropdown), show above
      if (spaceBelow < 200 && spaceAbove > 200) {
        setDropdownPosition("top")
      } else {
        setDropdownPosition("bottom")
      }
    }
  }, [isOpen])

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  if (!mounted) {
    return <div className={cn("w-10 h-10 bg-gray-200 rounded-lg animate-pulse", className)} />
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg"
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  const variantClasses = {
    default: "bg-black/40 backdrop-blur-lg border border-gray-600/50 hover:border-purple-500/50",
    floating: "bg-white/10 backdrop-blur-lg border border-white/20 hover:border-purple-400/50 shadow-lg",
    minimal: "bg-transparent border border-gray-600/30 hover:border-purple-500/50"
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className={iconSizes[size]} />
      case "dark":
        return <Moon className={iconSizes[size]} />
      case "system":
        return <Monitor className={iconSizes[size]} />
      default:
        return <Sparkles className={iconSizes[size]} />
    }
  }

  const getThemeColor = () => {
    switch (theme) {
      case "light":
        return "text-yellow-500"
      case "dark":
        return "text-blue-400"
      case "system":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  // Desktop UI with enhanced design
  if (isDesktop) {
    return (
      <div className="relative" ref={containerRef}>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95",
            "bg-black/40 backdrop-blur-lg border border-gray-600/50 hover:border-purple-500/50",
            className
          )}
        >
          <div className={cn("transition-all duration-300", getThemeColor())}>
            {getThemeIcon()}
          </div>
          <span className="text-sm font-medium text-gray-300">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
          <ChevronDown className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </Button>

        {/* Desktop Dropdown */}
        {isOpen && (
          <div className={cn(
            "absolute w-56 bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50",
            "animate-in slide-in-from-top-2 duration-200",
            dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
          )}>
            <div className="p-3">
              <div className="text-xs font-medium text-gray-400 mb-2 px-2">Choose Theme</div>
              <div className="space-y-1">
                {[
                  { value: "light", icon: Sun, label: "Light Mode", color: "text-yellow-400", desc: "Bright and clean" },
                  { value: "dark", icon: Moon, label: "Dark Mode", color: "text-blue-400", desc: "Easy on the eyes" },
                  { value: "system", icon: Monitor, label: "System", color: "text-purple-400", desc: "Follows your OS" }
                ].map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value as "light" | "dark" | "system")}
                      className={cn(
                        "w-full flex items-center space-x-3 p-3 rounded-lg text-sm transition-all duration-200",
                        "hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]",
                        theme === option.value && "bg-purple-500/20 text-purple-300",
                        theme !== option.value && "text-gray-300 hover:text-white"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", 
                        theme === option.value ? "bg-purple-500/20" : "bg-gray-800/50"
                      )}>
                        <Icon className={cn("w-4 h-4", option.color)} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                      {theme === option.value && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    )
  }

  // Mobile/Compact UI
  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative transition-all duration-300 hover:scale-105 active:scale-95",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        <div className={cn("transition-all duration-300", getThemeColor())}>
          {getThemeIcon()}
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </Button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className={cn(
          "absolute right-0 w-48 bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-2xl z-50",
          "animate-in slide-in-from-top-2 duration-200",
          dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
        )}>
          <div className="p-2 space-y-1">
            {[
              { value: "light", icon: Sun, label: "Light", color: "text-yellow-400" },
              { value: "dark", icon: Moon, label: "Dark", color: "text-blue-400" },
              { value: "system", icon: Monitor, label: "System", color: "text-purple-400" }
            ].map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value as "light" | "dark" | "system")}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
                    "hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]",
                    theme === option.value && "bg-purple-500/20 text-purple-300",
                    theme !== option.value && "text-gray-300 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-4 h-4", option.color)} />
                  <span>{option.label}</span>
                  {theme === option.value && (
                    <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Monitor, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Theme = "light" | "dark" | "system"

interface ThemeSwitcherProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "floating" | "minimal"
}

export function ThemeSwitcher({ 
  className, 
  size = "md", 
  variant = "default" 
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme || "dark"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.toggle("dark", systemTheme === "dark")
    } else {
      root.classList.toggle("dark", newTheme === "dark")
    }
    
    localStorage.setItem("theme", newTheme)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
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

  return (
    <div className="relative">
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

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
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
                  onClick={() => handleThemeChange(option.value as Theme)}
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
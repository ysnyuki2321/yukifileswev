"use client"

import { useTheme } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  variant?: "default" | "floating" | "minimal"
}

export function ThemeToggle({ 
  className, 
  showLabel = false, 
  variant = "default" 
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"]
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />
      case "dark":
        return <Moon className="w-4 h-4" />
      case "system":
        return <Monitor className="w-4 h-4" />
      default:
        return <Sun className="w-4 h-4" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      case "system":
        return "System"
      default:
        return "Light"
    }
  }

  const variantClasses = {
    default: "bg-background border border-border hover:bg-accent hover:text-accent-foreground",
    floating: "bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/50 shadow-lg",
    minimal: "bg-transparent hover:bg-accent/50"
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative transition-all duration-300 hover:scale-105 active:scale-95",
        variantClasses[variant],
        className
      )}
      title={`Current theme: ${getThemeLabel()}. Click to cycle themes.`}
    >
      <div className="relative">
        {/* Icon with rotation animation */}
        <div className={cn(
          "transition-all duration-500",
          theme === "light" && "rotate-0",
          theme === "dark" && "rotate-180",
          theme === "system" && "rotate-90"
        )}>
          {getThemeIcon()}
        </div>
        
        {/* Glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-full transition-all duration-300",
          theme === "light" && "bg-yellow-500/20",
          theme === "dark" && "bg-blue-500/20",
          theme === "system" && "bg-purple-500/20"
        )} />
      </div>

      {/* Label if enabled */}
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {getThemeLabel()}
        </span>
      )}

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-current opacity-0 transition-opacity duration-300 hover:opacity-10" />
    </Button>
  )
}
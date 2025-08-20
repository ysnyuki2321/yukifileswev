"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  Plus, Settings, HelpCircle, MessageCircle, 
  ArrowUp, Sparkles, X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingActionsProps {
  className?: string
}

export function FloatingActions({ className }: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
      href: "/settings",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: "Help",
      href: "/help",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <MessageCircle className="w-4 h-4" />,
      label: "Feedback",
      href: "/feedback",
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ]

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Action Buttons */}
      <div className="flex flex-col items-end space-y-3">
        {isOpen && actions.map((action, index) => (
          <div
            key={action.label}
            className="flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-sm font-medium text-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border">
              {action.label}
            </span>
            <Button
              size="icon"
              className={cn(
                "w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
                action.color
              )}
              onClick={() => {
                // Handle navigation or action
                console.log(`Navigate to ${action.href}`)
              }}
            >
              {action.icon}
            </Button>
          </div>
        ))}

        {/* Theme Toggle */}
        {isOpen && (
          <div className="flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${actions.length * 100}ms` }}>
            <span className="text-sm font-medium text-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border">
              Theme
            </span>
            <ThemeToggle 
              variant="floating" 
              className="w-12 h-12 rounded-full shadow-lg"
            />
          </div>
        )}

        {/* Main Toggle Button */}
        <Button
          size="icon"
          className={cn(
            "w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
            isOpen 
              ? "bg-destructive hover:bg-destructive/90" 
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </Button>
      </div>

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
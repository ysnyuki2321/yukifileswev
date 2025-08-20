"use client"

import { useState } from "react"
import { Star, Folder } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "gradient" | "glow" | "minimal"
  showText?: boolean
  className?: string
  animated?: boolean
}

export function Logo({ 
  size = "md", 
  variant = "default", 
  showText = true, 
  className,
  animated = true 
}: LogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12"
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6"
  }

  const variantClasses = {
    default: {
      container: "bg-gradient-to-r from-purple-500 to-pink-500",
      star: "text-white",
      folder: "text-blue-400"
    },
    gradient: {
      container: "bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500",
      star: "text-white",
      folder: "text-cyan-300"
    },
    glow: {
      container: "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25",
      star: "text-white",
      folder: "text-yellow-300"
    },
    minimal: {
      container: "bg-black/30 border border-purple-500/30",
      star: "text-purple-400",
      folder: "text-blue-400"
    }
  }

  const currentVariant = variantClasses[variant]

  return (
    <div 
      className={cn(
        "flex items-center space-x-2",
        className
      )}
      onMouseEnter={() => animated && setIsHovered(true)}
      onMouseLeave={() => animated && setIsHovered(false)}
    >
      {/* Logo Icon */}
      <div className="relative">
        {/* Main Container */}
        <div 
          className={cn(
            "relative rounded-lg flex items-center justify-center transition-all duration-300",
            sizeClasses[size],
            currentVariant.container,
            animated && "hover:scale-110 hover:rotate-3",
            isHovered && animated && "scale-110 rotate-3"
          )}
        >
          {/* Star Icon */}
          <Star 
            className={cn(
              "absolute transition-all duration-300",
              iconSizes[size],
              currentVariant.star,
              animated && isHovered && "animate-pulse"
            )} 
          />
          
          {/* Folder Icon - Positioned slightly offset */}
          <Folder 
            className={cn(
              "absolute transition-all duration-300",
              iconSizes[size],
              currentVariant.folder,
              "translate-x-0.5 translate-y-0.5",
              animated && isHovered && "animate-bounce"
            )} 
          />

          {/* Glow Effect for Glow Variant */}
          {variant === "glow" && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-sm animate-pulse" />
          )}

          {/* Sparkles Animation */}
          {animated && isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-1 -right-1 animate-ping">
                <div className="w-1 h-1 bg-yellow-400 rounded-full" />
              </div>
              <div className="absolute -bottom-1 -left-1 animate-ping" style={{ animationDelay: "0.1s" }}>
                <div className="w-0.5 h-0.5 bg-pink-400 rounded-full" />
              </div>
              <div className="absolute top-1/2 -left-1 animate-ping" style={{ animationDelay: "0.2s" }}>
                <div className="w-0.5 h-0.5 bg-blue-400 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Ripple Effect */}
        {animated && isHovered && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 scale-150 opacity-0 animate-ping" />
        )}
      </div>

      {/* Logo Text */}
      {showText && (
        <span 
          className={cn(
            "font-bold transition-all duration-300",
            textSizes[size],
            "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent",
            animated && isHovered && "from-purple-300 to-pink-300"
          )}
        >
          YukiFiles
        </span>
      )}
    </div>
  )
}

// Favicon Component for web icon
export function Favicon({ size = 32 }: { size?: number }) {
  return (
    <div 
      className="relative rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Star className="absolute text-white" style={{ width: size * 0.4, height: size * 0.4 }} />
      <Folder 
        className="absolute text-blue-400 translate-x-0.5 translate-y-0.5" 
        style={{ width: size * 0.4, height: size * 0.4 }} 
      />
    </div>
  )
}

// Logo with different styles for different contexts
export function LogoWithText({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  return <Logo size={size} variant="default" showText={true} className={className} />
}

export function LogoIcon({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  return <Logo size={size} variant="default" showText={false} className={className} />
}

export function LogoGradient({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  return <Logo size={size} variant="gradient" showText={true} className={className} />
}

export function LogoGlow({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  return <Logo size={size} variant="glow" showText={true} className={className} />
}
"use client"

import React, { useState, useEffect } from "react"
import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomCheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  className?: string
  children?: React.ReactNode
  variant?: "default" | "gradient" | "glow"
  size?: "sm" | "md" | "lg"
}

export function CustomCheckbox({
  checked = false,
  onChange,
  disabled = false,
  required = false,
  className,
  children,
  variant = "default",
  size = "md"
}: CustomCheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleClick = () => {
    if (disabled) return
    
    const newValue = !isChecked
    setIsChecked(newValue)
    onChange?.(newValue)
    
    // Trigger sparkles animation
    if (newValue) {
      setShowSparkles(true)
      setTimeout(() => setShowSparkles(false), 600)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  }

  const variantClasses = {
    default: {
      base: "bg-black/30 border-gray-600",
      checked: "bg-purple-500 border-purple-500",
      hover: "hover:border-purple-400 hover:bg-purple-500/20",
      focus: "focus:ring-purple-500/20 focus:ring-2"
    },
    gradient: {
      base: "bg-black/30 border-gray-600",
      checked: "bg-gradient-to-r from-purple-500 to-pink-500 border-transparent",
      hover: "hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20",
      focus: "focus:ring-purple-500/20 focus:ring-2"
    },
    glow: {
      base: "bg-black/30 border-gray-600",
      checked: "bg-gradient-to-r from-purple-500 to-pink-500 border-transparent shadow-lg shadow-purple-500/25",
      hover: "hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:shadow-purple-500/10",
      focus: "focus:ring-purple-500/20 focus:ring-2"
    }
  }

  const currentVariant = variantClasses[variant]

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        aria-required={required}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={cn(
          "relative inline-flex items-center justify-center rounded transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
          sizeClasses[size],
          currentVariant.base,
          isChecked && currentVariant.checked,
          !disabled && currentVariant.hover,
          !disabled && currentVariant.focus,
          disabled && "opacity-50 cursor-not-allowed",
          isPressed && "scale-95",
          className
        )}
        tabIndex={disabled ? -1 : 0}
      >
        {/* Check Icon */}
        <div
          className={cn(
            "flex items-center justify-center transition-all duration-200",
            isChecked 
              ? "opacity-100 scale-100 rotate-0" 
              : "opacity-0 scale-75 -rotate-12"
          )}
        >
          <Check 
            className={cn(
              "text-white font-bold",
              iconSizes[size]
            )} 
          />
        </div>

        {/* Sparkles Animation */}
        {showSparkles && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1 -right-1 animate-ping">
              <Sparkles className="w-2 h-2 text-yellow-400" />
            </div>
            <div className="absolute -bottom-1 -left-1 animate-ping" style={{ animationDelay: "0.1s" }}>
              <Sparkles className="w-1.5 h-1.5 text-pink-400" />
            </div>
            <div className="absolute top-1/2 -left-1 animate-ping" style={{ animationDelay: "0.2s" }}>
              <Sparkles className="w-1 h-1 text-blue-400" />
            </div>
          </div>
        )}

        {/* Ripple Effect */}
        <div
          className={cn(
            "absolute inset-0 rounded transition-all duration-300",
            isHovered && !isChecked && "bg-purple-500/10 scale-110",
            isChecked && "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
          )}
        />

        {/* Glow Effect */}
        {isChecked && variant === "glow" && (
          <div className="absolute inset-0 rounded bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-sm animate-pulse" />
        )}
      </button>

      {/* Label */}
      {children && (
        <label 
          className={cn(
            "ml-3 text-sm cursor-pointer select-none transition-colors duration-200",
            disabled ? "text-gray-500 cursor-not-allowed" : "text-gray-300 hover:text-white",
            isChecked && "text-white"
          )}
          onClick={!disabled ? handleClick : undefined}
        >
          {children}
        </label>
      )}

      {/* Hidden Native Checkbox for Form Submission */}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => {}} // Handled by custom button
        required={required}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
      />
    </div>
  )
}

// Checkbox Group Component
interface CheckboxGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function CheckboxGroup({ 
  children, 
  className, 
  orientation = "vertical" 
}: CheckboxGroupProps) {
  return (
    <div 
      className={cn(
        "space-y-3",
        orientation === "horizontal" && "flex flex-wrap gap-4 space-y-0",
        className
      )}
    >
      {children}
    </div>
  )
}

// Animated Checkbox with Loading State
interface AnimatedCheckboxProps extends CustomCheckboxProps {
  loading?: boolean
  loadingText?: string
}

export function AnimatedCheckbox({
  loading = false,
  loadingText = "Loading...",
  ...props
}: AnimatedCheckboxProps) {
  return (
    <div className="relative">
      <CustomCheckbox
        {...props}
        disabled={props.disabled || loading}
        className={cn(
          props.className,
          loading && "opacity-75"
        )}
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {loading && loadingText && (
        <span className="ml-2 text-xs text-gray-400 animate-pulse">
          {loadingText}
        </span>
      )}
    </div>
  )
}
"use client"

import type React from "react"

import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"

interface PremiumTextProps {
  children: React.ReactNode
  className?: string
  premium?: boolean
}

export function PremiumText({ children, className, premium = true }: PremiumTextProps) {
  const { isPremium } = useTheme()

  return (
    <span className={cn(isPremium && premium ? "premium-text" : "free-text text-white", className)}>{children}</span>
  )
}

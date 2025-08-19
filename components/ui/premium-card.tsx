"use client"

import { Card, type CardProps } from "@/components/ui/card"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"

interface PremiumCardProps extends CardProps {
  premium?: boolean
}

export function PremiumCard({ className, premium = true, ...props }: PremiumCardProps) {
  const { isPremium } = useTheme()

  return (
    <Card
      className={cn(
        isPremium && premium ? "premium-card premium-glow" : "free-card bg-black/40 backdrop-blur-lg border-gray-700",
        className,
      )}
      {...props}
    />
  )
}

"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useTheme } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"

interface PremiumButtonProps extends ButtonProps {
  premium?: boolean
}

export function PremiumButton({ className, premium = true, ...props }: PremiumButtonProps) {
  const { isPremium } = useTheme()

  return (
    <Button
      className={cn(
        isPremium && premium
          ? "premium-button text-white border-0"
          : "free-button bg-gray-700 hover:bg-gray-600 text-white",
        className,
      )}
      {...props}
    />
  )
}

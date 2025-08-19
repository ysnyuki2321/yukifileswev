"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface ThemeContextType {
  theme: "free" | "premium"
  setTheme: (theme: "free" | "premium") => void
  isPremium: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  subscriptionType,
}: {
  children: React.ReactNode
  subscriptionType?: "free" | "paid"
}) {
  const [theme, setTheme] = useState<"free" | "premium">("free")

  useEffect(() => {
    // Set theme based on subscription type
    const newTheme = subscriptionType === "paid" ? "premium" : "free"
    setTheme(newTheme)

    // Apply theme class to document
    document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, "")
    document.documentElement.classList.add(`theme-${newTheme}`)

    console.log(`[v0] Applied ${newTheme} theme for ${subscriptionType} user`)
  }, [subscriptionType])

  const value = {
    theme,
    setTheme,
    isPremium: theme === "premium",
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

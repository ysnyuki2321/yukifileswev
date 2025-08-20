"use client"

import { DesktopNavigation } from "@/components/ui/desktop-navigation"
import { MobileNavigation } from "@/components/ui/mobile-navigation"

interface NavigationProps {
  brandName?: string
  isAuthenticated?: boolean
  isAdmin?: boolean
}

export default function Navigation({ brandName = "YukiFiles", isAuthenticated = false, isAdmin = false }: NavigationProps) {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <DesktopNavigation 
          brandName={brandName}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation 
          brandName={brandName}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        />
      </div>
    </>
  )
}
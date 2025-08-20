"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Bell, LogOut, Menu } from "lucide-react"
import { signOut } from "@/lib/actions/auth"

interface TopbarProps {
  userEmail: string
  isPremium: boolean
  brandName?: string
}

export default function Topbar({ userEmail, isPremium, brandName = "YukiFiles" }: TopbarProps) {
  return (
    <header className="h-16 w-full border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
      <div className="h-full container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-300 hover:text-white hover:bg-white/5">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
            <span className="font-semibold text-foreground">{brandName}</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl hidden md:block">
          <Input placeholder="Search files, shares..." className="bg-black/30 border-gray-700" />
        </div>

        <div className="flex items-center gap-2">
          {isPremium && (
            <span className="hidden sm:inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded premium-glow">
              PREMIUM
            </span>
          )}
          <span className="hidden sm:inline text-gray-300 text-sm">{userEmail}</span>
          <button className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-300 hover:text-white hover:bg-white/5">
            <Bell className="h-5 w-5" />
          </button>
          <form action={signOut}>
            <Button type="submit" variant="ghost" className="text-gray-300 hover:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}


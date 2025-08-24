"use client"

import { Button } from "@/components/ui/button"
import { YukiFilesLogo } from "./yukifiles-logo"
import { Menu, X, Shield, User, LogOut } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <YukiFilesLogo size={32} variant="gradient" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Features
            </a>
            <a href="#demo" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Demo
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Pricing
            </a>
            <a href="#docs" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Docs
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                Try Demo
              </Button>
            </Link>
            <Link href="/demo/dashboard">
              <Button size="sm" className="gradient-primary text-white hover:opacity-90 transition-opacity">
                Launch Dashboard
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <nav className="flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-sm font-medium hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-muted/50"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#demo" 
                className="text-sm font-medium hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-muted/50"
                onClick={() => setIsMenuOpen(false)}
              >
                Demo
              </a>
              <a 
                href="#pricing" 
                className="text-sm font-medium hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-muted/50"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#docs" 
                className="text-sm font-medium hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-muted/50"
                onClick={() => setIsMenuOpen(false)}
              >
                Docs
              </a>
              
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link href="/demo" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Try Demo
                  </Button>
                </Link>
                <Link href="/demo/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="gradient-primary text-white w-full">
                    Launch Dashboard
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
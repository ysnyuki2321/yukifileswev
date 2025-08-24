"use client"

import { Header } from "@/components/ui/header"
import { HeroSection } from "@/components/ui/hero-section"
import { FeaturesSection } from "@/components/ui/features-section"
import { DemoSection } from "@/components/ui/demo-section"
import { YukiFilesLogo } from "@/components/ui/yukifiles-logo"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-muted/50 border-t border-border/50 py-12"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <YukiFilesLogo size={40} variant="minimal" />
          </div>
          <p className="text-muted-foreground mb-4">
            Advanced file management for the modern digital workspace
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            © 2024 YukiFiles. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </main>
  )
}

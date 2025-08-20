"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function FloatingDemoButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: 1,
        type: "spring",
        stiffness: 100
      }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link href="/demo">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl shadow-purple-500/25 text-white font-semibold px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300"
          >
            <PlayCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Try Demo</span>
            <span className="sm:hidden">Demo</span>
          </Button>
          
          {/* Floating Animation Ring */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 -z-10"
          />
          
          {/* Pulse Effect */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 -z-20"
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

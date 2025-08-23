"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, FileText, FileCode, Music, Image, Video, Database, Folder, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  title: string
  type: 'file' | 'media' | 'database' | 'folder'
  content: any
  isActive: boolean
}

interface TabSystemProps {
  tabs: Tab[]
  onTabClose: (tabId: string) => void
  onTabActivate: (tabId: string) => void
  onTabUpdate: (tabId: string, content: any) => void
}

const FILE_TYPE_ICONS = {
  file: FileText,
  media: Image,
  database: Database,
  folder: Folder
}

export function TabSystem({ tabs, onTabClose, onTabActivate, onTabUpdate }: TabSystemProps) {
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const tabContentRef = useRef<HTMLDivElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const activeTab = tabs.find(tab => tab.isActive)
    if (activeTab) {
      setActiveTabId(activeTab.id)
      // Auto-scroll to tab content
      setTimeout(() => {
        if (tabContentRef.current) {
          tabContentRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          })
        }
      }, 100)
    }
  }, [tabs])

  useEffect(() => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const hasOverflow = container.scrollWidth > container.clientWidth
      setShowScrollButtons(hasOverflow)
    }
  }, [tabs])

  const handleTabClick = (tabId: string) => {
    onTabActivate(tabId)
    setActiveTabId(tabId)
  }

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    onTabClose(tabId)
  }

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const scrollAmount = direction === 'left' ? -200 : 200
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const getTabIcon = (type: string) => {
    const IconComponent = FILE_TYPE_ICONS[type as keyof typeof FILE_TYPE_ICONS]
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <FileText className="w-4 h-4" />
  }

  if (tabs.length === 0) return null

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="relative bg-gradient-to-r from-slate-800/50 via-purple-900/50 to-slate-800/50 border-b border-purple-500/20">
        {/* Scroll Buttons - Desktop Only */}
        {showScrollButtons && !isMobile && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => scrollTabs('left')}
              className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-slate-800/80 to-transparent text-white hover:bg-white/20 rounded-none px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => scrollTabs('right')}
              className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-slate-800/80 to-transparent text-white hover:bg-white/20 rounded-none px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Tabs Container */}
        <div 
          ref={tabsContainerRef}
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-2"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "flex items-center gap-2 px-3 py-3 cursor-pointer transition-all duration-200 border-b-2 min-w-fit flex-shrink-0",
                tab.isActive
                  ? "border-purple-500 bg-purple-500/20 text-white shadow-lg"
                  : "border-transparent hover:bg-white/10 text-white/80 hover:text-white hover:bg-purple-500/10"
              )}
              onClick={() => handleTabClick(tab.id)}
            >
              {getTabIcon(tab.type)}
              <span className={cn(
                "text-sm font-medium truncate",
                isMobile ? "max-w-20" : "max-w-32"
              )}>
                {tab.title}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleTabClose(e, tab.id)}
                className={cn(
                  "hover:bg-white/20 rounded-full transition-all duration-200",
                  isMobile ? "w-6 h-6 p-0 ml-1" : "w-5 h-5 p-0 ml-2"
                )}
              >
                <X className={isMobile ? "w-3 h-3" : "w-3 h-3"} />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Mobile Tab Indicator */}
        {isMobile && tabs.length > 1 && (
          <div className="flex justify-center py-2">
            <div className="flex gap-1">
              {tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    tab.isActive 
                      ? "bg-purple-500" 
                      : "bg-white/30"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div ref={tabContentRef} className="w-full">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.isActive && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
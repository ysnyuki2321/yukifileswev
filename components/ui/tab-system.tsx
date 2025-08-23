"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, FileText, FileCode, Music, Image, Video, Database, Folder } from 'lucide-react'
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
  const tabContentRef = useRef<HTMLDivElement>(null)

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

  const handleTabClick = (tabId: string) => {
    onTabActivate(tabId)
    setActiveTabId(tabId)
  }

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    onTabClose(tabId)
  }

  const getTabIcon = (type: string) => {
    const IconComponent = FILE_TYPE_ICONS[type as keyof typeof FILE_TYPE_ICONS]
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <FileText className="w-4 h-4" />
  }

  if (tabs.length === 0) return null

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "flex items-center gap-2 px-4 py-3 cursor-pointer transition-all duration-200 border-b-2 min-w-fit",
              tab.isActive
                ? "border-purple-500 bg-purple-500/10 text-white"
                : "border-transparent hover:bg-white/5 text-white/70 hover:text-white"
            )}
            onClick={() => handleTabClick(tab.id)}
          >
            {getTabIcon(tab.type)}
            <span className="text-sm font-medium truncate max-w-32">{tab.title}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => handleTabClose(e, tab.id)}
              className="w-5 h-5 p-0 hover:bg-white/20 rounded-full ml-2"
            >
              <X className="w-3 h-3" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Tab Content */}
      <div ref={tabContentRef} className="mt-4">
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
    </div>
  )
}
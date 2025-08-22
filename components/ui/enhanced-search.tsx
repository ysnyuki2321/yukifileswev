"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, File, Folder, Image, Video, Music, 
  Code, FileText, Archive, Database, X, MapPin
} from "lucide-react"

interface SearchResult {
  id: string
  name: string
  type: 'file' | 'folder' | 'feature'
  category: string
  path: string[]
  size?: string
  lastModified?: string
  icon: any
  matches: {
    field: 'name' | 'content' | 'path'
    text: string
    highlights: { start: number; end: number }[]
  }[]
}

interface EnhancedSearchProps {
  placeholder?: string
  onResultClick?: (result: SearchResult) => void
  className?: string
}

export function EnhancedSearch({ 
  placeholder = "Search files, folders, content...", 
  onResultClick,
  className = ""
}: EnhancedSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock comprehensive search data
  const mockSearchData: SearchResult[] = [
    {
      id: '1', name: 'project-proposal.pdf', type: 'file', category: 'document',
      path: ['Documents', 'Projects'], size: '2.5 MB', lastModified: '2 hours ago',
      icon: FileText, matches: [{ field: 'name', text: 'project-proposal.pdf', highlights: [] }]
    },
    {
      id: '2', name: 'vacation-photos', type: 'folder', category: 'folder',
      path: ['Photos'], size: '45 files', lastModified: '1 day ago',
      icon: Folder, matches: [{ field: 'name', text: 'vacation-photos', highlights: [] }]
    },
    {
      id: '3', name: 'presentation.pptx', type: 'file', category: 'presentation',
      path: ['Work', 'Presentations'], size: '8.1 MB', lastModified: '3 hours ago',
      icon: FileText, matches: [{ field: 'name', text: 'presentation.pptx', highlights: [] }]
    },
    {
      id: '4', name: 'demo-video.mp4', type: 'file', category: 'video',
      path: ['Media', 'Videos'], size: '125 MB', lastModified: '1 day ago',
      icon: Video, matches: [{ field: 'name', text: 'demo-video.mp4', highlights: [] }]
    },
    {
      id: '5', name: 'background-music.mp3', type: 'file', category: 'audio',
      path: ['Media', 'Audio'], size: '4.2 MB', lastModified: '2 days ago',
      icon: Music, matches: [{ field: 'name', text: 'background-music.mp3', highlights: [] }]
    },
    {
      id: '6', name: 'app-source-code', type: 'folder', category: 'code',
      path: ['Development'], size: '23 files', lastModified: '5 hours ago',
      icon: Code, matches: [{ field: 'name', text: 'app-source-code', highlights: [] }]
    },
    {
      id: '7', name: 'database.sqlite', type: 'file', category: 'database',
      path: ['Data'], size: '12.3 MB', lastModified: '1 hour ago',
      icon: Database, matches: [{ field: 'name', text: 'database.sqlite', highlights: [] }]
    },
    {
      id: '8', name: 'compressed-files.tar.gz', type: 'file', category: 'archive',
      path: ['Archives'], size: '45.2 MB', lastModified: '30 minutes ago',
      icon: Archive, matches: [{ field: 'name', text: 'compressed-files.tar.gz', highlights: [] }]
    },
    // Features search
    {
      id: 'f1', name: 'AI Tools', type: 'feature', category: 'feature',
      path: ['Dashboard', 'AI Tools'], size: '', lastModified: '',
      icon: Search, matches: [{ field: 'name', text: 'AI Tools', highlights: [] }]
    },
    {
      id: 'f2', name: 'File Compression', type: 'feature', category: 'feature',
      path: ['Files', 'Actions'], size: '', lastModified: '',
      icon: Archive, matches: [{ field: 'name', text: 'File Compression', highlights: [] }]
    }
  ]

  const highlightText = (text: string, highlights: { start: number; end: number }[]) => {
    if (!highlights.length) return text
    
    let result = []
    let lastIndex = 0
    
    highlights.forEach(({ start, end }, index) => {
      // Add text before highlight
      if (start > lastIndex) {
        result.push(text.slice(lastIndex, start))
      }
      
      // Add highlighted text
      result.push(
        <mark key={index} className="bg-purple-500/30 text-purple-200 px-0.5 rounded">
          {text.slice(start, end)}
        </mark>
      )
      
      lastIndex = end
    })
    
    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex))
    }
    
    return result
  }

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    
    // Simulate search delay
    setTimeout(() => {
      const filtered = mockSearchData.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        const pathMatch = item.path.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
        const categoryMatch = item.category.toLowerCase().includes(searchQuery.toLowerCase())
        
        return nameMatch || pathMatch || categoryMatch
      }).map(item => {
        // Add highlights
        const queryLower = searchQuery.toLowerCase()
        const nameLower = item.name.toLowerCase()
        const nameIndex = nameLower.indexOf(queryLower)
        
        if (nameIndex !== -1) {
          item.matches = [{
            field: 'name',
            text: item.name,
            highlights: [{ start: nameIndex, end: nameIndex + searchQuery.length }]
          }]
        }
        
        return item
      })?.slice(0, 8) || [] // Limit results với safe navigation
      
      setResults(filtered)
      setShowResults(true)
      setSelectedIndex(-1)
      setIsSearching(false)
    }, 200)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setQuery("")
    setShowResults(false)
    setSelectedIndex(-1)
    onResultClick?.(result)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'document': return 'bg-blue-500/20 text-blue-400'
      case 'image': return 'bg-green-500/20 text-green-400'
      case 'video': return 'bg-red-500/20 text-red-400'
      case 'audio': return 'bg-yellow-500/20 text-yellow-400'
      case 'code': return 'bg-purple-500/20 text-purple-400'
      case 'archive': return 'bg-orange-500/20 text-orange-400'
      case 'database': return 'bg-cyan-500/20 text-cyan-400'
      case 'feature': return 'bg-pink-500/20 text-pink-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (query.trim()) setShowResults(true) }}
          onBlur={() => { setTimeout(() => setShowResults(false), 150) }}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-black/30 border-gray-700 focus:border-purple-500/50 focus:bg-black/50 transition-all allow-select"
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setResults([])
              setShowResults(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-lg border border-purple-500/30 rounded-lg shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto"
          >
            {results.length > 0 ? (
              <>
                <div className="p-3 border-b border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Found {results.length} result{results.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-gray-500">
                      Use ↑↓ to navigate, Enter to select
                    </span>
                  </div>
                </div>
                
                {results.map((result, index) => {
                  const Icon = result.icon
                  const isSelected = index === selectedIndex
                  
                  return (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left p-3 transition-colors ${
                        isSelected 
                          ? 'bg-purple-500/20 border-l-2 border-purple-500' 
                          : 'hover:bg-purple-500/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(result.category)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-medium text-sm truncate">
                              {result.matches[0] ? 
                                highlightText(result.matches[0].text, result.matches[0].highlights) : 
                                result.name
                              }
                            </p>
                            <Badge className={`text-xs ${getCategoryColor(result.category)} border-0`}>
                              {result.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {result.path.length > 0 ? result.path.join(' › ') : 'Root'}
                            </span>
                            {result.size && (
                              <>
                                <span>•</span>
                                <span>{result.size}</span>
                              </>
                            )}
                            {result.lastModified && (
                              <>
                                <span>•</span>
                                <span>{result.lastModified}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
                
                {query.trim() && (
                  <div className="border-t border-purple-500/20 p-3">
                    <button
                      onClick={() => {
                        setQuery("")
                        setShowResults(false)
                        window.location.href = `/files?search=${encodeURIComponent(query)}`
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 text-purple-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      <span className="text-sm">View all results for "{query}"</span>
                    </button>
                  </div>
                )}
              </>
            ) : query.trim() ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-300 font-medium mb-1">No results found</p>
                <p className="text-gray-500 text-sm">Try different keywords or check spelling</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
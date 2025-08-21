"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Download, 
  Upload,
  Share2,
  Globe,
  Link,
  ChevronDown,
  ExternalLink,
  Copy,
  Calendar,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfessionalChartsProps {
  isPremium: boolean
  isDemoMode?: boolean
}

interface ChartData {
  label: string
  value: number
  change: number
  color: string
}

interface ShareLink {
  id: string
  name: string
  url: string
  views: number
  downloads: number
  created: string
}

const mockShareLinks: ShareLink[] = [
  { id: '1', name: 'Project Report.pdf', url: '/share/abc123', views: 1247, downloads: 89, created: '2024-01-15' },
  { id: '2', name: 'Design Assets.zip', url: '/share/def456', views: 892, downloads: 156, created: '2024-01-14' },
  { id: '3', name: 'Meeting Notes.md', url: '/share/ghi789', views: 634, downloads: 23, created: '2024-01-13' },
  { id: '4', name: 'API Documentation', url: '/share/jkl012', views: 2103, downloads: 341, created: '2024-01-12' }
]

export default function ProfessionalCharts({ isPremium, isDemoMode = false }: ProfessionalChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'downloads' | 'uploads' | 'shares'>('views')
  const [showDropdown, setShowDropdown] = useState(false)

  const chartData: Record<string, ChartData[]> = {
    views: [
      { label: 'Today', value: 1247, change: 12.5, color: 'bg-blue-500' },
      { label: 'Yesterday', value: 1109, change: -3.2, color: 'bg-blue-400' },
      { label: 'This Week', value: 8934, change: 18.7, color: 'bg-blue-600' },
      { label: 'This Month', value: 34567, change: 24.1, color: 'bg-blue-700' }
    ],
    downloads: [
      { label: 'Today', value: 89, change: 8.3, color: 'bg-green-500' },
      { label: 'Yesterday', value: 82, change: 5.1, color: 'bg-green-400' },
      { label: 'This Week', value: 634, change: 15.2, color: 'bg-green-600' },
      { label: 'This Month', value: 2847, change: 31.4, color: 'bg-green-700' }
    ],
    uploads: [
      { label: 'Today', value: 23, change: 15.0, color: 'bg-purple-500' },
      { label: 'Yesterday', value: 20, change: -10.0, color: 'bg-purple-400' },
      { label: 'This Week', value: 156, change: 22.8, color: 'bg-purple-600' },
      { label: 'This Month', value: 678, change: 45.2, color: 'bg-purple-700' }
    ],
    shares: [
      { label: 'Today', value: 12, change: 20.0, color: 'bg-orange-500' },
      { label: 'Yesterday', value: 10, change: 0, color: 'bg-orange-400' },
      { label: 'This Week', value: 78, change: 18.2, color: 'bg-orange-600' },
      { label: 'This Month', value: 334, change: 28.5, color: 'bg-orange-700' }
    ]
  }

  const currentData = chartData[selectedMetric]
  const maxValue = Math.max(...currentData.map(d => d.value))

  const getMetricIcon = () => {
    switch (selectedMetric) {
      case 'views': return <Eye className="w-4 h-4" />
      case 'downloads': return <Download className="w-4 h-4" />
      case 'uploads': return <Upload className="w-4 h-4" />
      case 'shares': return <Share2 className="w-4 h-4" />
    }
  }

  const getMetricTitle = () => {
    switch (selectedMetric) {
      case 'views': return 'Page Views'
      case 'downloads': return 'Downloads'
      case 'uploads': return 'Uploads'
      case 'shares': return 'Shares'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredLinks = selectedMetric === 'views' 
    ? mockShareLinks.sort((a, b) => b.views - a.views)
    : selectedMetric === 'downloads'
    ? mockShareLinks.sort((a, b) => b.downloads - a.downloads)
    : mockShareLinks

  return (
    <div className="space-y-6">
      {/* Header with Metric Selector */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analytics Dashboard
            </CardTitle>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowDropdown(!showDropdown)}
                className="border-purple-500/30 text-white hover:bg-purple-500/20"
              >
                {getMetricIcon()}
                <span className="ml-2">{getMetricTitle()}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-purple-500/20 rounded-lg shadow-xl z-10">
                  {[
                    { key: 'views' as const, label: 'Page Views', icon: Eye },
                    { key: 'downloads' as const, label: 'Downloads', icon: Download },
                    { key: 'uploads' as const, label: 'Uploads', icon: Upload },
                    { key: 'shares' as const, label: 'Shares', icon: Share2 }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedMetric(key)
                        setShowDropdown(false)
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left hover:bg-purple-500/20 flex items-center gap-2 text-sm",
                        selectedMetric === key ? "text-purple-400 bg-purple-500/10" : "text-gray-300"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Chart */}
          <div className="mb-6">
            {/* Chart Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">{getMetricTitle()} Analytics</h3>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                Last 30 days
              </Badge>
            </div>
            
            {/* Main Chart - Curved Line Chart */}
            <div className="bg-slate-800/30 rounded-lg p-6 mb-4">
              <div className="h-64 relative">
                {/* Chart Grid */}
                <div className="absolute inset-0 grid grid-rows-4 opacity-20">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="border-b border-gray-600 last:border-b-0" />
                  ))}
                </div>
                
                {/* Chart Line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area under curve */}
                  <path
                    d={`M 50 ${200 - (currentData[0].value / maxValue) * 150} 
                        Q 150 ${200 - (currentData[1].value / maxValue) * 150} 200 ${200 - (currentData[2].value / maxValue) * 150}
                        Q 300 ${200 - (currentData[3].value / maxValue) * 150} 350 ${200 - (currentData[3].value / maxValue) * 150}
                        L 350 200 L 50 200 Z`}
                    fill="url(#areaGradient)"
                  />
                  
                  {/* Main curve line */}
                  <path
                    d={`M 50 ${200 - (currentData[0].value / maxValue) * 150} 
                        Q 150 ${200 - (currentData[1].value / maxValue) * 150} 200 ${200 - (currentData[2].value / maxValue) * 150}
                        Q 300 ${200 - (currentData[3].value / maxValue) * 150} 350 ${200 - (currentData[3].value / maxValue) * 150}`}
                    stroke="url(#chartGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  
                  {/* Data points */}
                  {currentData.map((item, index) => {
                    const x = 50 + (index * 100)
                    const y = 200 - (item.value / maxValue) * 150
                    return (
                      <g key={index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          fill="#8b5cf6"
                          stroke="white"
                          strokeWidth="2"
                          className="hover:r-8 transition-all cursor-pointer"
                        />
                        <text
                          x={x}
                          y={y - 15}
                          textAnchor="middle"
                          className="fill-white text-xs font-bold"
                        >
                          {item.value.toLocaleString()}
                        </text>
                      </g>
                    )
                  })}
                </svg>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-12 pb-2">
                  {currentData.map((item, index) => (
                    <div key={index} className="text-xs text-gray-400 text-center">
                      <div>{item.label}</div>
                      <Badge 
                        variant={item.change > 0 ? "default" : "destructive"}
                        className="text-xs mt-1"
                      >
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentData.map((item, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/10">
                  <div className="text-sm text-gray-400 mb-1">{item.label}</div>
                  <div className="text-xl font-bold text-white mb-2">
                    {item.value.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <div 
                      className={`h-1 rounded-full flex-1 mr-2 ${item.color}`}
                      style={{ width: `${(item.value / maxValue) * 100}%` }}
                    />
                    <Badge 
                      variant={item.change > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links Detail (for views and downloads) */}
          {(selectedMetric === 'views' || selectedMetric === 'downloads') && (
            <div className="bg-slate-800/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Link className="w-4 h-4" />
                Top Performing Links
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{link.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {link.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {link.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {link.created}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`${window.location.origin}${link.url}`)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        title="Copy Link"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(link.url, '_blank')}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        title="Open Link"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">
                {mockShareLinks.reduce((acc, link) => acc + link.views, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {mockShareLinks.reduce((acc, link) => acc + link.downloads, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Total Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{mockShareLinks.length}</div>
              <div className="text-xs text-gray-400">Active Links</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-400">98.5%</div>
              <div className="text-xs text-gray-400">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
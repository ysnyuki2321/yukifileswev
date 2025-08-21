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
      case 'views': return 'Lượt Truy Cập'
      case 'downloads': return 'Lượt Tải'
      case 'uploads': return 'Lượt Upload'
      case 'shares': return 'Lượt Chia Sẻ'
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
                    { key: 'views' as const, label: 'Lượt Truy Cập', icon: Eye },
                    { key: 'downloads' as const, label: 'Lượt Tải', icon: Download },
                    { key: 'uploads' as const, label: 'Lượt Upload', icon: Upload },
                    { key: 'shares' as const, label: 'Lượt Chia Sẻ', icon: Share2 }
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {currentData.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">{item.label}</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {item.value.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
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
              </div>
            ))}
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
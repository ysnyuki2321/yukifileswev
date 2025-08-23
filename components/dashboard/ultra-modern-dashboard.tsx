import React, { useState, useEffect } from 'react'
import { 
  Upload, 
  FolderOpen, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Code,
  Database,
  Archive,
  Star,
  Share2,
  TrendingUp,
  Users,
  HardDrive,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Shield,
  Globe,
  Download,
  Edit3,
  Settings
} from 'lucide-react'
import { 
  UltraModernLayout,
  GlassContainer,
  AnimatedCard,
  ResponsiveText,
  InteractiveButton,
  StatusBadge,
  ResponsiveGrid,
  ResponsiveContainer,
  GradientBackground
} from '@/components/ui'
import { SmartLoading } from '@/components/ui/smart-loading'

interface DashboardStats {
  totalFiles: number
  totalSize: number
  fileTypes: {
    images: number
    videos: number
    documents: number
    audio: number
    code: number
    databases: number
  }
  recentActivity: Array<{
    id: string
    type: 'upload' | 'download' | 'share' | 'edit'
    fileName: string
    timestamp: string
    user: string
  }>
  storageUsage: {
    used: number
    total: number
    percentage: number
  }
  popularFiles: Array<{
    id: string
    name: string
    downloads: number
    shares: number
    type: string
  }>
}

const UltraModernDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week')

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats({
        totalFiles: 1247,
        totalSize: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
        fileTypes: {
          images: 456,
          videos: 234,
          documents: 312,
          audio: 89,
          code: 156,
          databases: 23
        },
        recentActivity: [
          { id: '1', type: 'upload', fileName: 'presentation.pdf', timestamp: '2 hours ago', user: 'John Doe' },
          { id: '2', type: 'share', fileName: 'project.zip', timestamp: '4 hours ago', user: 'Jane Smith' },
          { id: '3', type: 'download', fileName: 'image.jpg', timestamp: '6 hours ago', user: 'Mike Johnson' },
          { id: '4', type: 'edit', fileName: 'document.docx', timestamp: '1 day ago', user: 'Sarah Wilson' }
        ],
        storageUsage: {
          used: 2.4 * 1024 * 1024 * 1024,
          total: 5 * 1024 * 1024 * 1024,
          percentage: 48
        },
        popularFiles: [
          { id: '1', name: 'company-presentation.pdf', downloads: 156, shares: 23, type: 'document' },
          { id: '2', name: 'product-demo.mp4', downloads: 89, shares: 45, type: 'video' },
          { id: '3', name: 'logo-pack.zip', downloads: 234, shares: 67, type: 'archive' },
          { id: '4', name: 'api-documentation.md', downloads: 78, shares: 34, type: 'code' }
        ]
      })
      setLoading(false)
    }, 1500)
  }, [])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />
      case 'video': return <Video className="w-5 h-5" />
      case 'audio': return <Music className="w-5 h-5" />
      case 'document': return <FileText className="w-5 h-5" />
      case 'code': return <Code className="w-5 h-5" />
      case 'database': return <Database className="w-5 h-5" />
      case 'archive': return <Archive className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4" />
      case 'download': return <Download className="w-4 h-4" />
      case 'share': return <Share2 className="w-4 h-4" />
      case 'edit': return <Edit3 className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <UltraModernLayout title="Dashboard" subtitle="Loading your file management overview...">
        <SmartLoading
          timeout={15000}
          message="Loading Dashboard"
          showProgress={true}
          progressSteps={[
            "Initializing components...",
            "Loading file statistics...",
            "Preparing analytics...",
            "Setting up dashboard..."
          ]}
          onTimeout={() => {
            console.log("Dashboard loading timeout")
            setLoading(false)
            setStats({
              totalFiles: 0,
              totalSize: 0,
              fileTypes: { images: 0, videos: 0, documents: 0, audio: 0, code: 0, databases: 0 },
              recentActivity: [],
              storageUsage: { used: 0, total: 0, percentage: 0 },
              popularFiles: []
            })
          }}
        />
      </UltraModernLayout>
    )
  }

  if (!stats) return null

  return (
    <UltraModernLayout 
      title="Dashboard" 
      subtitle="Your file management overview and analytics"
    >
      {/* Hero Section */}
      <div className="mb-8">
        <AnimatedCard className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <div className="text-center">
            <ResponsiveText variant="h2" className="font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome back! 👋
            </ResponsiveText>
            <ResponsiveText variant="p" className="text-gray-300 mb-6">
              You have {stats.totalFiles} files with a total size of {formatBytes(stats.totalSize)}
            </ResponsiveText>
            <div className="flex flex-wrap justify-center gap-4">
              <InteractiveButton variant="primary" size="lg">
                <Upload className="w-5 h-5 mr-2" />
                Upload Files
              </InteractiveButton>
              <InteractiveButton variant="outline" size="lg">
                <FolderOpen className="w-5 h-5 mr-2" />
                Browse Files
              </InteractiveButton>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Quick Stats */}
      <ResponsiveGrid 
        cols={{ sm: 1, md: 2, lg: 4 }}
        className="mb-8"
        gap="gap-6"
      >
        <AnimatedCard delay={0}>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <ResponsiveText variant="h3" className="font-bold mb-1">
              {stats.totalFiles.toLocaleString()}
            </ResponsiveText>
            <ResponsiveText variant="span" className="text-gray-400">
              Total Files
            </ResponsiveText>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={100}>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <HardDrive className="w-6 h-6 text-green-400" />
            </div>
            <ResponsiveText variant="h3" className="font-bold mb-1">
              {formatBytes(stats.storageUsage.used)}
            </ResponsiveText>
            <ResponsiveText variant="span" className="text-gray-400">
              Storage Used
            </ResponsiveText>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={200}>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <ResponsiveText variant="h3" className="font-bold mb-1">
              12
            </ResponsiveText>
            <ResponsiveText variant="span" className="text-gray-400">
              Active Users
            </ResponsiveText>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={300}>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <ResponsiveText variant="h3" className="font-bold mb-1">
              89%
            </ResponsiveText>
            <ResponsiveText variant="span" className="text-gray-400">
              Uptime
            </ResponsiveText>
          </div>
        </AnimatedCard>
      </ResponsiveGrid>

      {/* Main Content Grid */}
      <ResponsiveGrid 
        cols={{ sm: 1, lg: 2 }}
        className="mb-8"
        gap="gap-8"
      >
        {/* Storage Usage */}
        <AnimatedCard delay={400}>
          <div className="mb-6">
            <ResponsiveText variant="h4" className="font-semibold mb-2">
              Storage Usage
            </ResponsiveText>
            <ResponsiveText variant="p" className="text-gray-400">
              {formatBytes(stats.storageUsage.used)} of {formatBytes(stats.storageUsage.total)} used
            </ResponsiveText>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Used Space</span>
                <span>{stats.storageUsage.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.storageUsage.percentage}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <ResponsiveText variant="h5" className="font-bold text-blue-400">
                  {formatBytes(stats.storageUsage.used)}
                </ResponsiveText>
                <ResponsiveText variant="span" className="text-gray-400 text-sm">
                  Used
                </ResponsiveText>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <ResponsiveText variant="h5" className="font-bold text-green-400">
                  {formatBytes(stats.storageUsage.total - stats.storageUsage.used)}
                </ResponsiveText>
                <ResponsiveText variant="span" className="text-gray-400 text-sm">
                  Available
                </ResponsiveText>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* File Types Distribution */}
        <AnimatedCard delay={500}>
          <div className="mb-6">
            <ResponsiveText variant="h4" className="font-semibold mb-2">
              File Types
            </ResponsiveText>
            <ResponsiveText variant="p" className="text-gray-400">
              Distribution of your files by type
            </ResponsiveText>
          </div>
          
          <div className="space-y-3">
            {Object.entries(stats.fileTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  {getFileTypeIcon(type)}
                  <ResponsiveText variant="span" className="capitalize">
                    {type}
                  </ResponsiveText>
                </div>
                <div className="flex items-center space-x-2">
                  <ResponsiveText variant="span" className="font-semibold">
                    {count}
                  </ResponsiveText>
                  <ResponsiveText variant="span" className="text-gray-400 text-sm">
                    ({((count / stats.totalFiles) * 100).toFixed(1)}%)
                  </ResponsiveText>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </ResponsiveGrid>

      {/* Recent Activity & Popular Files */}
      <ResponsiveGrid 
        cols={{ sm: 1, lg: 2 }}
        className="mb-8"
        gap="gap-8"
      >
        {/* Recent Activity */}
        <AnimatedCard delay={600}>
          <div className="mb-6">
            <ResponsiveText variant="h4" className="font-semibold mb-2">
              Recent Activity
            </ResponsiveText>
            <ResponsiveText variant="p" className="text-gray-400">
              Latest actions in your file system
            </ResponsiveText>
          </div>
          
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <ResponsiveText variant="span" className="font-medium block truncate">
                    {activity.fileName}
                  </ResponsiveText>
                  <ResponsiveText variant="span" className="text-gray-400 text-sm">
                    {activity.user} • {activity.timestamp}
                  </ResponsiveText>
                </div>
                <StatusBadge status="info" className="capitalize">
                  {activity.type}
                </StatusBadge>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Popular Files */}
        <AnimatedCard delay={700}>
          <div className="mb-6">
            <ResponsiveText variant="h4" className="font-semibold mb-2">
              Popular Files
            </ResponsiveText>
            <ResponsiveText variant="p" className="text-gray-400">
              Most accessed and shared files
            </ResponsiveText>
          </div>
          
          <div className="space-y-4">
            {stats.popularFiles.map((file, index) => (
              <div key={file.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  {getFileTypeIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <ResponsiveText variant="span" className="font-medium block truncate">
                    {file.name}
                  </ResponsiveText>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>📥 {file.downloads}</span>
                    <span>🔗 {file.shares}</span>
                  </div>
                </div>
                <div className="text-right">
                  <ResponsiveText variant="span" className="text-xs text-gray-400 block">
                    Rank #{index + 1}
                  </ResponsiveText>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </ResponsiveGrid>

      {/* Performance Metrics */}
      <AnimatedCard delay={800} className="mb-8">
        <div className="mb-6">
          <ResponsiveText variant="h4" className="font-semibold mb-2">
            Performance Metrics
          </ResponsiveText>
          <ResponsiveText variant="p" className="text-gray-400">
            System performance and optimization insights
          </ResponsiveText>
        </div>
        
        <ResponsiveGrid 
          cols={{ sm: 2, md: 4 }}
          className="mb-6"
          gap="gap-6"
        >
          <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
            <ResponsiveText variant="h3" className="font-bold text-blue-400 mb-1">
              99.9%
            </ResponsiveText>
            <ResponsiveText variant="span" className="text-gray-300 text-sm">
              Uptime
            </ResponsiveText>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
            <ResponsiveText variant="h3" className="font-bold text-green-400 mb-1">
              45ms
            </ResponsiveText>
            <ResponsiveText variant="span" className="text-gray-300 text-sm">
              Response Time
            </ResponsiveText>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
            <ResponsiveText variant="h3" className="font-bold text-purple-400 mb-1">
              256
            </ResponsiveText>
            <ResponsiveText variant="span" className="text-gray-300 text-sm">
              Active Sessions
            </ResponsiveText>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
            <ResponsiveText variant="h3" className="font-bold text-orange-400 mb-1">
              1.2TB
            </ResponsiveText>
            <ResponsiveText variant="span" className="text-gray-300 text-sm">
              Bandwidth
            </ResponsiveText>
          </div>
        </ResponsiveGrid>
        
        <div className="flex flex-wrap justify-center gap-4">
          <InteractiveButton variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </InteractiveButton>
          <InteractiveButton variant="outline" size="sm">
            <PieChart className="w-4 h-4 mr-2" />
            Performance Report
          </InteractiveButton>
          <InteractiveButton variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Optimize
          </InteractiveButton>
        </div>
      </AnimatedCard>

      {/* Quick Actions */}
      <AnimatedCard delay={900}>
        <div className="mb-6">
          <ResponsiveText variant="h4" className="font-semibold mb-2">
            Quick Actions
          </ResponsiveText>
          <ResponsiveText variant="p" className="text-gray-400">
            Common tasks and shortcuts
          </ResponsiveText>
        </div>
        
        <ResponsiveGrid 
          cols={{ sm: 2, md: 3, lg: 4 }}
          gap="gap-4"
        >
          <InteractiveButton variant="ghost" className="h-20 flex-col space-y-2">
            <Upload className="w-6 h-6" />
            <span>Upload</span>
          </InteractiveButton>
          
          <InteractiveButton variant="ghost" className="h-20 flex-col space-y-2">
            <FolderOpen className="w-6 h-6" />
            <span>Browse</span>
          </InteractiveButton>
          
          <InteractiveButton variant="ghost" className="h-20 flex-col space-y-2">
            <Share2 className="w-6 h-6" />
            <span>Share</span>
          </InteractiveButton>
          
          <InteractiveButton variant="ghost" className="h-20 flex-col space-y-2">
            <Settings className="w-6 h-6" />
            <span>Settings</span>
          </InteractiveButton>
        </ResponsiveGrid>
      </AnimatedCard>
    </UltraModernLayout>
  )
}

export default UltraModernDashboard
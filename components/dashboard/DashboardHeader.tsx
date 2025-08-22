"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, Plus, Share2, Download, Star, HardDrive, FileText, Users, Zap, AlertTriangle } from "lucide-react"
import { useToastHelpers } from "@/components/ui/toast"
import { useState } from "react"

interface UserData {
  id: string
  email: string
  subscription_type: "free" | "paid"
  quota_used: number
  quota_limit: number
  is_admin?: boolean
}

interface DashboardHeaderProps {
  userData: UserData | null
  filesCount: number
  recentActivity?: Array<{
    id: string
    type: "upload" | "download" | "share" | "delete"
    fileName: string
    timestamp: string
  }>
  isDemoMode?: boolean
}

export default function DashboardHeader({
  userData,
  filesCount,
  recentActivity = [],
  isDemoMode = false
}: DashboardHeaderProps) {
  const toast = useToastHelpers()
  const [isUploading, setIsUploading] = useState(false)

  if (!userData) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-800 rounded-lg"></div>
      </div>
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const usagePercentage = userData.quota_limit > 0 ? 
    Math.round((userData.quota_used / userData.quota_limit) * 100) : 0

  const handleUpload = () => {
    if (isDemoMode) {
      toast.success("Upload Demo", "This is a demo - files would be uploaded here")
      return
    }
    setIsUploading(true)
    // Real upload logic would go here
    setTimeout(() => setIsUploading(false), 2000)
  }

  const handleCreateFolder = () => {
    if (isDemoMode) {
      toast.success("Create Folder Demo", "This is a demo - folder would be created here")
      return
    }
    // Real folder creation logic
  }

  const handleShare = () => {
    if (isDemoMode) {
      toast.success("Share Demo", "This is a demo - sharing features available here")
      return
    }
    // Real sharing logic
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="premium-gradient-card border-purple-500/20 rounded-xl p-6 hover-lift">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-mobile-h1 font-bold text-white mb-2">
              {getGreeting()}, {userData.email.split('@')[0]}!
            </h1>
            <p className="text-mobile-body text-gray-300">
              {isDemoMode ? 
                "Exploring YukiFiles Demo - All features available for testing" : 
                "Welcome back to your secure file management dashboard"
              }
            </p>
            {userData.is_admin && (
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Admin Access</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
              className="btn-gradient-primary hover-lift"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
            <Button 
              onClick={handleCreateFolder}
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Storage Usage */}
        <Card className="glass-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">Storage</h3>
              </div>
              <span className="text-sm text-gray-400">
                {userData.subscription_type === "paid" ? "Pro Plan" : "Free Plan"}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Used</span>
                <span className="text-white">
                  {formatFileSize(userData.quota_used)} / {formatFileSize(userData.quota_limit)}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <div className="text-xs text-gray-500">
                {usagePercentage}% used
              </div>
            </div>
            
            {usagePercentage > 80 && (
              <div className="flex items-center mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-xs text-yellow-400">Storage almost full</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Files Count */}
        <Card className="glass-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-white">Files</h3>
              </div>
              <Share2 className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">{filesCount}</div>
              <div className="text-sm text-gray-400">Total files managed</div>
              
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 hover-glow"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Activity</h3>
              </div>
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                <>
                  <div className="text-2xl font-bold text-white">{recentActivity.length}</div>
                  <div className="text-sm text-gray-400">Recent actions</div>
                  <div className="space-y-1">
                    {recentActivity.slice(0, 2).map((activity) => (
                      <div key={activity.id} className="text-xs text-gray-500 truncate">
                        {activity.type === 'upload' && '📤 '}
                        {activity.type === 'download' && '📥 '}
                        {activity.type === 'share' && '🔗 '}
                        {activity.type === 'delete' && '🗑️ '}
                        {activity.fileName}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-500">0</div>
                  <div className="text-sm text-gray-400">No recent activity</div>
                  <div className="text-xs text-gray-500">Start uploading files to see activity</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center premium-float">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Demo Mode Active</h4>
                <p className="text-sm text-gray-400">
                  All features are simulated for demonstration purposes
                </p>
              </div>
            </div>
            <div className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
              DEMO
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
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
  recentActivity: Array<{
    id: string
    type: "upload" | "download" | "share" | "delete"
    fileName: string
    timestamp: string
  }>
}

export default function DashboardHeader({
  userData,
  filesCount,
  recentActivity
}: DashboardHeaderProps) {
  const toast = useToastHelpers()
  const [isUploading, setIsUploading] = useState(false)

  if (!userData) {
    return <div>Loading...</div>
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const quotaUsedGB = (userData.quota_used / (1024 * 1024 * 1024)).toFixed(2)
  const quotaLimitGB = (userData.quota_limit / (1024 * 1024 * 1024)).toFixed(0)
  const quotaPercentage = Math.round((userData.quota_used / userData.quota_limit) * 100)

  const getStorageColor = () => {
    if (quotaPercentage > 80) return "text-red-400"
    if (quotaPercentage > 60) return "text-yellow-400"
    return "text-green-400"
  }

  const getStorageProgressColor = () => {
    if (quotaPercentage > 80) return "bg-red-500"
    if (quotaPercentage > 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      toast.success("Files uploaded successfully!", "Your files have been uploaded and are ready to share.")
    }, 2000)
  }

  const handleUpgrade = () => {
    toast.info("Upgrade to Premium", "Get more storage and advanced features!", {
      action: {
        label: "View Plans",
        onClick: () => window.location.href = "/pricing"
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {getGreeting()}, {userData?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-400">
            Welcome back to your file management dashboard
            {userData.is_admin && (
              <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                Admin
              </span>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
          <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {userData.subscription_type === "free" && (
            <Button 
              onClick={handleUpgrade}
              variant="outline" 
              className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
            >
              <Star className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Files</p>
                <p className="text-2xl font-bold text-white">{filesCount}</p>
                <p className="text-xs text-gray-500">Files uploaded</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Storage Used</p>
                <p className="text-2xl font-bold text-white">{quotaUsedGB} GB</p>
                <p className="text-xs text-gray-500">of {quotaLimitGB} GB</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-3">
              <Progress 
                value={quotaPercentage} 
                className="h-2"
                style={{
                  '--progress-background': getStorageProgressColor()
                } as React.CSSProperties}
              />
              <p className={`text-xs mt-1 ${getStorageColor()}`}>
                {quotaPercentage}% used
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 hover:border-green-500/40 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Plan</p>
                <p className="text-2xl font-bold text-white capitalize">{userData.subscription_type}</p>
                <p className="text-xs text-gray-500">
                  {userData.subscription_type === "paid" ? "Premium features" : "Free plan"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Recent Activity</p>
                <p className="text-2xl font-bold text-white">{recentActivity.length}</p>
                <p className="text-xs text-gray-500">This week</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Warning */}
      {quotaPercentage > 80 && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-red-300 font-medium">Storage almost full</p>
                <p className="text-red-400 text-sm">
                  You're using {quotaPercentage}% of your storage. Consider upgrading to get more space.
                </p>
              </div>
              <Button 
                onClick={handleUpgrade}
                size="sm" 
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
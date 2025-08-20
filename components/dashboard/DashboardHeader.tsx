"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Plus, Share2, Download, Star } from "lucide-react"
import { PremiumText } from "@/components/ui/premium-text"

interface DashboardHeaderProps {
  userEmail: string
  isPremium: boolean
  filesCount: number
  quotaUsedGB: string
  quotaLimitGB: string
  quotaPercentage: number
}

export default function DashboardHeader({
  userEmail,
  isPremium,
  filesCount,
  quotaUsedGB,
  quotaLimitGB,
  quotaPercentage
}: DashboardHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getStorageColor = () => {
    if (quotaPercentage > 80) return "text-red-400"
    if (quotaPercentage > 60) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            {getGreeting()}, {userEmail.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-400">
            Welcome back to your file management dashboard
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
          <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {!isPremium && (
            <Button variant="outline" className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10">
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
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-purple-400" />
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
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 hover:border-green-500/40 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Usage</p>
                <p className={`text-2xl font-bold ${getStorageColor()}`}>{quotaPercentage.toFixed(0)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${isPremium ? 'from-yellow-500/10 to-orange-500/10 border-yellow-500/20 hover:border-yellow-500/40' : 'from-gray-500/10 to-slate-500/10 border-gray-500/20 hover:border-gray-500/40'} transition-all duration-300`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Plan</p>
                <PremiumText className="text-2xl font-bold">
                  {isPremium ? "Premium" : "Free"}
                </PremiumText>
              </div>
              <div className={`w-12 h-12 ${isPremium ? 'bg-yellow-500/20' : 'bg-gray-500/20'} rounded-lg flex items-center justify-center`}>
                <Star className={`w-6 h-6 ${isPremium ? 'text-yellow-400' : 'text-gray-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Progress Bar */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Storage Usage</span>
              <span className="text-sm text-gray-400">{quotaUsedGB} / {quotaLimitGB} GB</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  quotaPercentage > 80 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : quotaPercentage > 60 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>0 GB</span>
              <span>{quotaLimitGB} GB</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
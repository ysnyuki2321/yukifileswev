"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Upload, 
  FolderPlus, 
  Share2, 
  Download, 
  Star,
  Zap,
  Shield,
  Globe
} from "lucide-react"

interface QuickActionsProps {
  isPremium: boolean
}

export default function QuickActions({ isPremium }: QuickActionsProps) {
  const actions = [
    {
      icon: Upload,
      title: "Upload Files",
      description: "Drag & drop or click to upload",
      color: "from-purple-500 to-pink-500",
      action: () => console.log("Upload clicked")
    },
    {
      icon: FolderPlus,
      title: "Create Folder",
      description: "Organize your files",
      color: "from-blue-500 to-cyan-500",
      action: () => console.log("Create folder clicked")
    },
    {
      icon: Share2,
      title: "Share Files",
      description: "Generate share links",
      color: "from-green-500 to-emerald-500",
      action: () => console.log("Share clicked")
    },
    {
      icon: Download,
      title: "Download All",
      description: "Download multiple files",
      color: "from-orange-500 to-red-500",
      action: () => console.log("Download all clicked")
    }
  ]

  const premiumFeatures = [
    {
      icon: Star,
      title: "Premium Features",
      description: "Unlock advanced capabilities",
      color: "from-yellow-500 to-orange-500",
      action: () => console.log("Premium features clicked")
    },
    {
      icon: Zap,
      title: "Fast Upload",
      description: "Unlimited upload speed",
      color: "from-purple-500 to-pink-500",
      action: () => console.log("Fast upload clicked")
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Advanced encryption & protection",
      color: "from-blue-500 to-cyan-500",
      action: () => console.log("Security clicked")
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Lightning-fast downloads worldwide",
      color: "from-green-500 to-emerald-500",
      action: () => console.log("CDN clicked")
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center gap-3 bg-black/20 hover:bg-black/40 border border-gray-700 hover:border-purple-500/30 transition-all duration-300"
                onClick={action.action}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-white text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Features */}
      {!isPremium && (
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-black/20 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                <Star className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium User Benefits */}
      {isPremium && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              Premium Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-black/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
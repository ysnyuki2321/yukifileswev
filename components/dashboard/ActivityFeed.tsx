"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Download, 
  Share2, 
  Trash2, 
  FileText, 
  Image, 
  Video, 
  Music,
  Clock,
  User
} from "lucide-react"

interface ActivityItem {
  id: string
  type: 'upload' | 'download' | 'share' | 'delete'
  fileName: string
  fileType: 'document' | 'image' | 'video' | 'audio' | 'other'
  timestamp: string
  user?: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'document': return <FileText className="w-4 h-4" />
    case 'image': return <Image className="w-4 h-4" />
    case 'video': return <Video className="w-4 h-4" />
    case 'audio': return <Music className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'upload': return <Upload className="w-4 h-4 text-green-400" />
    case 'download': return <Download className="w-4 h-4 text-blue-400" />
    case 'share': return <Share2 className="w-4 h-4 text-purple-400" />
    case 'delete': return <Trash2 className="w-4 h-4 text-red-400" />
    default: return <Upload className="w-4 h-4" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'upload': return 'bg-green-500/10 border-green-500/20'
    case 'download': return 'bg-blue-500/10 border-blue-500/20'
    case 'share': return 'bg-purple-500/10 border-purple-500/20'
    case 'delete': return 'bg-red-500/10 border-red-500/20'
    default: return 'bg-gray-500/10 border-gray-500/20'
  }
}

const getActivityText = (type: string) => {
  switch (type) {
    case 'upload': return 'Uploaded'
    case 'download': return 'Downloaded'
    case 'share': return 'Shared'
    case 'delete': return 'Deleted'
    default: return 'Modified'
  }
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="bg-black/40 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(activities?.length || 0) === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">No recent activity</p>
              <p className="text-sm text-gray-500">Your file activities will appear here</p>
            </div>
          ) : (
            (activities || []).map((activity) => activity && (
              <div
                key={activity.id}
                className={`flex items-center gap-4 p-4 rounded-lg border ${getActivityColor(activity.type)} hover:bg-white/5 transition-colors`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">
                      {getActivityText(activity.type)}
                    </span>
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {activity.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    {getFileIcon(activity.fileType)}
                    <span className="truncate">{activity.fileName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                    {activity.user && (
                      <>
                        <User className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{activity.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <button className="w-full text-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
              View all activity
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
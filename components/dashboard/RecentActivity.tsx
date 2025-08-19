import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Files } from "lucide-react"

interface ActivityItem {
  description: string
  timestamp: string
}

interface RecentActivityProps {
  items?: ActivityItem[]
}

export default function RecentActivity({ items = [] }: RecentActivityProps) {
  return (
    <Card className="bg-black/40 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Files className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Upload your first file to get started!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {items.map((item, index) => (
              <li key={index} className="py-3 flex items-center justify-between">
                <span className="text-gray-300">{item.description}</span>
                <span className="text-xs text-gray-500">{item.timestamp}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}


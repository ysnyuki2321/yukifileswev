import { Card, CardContent } from "@/components/ui/card"

// File card skeleton
export function FileCardSkeleton() {
  return (
    <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20 animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-600 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="w-8 h-8 bg-gray-600 rounded"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Dashboard stats skeleton
export function StatsCardSkeleton() {
  return (
    <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20 animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-600 rounded w-20"></div>
            <div className="h-8 bg-gray-600 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-600 rounded-lg"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Table row skeleton
export function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 animate-pulse">
      <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-600 rounded w-1/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/3"></div>
      </div>
      <div className="w-20 h-6 bg-gray-600 rounded"></div>
      <div className="w-24 h-6 bg-gray-600 rounded"></div>
    </div>
  )
}

// Activity feed skeleton
export function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 animate-pulse">
          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="w-16 h-3 bg-gray-600 rounded"></div>
        </div>
      ))}
    </div>
  )
}

// Upload zone skeleton
export function UploadZoneSkeleton() {
  return (
    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 animate-pulse">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-600 rounded w-48 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
        </div>
        <div className="w-32 h-10 bg-gray-600 rounded mx-auto"></div>
      </div>
    </div>
  )
}

// Sidebar skeleton
export function SidebarSkeleton() {
  return (
    <div className="w-64 bg-black/40 backdrop-blur-lg border-r border-purple-500/20 p-4 animate-pulse">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-600 rounded-lg"></div>
          <div className="h-6 bg-gray-600 rounded w-24"></div>
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2">
              <div className="w-5 h-5 bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-600 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Page skeleton wrapper
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="flex">
        <SidebarSkeleton />
        <div className="flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-600 rounded w-64"></div>
              <div className="h-4 bg-gray-700 rounded w-96"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                  <CardContent className="p-6">
                    <ActivitySkeleton />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <FileCardSkeleton key={i} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
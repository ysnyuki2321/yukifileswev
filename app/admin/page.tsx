import { requireAdmin } from "@/lib/middleware/admin"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CreditCard, HardDrive, AlertTriangle } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { isDebugModeEnabled } from "@/lib/services/debug-context"
import { getDebugStats } from "@/lib/services/debug-user"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const { userData } = await requireAdmin()
  const supabase = await createServerClient()

  // Check debug mode for mock data
  const debugMode = await isDebugModeEnabled()
  let stats: any = {}
  
  if (debugMode) {
    console.log("[v0] Debug mode enabled - using mock admin stats")
    stats = getDebugStats()
  } else {
    if (!supabase) {
      throw new Error("Supabase client not available")
    }
    
    // Get system statistics
    const [
      { count: totalUsers },
      { count: totalFiles },
      { count: totalTransactions },
      { count: pendingTransactions },
      { count: suspiciousIPs },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("files").select("*", { count: "exact", head: true }),
      supabase.from("transactions").select("*", { count: "exact", head: true }),
      supabase.from("transactions").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("ip_logs").select("*", { count: "exact", head: true }).or("is_vpn.eq.true,is_proxy.eq.true"),
    ])
    
    stats = {
      totalUsers: totalUsers || 0,
      totalFiles: totalFiles || 0,
      totalTransactions: totalTransactions || 0,
      pendingTransactions: pendingTransactions || 0,
      suspiciousIPs: suspiciousIPs || 0,
      totalStorageUsed: 0,
      recentUsers: [],
      recentTransactions: []
    }
  }

  // Get recent activity (use debug data if in debug mode)
  let recentTransactions = []
  let recentUsers = []
  let totalStorageGB = "0.00"
  
  if (!debugMode && supabase) {
    const { data: recentTransactionsData } = await supabase
      .from("transactions")
      .select("*, users(email)")
      .order("created_at", { ascending: false })
      .limit(5)

    const { data: recentUsersData } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    // Calculate total storage used
    const { data: storageData } = await supabase.from("users").select("quota_used")
    const totalStorageUsed = storageData?.reduce((sum, user) => sum + (user.quota_used || 0), 0) || 0
    totalStorageGB = (totalStorageUsed / (1024 * 1024 * 1024)).toFixed(2)
    
    recentTransactions = recentTransactionsData || []
    recentUsers = recentUsersData || []
  } else {
    recentTransactions = stats.recentTransactions
    recentUsers = stats.recentUsers
    totalStorageGB = (stats.totalStorageUsed / (1024 * 1024 * 1024)).toFixed(2)
  }

  return (
    <AdminLayout userData={userData}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">System overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-gray-400">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Files</CardTitle>
              <HardDrive className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalFiles}</div>
              <p className="text-xs text-gray-400">Uploaded files</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalTransactions}</div>
              <p className="text-xs text-gray-400">
                {stats.pendingTransactions} pending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalStorageGB} GB</div>
              <p className="text-xs text-gray-400">Total storage</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Users */}
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Users</CardTitle>
              <CardDescription>Latest registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{user.email}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={user.subscription_type === "paid" ? "default" : "secondary"}>
                      {user.subscription_type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
              <CardDescription>Latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">${tx.amount} {tx.currency}</p>
                      <p className="text-gray-400 text-sm">
                        {tx.users?.email || "Unknown user"}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        tx.status === "completed" ? "default" : 
                        tx.status === "pending" ? "secondary" : "destructive"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

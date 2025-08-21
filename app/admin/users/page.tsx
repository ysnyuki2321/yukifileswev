export const dynamic = 'force-dynamic'
import { redirect } from "next/navigation"
import UsersManagement from "@/components/admin/users-management"
import { isDebugModeEnabled } from "@/lib/services/debug-context"
import { requireAdmin } from "@/lib/middleware/admin"

export default async function AdminUsersPage() {
  // Enforce admin role; allows debug bypass only via middleware helper
  const { isAdmin } = await requireAdmin()

  let users: any[] = []
  
  if (await isDebugModeEnabled()) {
    // Mock users for debug mode
    users = [
      {
        id: "debug-user-1",
        email: "debug@yukifiles.com",
        subscription_type: "paid",
        is_admin: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        storage_used: 1024 * 1024 * 500, // 500MB
        storage_limit: 1024 * 1024 * 1024 * 5 // 5GB
      }
    ]
  } else {
    // Fetch via API route that validates admin server-side
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/users`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        users = data.users || []
      } else if (res.status === 401 || res.status === 403) {
        redirect("/auth/login")
      }
    } catch {
      users = []
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <UsersManagement users={users} />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Shield, Ban, CheckCircle, HardDrive } from "lucide-react"
import { formatBytes, formatDate } from "@/lib/utils"

interface User {
  id: string
  email: string
  subscription_type: string
  quota_used: number
  quota_limit: number
  is_admin: boolean
  is_active: boolean
  created_at: string
  last_ip: string
  registration_ip: string
}

interface UsersManagementProps {
  users: User[]
}

export default function UsersManagement({ users: initialUsers }: UsersManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState<string | null>(null)

  const filteredUsers = users.filter((user) => {
    if (!user.email) return false
    if (!searchTerm || searchTerm.trim() === '') return true
    return user.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleUserAction = async (userId: string, action: string) => {
    setLoading(userId)
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      })

      if (response.ok) {
        // Update local state
        setUsers((prev) =>
          prev.map((user) => {
            if (user.id === userId) {
              switch (action) {
                case "toggle_active":
                  return { ...user, is_active: !user.is_active }
                case "make_admin":
                  return { ...user, is_admin: true }
                case "remove_admin":
                  return { ...user, is_admin: false }
                case "upgrade_premium":
                  return { ...user, subscription_type: "paid", quota_limit: 5368709120 }
                case "downgrade_free":
                  return { ...user, subscription_type: "free", quota_limit: 2147483648 }
                default:
                  return user
              }
            }
            return user
          }),
        )
      }
    } catch (error) {
      console.error("User action error:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Subscription</TableHead>
                <TableHead className="text-gray-300">Storage</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Registered</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-gray-700">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{user.email}</p>
                      <p className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</p>
                      {user.is_admin && <Badge className="bg-yellow-500 text-black text-xs mt-1">Admin</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.subscription_type === "paid" ? "default" : "secondary"}>
                      {user.subscription_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <HardDrive className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-white">
                          {formatBytes(user.quota_used)} / {formatBytes(user.quota_limit)}
                        </p>
                        <div className="w-20 bg-gray-700 rounded-full h-1 mt-1">
                          <div
                            className="bg-purple-500 h-1 rounded-full"
                            style={{
                              width: `${Math.min((user.quota_used / user.quota_limit) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "destructive"}>
                      {user.is_active ? "Active" : "Suspended"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-white">{formatDate(user.created_at)}</p>
                      <p className="text-xs text-gray-400">IP: {user.registration_ip}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={loading === user.id}
                          className="text-gray-400 hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 border-gray-700">
                        <DropdownMenuItem
                          onClick={() => handleUserAction(user.id, "toggle_active")}
                          className="text-gray-300 hover:text-white"
                        >
                          {user.is_active ? (
                            <>
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend User
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activate User
                            </>
                          )}
                        </DropdownMenuItem>

                        {!user.is_admin ? (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "make_admin")}
                            className="text-gray-300 hover:text-white"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "remove_admin")}
                            className="text-gray-300 hover:text-white"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Remove Admin
                          </DropdownMenuItem>
                        )}

                        {user.subscription_type === "free" ? (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "upgrade_premium")}
                            className="text-gray-300 hover:text-white"
                          >
                            Upgrade to Premium
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "downgrade_free")}
                            className="text-gray-300 hover:text-white"
                          >
                            Downgrade to Free
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

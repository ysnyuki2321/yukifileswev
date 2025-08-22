"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions/auth"
import { deleteFile } from "@/lib/actions/files"
import UploadZone from "./upload-zone"
import FileList from "./file-list"
import { formatBytes } from "@/lib/utils"

interface FileManagerClientProps {
  userData: any
  initialFiles: any[]
  showHeader?: boolean
  isDemo?: boolean
}

export default function FileManagerClient({ userData, initialFiles, showHeader = true, isDemo = false }: FileManagerClientProps) {
  const [files, setFiles] = useState(initialFiles)
  const [quotaUsed, setQuotaUsed] = useState(userData?.quota_used || 0)

  const handleUploadComplete = () => {
    // Refresh files list
    window.location.reload()
  }

  const handleDeleteFile = async (fileId: string) => {
    const result = await deleteFile(fileId)
    if (result.success) {
      // Remove file from list and update quota
      const deletedFile = files.find((f) => f.id === fileId)
      if (deletedFile) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId))
        setQuotaUsed((prev: number) => Math.max(0, prev - deletedFile.file_size))
      }
    }
  }

  const quotaUsedGB = (quotaUsed / (1024 * 1024 * 1024)).toFixed(2)
  const quotaLimitGB = (userData?.quota_limit / (1024 * 1024 * 1024)).toFixed(0) || "2"
  const quotaPercentage = userData ? (quotaUsed / userData.quota_limit) * 100 : 0

  return (
    <>
      {/* Header */}
      {showHeader && (
        <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href={isDemo ? "/dashboard?demo=true" : "/dashboard"}>
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                  <span className="text-2xl font-bold text-white">File Manager</span>
                </div>
              </div>
              <form action={signOut}>
                <Button type="submit" variant="ghost" className="text-gray-300 hover:text-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upload and Storage Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Storage Usage */}
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Storage Usage</CardTitle>
                <CardDescription className="text-gray-400">
                  {quotaUsedGB} GB of {quotaLimitGB} GB used
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatBytes(quotaUsed)} used</span>
                  <span>{formatBytes(userData?.quota_limit || 0)} total</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {userData?.subscription_type === "paid" ? "Premium Account" : "Free Account"}
                </p>
              </CardContent>
            </Card>

            {/* Upload Zone */}
            <UploadZone onUploadComplete={handleUploadComplete} />
          </div>

          {/* File List */}
          <div className="lg:col-span-2">
            <FileList
              files={files}
              onDelete={handleDeleteFile}
              onShare={(shareToken) => {
                const shareUrl = `${window.location.origin}/share/${shareToken}`
                navigator.clipboard.writeText(shareUrl)
              }}
            />
          </div>
        </div>
      </main>
    </>
  )
}

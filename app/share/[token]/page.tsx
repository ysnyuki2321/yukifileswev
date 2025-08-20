import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy, Eye, Calendar, HardDrive } from "lucide-react"
import ShareActions from "@/components/share/ShareActions"

interface SharePageProps {
  params: {
    token: string
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const supabase = await createServerClient()

  if (!supabase) {
    notFound()
  }

  // Get file by share token
  const { data: file } = await supabase
    .from("files")
    .select("*")
    .eq("share_token", params.token)
    .single()

  if (!file) {
    notFound()
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-lg border-purple-500/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <HardDrive className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl text-white">{file.original_name}</CardTitle>
          <CardDescription className="text-gray-400">
            Shared file from YukiFiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Size:</span>
              <span className="text-white">{formatFileSize(file.file_size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Uploaded:</span>
              <span className="text-white">{formatDate(file.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Downloads:</span>
              <span className="text-white">{file.download_count}</span>
            </div>
          </div>

          {/* Actions */}
          <ShareActions file={file} />
        </CardContent>
      </Card>
    </div>
  )
}

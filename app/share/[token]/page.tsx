import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ImageIcon, Video, Music, File } from "lucide-react"
import { formatBytes, formatDate } from "@/lib/utils"
import Link from "next/link"
import ShareActions from "@/components/share/ShareActions"

interface SharePageProps {
  params: { token: string }
}

export default async function SharePage({ params }: SharePageProps) {
  const supabase = createServerClient()
  if (!supabase) {
    notFound()
  }

  const { token } = params

  // Get file data
  const { data: fileData } = await supabase.from("files").select("*").eq("share_token", token).single()

  if (!fileData || !fileData.is_public) {
    notFound()
  }

  // Get uploader info (optional)
  const { data: uploaderData } = await supabase.from("users").select("email").eq("id", fileData.user_id).single()

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="w-16 h-16 text-blue-400" />
    if (mimeType.startsWith("video/")) return <Video className="w-16 h-16 text-red-400" />
    if (mimeType.startsWith("audio/")) return <Music className="w-16 h-16 text-green-400" />
    return <File className="w-16 h-16 text-gray-400" />
  }

  const isImage = fileData.mime_type.startsWith("image/")
  const isVideo = fileData.mime_type.startsWith("video/")
  const isAudio = fileData.mime_type.startsWith("audio/")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
              <span className="text-2xl font-bold text-white">YukiFiles</span>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">{getFileIcon(fileData.mime_type)}</div>
              <CardTitle className="text-2xl text-white">{fileData.original_name}</CardTitle>
              <CardDescription className="text-gray-400">
                Shared via YukiFiles • {formatBytes(fileData.file_size)} • {formatDate(fileData.created_at)}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* File Info */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">{formatBytes(fileData.file_size)}</Badge>
                <Badge variant="secondary">{fileData.download_count} downloads</Badge>
                <Badge variant="secondary">{fileData.mime_type}</Badge>
              </div>

              {/* Preview (for images) */}
              {isImage && (
                <div className="text-center">
                  <img
                    src={`/api/files/download/${token}`}
                    alt={fileData.original_name}
                    className="max-w-full max-h-96 mx-auto rounded-lg border border-gray-700"
                  />
                </div>
              )}

              {/* Video Preview */}
              {isVideo && (
                <div className="text-center">
                  <video
                    controls
                    className="max-w-full max-h-96 mx-auto rounded-lg border border-gray-700"
                    preload="metadata"
                  >
                    <source src={`/api/files/download/${token}`} type={fileData.mime_type} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Audio Preview */}
              {isAudio && (
                <div className="text-center">
                  <audio controls className="w-full max-w-md mx-auto">
                    <source src={`/api/files/download/${token}`} type={fileData.mime_type} />
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              )}

              {/* Download + Share */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <a href={`/api/files/download/${token}`} download={fileData.original_name}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download File
                    </Button>
                  </a>
                </div>
                <ShareActions token={token} />
              </div>

              {/* Uploader Info */}
              {uploaderData && (
                <div className="text-center text-sm text-gray-400 border-t border-gray-700 pt-4">
                  <p>Uploaded by {uploaderData.email.replace(/(.{2}).*@/, "$1***@")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <Card className="bg-black/20 backdrop-blur-lg border-purple-500/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Want to share your own files?</h3>
                <p className="text-gray-400 mb-4">Get 2GB free storage and start sharing instantly!</p>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Sign Up Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

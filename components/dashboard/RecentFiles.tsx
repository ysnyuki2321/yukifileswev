"use client"

import { useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatBytes } from "@/lib/utils"
import { Copy, Link as LinkIcon, ExternalLink } from "lucide-react"
import Link from "next/link"

export interface RecentFileItem {
  id: string
  original_name: string
  file_size: number
  share_token: string
  created_at: string
}

export default function RecentFiles({ files }: { files: RecentFileItem[] }) {
  const copyShareLink = useCallback((token: string) => {
    const url = `${window.location.origin}/share/${token}`
    navigator.clipboard.writeText(url)
  }, [])

  return (
    <Card className="bg-black/40 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Recent Files</CardTitle>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No files yet</p>
            <p className="text-sm">Upload your first file to generate a share link.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {files.map((file) => (
              <li key={file.id} className="py-3 flex items-center gap-3 justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{file.original_name}</p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(file.file_size)} · {new Date(file.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white"
                    onClick={() => copyShareLink(file.share_token)}
                    title="Copy share link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Link href={`/share/${file.share_token}`} target="_blank">
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      <span>Open</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}


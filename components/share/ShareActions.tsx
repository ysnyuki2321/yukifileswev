"use client"

import { Button } from "@/components/ui/button"
import { Copy, Share2 } from "lucide-react"

export default function ShareActions({ token }: { token: string }) {
  const copy = async () => {
    const url = `${window.location.origin}/share/${token}`
    await navigator.clipboard.writeText(url)
  }
  const nativeShare = async () => {
    const url = `${window.location.origin}/share/${token}`
    if (navigator.share) {
      try {
        await navigator.share({ title: "YukiFiles", text: "Check this file", url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
    }
  }
  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" className="border-gray-700 text-gray-300" onClick={copy}>
        <Copy className="h-4 w-4 mr-2" /> Copy Link
      </Button>
      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" onClick={nativeShare}>
        <Share2 className="h-4 w-4 mr-2" /> Share
      </Button>
    </div>
  )
}


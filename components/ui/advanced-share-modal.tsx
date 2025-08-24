import React, { useState } from "react"
import { X, Copy, Share2, Settings, Eye, Download } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { Switch } from "./switch"
import { Badge } from "./badge"

interface AdvancedShareModalProps {
  isOpen: boolean
  onClose: () => void
  fileName: string
  fileSize: number
  className?: string
}

export function AdvancedShareModal({
  isOpen,
  onClose,
  fileName,
  fileSize,
  className = ""
}: AdvancedShareModalProps) {
  const [shareSettings, setShareSettings] = useState({
    password: "",
    expiresIn: "7d",
    maxDownloads: 10,
    allowDownload: true,
    allowPreview: true,
    notifyOnAccess: false
  })

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Share File</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Share2 className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="font-medium text-sm">{fileName}</p>
              <p className="text-xs text-gray-500">{fileSize} bytes</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Password Protection</label>
              <Input
                type="password"
                placeholder="Optional password"
                value={shareSettings.password}
                onChange={(e) => setShareSettings({...shareSettings, password: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expires In</label>
              <select
                className="w-full p-2 border rounded-md"
                value={shareSettings.expiresIn}
                onChange={(e) => setShareSettings({...shareSettings, expiresIn: e.target.value})}
              >
                <option value="1d">1 Day</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Allow Download</label>
                <Switch
                  checked={shareSettings.allowDownload}
                  onCheckedChange={(checked) => setShareSettings({...shareSettings, allowDownload: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Allow Preview</label>
                <Switch
                  checked={shareSettings.allowPreview}
                  onCheckedChange={(checked) => setShareSettings({...shareSettings, allowPreview: checked})}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            <Share2 className="w-4 h-4 mr-2" />
            Create Share Link
          </Button>
        </div>
      </div>
    </div>
  )
}
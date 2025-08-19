"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, ImageIcon, Video, Music, File } from "lucide-react"

interface UploadFile {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  error?: string
}

export default function UploadZone({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      status: "pending",
    }))

    setUploadFiles((prev) => [...prev, ...newFiles])

    // Start uploading each file
    newFiles.forEach((uploadFile) => {
      handleFileUpload(uploadFile)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB per file
  })

  const handleFileUpload = async (uploadFile: UploadFile) => {
    setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading" } : f)))

    try {
      const formData = new FormData()
      formData.append("file", uploadFile.file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadFiles((prev) =>
          prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: Math.min(f.progress + 10, 90) } : f)),
        )
      }, 200)

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      clearInterval(progressInterval)

      if (!response.ok || result.error) {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "error", progress: 0, error: result.error || "Upload failed" } : f,
          ),
        )
      } else {
        setUploadFiles((prev) =>
          prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed", progress: 100 } : f)),
        )
        onUploadComplete?.()
      }
    } catch (error) {
      setUploadFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", progress: 0, error: "Upload failed" } : f)),
      )
    }
  }

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (file.type.startsWith("video/")) return <Video className="w-4 h-4" />
    if (file.type.startsWith("audio/")) return <Music className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-purple-400 bg-purple-500/10"
                : "border-gray-600 hover:border-purple-500 hover:bg-purple-500/5"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-purple-400 text-lg">Drop files here...</p>
            ) : (
              <div>
                <p className="text-white text-lg mb-2">Drag & drop files here</p>
                <p className="text-gray-400 mb-4">or click to select files</p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Choose Files
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4">Maximum file size: 100MB</p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-4">Upload Progress</h3>
            <div className="space-y-3">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">{getFileIcon(uploadFile.file)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{uploadFile.file.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={uploadFile.progress} className="flex-1 h-2" />
                      <span className="text-xs text-gray-400 w-12">{uploadFile.progress}%</span>
                    </div>
                    {uploadFile.error && <p className="text-xs text-red-400 mt-1">{uploadFile.error}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

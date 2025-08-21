import FilesPageClient from "@/components/files-page-client"
import { Suspense } from "react"

export default function FilesPage() {
  return (
    <Suspense fallback={null}>
      <FilesPageClient />
    </Suspense>
  )
}
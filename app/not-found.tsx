import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">404</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
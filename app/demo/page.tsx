"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DemoPage() {
  const [features, setFeatures] = useState<Record<string, boolean>>({
    premiumUI: true,
    apiAccess: true,
    e2e: true,
    editor: true,
    ai: true,
  })

  const toggle = (k: string) => setFeatures((s) => ({ ...s, [k]: !s[k] }))

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Live Plan Demo</h1>
        <p className="text-gray-400 mb-8">Toggle features to preview how different plans change the UI.</p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-black/40 border-purple-500/20">
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(features).map(([k, v]) => (
                  <label key={k} className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={v} onChange={() => toggle(k)} className="accent-purple-500" />
                    <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/20 relative overflow-hidden">
            <div className={`absolute right-4 top-4 transition-all ${features.premiumUI ? "opacity-100" : "opacity-0"}`}>
              <div className="animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500 w-24 h-24 blur-2xl opacity-40" />
            </div>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className={`w-full ${features.premiumUI ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-700"}`}>
                  Upload File
                </Button>
                {features.apiAccess && <p className="text-sm text-purple-300">API access enabled</p>}
                {features.e2e && <p className="text-sm text-emerald-300">End-to-end encryption</p>}
                {features.editor && <p className="text-sm text-blue-300">Developer editor active</p>}
                {features.ai && <p className="text-sm text-orange-300">AI assistant ready</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


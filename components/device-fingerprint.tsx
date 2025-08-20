"use client"

import { useState } from "react"

import { useEffect } from "react"

interface DeviceFingerprint {
  userAgent: string
  screen: string
  timezone: string
  language: string
  platform: string
  cookieEnabled: boolean
  doNotTrack: string
  canvas: string
  webgl: string
}

export function useDeviceFingerprint(): DeviceFingerprint | null {
  const [fingerprint, setFingerprint] = useState<DeviceFingerprint | null>(null)

  useEffect(() => {
    const generateFingerprint = async () => {
      try {
        // Basic browser info
        const basicInfo = {
          userAgent: navigator.userAgent,
          screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack || "unspecified",
        }

        // Canvas fingerprinting
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.textBaseline = "top"
          ctx.font = "14px Arial"
          ctx.fillText("YukiFiles fingerprint test 🔒", 2, 2)
        }
        const canvasFingerprint = canvas.toDataURL()

        // WebGL fingerprinting
        const webglCanvas = document.createElement("canvas")
        const gl = webglCanvas.getContext('webgl') || webglCanvas.getContext('experimental-webgl')
        let webglFingerprint = "not supported"

        if (gl) {
          const debugInfo = (gl as any).getExtension("WEBGL_debug_renderer_info")
          if (debugInfo) {
            webglFingerprint = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          }
        }

        const fullFingerprint: DeviceFingerprint = {
          ...basicInfo,
          canvas: canvasFingerprint.slice(-50), // Last 50 chars to reduce size
          webgl: webglFingerprint,
        }

        console.log("[v0] Generated device fingerprint")
        setFingerprint(fullFingerprint)
      } catch (error) {
        console.error("Failed to generate fingerprint:", error)
      }
    }

    generateFingerprint()
  }, [])

  return fingerprint
}

// Component to include in auth forms
export default function DeviceFingerprintCollector({
  onFingerprintReady,
}: { onFingerprintReady: (fp: DeviceFingerprint) => void }) {
  const fingerprint = useDeviceFingerprint()

  useEffect(() => {
    if (fingerprint) {
      onFingerprintReady(fingerprint)
    }
  }, [fingerprint, onFingerprintReady])

  return null // This component doesn't render anything
}

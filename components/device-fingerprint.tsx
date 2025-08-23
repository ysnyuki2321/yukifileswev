"use client"

import { useEffect, useState } from "react"

export function DeviceFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>("")

  useEffect(() => {
    // Simple device fingerprinting for demo purposes
    const generateFingerprint = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.textBaseline = "top"
        ctx.font = "14px Arial"
        ctx.fillText("Device fingerprint", 2, 2)
        const fingerprint = canvas.toDataURL()
        setFingerprint(fingerprint.slice(-20))
      }
    }

    generateFingerprint()
  }, [])

  return (
    <div className="hidden">
      <span data-fingerprint={fingerprint}></span>
    </div>
  )
}

export function useDeviceFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>("")

  useEffect(() => {
    const generateFingerprint = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.textBaseline = "top"
        ctx.font = "14px Arial"
        ctx.fillText("Device fingerprint", 2, 2)
        const fingerprint = canvas.toDataURL()
        setFingerprint(fingerprint.slice(-20))
      }
    }

    generateFingerprint()
  }, [])

  return fingerprint
}
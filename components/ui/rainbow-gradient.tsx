"use client"

import { useEffect, useRef } from "react"

interface RainbowGradientProps {
  children: React.ReactNode
  className?: string
}

export function RainbowGradient({ children, className = "" }: RainbowGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Rainbow colors
    const colors = [
      "#FF0000", // Red
      "#FF7F00", // Orange
      "#FFFF00", // Yellow
      "#00FF00", // Green
      "#0000FF", // Blue
      "#4B0082", // Indigo
      "#9400D3", // Violet
      "#FF1493", // Deep Pink
      "#00CED1", // Dark Turquoise
      "#32CD32", // Lime Green
      "#FFD700", // Gold
      "#FF69B4", // Hot Pink
    ]

    let time = 0
    let colorIndex = 0

    const animate = () => {
      time += 0.005
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      
      // Add multiple color stops with moving positions
      for (let i = 0; i < colors.length; i++) {
        const position = ((i / colors.length) + time) % 1
        gradient.addColorStop(position, colors[i])
        gradient.addColorStop((position + 0.1) % 1, colors[(i + 1) % colors.length])
      }

      // Fill canvas with gradient
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: -1 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
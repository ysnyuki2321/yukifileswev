import React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  )
}

export function FileSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-4 border rounded-lg">
      <Skeleton className="w-8 h-8 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
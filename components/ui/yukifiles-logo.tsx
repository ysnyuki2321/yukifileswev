import React from 'react'

interface YukiFilesLogoProps {
  size?: number
  variant?: 'default' | 'gradient' | 'white'
  className?: string
}

export function YukiFilesLogo({ size = 40, variant = 'default', className = '' }: YukiFilesLogoProps) {
  const baseClasses = 'inline-block'
  const variantClasses = {
    default: 'text-gray-900',
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent',
    white: 'text-white'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="20" cy="20" r="19" fill="currentColor" opacity="0.1" />
        
        {/* File icon */}
        <path
          d="M12 8C12 6.89543 12.8954 6 14 6H24L32 14V32C32 33.1046 31.1046 34 30 34H14C12.8954 34 12 33.1046 12 32V8Z"
          fill="currentColor"
          opacity="0.9"
        />
        
        {/* File fold */}
        <path
          d="M24 6L32 14H26C25.4477 14 25 13.5523 25 13V6H24Z"
          fill="currentColor"
          opacity="0.7"
        />
        
        {/* Yuki text */}
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          fill="currentColor"
          opacity="0.9"
        >
          YUKI
        </text>
      </svg>
    </div>
  )
}
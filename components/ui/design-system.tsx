import React from 'react'
import { cn } from '@/lib/utils'

// Ultra-Modern Design System
export const DesignTokens = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  }
}

// Glassmorphism Container
export const GlassContainer: React.FC<{
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'subtle'
}> = ({ children, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-white/10 backdrop-blur-md border border-white/20',
    elevated: 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl',
    subtle: 'bg-white/5 backdrop-blur-sm border border-white/10'
  }

  return (
    <div className={cn(
      'rounded-2xl p-6',
      variants[variant],
      className
    )}>
      {children}
    </div>
  )
}

// Gradient Background
export const GradientBackground: React.FC<{
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral'
}> = ({ children, className, variant = 'primary' }) => {
  const gradients = {
    primary: 'from-blue-500 via-purple-500 to-pink-500',
    accent: 'from-purple-500 via-pink-500 to-red-500',
    success: 'from-green-400 via-blue-500 to-purple-600',
    warning: 'from-yellow-400 via-orange-500 to-red-500',
    error: 'from-red-400 via-pink-500 to-purple-500',
    neutral: 'from-gray-500 via-gray-600 to-gray-700'
  }

  return (
    <div className={cn(
      'bg-gradient-to-br',
      gradients[variant],
      'min-h-screen',
      className
    )}>
      {children}
    </div>
  )
}

// Animated Card
export const AnimatedCard: React.FC<{
  children: React.ReactNode
  className?: string
  hover?: boolean
  delay?: number
}> = ({ children, className, hover = true, delay = 0 }) => {
  return (
    <div
      className={cn(
        'transform transition-all duration-300 ease-out',
        hover && 'hover:scale-105 hover:shadow-2xl',
        'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {children}
    </div>
  )
}

// Responsive Grid
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode
  className?: string
  cols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: string
}> = ({ children, className, cols = { sm: 1, md: 2, lg: 3, xl: 4 }, gap = 'gap-6' }) => {
  const gridCols = {
    [`grid-cols-${cols.sm}`]: cols.sm,
    [`md:grid-cols-${cols.md}`]: cols.md,
    [`lg:grid-cols-${cols.lg}`]: cols.lg,
    [`xl:grid-cols-${cols.xl}`]: cols.xl,
  }

  return (
    <div className={cn(
      'grid',
      gap,
      Object.keys(gridCols).filter(key => gridCols[key]).join(' '),
      className
    )}>
      {children}
    </div>
  )
}

// Floating Action Button
export const FloatingActionButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}> = ({ children, onClick, className, position = 'bottom-right' }) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed z-50 p-4 rounded-full shadow-2xl',
        'bg-gradient-to-r from-blue-500 to-purple-600',
        'text-white font-semibold',
        'transform transition-all duration-300',
        'hover:scale-110 hover:shadow-3xl',
        'active:scale-95',
        positions[position],
        className
      )}
    >
      {children}
    </button>
  )
}

// Status Badge
export const StatusBadge: React.FC<{
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
}> = ({ status, children, className }) => {
  const variants = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
      'border backdrop-blur-sm',
      variants[status],
      className
    )}>
      {children}
    </span>
  )
}

// Loading Spinner
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn(
      'animate-spin rounded-full border-2 border-transparent',
      'border-t-current border-r-current',
      'bg-gradient-to-r from-blue-500 to-purple-600',
      sizes[size],
      className
    )} />
  )
}

// Responsive Text
export const ResponsiveText: React.FC<{
  children: React.ReactNode
  className?: string
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  responsive?: boolean
}> = ({ children, className, variant = 'p', responsive = true }) => {
  const baseClasses = 'font-outfit'
  const responsiveClasses = responsive ? {
    h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
    h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl',
    h4: 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl',
    h5: 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl',
    h6: 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl',
    p: 'text-sm sm:text-base md:text-lg',
    span: 'text-sm sm:text-base'
  } : {}

  const Component = variant as keyof JSX.IntrinsicElements

  return (
    <Component className={cn(
      baseClasses,
      responsiveClasses[variant],
      'leading-tight',
      className
    )}>
      {children}
    </Component>
  )
}

// Interactive Button
export const InteractiveButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  loading?: boolean
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled = false,
  loading = false
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl'
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center',
        'font-semibold rounded-xl',
        'transform transition-all duration-200',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

// Responsive Container
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: boolean
}> = ({ children, className, maxWidth = 'xl', padding = true }) => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidths[maxWidth],
      padding && 'px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  )
}

// CSS Animations
export const CSSAnimations = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .animate-slideInRight {
    animation: slideInRight 0.6s ease-out forwards;
  }

  .animate-scaleIn {
    animation: scaleIn 0.6s ease-out forwards;
  }

  .animate-bounceIn {
    animation: bounceIn 0.8s ease-out forwards;
  }
`

export default {
  DesignTokens,
  GlassContainer,
  GradientBackground,
  AnimatedCard,
  ResponsiveGrid,
  FloatingActionButton,
  StatusBadge,
  LoadingSpinner,
  ResponsiveText,
  InteractiveButton,
  ResponsiveContainer,
  CSSAnimations
}
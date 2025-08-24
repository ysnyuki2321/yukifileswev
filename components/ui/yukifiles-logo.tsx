import { FolderOpen, Sparkles } from "lucide-react"

interface YukiFilesLogoProps {
  size?: number
  className?: string
  showText?: boolean
  variant?: 'default' | 'gradient' | 'minimal'
}

export function YukiFilesLogo({ 
  size = 40, 
  className = "", 
  showText = true,
  variant = 'default'
}: YukiFilesLogoProps) {
  const iconSize = Math.max(16, size * 0.4)
  
  const renderIcon = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className={`w-${size} h-${size} rounded-xl gradient-primary flex items-center justify-center ${className}`}>
            <FolderOpen className={`w-${iconSize} h-${iconSize} text-white`} />
          </div>
        )
      case 'gradient':
        return (
          <div className={`flex items-center gap-3 ${className}`}>
            <div className={`w-${size} h-${size} rounded-xl gradient-primary flex items-center justify-center relative overflow-hidden`}>
              <FolderOpen className={`w-${iconSize} h-${iconSize} text-white relative z-10`} />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent" />
              <Sparkles className="absolute top-1 right-1 w-3 h-3 text-white/80" />
            </div>
            {showText && (
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gradient">YukiFiles</span>
                <span className="text-sm text-muted-foreground">Advanced Storage</span>
              </div>
            )}
          </div>
        )
      default:
        return (
          <div className={`flex items-center gap-3 ${className}`}>
            <div className={`w-${size} h-${size} rounded-xl bg-primary flex items-center justify-center shadow-lg`}>
              <FolderOpen className={`w-${iconSize} h-${iconSize} text-primary-foreground`} />
            </div>
            {showText && (
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">YukiFiles</span>
                <span className="text-sm text-muted-foreground">Advanced Storage</span>
              </div>
            )}
          </div>
        )
    }
  }

  return renderIcon()
}
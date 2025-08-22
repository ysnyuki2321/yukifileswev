"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X, Check, AlertCircle, FileText, Folder, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfessionalInputModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  placeholder?: string
  defaultValue?: string
  inputType?: 'text' | 'email' | 'password' | 'textarea'
  icon?: 'file' | 'folder' | 'text' | 'zap'
  variant?: 'create' | 'rename' | 'move' | 'custom'
  maxLength?: number
  required?: boolean
  validation?: (value: string) => string | null
  onConfirm: (value: string) => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

const ICONS = {
  file: FileText,
  folder: Folder, 
  text: FileText,
  zap: Zap
}

const VARIANTS = {
  create: {
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30'
  },
  rename: {
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30'
  },
  move: {
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30'
  },
  custom: {
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30'
  }
}

export function ProfessionalInputModal({
  isOpen,
  onClose,
  title,
  description,
  placeholder = "Enter value...",
  defaultValue = "",
  inputType = 'text',
  icon = 'text',
  variant = 'custom',
  maxLength,
  required = true,
  validation,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false
}: ProfessionalInputModalProps) {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)
  const [charCount, setCharCount] = useState(defaultValue.length)

  const IconComponent = ICONS[icon]
  const variantStyles = VARIANTS[variant]

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue)
      setCharCount(defaultValue.length)
      setError(null)
    }
  }, [isOpen, defaultValue])

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    setCharCount(newValue.length)
    
    // Clear error when user starts typing
    if (error) setError(null)
    
    // Run validation if provided
    if (validation) {
      const validationError = validation(newValue)
      setError(validationError)
    }
  }

  const handleConfirm = () => {
    // Basic validation
    if (required && !value.trim()) {
      setError("This field is required")
      return
    }

    // Custom validation
    if (validation) {
      try {
        const validationError = validation(value)
        if (validationError) {
          setError(validationError)
          return
        }
      } catch (error) {
        setError('Validation error occurred')
        return
      }
    }

    // Length validation
    if (maxLength && value.length > maxLength) {
      setError(`Maximum ${maxLength} characters allowed`)
      return
    }

    onConfirm(value.trim())
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={cn(
              "bg-gradient-to-r border-b border-purple-500/10 p-6 rounded-t-2xl",
              variantStyles.bgColor
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r",
                    variantStyles.color
                  )}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    {description && (
                      <p className="text-sm text-gray-400 mt-1">{description}</p>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Input Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">
                    {inputType === 'textarea' ? 'Content' : 'Value'}
                    {required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {maxLength && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        charCount > maxLength 
                          ? "border-red-500/30 text-red-400" 
                          : "border-gray-600 text-gray-400"
                      )}
                    >
                      {charCount}/{maxLength}
                    </Badge>
                  )}
                </div>
                
                {inputType === 'textarea' ? (
                  <Textarea
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={cn(
                      "bg-black/30 border-purple-500/30 text-white placeholder-gray-400 min-h-[100px] resize-none",
                      error && "border-red-500/50 focus:border-red-500"
                    )}
                    maxLength={maxLength}
                  />
                ) : (
                  <Input
                    type={inputType}
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={cn(
                      "bg-black/30 border-purple-500/30 text-white placeholder-gray-400",
                      error && "border-red-500/50 focus:border-red-500"
                    )}
                    maxLength={maxLength}
                  />
                )}
                
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-400"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Tips */}
              <div className="p-3 bg-black/20 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>
                    Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Enter</kbd> to confirm, 
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs ml-1">Esc</kbd> to cancel
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-purple-500/10 bg-black/20 rounded-b-2xl">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading || (required && !value.trim()) || !!error}
                  className={cn(
                    "flex-1 bg-gradient-to-r text-white",
                    variantStyles.color,
                    "hover:from-purple-600 hover:to-pink-600"
                  )}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook để sử dụng Professional Input Modal
export function useProfessionalInput() {
  const [modal, setModal] = useState<{
    isOpen: boolean
    title: string
    description?: string
    placeholder?: string
    defaultValue?: string
    inputType?: 'text' | 'email' | 'password' | 'textarea'
    icon?: 'file' | 'folder' | 'text' | 'zap'
    variant?: 'create' | 'rename' | 'move' | 'custom'
    maxLength?: number
    required?: boolean
    validation?: (value: string) => string | null
    onConfirm: (value: string) => void
    onCancel?: () => void
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
  } | null>(null)

  const showInput = (
    title: string, 
    options: Omit<NonNullable<typeof modal>, 'isOpen' | 'title'>
  ) => {
    setModal({
      isOpen: true,
      title,
      ...options
    })
  }

  const closeModal = () => {
    setModal(null)
  }

  const ProfessionalInputComponent = modal ? (
    <ProfessionalInputModal
      {...modal}
      onClose={closeModal}
    />
  ) : null

  return {
    showInput,
    closeModal,
    ProfessionalInputComponent
  }
}
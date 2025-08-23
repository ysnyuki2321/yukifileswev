"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  X, AlertCircle, CheckCircle, Info, AlertTriangle,
  File, Folder, Plus, Edit3, Trash2, Save, Upload
} from "lucide-react"

interface ProfessionalModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  type: 'input' | 'confirm' | 'alert' | 'success' | 'error' | 'info'
  inputPlaceholder?: string
  inputValue?: string
  inputType?: 'text' | 'email' | 'password'
  confirmText?: string
  cancelText?: string
  onConfirm?: (value?: string) => void
  onCancel?: () => void
  icon?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  destructive?: boolean
}

export function ProfessionalModal({
  isOpen,
  onClose,
  title,
  description,
  type,
  inputPlaceholder = "Enter value...",
  inputValue = "",
  inputType = "text",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  icon,
  maxWidth = 'md',
  destructive = false
}: ProfessionalModalProps) {
  const [value, setValue] = useState(inputValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && type === 'input') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, type])

  useEffect(() => {
    setValue(inputValue)
  }, [inputValue])

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(type === 'input' ? value : undefined)
    }
    onClose()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
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

  const getIcon = () => {
    if (icon) return icon
    
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />
      case 'alert':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-400" />
      case 'input':
        return <Edit3 className="w-6 h-6 text-purple-400" />
      case 'confirm':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />
      default:
        return <Info className="w-6 h-6 text-gray-400" />
    }
  }

  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm'
      case 'md': return 'max-w-md'
      case 'lg': return 'max-w-lg'
      case 'xl': return 'max-w-xl'
      default: return 'max-w-md'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={handleCancel}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`w-full ${getMaxWidth()} bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl overflow-hidden mobile-modal touch-manipulation`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
                    {getIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleCancel}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                {type === 'input' && (
                  <div className="space-y-4">
                    <Input
                      ref={inputRef}
                      type={inputType}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={inputPlaceholder}
                      onKeyDown={handleKeyDown}
                      className="bg-black/30 border-gray-700 focus:border-purple-500/50 focus:bg-black/50 transition-all allow-select"
                    />
                    {value && (
                      <div className="text-xs text-gray-400">
                        Press Enter to confirm, Esc to cancel
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
                  <Button
                    onClick={handleConfirm}
                    className={`flex-1 touch-target ${
                      destructive 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    disabled={type === 'input' && !value.trim()}
                  >
                    {type === 'input' && <Save className="w-4 h-4 mr-2" />}
                    {confirmText}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 touch-target"
                  >
                    {cancelText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook for easier usage
export function useProfessionalModal() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    config: Partial<ProfessionalModalProps>
  }>({
    isOpen: false,
    config: {}
  })

  const showModal = (config: Partial<ProfessionalModalProps>) => {
    setModalState({
      isOpen: true,
      config
    })
  }

  const hideModal = () => {
    setModalState({
      isOpen: false,
      config: {}
    })
  }

  // Convenience methods
  const showInput = (title: string, options?: {
    description?: string
    placeholder?: string
    defaultValue?: string
    onConfirm?: (value: string) => void
    onCancel?: () => void
  }) => {
    showModal({
      type: 'input',
      title,
      description: options?.description,
      inputPlaceholder: options?.placeholder,
      inputValue: options?.defaultValue || '',
      onConfirm: options?.onConfirm,
      onCancel: options?.onCancel
    })
  }

  const showConfirm = (title: string, options?: {
    description?: string
    confirmText?: string
    cancelText?: string
    destructive?: boolean
    onConfirm?: () => void
    onCancel?: () => void
  }) => {
    showModal({
      type: 'confirm',
      title,
      description: options?.description,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      destructive: options?.destructive,
      onConfirm: options?.onConfirm,
      onCancel: options?.onCancel
    })
  }

  const showAlert = (title: string, description?: string, type: 'success' | 'error' | 'info' | 'alert' = 'info') => {
    showModal({
      type,
      title,
      description,
      confirmText: 'OK',
      onConfirm: hideModal
    })
  }

  return {
    modalState,
    showModal,
    hideModal,
    showInput,
    showConfirm,
    showAlert,
    Modal: () => (
      <ProfessionalModal
        {...modalState.config as ProfessionalModalProps}
        isOpen={modalState.isOpen}
        onClose={hideModal}
      />
    )
  }
}
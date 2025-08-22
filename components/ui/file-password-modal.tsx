"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Lock, Unlock, X, Eye, EyeOff, Shield, 
  CheckCircle, AlertTriangle, Key, Save
} from "lucide-react"

interface FilePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    hasPassword: boolean
  }
  onSave: (password: string | null) => void
}

export function FilePasswordModal({ isOpen, onClose, file, onSave }: FilePasswordModalProps) {
  const [hasPassword, setHasPassword] = useState(file.hasPassword)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak')

  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length < 6) return 'weak'
    if (pwd.length >= 6 && pwd.length < 12) return 'medium'
    if (pwd.length >= 12 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return 'strong'
    return 'medium'
  }

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword)
    setPasswordStrength(checkPasswordStrength(newPassword))
  }

  const handleSave = () => {
    if (hasPassword) {
      if (password !== confirmPassword) {
        alert('Passwords do not match')
        return
      }
      if (password.length < 6) {
        alert('Password must be at least 6 characters')
        return
      }
      onSave(password)
    } else {
      onSave(null)
    }
    onClose()
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl max-w-md w-full mx-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">File Password</h3>
                  <p className="text-sm text-gray-400 truncate max-w-48">{file.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Password Toggle */}
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700/50">
              <div className="flex items-center gap-3">
                {hasPassword ? (
                  <Lock className="w-5 h-5 text-red-400" />
                ) : (
                  <Unlock className="w-5 h-5 text-green-400" />
                )}
                <div>
                  <p className="text-white font-medium">Password Protection</p>
                  <p className="text-sm text-gray-400">
                    {hasPassword ? 'File is password protected' : 'File is accessible to anyone'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={hasPassword}
                onCheckedChange={setHasPassword}
              />
            </div>

            {/* Password Inputs */}
            <AnimatePresence>
              {hasPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        placeholder="Enter password for this file"
                        className="bg-black/30 border-gray-700 focus:border-purple-500/50 pr-10 allow-select"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {/* Password Strength */}
                    {password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Password Strength</span>
                          <Badge className={`text-xs ${
                            passwordStrength === 'strong' ? 'bg-green-500/20 text-green-400' :
                            passwordStrength === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {passwordStrength}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all ${getStrengthColor(passwordStrength)}`}
                            style={{ 
                              width: passwordStrength === 'weak' ? '33%' : 
                                     passwordStrength === 'medium' ? '66%' : '100%' 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Confirm Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="bg-black/30 border-gray-700 focus:border-purple-500/50 allow-select"
                    />
                    
                    {confirmPassword && password !== confirmPassword && (
                      <div className="flex items-center gap-2 text-red-400 text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Passwords do not match</span>
                      </div>
                    )}
                    
                    {confirmPassword && password === confirmPassword && password.length >= 6 && (
                      <div className="flex items-center gap-2 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>Passwords match</span>
                      </div>
                    )}
                  </div>

                  {/* Security Notice */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-blue-400 text-sm font-medium">Security Notice</p>
                        <p className="text-xs text-gray-400 mt-1">
                          This password will be required to access the file. Make sure to share it securely with authorized users.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Current Status */}
            <div className="bg-black/20 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Current Status</span>
                <Badge className={hasPassword ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                  {hasPassword ? 'Password Protected' : 'Open Access'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={hasPassword && (password !== confirmPassword || password.length < 6)}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Password
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
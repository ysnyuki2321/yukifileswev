"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  User, Shield, CreditCard, Crown, Smartphone, 
  HardDrive, HelpCircle, FileText, Heart, X,
  Camera, Mail, Phone, MapPin, Calendar, Save,
  Lock, Key, Bell, Globe, Trash2, Download,
  Edit3, Settings, Wallet, Star
} from "lucide-react"

interface ProfileScreenProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  isPremium: boolean
}

export function ProfileScreen({ isOpen, onClose, userEmail, isPremium }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'payment' | 'plan' | 'apps' | 'storage' | 'faq' | 'tos' | 'help'>('profile')

  const sidebarItems = [
    { key: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
    { key: 'security', label: 'Security', icon: Shield, description: 'Password & 2FA' },
    { key: 'payment', label: 'Payment', icon: CreditCard, description: 'Billing & methods' },
    { key: 'plan', label: 'My Plan', icon: Crown, description: 'Subscription details' },
    { key: 'apps', label: 'Authorized Apps', icon: Smartphone, description: 'Connected services' },
    { key: 'storage', label: 'Storage', icon: HardDrive, description: 'Usage & limits' },
    { key: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Common questions' },
    { key: 'tos', label: 'Terms of Service', icon: FileText, description: 'Legal terms' },
    { key: 'help', label: 'Help Center', icon: Heart, description: 'Get support' }
  ]

  const renderProfileTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
        <p className="text-gray-400">Manage your personal information and preferences</p>
      </motion.div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="text-center sm:text-left space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{userEmail.split('@')[0]}</h3>
                  <p className="text-gray-400">{userEmail}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Avatar
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <Input 
                  defaultValue={userEmail.split('@')[0]} 
                  className="bg-black/30 border-gray-700 allow-select"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Username</label>
                <Input 
                  defaultValue={userEmail.split('@')[0].toLowerCase()} 
                  className="bg-black/30 border-gray-700 allow-select"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    defaultValue={userEmail} 
                    className="bg-black/30 border-gray-700 pl-10 allow-select"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="+1 (555) 123-4567" 
                    className="bg-black/30 border-gray-700 pl-10 allow-select"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bio</label>
              <textarea 
                className="w-full p-3 bg-black/30 border border-gray-700 rounded-md text-white resize-none allow-select"
                rows={3}
                placeholder="Tell us about yourself..."
                defaultValue="Software developer passionate about creating amazing user experiences."
              />
            </div>

            <div className="flex justify-end">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderSecurityTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Security Settings</h2>
        <p className="text-gray-400">Protect your account with advanced security features</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Password & Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div>
                <h4 className="text-white font-medium">Password</h4>
                <p className="text-sm text-gray-400">Last changed 30 days ago</p>
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-300">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderStorageTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Storage Management</h2>
        <p className="text-gray-400">Monitor your storage usage and manage files</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Storage Used</span>
                <span className="text-purple-400 font-bold">2.5 GB / 100 GB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-sm text-gray-400">You have 97.5 GB of storage remaining</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

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
            onClick={onClose}
          />
          
          {/* Profile Screen - Slide up from bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900"
          >
            <div className="h-full flex">
              {/* Sidebar */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="w-64 bg-black/40 border-r border-purple-500/20 p-4 overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Profile Settings</h3>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {sidebarItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.key
                    
                    return (
                      <motion.button
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={() => setActiveTab(item.key as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.label}</p>
                          <p className="text-xs text-gray-400 truncate">{item.description}</p>
                        </div>
                      </motion.button>
                    )
                  })}
                </nav>
              </motion.div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'profile' && renderProfileTab()}
                      {activeTab === 'security' && renderSecurityTab()}
                      {activeTab === 'storage' && renderStorageTab()}
                      {activeTab === 'payment' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">Payment Methods</h2>
                          <Card className="bg-black/40 border-purple-500/20">
                            <CardContent className="p-6">
                              <p className="text-gray-400">Manage your payment methods and billing information</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      {activeTab === 'plan' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">My Plan</h2>
                          <Card className="bg-black/40 border-purple-500/20">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Crown className="w-8 h-8 text-yellow-400" />
                                <div>
                                  <h3 className="text-white font-semibold">
                                    {isPremium ? 'Premium Plan' : 'Free Plan'}
                                  </h3>
                                  <p className="text-gray-400">
                                    {isPremium ? '$9.99/month' : 'Limited features'}
                                  </p>
                                </div>
                              </div>
                              {!isPremium && (
                                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                                  Upgrade to Premium
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      {activeTab === 'apps' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">Authorized Apps</h2>
                          <Card className="bg-black/40 border-purple-500/20">
                            <CardContent className="p-6">
                              <p className="text-gray-400">Manage apps and services connected to your account</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      {(activeTab === 'faq' || activeTab === 'tos' || activeTab === 'help') && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">
                            {activeTab === 'faq' ? 'Frequently Asked Questions' :
                             activeTab === 'tos' ? 'Terms of Service' :
                             'Help Center'}
                          </h2>
                          <Card className="bg-black/40 border-purple-500/20">
                            <CardContent className="p-6">
                              <p className="text-gray-400">
                                {activeTab === 'faq' ? 'Find answers to common questions' :
                                 activeTab === 'tos' ? 'Read our terms and conditions' :
                                 'Get help and support'}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
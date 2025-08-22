"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { 
  User, Shield, CreditCard, Crown, Smartphone, 
  HardDrive, HelpCircle, FileText, Heart, X,
  Camera, Mail, Phone, MapPin, Calendar, Save,
  Lock, Key, Bell, Globe, Trash2, Download,
  Edit3, Settings, Wallet, Star, CheckCircle,
  AlertTriangle, Eye, EyeOff, Copy, ExternalLink,
  Monitor, Moon, Sun, Volume2, Palette, Languages,
  Clock, Zap, Database, Cloud, Wifi, Activity,
  Upload, Share2
} from "lucide-react"

interface DetailedProfileScreenProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  isPremium: boolean
}

export function DetailedProfileScreen({ isOpen, onClose, userEmail, isPremium }: DetailedProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'payment' | 'plan' | 'apps' | 'storage' | 'faq' | 'tos' | 'help'>('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: userEmail.split('@')[0],
    username: userEmail.split('@')[0].toLowerCase(),
    email: userEmail,
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Software developer passionate about creating amazing user experiences.',
    website: 'https://johndoe.dev',
    company: 'Tech Startup Inc.',
    timezone: 'UTC-5 (Eastern Time)',
    language: 'English (US)'
  })
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    loginAlerts: true,
    deviceTracking: true,
    sessionTimeout: 30,
    backupCodes: 3
  })

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    notifications: {
      email: true,
      push: false,
      desktop: true,
      marketing: false
    },
    privacy: {
      showEmail: false,
      showLastSeen: true,
      allowIndexing: false
    },
    fileDefaults: {
      defaultPrivacy: 'private',
      autoBackup: true,
      compressionLevel: 'medium'
    }
  })

  const sidebarItems = [
    { key: 'profile', label: 'Profile', icon: User, description: 'Personal information & avatar' },
    { key: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA & sessions' },
    { key: 'payment', label: 'Payment', icon: CreditCard, description: 'Billing & payment methods' },
    { key: 'plan', label: 'My Plan', icon: Crown, description: 'Subscription & usage' },
    { key: 'apps', label: 'Authorized Apps', icon: Smartphone, description: 'Connected services' },
    { key: 'storage', label: 'Storage', icon: HardDrive, description: 'Usage, cleanup & limits' },
    { key: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Common questions' },
    { key: 'tos', label: 'Terms of Service', icon: FileText, description: 'Legal terms & privacy' },
    { key: 'help', label: 'Help Center', icon: Heart, description: 'Support & contact' }
  ]

  const handleSaveProfile = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log('Profile saved:', profileData)
  }

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
        <p className="text-gray-400">Manage your personal information and public profile</p>
      </motion.div>

      {/* Avatar & Basic Info */}
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
              
              <div className="text-center sm:text-left space-y-3 flex-1">
                <div>
                  <h3 className="text-xl font-semibold text-white">{profileData.fullName}</h3>
                  <p className="text-gray-400">@{profileData.username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={isPremium ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}>
                      {isPremium ? 'Premium Account' : 'Free Account'}
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Avatar
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Profile
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
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-black/30 border-gray-700 allow-select"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Username</label>
                <Input 
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-black/30 border-gray-700 allow-select"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-black/30 border-gray-700 pl-10 allow-select"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-black/30 border-gray-700 pl-10 allow-select"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-black/30 border-gray-700 pl-10 allow-select"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    className="bg-black/30 border-gray-700 pl-10 allow-select"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bio</label>
              <textarea 
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 bg-black/30 border border-gray-700 rounded-md text-white resize-none allow-select"
                rows={3}
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-gray-400 mt-1">{profileData.bio.length}/500 characters</p>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
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

      {/* Password & Authentication */}
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

            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div>
                <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <Switch 
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
              />
            </div>

            {securitySettings.twoFactorEnabled && (
              <div className="ml-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">2FA is enabled</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Backup codes: {securitySettings.backupCodes} remaining</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    View Backup Codes
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Regenerate Codes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Security Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Security Alerts', description: 'Get notified of suspicious activity' },
              { key: 'loginAlerts', label: 'Login Notifications', description: 'Alert on new device logins' },
              { key: 'deviceTracking', label: 'Device Tracking', description: 'Track devices accessing your account' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{label}</h4>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
                <Switch 
                  checked={securitySettings[key as keyof typeof securitySettings] as boolean}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, [key]: checked }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { device: 'Chrome on Windows', location: 'New York, US', current: true, lastActive: 'Active now', ip: '192.168.1.100' },
                { device: 'Safari on iPhone', location: 'New York, US', current: false, lastActive: '2 hours ago', ip: '192.168.1.101' },
                { device: 'Firefox on MacOS', location: 'San Francisco, US', current: false, lastActive: '1 day ago', ip: '203.0.113.42' }
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      {session.device.includes('iPhone') ? <Smartphone className="w-4 h-4 text-purple-400" /> :
                       session.device.includes('MacOS') ? <Monitor className="w-4 h-4 text-purple-400" /> :
                       <Monitor className="w-4 h-4 text-purple-400" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{session.device}</p>
                      <p className="text-xs text-gray-400">
                        {session.location} • {session.ip} • {session.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.current && (
                      <Badge className="bg-green-500 text-white text-xs">Current</Badge>
                    )}
                    {!session.current && (
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderPaymentTab = () => (
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
        <h2 className="text-2xl font-bold text-white mb-2">Payment & Billing</h2>
        <p className="text-gray-400">Manage your subscription and payment methods</p>
      </motion.div>

      {/* Current Balance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Available Balance</p>
                <p className="text-2xl font-bold text-white">$24.50</p>
                <p className="text-xs text-green-400">+$5.00 from referrals this month</p>
              </div>
              <div className="ml-auto">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Payment Methods</CardTitle>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <CreditCard className="w-4 h-4 mr-2" />
                Add Method
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Visa', last4: '4242', expires: '12/25', default: true },
                { type: 'PayPal', email: 'john@example.com', default: false },
                { type: 'Crypto', wallet: 'bc1q...7x8z', default: false }
              ].map((method, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {method.type} {method.last4 ? `****${method.last4}` : ''}
                      </p>
                      <p className="text-xs text-gray-400">
                        {method.expires ? `Expires ${method.expires}` : 
                         method.email ? method.email :
                         method.wallet ? method.wallet : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.default && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">Default</Badge>
                    )}
                    <Button size="sm" variant="ghost">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: '2024-01-15', description: 'Premium Subscription', amount: '$9.99', status: 'completed' },
                { date: '2024-01-01', description: 'Storage Upgrade', amount: '$4.99', status: 'completed' },
                { date: '2023-12-15', description: 'Premium Subscription', amount: '$9.99', status: 'completed' }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-400">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{transaction.amount}</p>
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
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
        <p className="text-gray-400">Monitor usage, manage files, and optimize storage</p>
      </motion.div>

      {/* Storage Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Usage Stats */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.25)}`}
                      className="text-purple-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">25%</p>
                      <p className="text-xs text-gray-400">Used</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Storage Used</span>
                    <span className="text-purple-400 font-bold">2.5 GB / 100 GB</span>
                  </div>
                  <p className="text-sm text-gray-400">You have 97.5 GB remaining</p>
                </div>
              </div>

              {/* Storage Breakdown */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Storage Breakdown</h4>
                {[
                  { type: 'Documents', size: 1.2, color: 'bg-blue-500', percentage: 48 },
                  { type: 'Videos', size: 0.8, color: 'bg-red-500', percentage: 32 },
                  { type: 'Images', size: 0.3, color: 'bg-green-500', percentage: 12 },
                  { type: 'Other', size: 0.2, color: 'bg-gray-500', percentage: 8 }
                ].map((item) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.type}</span>
                      <span className="text-sm text-white">{item.size} GB ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Storage Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Storage
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderPlanTab = () => (
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
        <h2 className="text-2xl font-bold text-white mb-2">My Plan</h2>
        <p className="text-gray-400">Manage your subscription and view usage</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`border ${isPremium ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20' : 'bg-black/40 border-gray-700'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Crown className={`w-12 h-12 ${isPremium ? 'text-yellow-400' : 'text-gray-400'}`} />
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {isPremium ? 'Premium Plan' : 'Free Plan'}
                </h3>
                <p className="text-gray-400">
                  {isPremium ? '$9.99/month • Renews Feb 15, 2024' : 'Limited features • Upgrade anytime'}
                </p>
              </div>
            </div>

            {/* Plan Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { feature: 'Storage', current: isPremium ? '100 GB' : '2 GB', included: true },
                { feature: 'File Sharing', current: 'Unlimited', included: true },
                { feature: 'Password Protection', current: 'Advanced', included: isPremium },
                { feature: 'API Access', current: '1000 req/hour', included: isPremium },
                { feature: 'Priority Support', current: '24/7', included: isPremium },
                { feature: 'Custom Branding', current: 'Available', included: isPremium }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <span className="text-sm text-gray-300">{item.feature}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">{item.current}</span>
                    {item.included ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isPremium ? (
                <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 border-gray-600 text-gray-300">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                  <Button variant="outline" className="border-red-600 text-red-400">
                    Cancel Plan
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Usage Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Usage This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-black/20 rounded-lg">
                <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">1.2 GB</p>
                <p className="text-xs text-gray-400">Uploaded</p>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-lg">
                <Download className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">3.8 GB</p>
                <p className="text-xs text-gray-400">Downloaded</p>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-lg">
                <Share2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">47</p>
                <p className="text-xs text-gray-400">Files Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderAppsTab = () => (
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
        <h2 className="text-2xl font-bold text-white mb-2">Authorized Apps</h2>
        <p className="text-gray-400">Manage apps and services connected to your account</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-black/40 border-purple-500/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { name: 'YukiFiles Mobile App', permissions: ['Read Files', 'Upload Files', 'Share Files'], lastUsed: '2 hours ago', trusted: true },
                { name: 'Desktop Sync Client', permissions: ['Read Files', 'Write Files', 'Delete Files'], lastUsed: '1 day ago', trusted: true },
                { name: 'Third-party Backup Tool', permissions: ['Read Files'], lastUsed: '1 week ago', trusted: false }
              ].map((app, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{app.name}</p>
                      <p className="text-xs text-gray-400">Last used: {app.lastUsed}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {app.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.trusted && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">Trusted</Badge>
                    )}
                    <Button size="sm" variant="ghost" className="text-red-400">
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
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
                      {activeTab === 'payment' && renderPaymentTab()}
                      {activeTab === 'plan' && renderPlanTab()}
                      {activeTab === 'apps' && renderAppsTab()}
                      {activeTab === 'storage' && renderStorageTab()}
                      {activeTab === 'faq' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                          <Card className="bg-black/40 border-purple-500/20">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                {[
                                  { q: 'How do I upgrade my storage?', a: 'Go to My Plan tab and click Upgrade to Premium for 100GB storage.' },
                                  { q: 'How secure are my files?', a: 'All files are encrypted with bank-level security and stored securely.' },
                                  { q: 'Can I share files with password protection?', a: 'Yes, use our Advanced Share feature to add passwords and access limits.' }
                                ].map((faq, index) => (
                                  <div key={index} className="p-4 bg-black/20 rounded-lg">
                                    <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                                    <p className="text-gray-400 text-sm">{faq.a}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      {activeTab === 'help' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">Help Center</h2>
                          <Card className="bg-black/40 border-purple-500/20">
                            <CardContent className="p-6">
                              <div className="text-center space-y-4">
                                <Heart className="w-16 h-16 text-purple-400 mx-auto" />
                                <div>
                                  <h3 className="text-xl font-semibold text-white mb-2">Need Help?</h3>
                                  <p className="text-gray-400 mb-4">Our support team is here to help you 24/7</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button className="bg-purple-600 hover:bg-purple-700">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Support
                                  </Button>
                                  <Button variant="outline" className="border-gray-600 text-gray-300">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Documentation
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      {activeTab === 'tos' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
                          <Card className="bg-black/40 border-purple-500/20">
                            <CardContent className="p-6">
                              <div className="prose prose-invert max-w-none">
                                <p className="text-gray-400">
                                  By using YukiFiles, you agree to our terms of service and privacy policy. 
                                  We are committed to protecting your data and providing a secure file sharing experience.
                                </p>
                                <div className="mt-4">
                                  <Button variant="outline" className="border-gray-600 text-gray-300">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Read Full Terms
                                  </Button>
                                </div>
                              </div>
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
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, Key, Shield, User, Globe, Bell, 
  Database, Code, Lock, Eye, EyeOff, Copy,
  Upload, Download, Trash2, Edit3, Save,
  Camera, Mail, Phone, MapPin, Calendar,
  Zap, Server, Wifi, HardDrive, Cpu,
  AlertTriangle, CheckCircle, RefreshCw, Plus,
  Palette, Monitor, Moon, Sun, Volume2,
  Smartphone, Laptop, Tablet, Chrome,
  Github, Twitter, Facebook, Instagram
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  lastUsed: string
  created: string
  status: 'active' | 'inactive' | 'expired'
}

interface SecurityLog {
  id: string
  action: string
  ip: string
  device: string
  location: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

export function SettingsDemo() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'api' | 'preferences' | 'integrations'>('profile')
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    desktop: true,
    marketing: false
  })

  // Mock data
  const apiKeys: APIKey[] = [
    { id: '1', name: 'Production API', key: 'yk_prod_1234567890abcdef', permissions: ['read', 'write', 'delete'], lastUsed: '2 hours ago', created: '2024-01-15', status: 'active' },
    { id: '2', name: 'Development API', key: 'yk_dev_abcdef1234567890', permissions: ['read', 'write'], lastUsed: '1 day ago', created: '2024-01-10', status: 'active' },
    { id: '3', name: 'Analytics API', key: 'yk_analytics_fedcba0987654321', permissions: ['read'], lastUsed: 'Never', created: '2024-01-05', status: 'inactive' }
  ]

  const securityLogs: SecurityLog[] = [
    { id: '1', action: 'Login', ip: '192.168.1.100', device: 'Chrome on Windows', location: 'New York, US', timestamp: '2024-01-15 14:30', status: 'success' },
    { id: '2', action: 'API Key Created', ip: '192.168.1.100', device: 'Chrome on Windows', location: 'New York, US', timestamp: '2024-01-15 10:15', status: 'success' },
    { id: '3', action: 'Failed Login', ip: '203.0.113.42', device: 'Unknown', location: 'Unknown', timestamp: '2024-01-14 23:45', status: 'warning' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'success': return 'bg-green-500'
      case 'inactive': case 'warning': return 'bg-yellow-500'
      case 'expired': case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast notification
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
        <p className="text-gray-400">Manage your personal information and preferences</p>
      </div>

      {/* Avatar Section */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="space-y-2">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Avatar
              </Button>
              <Button variant="outline" size="sm" className="text-gray-300 border-gray-600">
                Remove Avatar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <Input 
                defaultValue="John Doe" 
                className="bg-black/30 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <Input 
                defaultValue="johndoe" 
                className="bg-black/30 border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  defaultValue="john@example.com" 
                  className="bg-black/30 border-gray-700 pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  defaultValue="+1 (555) 123-4567" 
                  className="bg-black/30 border-gray-700 pl-10"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Bio</label>
            <textarea 
              className="w-full p-3 bg-black/30 border border-gray-700 rounded-md text-white resize-none"
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
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-white">Security Settings</h3>
        <p className="text-gray-400">Protect your account with advanced security features</p>
      </div>

      {/* Password Section */}
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
            <Button 
              onClick={() => setShowPasswordModal(true)}
              variant="outline" 
              className="border-gray-600 text-gray-300"
            >
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Switch 
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          {twoFactorEnabled && (
            <div className="ml-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">2FA is enabled</span>
              </div>
              <p className="text-xs text-gray-400">Backup codes: 3 remaining</p>
              <Button size="sm" variant="outline" className="mt-2 text-xs">
                View Backup Codes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { device: 'Chrome on Windows', location: 'New York, US', current: true, lastActive: 'Active now' },
              { device: 'Safari on iPhone', location: 'New York, US', current: false, lastActive: '2 hours ago' },
              { device: 'Firefox on MacOS', location: 'San Francisco, US', current: false, lastActive: '1 day ago' }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    {session.device.includes('iPhone') ? <Smartphone className="w-4 h-4 text-purple-400" /> :
                     session.device.includes('MacOS') ? <Laptop className="w-4 h-4 text-purple-400" /> :
                     <Monitor className="w-4 h-4 text-purple-400" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{session.device}</p>
                    <p className="text-xs text-gray-400">{session.location} • {session.lastActive}</p>
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

      {/* Security Logs */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Security Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`} />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-gray-400">
                    {log.ip} • {log.device} • {log.location} • {log.timestamp}
                  </p>
                </div>
                <Badge className={`${getStatusColor(log.status)} text-white text-xs border-0`}>
                  {log.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAPITab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">API Management</h3>
          <p className="text-gray-400">Manage your API keys and integrations</p>
        </div>
        <Button 
          onClick={() => setShowAPIKeyModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* API Keys */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 bg-black/20 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Key className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{apiKey.name}</h4>
                      <p className="text-xs text-gray-400">Created {apiKey.created} • Last used {apiKey.lastUsed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(apiKey.status)} text-white text-xs border-0`}>
                      {apiKey.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-black/40 rounded text-xs text-gray-300 font-mono">
                      {apiKey.key}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="border-gray-600"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Permissions:</span>
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Base URL</h4>
              <code className="text-sm text-purple-400">https://api.yukifiles.com/v1</code>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
              <h4 className="text-white font-medium mb-2">Rate Limit</h4>
              <code className="text-sm text-purple-400">1000 requests/hour</code>
            </div>
          </div>
          
          <div className="p-4 bg-black/20 rounded-lg">
            <h4 className="text-white font-medium mb-2">Authentication</h4>
            <code className="text-sm text-gray-300">
              curl -H "Authorization: Bearer your_api_key" https://api.yukifiles.com/v1/files
            </code>
          </div>

          <Button className="bg-purple-600 hover:bg-purple-700">
            <Code className="w-4 h-4 mr-2" />
            View Full Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-white">Preferences</h3>
        <p className="text-gray-400">Customize your experience</p>
      </div>

      {/* Notifications */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
            { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
            { key: 'desktop', label: 'Desktop Notifications', description: 'System notifications' },
            { key: 'marketing', label: 'Marketing Emails', description: 'Product updates and offers' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div>
                <h4 className="text-white font-medium">{label}</h4>
                <p className="text-sm text-gray-400">{description}</p>
              </div>
              <Switch 
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Theme & Appearance */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Theme & Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Dark', icon: Moon, active: true },
              { name: 'Light', icon: Sun, active: false },
              { name: 'Auto', icon: Monitor, active: false }
            ].map(({ name, icon: Icon, active }) => (
              <button
                key={name}
                className={`p-4 rounded-lg border transition-all ${
                  active 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-gray-700 bg-black/20 hover:border-purple-500/50'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${active ? 'text-purple-400' : 'text-gray-400'}`} />
                <p className={`text-sm ${active ? 'text-white' : 'text-gray-400'}`}>{name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Language & Region</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Language</label>
              <select className="w-full p-2 bg-black/30 border border-gray-700 rounded text-white">
                <option>English (US)</option>
                <option>Tiếng Việt</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Timezone</label>
              <select className="w-full p-2 bg-black/30 border border-gray-700 rounded text-white">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+7 (Vietnam Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC-8 (Pacific Time)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-white">Integrations</h3>
        <p className="text-gray-400">Connect with your favorite services</p>
      </div>

      {/* Social Connections */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Social Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'GitHub', icon: Github, connected: true, description: 'Sync repositories and commits' },
              { name: 'Google', icon: Globe, connected: true, description: 'Single sign-on and Drive integration' },
              { name: 'Twitter', icon: Twitter, connected: false, description: 'Share files and updates' },
              { name: 'Discord', icon: Facebook, connected: false, description: 'File sharing in servers' }
            ].map(({ name, icon: Icon, connected, description }) => (
              <div key={name} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{name}</h4>
                    <p className="text-sm text-gray-400">{description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {connected && (
                    <Badge className="bg-green-500 text-white text-xs">Connected</Badge>
                  )}
                  <Button 
                    size="sm" 
                    variant={connected ? "outline" : "default"}
                    className={connected ? "border-gray-600 text-gray-300" : "bg-purple-600 hover:bg-purple-700"}
                  >
                    {connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Webhooks</CardTitle>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { url: 'https://api.myapp.com/webhooks/files', events: ['file.uploaded', 'file.deleted'], status: 'active' },
              { url: 'https://slack.com/webhooks/abc123', events: ['user.registered'], status: 'inactive' }
            ].map((webhook, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm text-purple-400">{webhook.url}</code>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(webhook.status)} text-white text-xs border-0`}>
                      {webhook.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Events:</span>
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="outline" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-black/40 rounded-lg border border-purple-500/20 overflow-x-auto">
        {[
          { key: 'profile', label: 'Profile', icon: User },
          { key: 'security', label: 'Security', icon: Shield },
          { key: 'api', label: 'API', icon: Key },
          { key: 'preferences', label: 'Preferences', icon: Settings },
          { key: 'integrations', label: 'Integrations', icon: Zap }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
              activeTab === key
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-black/40'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
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
          {activeTab === 'api' && renderAPITab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
          {activeTab === 'integrations' && renderIntegrationsTab()}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showAPIKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowAPIKeyModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black/90 border border-purple-500/30 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Create API Key</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Key Name</label>
                  <Input 
                    placeholder="e.g., Production API" 
                    className="bg-black/30 border-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Permissions</label>
                  <div className="space-y-2">
                    {['read', 'write', 'delete', 'admin'].map((permission) => (
                      <label key={permission} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-gray-300 capitalize">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <Button 
                    onClick={() => setShowAPIKeyModal(false)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Create Key
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAPIKeyModal(false)}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
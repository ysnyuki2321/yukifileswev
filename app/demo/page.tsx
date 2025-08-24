"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { YukiFilesLogo } from '@/components/ui/yukifiles-logo'
import { 
  Upload, 
  Share2, 
  Shield, 
  BarChart3, 
  Zap, 
  Globe, 
  Smartphone,
  ArrowRight,
  Play,
  Star,
  CheckCircle
} from 'lucide-react'

export default function DemoPage() {
  const router = useRouter()

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Advanced File Management",
      description: "Upload, organize, and manage files with intelligent categorization and search."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Secure File Sharing",
      description: "Share files with password protection, expiration dates, and download limits."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption, access controls, and compliance features."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics & Insights",
      description: "Track file usage, sharing patterns, and storage analytics."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Global CDN, intelligent caching, and optimized performance."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Access your files from anywhere with our mobile and web apps."
    }
  ]

  const demoStats = [
    { label: "Files Uploaded", value: "2,847", change: "+12%" },
    { label: "Storage Used", value: "156 GB", change: "+8%" },
    { label: "Active Shares", value: "89", change: "+23%" },
    { label: "Users Online", value: "1,234", change: "+5%" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <YukiFilesLogo size={40} variant="gradient" />
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/demo/login')}>
                Demo Login
              </Button>
              <Button 
                onClick={() => router.push('/demo/dashboard')}
                className="gradient-primary text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Experience{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                YukiFiles
              </span>{' '}
              in Action
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Test our advanced file management platform with real functionality. 
              Upload files, create folders, share securely, and explore all features.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg"
                onClick={() => router.push('/demo/dashboard')}
                className="gradient-primary text-white px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Demo Experience
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/demo/login')}
                className="px-8 py-3 text-lg border-2"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Demo Login
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {demoStats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                  <div className="text-xs text-green-600 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Full-Featured Demo Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our demo includes all the features you'd find in the production version, 
              giving you a complete understanding of YukiFiles capabilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to Experience YukiFiles?
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  Our demo gives you hands-on experience with all features. 
                  No setup required - just click and start exploring!
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button 
                    size="lg"
                    onClick={() => router.push('/demo/dashboard')}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Launch Demo Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => router.push('/demo/login')}
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Demo Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <YukiFilesLogo size={40} variant="white" />
          <p className="mt-4 text-gray-400">
            Experience the future of file management with our comprehensive demo.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-6">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Terms of Service
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Contact Support
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
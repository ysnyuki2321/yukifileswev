"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  Clock, 
  Users, 
  Share2, 
  FileText, 
  FolderOpen, 
  Video, 
  Smartphone,
  Monitor,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Target,
  BarChart3,
  Shield,
  Lock,
  Globe,
  Database,
  Rocket,
  Sparkles,
  Award,
  TrendingUp,
  Download,
  Eye,
  Settings,
  UserCheck,
  CreditCard,
  Server,
  Cloud,
  Smartphone as MobileIcon,
  Tablet,
  Laptop,
  Monitor as DesktopIcon
} from "lucide-react"

import { DEMO_SCENARIOS } from "@/lib/demo/demo-scenarios"
import { demoProgress } from "@/lib/demo/demo-scenarios"

// ====================================================================
// DEMO EXPERIENCE TYPES
// ====================================================================

interface DemoStats {
  completedScenarios: number
  totalTime: number
  skillsLearned: string[]
  certificateEarned: boolean
  featuresExplored: string[]
}

interface FeatureShowcase {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: 'security' | 'ui' | 'performance' | 'collaboration'
  demoUrl?: string
  isHighlighted: boolean
}

// ====================================================================
// MAIN DEMO EXPERIENCE COMPONENT
// ====================================================================

export default function DemoExperiencePage() {
  const router = useRouter()
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [demoStats, setDemoStats] = useState<DemoStats>({
    completedScenarios: 0,
    totalTime: 0,
    skillsLearned: [],
    featuresExplored: [],
    certificateEarned: false
  })

  useEffect(() => {
    // Load demo progress
    demoProgress.loadProgress()
    
    // Calculate demo stats
    const completed = DEMO_SCENARIOS.filter(scenario => 
      demoProgress.getScenarioProgress(scenario.id) === 100
    ).length
    
    const totalTime = DEMO_SCENARIOS.reduce((sum, scenario) => 
      demoProgress.getScenarioProgress(scenario.id) === 100 ? sum + scenario.estimatedTime : sum, 0
    )

    setDemoStats({
      completedScenarios: completed,
      totalTime,
      skillsLearned: extractSkillsFromCompletedScenarios(),
      featuresExplored: ['File Management', 'Secure Sharing', 'Analytics', 'Team Collaboration'],
      certificateEarned: completed >= 3
    })
  }, [])

  const extractSkillsFromCompletedScenarios = (): string[] => {
    const skills: string[] = []
    DEMO_SCENARIOS.forEach(scenario => {
      if (demoProgress.getScenarioProgress(scenario.id) === 100) {
        scenario.steps.forEach(step => {
          skills.push(...step.learningObjectives)
        })
      }
    })
    return [...new Set(skills)] // Remove duplicates
  }

  const startScenario = async (scenarioId: string) => {
    setIsStarting(true)
    demoProgress.setCurrentScenario(scenarioId)
    
    // Simulate loading/preparation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Navigate to dashboard with demo scenario
    router.push(`/dashboard?demo=true&scenario=${scenarioId}`)
  }

  const startQuickDemo = async () => {
    setIsStarting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push('/dashboard?demo=true&quick=true')
  }

  const startFullPlatformDemo = async () => {
    setIsStarting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    router.push('/dashboard?demo=true&full=true')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500'
      case 'intermediate': return 'bg-yellow-500'
      case 'advanced': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'file-management': return <FolderOpen className="w-5 h-5" />
      case 'collaboration': return <Users className="w-5 h-5" />
      case 'sharing': return <Share2 className="w-5 h-5" />
      case 'organization': return <BarChart3 className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'from-blue-500 to-cyan-500'
      case 'Pro': return 'from-emerald-500 to-teal-500'
      case 'Developer': return 'from-orange-500 to-red-500'
      case 'Team': return 'from-indigo-500 to-purple-500'
      case 'Enterprise': return 'from-purple-500 to-pink-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const features: FeatureShowcase[] = [
    {
      id: 'authentication',
      title: 'Supabase Auth Integration',
      description: 'Secure user authentication with email verification and role-based access control',
      icon: <Shield className="w-6 h-6" />,
      category: 'security',
      isHighlighted: true
    },
    {
      id: 'file-management',
      title: 'Drag & Drop Upload',
      description: 'Intuitive file upload interface with real-time progress and preview',
      icon: <FolderOpen className="w-6 h-6" />,
      category: 'ui',
      isHighlighted: true
    },
    {
      id: 'secure-sharing',
      title: 'Smart Sharing System',
      description: 'Create shareable links with password protection, expiration, and analytics',
      icon: <Share2 className="w-6 h-6" />,
      category: 'security',
      isHighlighted: true
    },
    {
      id: 'analytics',
      title: 'Comprehensive Analytics',
      description: 'Track downloads, views, engagement, and user behavior in real-time',
      icon: <BarChart3 className="w-6 h-6" />,
      category: 'performance',
      isHighlighted: false
    },
    {
      id: 'responsive-design',
      title: 'Mobile-First Design',
      description: 'Beautiful responsive layout that works perfectly on all devices',
      icon: <MobileIcon className="w-6 h-6" />,
      category: 'ui',
      isHighlighted: false
    },
    {
      id: 'performance',
      title: 'Global CDN & Caching',
      description: 'Lightning-fast file delivery worldwide with intelligent caching',
      icon: <Rocket className="w-6 h-6" />,
      category: 'performance',
      isHighlighted: false
    }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      storage: '2GB',
      features: ['Basic file sharing', 'Email support', 'Standard security'],
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      storage: '50GB',
      features: ['Advanced sharing', 'Priority support', 'Enhanced security', 'Analytics'],
      popular: true
    },
    {
      name: 'Developer',
      price: '$19.99',
      period: '/month',
      storage: '200GB',
      features: ['API access', 'Custom integrations', 'Advanced analytics', 'Team features'],
      popular: false
    },
    {
      name: 'Team',
      price: '$39.99',
      period: '/month',
      storage: '1TB',
      features: ['Team management', 'Admin controls', 'Enterprise security', '24/7 support'],
      popular: false
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      storage: 'Unlimited',
      features: ['Custom solutions', 'Dedicated support', 'SLA guarantees', 'On-premise options'],
      popular: false
    }
  ]

  if (isStarting) {
    return (
      <div className="min-h-screen theme-premium flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            {selectedScenario ? 'Preparing Your Scenario...' : 'Starting Demo Experience...'}
          </h2>
          
          <p className="text-gray-300 mb-6">
            {selectedScenario 
              ? `Loading ${DEMO_SCENARIOS.find(s => s.id === selectedScenario)?.title} with guided tutorials`
              : 'Initializing comprehensive demo environment with real functionality'
            }
          </p>
          
          <div className="space-y-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5 }}
              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
            <div className="text-sm text-gray-400">
              Setting up demo session with real file operations...
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen theme-premium">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                YukiFiles Demo
              </h1>
            </div>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the full power of our <strong>enterprise-grade file sharing platform</strong> with 
              real functionality, guided scenarios, and interactive tutorials. Built with Next.js 15, Supabase, and TypeScript.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                onClick={startQuickDemo}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
                size="lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Quick Demo (2 min)
              </Button>
              
              <Button
                onClick={startFullPlatformDemo}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
                size="lg"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Full Platform Demo
              </Button>
              
              <Button
                onClick={() => router.push('/demo/dashboard')}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 text-lg"
                size="lg"
              >
                <FolderOpen className="w-5 h-5 mr-2" />
                Comprehensive Dashboard
              </Button>
              
              <Button
                onClick={() => setShowSkillsModal(true)}
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 px-8 py-3 text-lg"
                size="lg"
              >
                <Target className="w-5 h-5 mr-2" />
                Choose Learning Path
              </Button>
            </div>

            {/* Demo Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{demoStats.completedScenarios}</div>
                <div className="text-sm text-gray-400">Scenarios</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{demoStats.totalTime}m</div>
                <div className="text-sm text-gray-400">Time</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{demoStats.skillsLearned.length}</div>
                <div className="text-sm text-gray-400">Skills</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-400">{demoStats.featuresExplored.length}</div>
                <div className="text-sm text-gray-400">Features</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-400">
                  {demoStats.certificateEarned ? <CheckCircle className="w-6 h-6" /> : '○'}
                </div>
                <div className="text-sm text-gray-400">Certificate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-black/20 mb-12">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20">
                Overview
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-purple-500/20">
                Features
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="data-[state=active]:bg-purple-500/20">
                Scenarios
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-purple-500/20">
                Pricing
              </TabsTrigger>
              <TabsTrigger value="tech" className="data-[state=active]:bg-purple-500/20">
                Tech Stack
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  Enterprise-Grade File Sharing Platform
                </h2>
                <p className="text-gray-300 text-lg max-w-4xl mx-auto">
                  YukiFiles is built with modern technologies and enterprise security standards. 
                  Experience real-time collaboration, advanced analytics, and professional-grade file management.
                </p>
              </motion.div>

              {/* Key Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Shield className="w-12 h-12" />,
                    title: "Bank-Level Security",
                    description: "Enterprise-grade encryption, anti-fraud protection, and secure file sharing with advanced access controls."
                  },
                  {
                    icon: <Rocket className="w-12 h-12" />,
                    title: "Lightning Fast",
                    description: "Global CDN, optimized loading, and intelligent caching for the best performance worldwide."
                  },
                  {
                    icon: <Users className="w-12 h-12" />,
                    title: "Team Collaboration",
                    description: "Real-time collaboration, role-based permissions, and comprehensive team management features."
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                  >
                    <Card className="bg-black/40 border-purple-500/20 h-full">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6 text-white">
                          {benefit.icon}
                        </div>
                        <h3 className="text-white font-semibold text-xl mb-4">{benefit.title}</h3>
                        <p className="text-gray-400">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Platform Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Global CDN", value: "200+", suffix: "locations" },
                  { label: "Security", value: "99.9%", suffix: "uptime" },
                  { label: "File Types", value: "100+", suffix: "supported" },
                  { label: "Languages", value: "15+", suffix: "languages" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-purple-400 mb-2">{stat.value}</div>
                    <div className="text-gray-300 font-medium">{stat.label}</div>
                    <div className="text-gray-500 text-sm">{stat.suffix}</div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  Platform Features
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                  Explore the comprehensive feature set that makes YukiFiles the ultimate file sharing solution
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                  >
                    <Card className={`bg-black/40 border-purple-500/20 h-full transition-all duration-300 ${
                      feature.isHighlighted ? 'ring-2 ring-purple-500/50' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            feature.isHighlighted 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                              : 'bg-gray-600/50 text-gray-300'
                          }`}>
                            {feature.icon}
                          </div>
                          {feature.isHighlighted && (
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Scenarios Tab */}
            <TabsContent value="scenarios" className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  Interactive Learning Scenarios
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                  Each scenario guides you through real-world use cases with step-by-step instructions, 
                  interactive elements, and practical exercises using actual file operations.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEMO_SCENARIOS.map((scenario, index) => {
                  const progress = demoProgress.getScenarioProgress(scenario.id)
                  const isCompleted = progress === 100
                  
                  return (
                    <motion.div
                      key={scenario.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 * index }}
                    >
                      <Card className="bg-black/40 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 h-full group cursor-pointer"
                            onClick={() => setSelectedScenario(scenario.id)}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                                {scenario.icon}
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
                                  {scenario.title}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  {getCategoryIcon(scenario.category)}
                                  <span className="text-xs text-gray-400 capitalize">
                                    {scenario.category.replace('-', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {isCompleted && (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {scenario.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-400">
                              <Clock className="w-4 h-4" />
                              {scenario.estimatedTime}m
                            </div>
                            
                            <Badge 
                              variant="secondary" 
                              className={`${getDifficultyColor(scenario.difficulty)} text-white text-xs`}
                            >
                              {scenario.difficulty}
                            </Badge>
                          </div>
                          
                          {progress > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-purple-400">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation()
                                startScenario(scenario.id)
                              }}
                              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                              size="sm"
                            >
                              {progress > 0 ? 'Continue' : 'Start'} Scenario
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  Choose Your Plan
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                  Start with our free plan and scale up as your needs grow. All plans include enterprise-grade security.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {pricingPlans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                  >
                    <Card className={`bg-black/40 border-purple-500/20 h-full relative ${
                      plan.popular ? 'ring-2 ring-purple-500/50' : ''
                    }`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-purple-500 text-white">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center pt-6">
                        <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                        <div className="mt-4">
                          <span className="text-3xl font-bold text-white">{plan.price}</span>
                          {plan.period && (
                            <span className="text-gray-400 text-lg">{plan.period}</span>
                          )}
                        </div>
                        <div className="text-gray-300 text-sm mt-2">
                          {plan.storage} Storage
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <ul className="space-y-2 text-sm">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <Button 
                          className={`w-full ${
                            plan.popular 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                              : 'bg-gray-600 hover:bg-gray-700'
                          }`}
                          size="sm"
                        >
                          {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tech Stack Tab */}
            <TabsContent value="tech" className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  Built with Modern Technologies
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                  YukiFiles leverages the latest web technologies for performance, security, and developer experience
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    category: 'Frontend',
                    technologies: [
                      { name: 'Next.js 15', description: 'Latest React framework with App Router' },
                      { name: 'React 19', description: 'Modern React with concurrent features' },
                      { name: 'TypeScript', description: 'Type-safe development experience' }
                    ],
                    icon: <Monitor className="w-8 h-8" />
                  },
                  {
                    category: 'Backend & Database',
                    technologies: [
                      { name: 'Supabase', description: 'Open source Firebase alternative' },
                      { name: 'PostgreSQL', description: 'Enterprise-grade database' },
                      { name: 'Real-time', description: 'Live updates and collaboration' }
                    ],
                    icon: <Database className="w-8 h-8" />
                  },
                  {
                    category: 'UI & Styling',
                    technologies: [
                      { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
                      { name: 'Radix UI', description: 'Accessible component primitives' },
                      { name: 'Framer Motion', description: 'Production-ready animations' }
                    ],
                    icon: <Sparkles className="w-8 h-8" />
                  }
                ].map((tech, index) => (
                  <motion.div
                    key={tech.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                  >
                    <Card className="bg-black/40 border-purple-500/20 h-full">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                            {tech.icon}
                          </div>
                          <CardTitle className="text-white text-lg">{tech.category}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tech.technologies.map((item, itemIndex) => (
                          <div key={itemIndex} className="p-3 bg-black/20 rounded-lg">
                            <div className="font-medium text-white text-sm mb-1">{item.name}</div>
                            <div className="text-gray-400 text-xs">{item.description}</div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Skills Modal */}
      <AnimatePresence>
        {showSkillsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSkillsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-purple-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Choose Your Learning Path
              </h3>
              
              <div className="space-y-4">
                {DEMO_SCENARIOS.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer"
                    onClick={() => {
                      setShowSkillsModal(false)
                      startScenario(scenario.id)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{scenario.icon}</span>
                      <div>
                        <div className="text-white font-medium">{scenario.title}</div>
                        <div className="text-sm text-gray-400">{scenario.estimatedTime} minutes • {scenario.difficulty}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-400" />
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowSkillsModal(false)}
                  variant="outline"
                  className="border-purple-500/30 text-purple-300"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
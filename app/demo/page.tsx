"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  BarChart3
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
}

// ====================================================================
// MAIN DEMO EXPERIENCE COMPONENT
// ====================================================================

export default function DemoExperiencePage() {
  const router = useRouter()
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)
  const [demoStats, setDemoStats] = useState<DemoStats>({
    completedScenarios: 0,
    totalTime: 0,
    skillsLearned: [],
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
              Experience the full power of our file management platform with <strong>real functionality</strong>, 
              guided scenarios, and interactive tutorials. No fake data - this is the actual product.
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{demoStats.completedScenarios}</div>
                <div className="text-sm text-gray-400">Scenarios Completed</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{demoStats.totalTime}m</div>
                <div className="text-sm text-gray-400">Time Invested</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{demoStats.skillsLearned.length}</div>
                <div className="text-sm text-gray-400">Skills Learned</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-400">
                  {demoStats.certificateEarned ? <CheckCircle className="w-6 h-6" /> : '○'}
                </div>
                <div className="text-sm text-gray-400">Certificate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Scenarios Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
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
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              What You'll Experience
            </h2>
            <p className="text-gray-300 text-lg">
              Real functionality, not fake demos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Share2 className="w-6 h-6" />,
                title: "Real Share Links",
                description: "Generate actual shareable links with analytics, password protection, and expiration dates"
              },
              {
                icon: <FolderOpen className="w-6 h-6" />,
                title: "File Operations",
                description: "Upload, organize, and manage real files with drag-and-drop, folders, and metadata"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Collaboration",
                description: "Experience real-time collaboration features with comments, permissions, and notifications"
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Analytics Dashboard",
                description: "View detailed analytics with real data about file usage, shares, and team activity"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-black/20 border-purple-500/20 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Experience */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Optimized for Every Device
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-black/20 border-purple-500/20 p-8">
                <Monitor className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Desktop Experience</h3>
                <ul className="text-gray-300 text-left space-y-2">
                  <li>• Advanced file manager with multi-panel view</li>
                  <li>• Keyboard shortcuts and right-click menus</li>
                  <li>• Professional dashboard with detailed analytics</li>
                  <li>• Drag-and-drop file organization</li>
                </ul>
              </Card>
              
              <Card className="bg-black/20 border-purple-500/20 p-8">
                <Smartphone className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Mobile Experience</h3>
                <ul className="text-gray-300 text-left space-y-2">
                  <li>• Touch-optimized interface with gestures</li>
                  <li>• Mobile camera integration for quick uploads</li>
                  <li>• Responsive design that works on any screen</li>
                  <li>• Offline capabilities and sync</li>
                </ul>
              </Card>
            </div>
          </motion.div>
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
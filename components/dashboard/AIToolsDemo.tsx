"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Sparkles, Brain, FileText, Image, Video, Music, 
  Zap, Eye, Download, Copy, Settings, RefreshCw,
  MessageSquare, Search, Wand2, Cpu, Globe, Star, Upload
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AIToolsDemoProps {
  isDemoMode?: boolean
}

export default function AIToolsDemo({ isDemoMode = true }: AIToolsDemoProps) {
  const [selectedTool, setSelectedTool] = useState<'analyze' | 'generate' | 'chat' | 'ocr' | 'transcribe'>('analyze')
  const [inputText, setInputText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'chatgpt' | 'claude'>('gemini')

  const aiModels = [
    { 
      id: 'gemini' as const, 
      name: 'Google Gemini Pro', 
      icon: Brain, 
      description: 'Advanced multimodal AI',
      strength: 'Code & Analysis'
    },
    { 
      id: 'chatgpt' as const, 
      name: 'OpenAI GPT-4', 
      icon: MessageSquare, 
      description: 'Conversational AI expert',
      strength: 'Writing & Chat'
    },
    { 
      id: 'claude' as const, 
      name: 'Anthropic Claude', 
      icon: Sparkles, 
      description: 'Helpful, harmless AI',
      strength: 'Research & Safety'
    }
  ]

  const aiTools = [
    {
      id: 'analyze' as const,
      name: 'Content Analysis',
      icon: Brain,
      description: 'Analyze file content with AI',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'generate' as const,
      name: 'Content Generation',
      icon: Wand2,
      description: 'Generate content using AI',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'chat' as const,
      name: 'AI Chat Assistant',
      icon: MessageSquare,
      description: 'Chat with AI about your files',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ocr' as const,
      name: 'OCR Text Extraction',
      icon: Eye,
      description: 'Extract text from images',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'transcribe' as const,
      name: 'Audio Transcription',
      icon: Music,
      description: 'Convert speech to text',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const simulateAIProcessing = async (prompt: string) => {
    setIsProcessing(true)
    setResult('')
    
    // Simulate AI processing
    const steps = [
      'Connecting to AI model...',
      'Processing your request...',
      'Analyzing content...',
      'Generating response...',
      'Finalizing results...'
    ]
    
    for (let i = 0; i < steps.length; i++) {
      setResult(steps[i])
      await new Promise(resolve => setTimeout(resolve, 800))
    }
    
    // Mock AI responses based on tool and model
    const responses = {
      gemini: {
        analyze: `**Gemini Pro Analysis:**\n\n✨ **Content Summary:** This appears to be a well-structured document with technical content.\n\n🔍 **Key Insights:**\n• Professional formatting detected\n• Technical terminology identified\n• Recommended for developer audience\n\n📊 **Metrics:**\n• Readability Score: 85/100\n• Technical Complexity: High\n• Estimated Reading Time: 5 minutes`,
        generate: `**Gemini Pro Generated Content:**\n\n# YukiFiles Platform Overview\n\n## Introduction\nYukiFiles represents the next generation of secure file sharing platforms, combining enterprise-grade security with intuitive user experience.\n\n## Key Features\n• 🔐 Bank-level encryption\n• 🚀 Lightning-fast uploads\n• 🌍 Global CDN distribution\n• 📊 Advanced analytics\n\n## Technical Architecture\nBuilt on modern tech stack including Next.js 15, React 19, and Supabase for scalable performance.`,
        chat: `**Gemini Pro Response:**\n\nHello! I'm here to help you with your YukiFiles platform. I can assist with:\n\n• 📁 File management and organization\n• 🔐 Security best practices\n• 📊 Analytics interpretation\n• 🚀 Platform optimization\n\nWhat would you like to know about your files today?`,
        ocr: `**Gemini Pro OCR Results:**\n\n📄 **Extracted Text:**\n"YukiFiles - Secure File Sharing Platform\nEnterprise-grade security meets intuitive design\nUpload • Share • Collaborate"\n\n🎯 **Detected Elements:**\n• Logo/Branding text\n• Marketing tagline\n• Call-to-action buttons\n\n📊 **Confidence Score:** 98.5%`,
        transcribe: `**Gemini Pro Transcription:**\n\n🎵 **Audio Transcript:**\n"Welcome to YukiFiles, the secure file sharing platform designed for modern teams. With enterprise-grade security and intuitive design, you can upload, share, and collaborate with confidence."\n\n⏱️ **Duration:** 15 seconds\n🎯 **Confidence:** 96.2%\n🗣️ **Speaker:** Professional narrator`
      },
      chatgpt: {
        analyze: `**ChatGPT-4 Analysis:**\n\n🧠 **Content Intelligence:**\nThis content demonstrates high-quality structure and professional presentation.\n\n💡 **Recommendations:**\n• Consider adding more visual elements\n• Enhance call-to-action clarity\n• Optimize for mobile readability\n\n📈 **SEO Score:** 92/100\n🎯 **Engagement Potential:** High`,
        generate: `**ChatGPT-4 Generated Content:**\n\n# The Future of File Sharing\n\n*Revolutionizing how teams collaborate in the digital age*\n\nIn today's fast-paced business environment, secure and efficient file sharing isn't just a convenience—it's a necessity. YukiFiles emerges as the definitive solution, bridging the gap between security and usability.\n\n## Why Choose YukiFiles?\n\n**🛡️ Uncompromising Security**\nEvery file is protected with military-grade encryption, ensuring your sensitive data remains confidential.\n\n**⚡ Lightning Performance**\nOur global CDN ensures instant access to your files, anywhere in the world.`,
        chat: `**ChatGPT-4 Assistant:**\n\nHi there! 👋 I'm your AI assistant for YukiFiles. I'm here to help you maximize your file sharing experience.\n\n**I can help you with:**\n• 📝 Writing file descriptions\n• 🏷️ Creating smart tags\n• 📊 Understanding your analytics\n• 🔧 Optimizing your workflow\n\nFeel free to ask me anything about your files or the platform!`,
        ocr: `**ChatGPT-4 OCR Analysis:**\n\n📸 **Image Text Extraction:**\n"Secure File Sharing\nMade Simple\n\nUpload → Share → Collaborate\nTrusted by 10,000+ users worldwide"\n\n🏷️ **Detected Categories:**\n• Marketing material\n• Product features\n• User testimonial\n\n✨ **Enhancement Suggestions:**\n• Add stronger call-to-action\n• Include pricing information`,
        transcribe: `**ChatGPT-4 Transcription:**\n\n🎙️ **Audio Content:**\n"Hello and welcome to YukiFiles! I'm excited to show you how easy it is to share files securely. Whether you're a small team or a large enterprise, our platform scales with your needs."\n\n📝 **Key Points:**\n• Welcome message\n• Platform benefits\n• Scalability emphasis\n\n🎯 **Sentiment:** Positive, Professional`
      },
      claude: {
        analyze: `**Claude Analysis:**\n\n🔍 **Thoughtful Content Review:**\nThis content appears well-crafted with attention to user experience and security considerations.\n\n🎯 **Strengths Identified:**\n• Clear value proposition\n• Security-focused messaging\n• User-centric design\n\n⚠️ **Areas for Consideration:**\n• Could benefit from user testimonials\n• Consider accessibility improvements\n• Mobile optimization opportunities\n\n📋 **Overall Assessment:** Professional and trustworthy presentation`,
        generate: `**Claude Generated Content:**\n\n# Building Trust in Digital File Sharing\n\n## A Thoughtful Approach to Security\n\nAt YukiFiles, we believe that security shouldn't come at the expense of usability. Our platform is designed with a deep understanding of both technical requirements and human needs.\n\n### Our Philosophy\n\n**🤝 Trust Through Transparency**\nWe believe users deserve to understand how their data is protected.\n\n**🎯 Simplicity Without Compromise**\nComplex security made simple through thoughtful design.\n\n**🌱 Growing With You**\nFrom individual users to enterprise teams, we scale responsibly.`,
        chat: `**Claude Assistant:**\n\nHello! I'm Claude, your thoughtful AI assistant for YukiFiles. I'm here to provide helpful, accurate information about your files and the platform.\n\n**How I can assist:**\n• 🔍 Careful analysis of your content\n• 💡 Thoughtful suggestions for organization\n• 🛡️ Security best practices\n• 📈 Insights into your usage patterns\n\nI aim to be helpful while respecting your privacy and data security. What would you like to explore?`,
        ocr: `**Claude OCR Analysis:**\n\n📋 **Careful Text Extraction:**\n"YukiFiles Platform\nSecure • Fast • Reliable\n\nJoin thousands of satisfied users\nStart your free trial today"\n\n🔍 **Context Analysis:**\n• Marketing/promotional content\n• Emphasis on security and reliability\n• Clear call-to-action present\n\n💭 **Thoughtful Notes:**\nThe messaging effectively balances security assurance with accessibility, appealing to both technical and non-technical users.`,
        transcribe: `**Claude Transcription:**\n\n📝 **Careful Audio Analysis:**\n"Thank you for choosing YukiFiles. Our mission is to provide secure, reliable file sharing that you can trust. Every feature is designed with your privacy and security in mind."\n\n🎭 **Tone Analysis:**\n• Professional and reassuring\n• Security-focused messaging\n• Trust-building language\n\n📊 **Quality Metrics:**\n• Clarity: Excellent\n• Audio Quality: High\n• Transcription Confidence: 97.8%`
      }
    }
    
    const response = responses[selectedModel][selectedTool] || "AI processing complete!"
    setResult(response)
    setIsProcessing(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setInputText(`Analyze this ${file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file'}: ${file.name}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Model Selector */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Tools Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {aiModels.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full p-4 rounded-lg border transition-all ${
                    selectedModel === model.id
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="w-8 h-8 mb-2 flex items-center justify-center">
                    <model.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{model.name}</h3>
                  <p className="text-xs opacity-80 mb-2">{model.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {model.strength}
                  </Badge>
                </button>
              </motion.div>
            ))}
          </div>

          {/* AI Tools */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {aiTools.map((tool) => {
              const Icon = tool.icon
              return (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedTool === tool.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs text-white font-medium">{tool.name}</p>
                </motion.button>
              )
            })}
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                {selectedTool === 'ocr' || selectedTool === 'transcribe' ? 'Upload File' : 'Input Text'}
              </label>
              
              {selectedTool === 'ocr' || selectedTool === 'transcribe' ? (
                <div className="relative">
                  <input
                    type="file"
                    accept={selectedTool === 'ocr' ? 'image/*' : 'audio/*,video/*'}
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors">
                    <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-gray-300">
                      {selectedFile ? selectedFile.name : `Drop ${selectedTool === 'ocr' ? 'image' : 'audio/video'} file here or click to browse`}
                    </p>
                  </div>
                </div>
              ) : (
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Enter text for ${selectedTool}...`}
                  className="bg-slate-800/50 border-purple-500/20 text-white min-h-24"
                />
              )}
            </div>

            <Button
              onClick={() => simulateAIProcessing(inputText)}
              disabled={isProcessing || (!inputText.trim() && !selectedFile)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? 'Processing with AI...' : `Process with ${aiModels.find(m => m.id === selectedModel)?.name}`}
            </Button>
          </div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-slate-800/30 rounded-lg p-4 border border-purple-500/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Result
                </h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="border-purple-500/30 text-purple-300"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setResult('')}
                    className="border-gray-500/30 text-gray-300"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-gray-300 text-sm whitespace-pre-wrap font-mono">
                {result}
              </div>
            </motion.div>
          )}

          {/* AI Usage Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-400">1,247</div>
              <div className="text-xs text-gray-400">AI Requests</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-400">98.5%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-400">2.3s</div>
              <div className="text-xs text-gray-400">Avg Response</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-orange-400">24/7</div>
              <div className="text-xs text-gray-400">Availability</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
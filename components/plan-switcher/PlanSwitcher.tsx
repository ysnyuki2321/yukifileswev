"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, Sparkles, Zap, Users, FileCode, Check, X,
  ArrowRight, Star, Shield, Globe, BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PlanSwitcherProps {
  isOpen: boolean
  onClose: () => void
  onSwitch: (plan: string) => void
  currentPlan: string
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    storage: '2GB',
    features: ['Basic file sharing', 'Email support', 'Standard security'],
    icon: FileCode,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99/month',
    storage: '50GB',
    features: ['Advanced sharing', 'Priority support', 'Enhanced security', 'Analytics'],
    icon: Zap,
    color: 'from-blue-500 to-purple-500',
    popular: true
  },
  {
    id: 'developer',
    name: 'Developer',
    price: '$19.99/month',
    storage: '200GB',
    features: ['API access', 'Webhooks', 'Advanced analytics', 'Custom branding'],
    icon: FileCode,
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'team',
    name: 'Team',
    price: '$39.99/month',
    storage: '1TB',
    features: ['Team management', 'Collaboration tools', 'Advanced permissions', 'SSO'],
    icon: Users,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    storage: 'Unlimited',
    features: ['Custom solutions', 'Dedicated support', 'On-premise option', 'SLA guarantee'],
    icon: Crown,
    color: 'from-yellow-500 to-orange-500'
  }
]

export function PlanSwitcher({ isOpen, onClose, onSwitch, currentPlan }: PlanSwitcherProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)

  const handleSwitch = async (planId: string) => {
    setSelectedPlan(planId)
    setIsSwitching(true)
    
    // Simulate switching animation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onSwitch(planId)
    setIsSwitching(false)
    setSelectedPlan(null)
  }

  const getCurrentPlan = () => plans.find(p => p.id === currentPlan) || plans[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-white text-lg sm:text-xl">Switch Your Plan</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    Current: {getCurrentPlan().name}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Removed duplicate header close button to avoid double X */}
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Current Plan Highlight */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Current Plan: {getCurrentPlan().name}</h3>
                <p className="text-gray-400 text-sm">{getCurrentPlan().storage} Storage • {getCurrentPlan().price}</p>
              </div>
              <Badge className="bg-purple-500 text-white">
                <Check className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon
              const isCurrent = plan.id === currentPlan
              const isSelected = selectedPlan === plan.id
              
              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative p-4 rounded-lg border transition-all cursor-pointer",
                    isCurrent 
                      ? "border-purple-500 bg-purple-500/10" 
                      : "border-gray-600 bg-gray-800/50 hover:border-gray-500",
                    isSelected && "border-green-500 bg-green-500/10"
                  )}
                  onClick={() => !isCurrent && handleSwitch(plan.id)}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  {/* Current Badge */}
                  {isCurrent && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-green-500 text-white text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Current
                      </Badge>
                    </div>
                  )}

                  {/* Switching Animation */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
                      />
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    {/* Plan Header */}
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r",
                        plan.color
                      )}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{plan.name}</h3>
                        <p className="text-gray-400 text-sm">{plan.storage} Storage</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-bold text-white">{plan.price}</div>

                    {/* Features */}
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    {!isCurrent && (
                      <Button
                        className={cn(
                          "w-full bg-gradient-to-r",
                          plan.color,
                          "hover:opacity-90 transition-opacity"
                        )}
                        disabled={isSwitching}
                      >
                        {isSelected ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            Switch to {plan.name}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}

                    {isCurrent && (
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300" disabled>
                        Current Plan
                      </Button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Plan Comparison */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Plan Comparison</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium text-gray-300">Feature</div>
                {plans.map(plan => (
                  <div key={plan.id} className="text-gray-400">{plan.name}</div>
                ))}
              </div>
              {['Storage', 'API Access', 'Team Features', 'Support'].map(feature => (
                <div key={feature} className="space-y-2">
                  <div className="font-medium text-gray-300">{feature}</div>
                  {plans.map(plan => (
                    <div key={plan.id} className="text-gray-400">
                      {feature === 'Storage' && plan.storage}
                      {feature === 'API Access' && (plan.id === 'developer' || plan.id === 'team' || plan.id === 'enterprise') && '✓'}
                      {feature === 'Team Features' && (plan.id === 'team' || plan.id === 'enterprise') && '✓'}
                      {feature === 'Support' && plan.id === 'enterprise' ? '24/7' : plan.id === 'pro' ? 'Priority' : 'Email'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <div className="text-gray-400 text-sm">
            Switch plans anytime • No setup fees
          </div>
          <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
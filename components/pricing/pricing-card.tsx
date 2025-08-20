"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Shield, Globe, Code2, Users, Crown, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface PricingCardProps {
  plan: {
    name: string
    price: string
    description: string
    features: string[]
    color: string
    gradient: string
    icon: React.ReactNode
    badge?: string
    popular?: boolean
    enterprise?: boolean
  }
  userSubscription?: string | null
  isLoggedIn: boolean
}

export function PricingCard({ plan, userSubscription, isLoggedIn }: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isCurrentPlan = userSubscription === plan.name.toLowerCase()

  const getPlanStyles = () => {
    switch (plan.name.toLowerCase()) {
      case "free":
        return {
          gradient: "from-gray-400 to-gray-600",
          border: "border-gray-600 hover:border-gray-400",
          shadow: "shadow-gray-500/20",
          checkColor: "text-green-400",
          iconColor: "text-gray-400"
        }
      case "pro":
        return {
          gradient: "from-blue-400 to-cyan-500",
          border: "border-blue-600 hover:border-blue-400",
          shadow: "shadow-blue-500/20",
          checkColor: "text-blue-400",
          iconColor: "text-blue-400"
        }
      case "developer":
        return {
          gradient: "from-purple-400 to-pink-500",
          border: "border-purple-600 hover:border-purple-400",
          shadow: "shadow-purple-500/20",
          checkColor: "text-purple-400",
          iconColor: "text-purple-400"
        }
      case "team":
        return {
          gradient: "from-green-400 to-emerald-500",
          border: "border-green-600 hover:border-green-400",
          shadow: "shadow-green-500/20",
          checkColor: "text-green-400",
          iconColor: "text-green-400"
        }
      case "enterprise":
        return {
          gradient: "from-orange-400 to-red-500",
          border: "border-orange-600 hover:border-orange-400",
          shadow: "shadow-orange-500/20",
          checkColor: "text-orange-400",
          iconColor: "text-orange-400"
        }
      default:
        return {
          gradient: "from-purple-400 to-pink-500",
          border: "border-purple-600 hover:border-purple-400",
          shadow: "shadow-purple-500/20",
          checkColor: "text-purple-400",
          iconColor: "text-purple-400"
        }
    }
  }

  const styles = getPlanStyles()

  return (
    <Card 
      className={`relative bg-black/40 backdrop-blur-lg border-2 transition-all duration-300 transform hover:scale-105 ${
        plan.popular 
          ? `${styles.border} shadow-2xl ${styles.shadow}` 
          : `${styles.border}`
      } ${isHovered ? 'shadow-2xl' : 'shadow-lg'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border gradient */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${styles.gradient} opacity-0 transition-opacity duration-300 ${
        isHovered ? 'opacity-20' : ''
      }`} />
      
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className={`bg-gradient-to-r ${styles.gradient} text-white px-6 py-2 border-2 border-white/20 shadow-lg`}>
            <Sparkles className="w-4 h-4 mr-2" />
            Most Popular
          </Badge>
        </div>
      )}

      {/* Enterprise badge */}
      {plan.enterprise && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 border-2 border-white/20 shadow-lg">
            <Crown className="w-4 h-4 mr-2" />
            Enterprise
          </Badge>
        </div>
      )}

      <CardHeader className="text-center relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${styles.gradient} flex items-center justify-center shadow-lg`}>
            {plan.icon}
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-white mb-2">{plan.name}</CardTitle>
        <CardDescription className="text-gray-300 text-lg">{plan.description}</CardDescription>
        <div className="py-6">
          <span className={`text-5xl font-bold bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent`}>
            {plan.price}
          </span>
          <span className="text-gray-400 text-xl ml-2">/month</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-4">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 group">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${styles.gradient} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                <Check className={`w-4 h-4 ${styles.checkColor}`} />
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors duration-200">{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-6">
          {isCurrentPlan ? (
            <Button 
              disabled 
              className={`w-full bg-gradient-to-r ${styles.gradient} text-white opacity-60 cursor-not-allowed`}
            >
              Current Plan
            </Button>
          ) : (
            <Link href={isLoggedIn ? "/payment/checkout" : "/auth/register"}>
              <Button 
                className={`w-full bg-gradient-to-r ${styles.gradient} hover:shadow-lg text-white font-semibold py-3 transition-all duration-200 transform hover:scale-105`}
              >
                {isLoggedIn ? "Upgrade Now" : "Get Started"}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
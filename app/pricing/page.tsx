import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/ui/navigation"
import { 
  Crown, Rocket, Code2, Users, Building, Star, Check, X, ArrowRight,
  Zap, Shield, Globe, BarChart3, Eye, Share2, Upload, Lock, Infinity,
  CheckCircle, Sparkles, Award
} from "lucide-react"
import Link from "next/link"
import { isDebugModeEnabled } from "@/lib/services/debug-context"

export default async function PricingPage() {
  const supabase = await createServerClient()

  // Check debug mode first
  const debugMode = await isDebugModeEnabled()
  
  if (supabase && !debugMode) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If user is logged in, redirect to dashboard
    if (user) {
      redirect("/dashboard")
    }
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      icon: <Rocket className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      features: [
        "2GB Storage",
        "Basic file sharing",
        "Email support",
        "Standard security",
        "File preview",
        "Mobile app access"
      ],
      limitations: [
        "100MB max file size",
        "Basic analytics",
        "Standard support"
      ],
      popular: false,
      cta: "Get Started Free",
      href: "/auth/register"
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For professionals and creators",
      icon: <Crown className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      features: [
        "50GB Storage",
        "Advanced sharing controls",
        "Priority support",
        "Enhanced security",
        "Advanced analytics",
        "Custom branding",
        "API access",
        "Team collaboration"
      ],
      limitations: [
        "1GB max file size",
        "5 team members",
        "Standard integrations"
      ],
      popular: true,
      cta: "Start Pro Trial",
      href: "/auth/register"
    },
    {
      name: "Developer",
      price: "$19.99",
      period: "per month",
      description: "For developers and startups",
      icon: <Code2 className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      features: [
        "200GB Storage",
        "Full API access",
        "Webhook integrations",
        "Advanced security",
        "Detailed analytics",
        "Custom domains",
        "Unlimited team members",
        "Priority support"
      ],
      limitations: [
        "5GB max file size",
        "Rate limits apply",
        "Community support"
      ],
      popular: false,
      cta: "Start Developer Plan",
      href: "/auth/register"
    },
    {
      name: "Team",
      price: "$39.99",
      period: "per month",
      description: "For growing teams",
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      features: [
        "1TB Storage",
        "Team management",
        "Advanced permissions",
        "SSO integration",
        "Advanced analytics",
        "Custom branding",
        "Dedicated support",
        "SLA guarantee"
      ],
      limitations: [
        "10GB max file size",
        "25 team members",
        "Business hours support"
      ],
      popular: false,
      cta: "Start Team Plan",
      href: "/auth/register"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "per month",
      description: "For large organizations",
      icon: <Building className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      features: [
        "Unlimited Storage",
        "Advanced security & compliance",
        "24/7 phone support",
        "Custom integrations",
        "Advanced analytics",
        "White-label solution",
        "Dedicated account manager",
        "SLA guarantee"
      ],
      limitations: [
        "Unlimited file size",
        "Unlimited team members",
        "Custom contract terms"
      ],
      popular: false,
      cta: "Contact Sales",
      href: "/contact"
    }
  ]

  const features = [
    {
      icon: <Upload className="w-5 h-5" />,
      title: "Drag & Drop Upload",
      description: "Upload files instantly with our intuitive drag & drop interface"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and secure file sharing with access controls"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Lightning Fast",
      description: "Global CDN ensures your files are delivered at maximum speed"
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: "Smart Sharing",
      description: "Create shareable links with password protection and expiration dates"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "File Preview",
      description: "Preview images, documents, and videos directly in your browser"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Analytics Dashboard",
      description: "Track downloads, views, and engagement with detailed analytics"
    }
  ]

  const faqs = [
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, all paid plans come with a 14-day free trial. No credit card required."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. No long-term contracts required."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use enterprise-grade encryption and security measures to protect your data."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Simple, transparent pricing
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Choose Your
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"> Plan</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start free and scale as you grow. All plans include our core features with no hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-black/40 backdrop-blur-lg border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 ${
                  plan.popular ? 'border-purple-500/60 scale-105 ring-2 ring-purple-500/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center`}>
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-gray-400 text-sm">/{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-500 mb-2">Limitations:</p>
                      <div className="space-y-1">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-center space-x-3">
                            <X className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <span className="text-xs text-gray-500">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Link href={plan.href}>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                          : `bg-gradient-to-r ${plan.color} hover:opacity-90`
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">All plans include these features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Every plan comes with our core features designed to make file sharing simple and secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-lg border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-lg border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of teams already using YukiFiles to share and collaborate on files securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-4 bg-transparent"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
                <span className="text-xl font-bold text-white">YukiFiles</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most secure and user-friendly file sharing platform for modern teams.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="/#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 YukiFiles. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

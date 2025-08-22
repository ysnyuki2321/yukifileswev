import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { NavigationWrapper } from "@/components/ui/navigation-wrapper" // Removed old navigation
import { 
  Upload, Shield, Zap, Globe, PlayCircle, Star, Code2, Users, 
  CheckCircle, ArrowRight, FileText, HardDrive, Lock, Share2,
  Download, Eye, Clock, BarChart3, Award, Globe2, Sparkles,
  Smartphone, Monitor, Tablet, Cloud, Database, Cpu, Wifi,
  Crown, Rocket, Building, Server, Infinity, Check, X, Folder
} from "lucide-react"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { isDebugModeEnabled } from "@/lib/services/debug-context"


export default async function HomePage() {
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

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Drag & Drop Upload",
      description: "Upload files instantly with our intuitive drag & drop interface"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level encryption and secure file sharing with access controls"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Global CDN ensures your files are delivered at maximum speed"
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Smart Sharing",
      description: "Create shareable links with password protection and expiration dates"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "File Preview",
      description: "Preview images, documents, and videos directly in your browser"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Track downloads, views, and engagement with detailed analytics"
    }
  ]

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
      href: "/pricing"
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
      href: "/pricing"
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
      href: "/pricing"
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

  const stats = [
    { number: "10M+", label: "Files Shared", icon: <FileText className="w-5 h-5" /> },
    { number: "500K+", label: "Active Users", icon: <Users className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Globe2 className="w-5 h-5" /> },
    { number: "50+", label: "Countries", icon: <Globe className="w-5 h-5" /> }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content: "YukiFiles has transformed how our team shares and collaborates on files. The interface is intuitive and the security features give us peace of mind.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "The analytics dashboard helps us understand how our content is being used. It's been a game-changer for our content strategy.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      company: "DesignStudio",
      content: "The file preview feature saves us so much time. No more downloading files just to see what they contain.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen theme-premium">
      {/* Navigation */}
      {/* <NavigationWrapper /> */}

      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-4 py-2 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-pink-500/20 dark:text-purple-300 dark:border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-500/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted by 500K+ users worldwide
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Share Files with
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"> Confidence</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              The most secure and user-friendly file sharing platform. Upload, share, and collaborate with enterprise-grade security, lightning-fast speeds, and beautiful analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {debugMode ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                  >
                    Enter Debug Mode
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">Start Free Trial</span>
                      <span className="sm:hidden">Get Started</span>
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-transparent w-full sm:w-auto"
                    >
                      <PlayCircle className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Try Demo</span>
                      <span className="sm:hidden">Demo</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mr-2">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need to share files securely</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From simple file sharing to enterprise collaboration, we've got you covered with powerful features designed for modern teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include our core features with no hidden fees.
            </p>
          </div>

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

      {/* Testimonials Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Loved by teams worldwide</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what our customers have to say about their experience with YukiFiles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-lg border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-300 font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of teams already using YukiFiles to share and collaborate on files securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {debugMode ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                  >
                    Enter Debug Mode
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">Start Free Trial</span>
                      <span className="sm:hidden">Get Started</span>
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-transparent w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">View All Plans</span>
                      <span className="sm:hidden">Pricing</span>
                    </Button>
                  </Link>
                </>
              )}
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
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
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
      
      {/* Floating Demo Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/demo">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl shadow-purple-500/25 text-white font-semibold px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-300 hover:scale-105"
          >
            <PlayCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Try Demo</span>
            <span className="sm:hidden">Demo</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}

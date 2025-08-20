import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavigationWrapper } from "@/components/ui/navigation-wrapper"
import { 
  Building, Mail, Phone, MapPin, MessageSquare, Users, Shield, 
  Zap, Globe, ArrowRight, Sparkles, CheckCircle
} from "lucide-react"
import Link from "next/link"
import { isDebugModeEnabled } from "@/lib/services/debug-context"

export default async function ContactPage() {
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
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "SOC 2 Type II certified with end-to-end encryption"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Management",
      description: "Advanced user management and SSO integration"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Custom Integrations",
      description: "API-first approach with custom development"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Infrastructure",
      description: "Multi-region deployment with 99.9% uptime SLA"
    }
  ]

  return (
    <div className="min-h-screen theme-premium">
      {/* Navigation */}
      <NavigationWrapper />

      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                <Building className="w-4 h-4 mr-2" />
                Enterprise Solutions
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Let's Build Something
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"> Amazing</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ready to scale your file sharing infrastructure? Our enterprise team is here to help you find the perfect solution.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Get in Touch</CardTitle>
                  <CardDescription className="text-gray-400">
                    Tell us about your needs and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-gray-300">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-gray-300">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-300">
                        Work Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-gray-300">
                        Company
                      </label>
                      <Input
                        id="company"
                        placeholder="Your Company"
                        className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="employees" className="text-sm font-medium text-gray-300">
                        Number of Employees
                      </label>
                      <select
                        id="employees"
                        className="w-full bg-black/30 border border-gray-600 text-white rounded-md px-3 py-2 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Select range</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="501-1000">501-1000</option>
                        <option value="1000+">1000+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-300">
                        Tell us about your needs
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Describe your file sharing requirements, security needs, integration requirements, etc."
                        rows={4}
                        className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Send Message
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & Features */}
            <div className="space-y-8">
              {/* Contact Info */}
              <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-gray-400">enterprise@yukifiles.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Phone</p>
                      <p className="text-gray-400">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Office</p>
                      <p className="text-gray-400">San Francisco, CA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise Features */}
              <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Enterprise Features</CardTitle>
                  <CardDescription className="text-gray-400">
                    Everything you need for enterprise-grade file sharing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        {feature.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium">{feature.title}</p>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-medium">24-Hour Response</p>
                      <p className="text-gray-400 text-sm">We'll get back to you within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of enterprises already using YukiFiles to secure their file sharing infrastructure.
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
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-4 bg-transparent"
                >
                  View Pricing
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
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
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
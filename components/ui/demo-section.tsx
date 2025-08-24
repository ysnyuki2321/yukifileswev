import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  FolderOpen, 
  Share2, 
  Settings, 
  BarChart3,
  Smartphone,
  Monitor,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export function DemoSection() {
  return (
    <section id="demo" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">See It In Action</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of YukiFiles with our interactive demo and comprehensive dashboard
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8 overflow-hidden border-0 shadow-2xl">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                  {/* Mock UI Elements */}
                  <div className="absolute top-6 left-6 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>

                  {/* Mock File Manager Interface */}
                  <div className="absolute inset-4 bg-card rounded-lg shadow-inner flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-xl flex items-center justify-center">
                        <FolderOpen className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">YukiFiles Demo</h3>
                      <p className="text-muted-foreground mb-4">Experience the full platform</p>
                      <Link href="/demo/dashboard">
                        <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-opacity">
                          <Play className="w-6 h-6 mr-2" />
                          Launch Demo
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Feature Badges */}
                  <div className="absolute bottom-6 right-6 flex gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      <FolderOpen className="w-3 h-3 mr-1" />
                      File Manager
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                      <Share2 className="w-3 h-3 mr-1" />
                      Sharing
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Analytics
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Features */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mx-auto mb-3 gradient-primary rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">File Management</h3>
                <p className="text-sm text-muted-foreground">
                  Upload, organize, and manage files with drag & drop interface
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mx-auto mb-3 gradient-secondary rounded-lg flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Advanced Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Create secure links with password protection and analytics
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mx-auto mb-3 gradient-emerald rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Track file usage, downloads, and user engagement metrics
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mx-auto mb-3 gradient-blue rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Customization</h3>
                <p className="text-sm text-muted-foreground">
                  Personalize your workspace with themes and preferences
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Support */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold mb-6">Works Everywhere</h3>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Monitor className="w-6 h-6" />
                <span className="font-medium">Desktop</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Smartphone className="w-6 h-6" />
                <span className="font-medium">Mobile</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Zap className="w-6 h-6" />
                <span className="font-medium">Fast</span>
              </div>
            </div>
          </motion.div>

          {/* Demo CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-2xl font-bold mb-4">Ready to Experience YukiFiles?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Jump into our comprehensive demo and see how YukiFiles can transform your file management workflow. 
                No registration required - start exploring immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo/dashboard">
                  <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg">
                    <Play className="w-5 h-5 mr-2" />
                    Launch Full Demo
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="border-2 bg-transparent hover:bg-muted/50">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
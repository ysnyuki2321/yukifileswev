import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FolderOpen, 
  Share2, 
  BarChart3, 
  Shield, 
  Zap, 
  Smartphone,
  Cloud,
  Lock,
  Download,
  Upload,
  Eye,
  Settings
} from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: FolderOpen,
    title: "Smart File Organization",
    description:
      "Intelligent file categorization with automatic tagging, folder structures, and search capabilities. Organize your digital workspace effortlessly.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Share2,
    title: "Advanced File Sharing",
    description:
      "Secure file sharing with customizable permissions, password protection, expiration dates, and detailed access analytics.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: BarChart3,
    title: "File Analytics & Insights",
    description:
      "Comprehensive analytics showing file usage, download patterns, user engagement, and storage optimization recommendations.",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with end-to-end encryption, access controls, audit logs, and compliance with industry standards.",
    gradient: "from-red-500 to-orange-500"
  },
  {
    icon: Zap,
    title: "High Performance",
    description:
      "Lightning-fast uploads, downloads, and file operations. Optimized for both mobile and desktop with minimal loading times.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Touch-optimized interface that works seamlessly across all devices. Responsive design that adapts to any screen size.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Cloud,
    title: "Global CDN",
    description:
      "Worldwide content delivery network ensuring fast access from anywhere. Automatic caching and optimization for global users.",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    icon: Lock,
    title: "Privacy Controls",
    description:
      "Granular privacy settings for files and folders. Control who can view, download, or share your content with precision.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Download,
    title: "Batch Operations",
    description:
      "Efficiently manage multiple files with bulk upload, download, move, and delete operations. Save time with powerful batch tools.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Upload,
    title: "Drag & Drop",
    description:
      "Intuitive drag and drop interface for effortless file management. Support for multiple file types and large file uploads.",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    icon: Eye,
    title: "File Preview",
    description:
      "Preview files without downloading. Support for images, documents, videos, and more with built-in viewers.",
    gradient: "from-amber-500 to-yellow-500"
  },
  {
    icon: Settings,
    title: "Customizable Workflows",
    description:
      "Create custom automation rules, folder structures, and sharing policies to match your specific workflow needs.",
    gradient: "from-slate-500 to-gray-500"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional tools that solve real problems in file management and digital workspace organization
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Experience the power of YukiFiles with our comprehensive demo. Try all features and see how it can transform your file management workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary text-white hover:opacity-90 transition-opacity">
                Launch Demo
              </Button>
              <Button size="lg" variant="outline" className="border-2 bg-transparent hover:bg-muted/50">
                View Documentation
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
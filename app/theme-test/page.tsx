"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { useTheme } from "@/components/theme/theme-provider"
import { 
  Sun, Moon, Monitor, Sparkles, Upload, Shield, Zap, 
  Share2, Eye, BarChart3, Crown, Rocket, CheckCircle
} from "lucide-react"
import Link from "next/link"

export default function ThemeTestPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark")
  
  // Try to get theme from context, fallback to local state
  let themeContext: { theme: "light" | "dark" | "system"; setTheme: (theme: "light" | "dark" | "system") => void } | null = null
  
  try {
    themeContext = useTheme()
  } catch (error) {
    // Server-side or context not available, use local state
  }

  const currentTheme = themeContext?.theme || theme
  const [testInput, setTestInput] = useState("")

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
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Theme Test Page</h1>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-4 py-2 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-pink-500/20 dark:text-purple-300 dark:border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
                             Current Theme: {currentTheme}
            </Badge>
            <ThemeSwitcher isDesktop={true} />
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test the theme switching functionality and see how different UI elements look in light and dark modes.
          </p>
        </div>

        {/* Theme Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>Theme Information</span>
            </CardTitle>
            <CardDescription>
              Current theme settings and system information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center space-x-2 mb-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">Light Theme</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bright and clean interface for daytime use
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center space-x-2 mb-2">
                  <Moon className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Dark Theme</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Easy on the eyes for nighttime use
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center space-x-2 mb-2">
                  <Monitor className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">System Theme</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Follows your operating system preference
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UI Elements Test */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Test input fields and buttons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-input">Test Input</Label>
                <Input
                  id="test-input"
                  placeholder="Type something here..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button>Primary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="destructive">Destructive Button</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>Default Badge</Badge>
                <Badge variant="secondary">Secondary Badge</Badge>
                <Badge variant="outline">Outline Badge</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Background and text colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background border">
                  <div className="text-sm font-medium mb-2">Background</div>
                  <div className="text-xs text-muted-foreground">bg-background</div>
                </div>
                <div className="p-4 rounded-lg bg-card border">
                  <div className="text-sm font-medium mb-2">Card Background</div>
                  <div className="text-xs text-muted-foreground">bg-card</div>
                </div>
                <div className="p-4 rounded-lg bg-muted border">
                  <div className="text-sm font-medium mb-2">Muted Background</div>
                  <div className="text-xs text-muted-foreground">bg-muted</div>
                </div>
                <div className="p-4 rounded-lg bg-accent border">
                  <div className="text-sm font-medium mb-2">Accent Background</div>
                  <div className="text-xs text-muted-foreground">bg-accent</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-foreground">Foreground Text</div>
                <div className="text-muted-foreground">Muted Foreground Text</div>
                <div className="text-primary">Primary Text</div>
                <div className="text-secondary-foreground">Secondary Text</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">Feature Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gradient Elements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gradient Elements</CardTitle>
            <CardDescription>Test gradient backgrounds and text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <h3 className="text-lg font-semibold mb-2">Purple to Pink Gradient</h3>
                <p>This is a gradient background with white text</p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <h3 className="text-lg font-semibold mb-2">Blue to Cyan Gradient</h3>
                <p>This is a gradient background with white text</p>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Gradient Text Example
              </h2>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
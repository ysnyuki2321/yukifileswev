"use client"

import { useState } from "react"
import { CustomCheckbox, CheckboxGroup, AnimatedCheckbox } from "@/components/ui/custom-checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Star, Heart, Shield } from "lucide-react"

export default function CheckboxDemoPage() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>({
    default1: false,
    default2: true,
    gradient1: false,
    gradient2: true,
    glow1: false,
    glow2: true,
    size1: false,
    size2: false,
    size3: false,
    group1: false,
    group2: false,
    group3: false,
    animated1: false,
    animated2: false,
  })

  const handleCheckboxChange = (key: string, value: boolean) => {
    setCheckboxStates(prev => ({ ...prev, [key]: value }))
  }

  const simulateLoading = (key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [key]: false }))
      setCheckboxStates(prev => ({ ...prev, [key]: !prev[key] }))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Custom Checkbox Demo</h1>
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-gray-400 text-lg">
            Beautiful, animated checkboxes with multiple variants and effects
          </p>
        </div>

        {/* Variants Section */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>Checkbox Variants</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Different visual styles and animations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default Variant */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Default Variant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomCheckbox
                  checked={checkboxStates.default1}
                  onChange={(value) => handleCheckboxChange('default1', value)}
                  variant="default"
                >
                  Default unchecked
                </CustomCheckbox>
                <CustomCheckbox
                  checked={checkboxStates.default2}
                  onChange={(value) => handleCheckboxChange('default2', value)}
                  variant="default"
                >
                  Default checked
                </CustomCheckbox>
              </div>
            </div>

            {/* Gradient Variant */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Gradient Variant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomCheckbox
                  checked={checkboxStates.gradient1}
                  onChange={(value) => handleCheckboxChange('gradient1', value)}
                  variant="gradient"
                >
                  Gradient unchecked
                </CustomCheckbox>
                <CustomCheckbox
                  checked={checkboxStates.gradient2}
                  onChange={(value) => handleCheckboxChange('gradient2', value)}
                  variant="gradient"
                >
                  Gradient checked
                </CustomCheckbox>
              </div>
            </div>

            {/* Glow Variant */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Glow Variant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomCheckbox
                  checked={checkboxStates.glow1}
                  onChange={(value) => handleCheckboxChange('glow1', value)}
                  variant="glow"
                >
                  Glow unchecked
                </CustomCheckbox>
                <CustomCheckbox
                  checked={checkboxStates.glow2}
                  onChange={(value) => handleCheckboxChange('glow2', value)}
                  variant="glow"
                >
                  Glow checked
                </CustomCheckbox>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sizes Section */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-purple-400" />
              <span>Checkbox Sizes</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Different sizes for different use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CustomCheckbox
                checked={checkboxStates.size1}
                onChange={(value) => handleCheckboxChange('size1', value)}
                variant="gradient"
                size="sm"
              >
                Small size checkbox
              </CustomCheckbox>
              <CustomCheckbox
                checked={checkboxStates.size2}
                onChange={(value) => handleCheckboxChange('size2', value)}
                variant="gradient"
                size="md"
              >
                Medium size checkbox (default)
              </CustomCheckbox>
              <CustomCheckbox
                checked={checkboxStates.size3}
                onChange={(value) => handleCheckboxChange('size3', value)}
                variant="gradient"
                size="lg"
              >
                Large size checkbox
              </CustomCheckbox>
            </div>
          </CardContent>
        </Card>

        {/* Checkbox Group */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Heart className="w-5 h-5 text-purple-400" />
              <span>Checkbox Group</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Grouped checkboxes with consistent styling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CheckboxGroup className="space-y-3">
              <CustomCheckbox
                checked={checkboxStates.group1}
                onChange={(value) => handleCheckboxChange('group1', value)}
                variant="default"
              >
                Accept terms and conditions
              </CustomCheckbox>
              <CustomCheckbox
                checked={checkboxStates.group2}
                onChange={(value) => handleCheckboxChange('group2', value)}
                variant="gradient"
              >
                Subscribe to newsletter
              </CustomCheckbox>
              <CustomCheckbox
                checked={checkboxStates.group3}
                onChange={(value) => handleCheckboxChange('group3', value)}
                variant="glow"
              >
                Enable notifications
              </CustomCheckbox>
            </CheckboxGroup>
          </CardContent>
        </Card>

        {/* Animated Checkboxes */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>Animated Checkboxes</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Checkboxes with loading states and special animations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <AnimatedCheckbox
                checked={checkboxStates.animated1}
                onChange={(value) => handleCheckboxChange('animated1', value)}
                loading={loadingStates.animated1}
                loadingText="Processing..."
                variant="glow"
              >
                Click to simulate loading
              </AnimatedCheckbox>
              
              <div className="flex space-x-4">
                <Button
                  onClick={() => simulateLoading('animated1')}
                  disabled={loadingStates.animated1}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Simulate Loading
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatedCheckbox
                checked={checkboxStates.animated2}
                onChange={(value) => handleCheckboxChange('animated2', value)}
                loading={loadingStates.animated2}
                loadingText="Verifying..."
                variant="gradient"
              >
                Another animated checkbox
              </AnimatedCheckbox>
              
              <div className="flex space-x-4">
                <Button
                  onClick={() => simulateLoading('animated2')}
                  disabled={loadingStates.animated2}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Simulate Loading
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Interactive Demo</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Try different combinations and see the animations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['default', 'gradient', 'glow'].map((variant) => (
                <div key={variant} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300 capitalize">{variant} variant</h4>
                  <CustomCheckbox
                    variant={variant as any}
                    size="md"
                  >
                    Interactive {variant}
                  </CustomCheckbox>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Features</CardTitle>
            <CardDescription className="text-gray-400">
              What makes these checkboxes special
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Sparkles animation on check</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Hover effects and transitions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Multiple visual variants</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Different sizes available</span>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Loading states with spinners</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Keyboard accessibility</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Form integration ready</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Fully customizable</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
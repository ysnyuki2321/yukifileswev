"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCard, DollarSign, Bitcoin, Shield, CheckCircle,
  Clock, AlertCircle, Zap, Globe, Star, Crown,
  TrendingUp, Users, Database, Sparkles, Settings
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PaymentDemoProps {
  isDemoMode?: boolean
}

interface Transaction {
  id: string
  type: 'upgrade' | 'renewal' | 'storage'
  plan: string
  amount: number
  currency: string
  method: 'paypal' | 'stripe' | 'crypto'
  status: 'completed' | 'pending' | 'failed'
  date: string
  txHash?: string
}

export default function PaymentDemo({ isDemoMode = true }: PaymentDemoProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('pro')
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'stripe' | 'crypto'>('stripe')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)

  const plans = [
    {
      id: 'free' as const,
      name: 'Free Plan',
      price: 0,
      storage: '2GB',
      features: ['Basic file sharing', 'Standard security', 'Email support'],
      color: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      id: 'pro' as const,
      name: 'Pro Plan',
      price: 9.99,
      storage: '50GB',
      features: ['Advanced sharing', 'Priority support', 'AI tools', 'Collaboration'],
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise',
      price: 39.99,
      storage: '1TB',
      features: ['Unlimited sharing', '24/7 support', 'Custom branding', 'SSO', 'API access'],
      color: 'from-orange-500 to-red-500',
      popular: false
    }
  ]

  const paymentMethods = [
    {
      id: 'stripe' as const,
      name: 'Credit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex',
      fee: '2.9% + $0.30'
    },
    {
      id: 'paypal' as const,
      name: 'PayPal',
      icon: DollarSign,
      description: 'PayPal account or card',
      fee: '3.49% + $0.49'
    },
    {
      id: 'crypto' as const,
      name: 'Cryptocurrency',
      icon: Bitcoin,
      description: 'BTC, ETH, USDT',
      fee: '1.5% network fee'
    }
  ]

  const mockTransactions: Transaction[] = [
    {
      id: 'tx_001',
      type: 'upgrade',
      plan: 'Pro Plan',
      amount: 9.99,
      currency: 'USD',
      method: 'stripe',
      status: 'completed',
      date: '2024-01-15',
      txHash: 'ch_3P1234567890abcdef'
    },
    {
      id: 'tx_002',
      type: 'storage',
      plan: 'Extra Storage',
      amount: 4.99,
      currency: 'USD', 
      method: 'paypal',
      status: 'completed',
      date: '2024-01-10',
      txHash: 'PAY-1234567890ABCDEF'
    },
    {
      id: 'tx_003',
      type: 'renewal',
      plan: 'Pro Plan',
      amount: 0.00025,
      currency: 'BTC',
      method: 'crypto',
      status: 'pending',
      date: '2024-01-14',
      txHash: '0x1234...abcd'
    }
  ]

  const simulatePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock successful payment
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'upgrade',
      plan: plans.find(p => p.id === selectedPlan)?.name || 'Pro Plan',
      amount: plans.find(p => p.id === selectedPlan)?.price || 9.99,
      currency: selectedMethod === 'crypto' ? 'BTC' : 'USD',
      method: selectedMethod,
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      txHash: selectedMethod === 'stripe' ? 'ch_demo123' : 
               selectedMethod === 'paypal' ? 'PAY-DEMO123' : '0xdemo...123'
    }
    
    setIsProcessing(false)
    alert(`Payment successful! Transaction ID: ${newTransaction.txHash}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Pricing Plans */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Pricing Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full p-6 rounded-lg border transition-all ${
                    selectedPlan === plan.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-white mb-1">
                    ${plan.price}
                    <span className="text-lg text-gray-400">/month</span>
                  </div>
                  <p className="text-purple-300 text-sm mb-4">{plan.storage} storage</p>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {paymentMethods.map((method, methodIndex) => {
              const Icon = method.icon
              return (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedMethod === method.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-white font-medium mb-1">{method.name}</h3>
                  <p className="text-gray-400 text-xs mb-2">{method.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    Fee: {method.fee}
                  </Badge>
                </motion.button>
              )
            })}
          </div>

          {/* Payment Form */}
          <div className="bg-slate-800/30 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4">Complete Payment</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{plans.find(p => p.id === selectedPlan)?.name}</p>
                  <p className="text-gray-400 text-sm">{plans.find(p => p.id === selectedPlan)?.storage} storage</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl">
                    ${plans.find(p => p.id === selectedPlan)?.price}
                  </p>
                  <p className="text-gray-400 text-sm">per month</p>
                </div>
              </div>

              {selectedMethod === 'stripe' && (
                <div className="space-y-3">
                  <Input placeholder="Card Number" className="bg-slate-800/50 border-purple-500/20 text-white" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM/YY" className="bg-slate-800/50 border-purple-500/20 text-white" />
                    <Input placeholder="CVC" className="bg-slate-800/50 border-purple-500/20 text-white" />
                  </div>
                  <Input placeholder="Cardholder Name" className="bg-slate-800/50 border-purple-500/20 text-white" />
                </div>
              )}

              {selectedMethod === 'crypto' && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bitcoin className="w-5 h-5 text-orange-400" />
                    <span className="text-white font-medium">Crypto Payment</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    Send payment to: <code className="bg-slate-800 px-2 py-1 rounded text-orange-300">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-orange-400 font-bold">BTC</p>
                      <p className="text-xs text-gray-400">0.00025</p>
                    </div>
                    <div>
                      <p className="text-blue-400 font-bold">ETH</p>
                      <p className="text-xs text-gray-400">0.0045</p>
                    </div>
                    <div>
                      <p className="text-green-400 font-bold">USDT</p>
                      <p className="text-xs text-gray-400">9.99</p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={simulatePayment}
                disabled={isProcessing}
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
                  <Shield className="w-4 h-4 mr-2" />
                )}
                {isProcessing ? 'Processing Payment...' : `Pay with ${paymentMethods.find(m => m.id === selectedMethod)?.name}`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Transaction History
            </CardTitle>
            <Button
              onClick={() => setShowTransactions(!showTransactions)}
              size="sm"
              variant="outline"
              className="border-purple-500/30 text-purple-300"
            >
              {showTransactions ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </CardHeader>
        
        {showTransactions && (
          <CardContent>
            <div className="space-y-3">
              {mockTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                      tx.method === 'stripe' ? 'from-blue-500 to-blue-600' :
                      tx.method === 'paypal' ? 'from-blue-600 to-blue-700' :
                      'from-orange-500 to-orange-600'
                    } flex items-center justify-center`}>
                      {tx.method === 'stripe' ? <CreditCard className="w-5 h-5 text-white" /> :
                       tx.method === 'paypal' ? <DollarSign className="w-5 h-5 text-white" /> :
                       <Bitcoin className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{tx.plan}</p>
                      <p className="text-gray-400 text-sm">
                        {tx.amount} {tx.currency} • {tx.date}
                      </p>
                      <p className="text-gray-500 text-xs">ID: {tx.txHash}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(tx.status)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Payment Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">$24.97</div>
                <div className="text-xs text-gray-400">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">3</div>
                <div className="text-xs text-gray-400">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">Pro</div>
                <div className="text-xs text-gray-400">Current Plan</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">15</div>
                <div className="text-xs text-gray-400">Days Left</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Billing Info */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Billing Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-3">Current Usage</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Storage Used</span>
                    <span className="text-white">32.5 GB / 50 GB</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Bandwidth</span>
                    <span className="text-white">1.2 TB / 2 TB</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">API Calls</span>
                    <span className="text-white">8,450 / 10,000</span>
                  </div>
                  <Progress value={84.5} className="h-2" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Next Billing</h4>
              <div className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white font-medium">Pro Plan</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-white font-bold">$9.99</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Next Charge</span>
                  <span className="text-white">Feb 15, 2024</span>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
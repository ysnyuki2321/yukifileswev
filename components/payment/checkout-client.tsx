"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CreditCard, Bitcoin, Loader2, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"

interface CheckoutClientProps {
  userData: any
}

export default function CheckoutClient({ userData }: CheckoutClientProps) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "crypto">("paypal")
  const [cryptoCurrency, setCryptoCurrency] = useState<"BTC" | "LTC" | "ETH">("BTC")
  const [cryptoPayment, setCryptoPayment] = useState<any>(null)

  const handlePayPalPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payment/paypal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData.id, amount: 1.0 }),
      })

      const data = await response.json()

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        alert("Failed to create PayPal payment")
      }
    } catch (error) {
      console.error("PayPal payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCryptoPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payment/crypto/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData.id, currency: cryptoCurrency, amount: 1.0 }),
      })

      const data = await response.json()

      if (data.walletAddress) {
        setCryptoPayment(data)
      } else {
        alert("Failed to create crypto payment")
      }
    } catch (error) {
      console.error("Crypto payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/pricing" className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Pricing</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
              <span className="text-2xl font-bold text-white">YukiFiles</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Upgrade to Premium</h1>
            <p className="text-gray-400 text-lg">Get 5GB storage and premium features for just $1/month</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <div>
                    <h3 className="text-white font-medium">Premium Subscription</h3>
                    <p className="text-sm text-gray-400">1 Month Access</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">$1.00</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>$1.00</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-base pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span>$1.00 USD</span>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/50 rounded-lg p-4 mt-4">
                  <h4 className="text-purple-400 font-medium mb-2">What you'll get:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 5GB storage space (2.5x more)</li>
                    <li>• Premium gradient UI themes</li>
                    <li>• Priority customer support</li>
                    <li>• Advanced security features</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Payment Method</CardTitle>
                <CardDescription className="text-gray-400">Choose your preferred payment option</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                  <TabsList className="grid w-full grid-cols-2 bg-black/20">
                    <TabsTrigger value="paypal" className="data-[state=active]:bg-purple-500">
                      <CreditCard className="w-4 h-4 mr-2" />
                      PayPal
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="data-[state=active]:bg-purple-500">
                      <Bitcoin className="w-4 h-4 mr-2" />
                      Crypto
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="paypal" className="space-y-4 mt-6">
                    <div className="text-center">
                      <p className="text-gray-400 mb-4">Pay securely with PayPal</p>
                      <Button
                        onClick={handlePayPalPayment}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Pay with PayPal
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="crypto" className="space-y-4 mt-6">
                    {!cryptoPayment ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Select Cryptocurrency</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["BTC", "LTC", "ETH"].map((currency) => (
                              <Button
                                key={currency}
                                variant={cryptoCurrency === currency ? "default" : "outline"}
                                onClick={() => setCryptoCurrency(currency as any)}
                                className={
                                  cryptoCurrency === currency
                                    ? "bg-purple-500 hover:bg-purple-600"
                                    : "border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                                }
                              >
                                {currency}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={handleCryptoPayment}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-6 text-lg"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Payment...
                            </>
                          ) : (
                            <>
                              <Bitcoin className="mr-2 h-5 w-5" />
                              Pay with {cryptoCurrency}
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
                          <h4 className="text-yellow-400 font-medium mb-2">Payment Instructions</h4>
                          <p className="text-sm text-gray-300">
                            Send exactly{" "}
                            <strong>
                              {cryptoPayment.cryptoAmount} {cryptoPayment.currency}
                            </strong>{" "}
                            to the address below:
                          </p>
                        </div>

                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Wallet Address</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(cryptoPayment.walletAddress)}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="bg-black/40 rounded p-3 font-mono text-sm text-white break-all">
                            {cryptoPayment.walletAddress}
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Amount</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(cryptoPayment.cryptoAmount.toString())}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="bg-black/40 rounded p-3 font-mono text-sm text-white">
                            {cryptoPayment.cryptoAmount} {cryptoPayment.currency}
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-4">
                            Your account will be upgraded automatically once the payment is confirmed.
                          </p>
                          <Button
                            variant="outline"
                            className="border-purple-500 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Check Payment Status
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}

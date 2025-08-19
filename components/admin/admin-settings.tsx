"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, CreditCard, Bitcoin, Settings, Loader2 } from "lucide-react"

interface AdminSettingsProps {
  settings: Record<string, string>
}

export default function AdminSettings({ settings: initialSettings }: AdminSettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Settings save error:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="paypal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-black/20">
          <TabsTrigger value="paypal" className="data-[state=active]:bg-purple-500">
            <CreditCard className="w-4 h-4 mr-2" />
            PayPal
          </TabsTrigger>
          <TabsTrigger value="crypto" className="data-[state=active]:bg-purple-500">
            <Bitcoin className="w-4 h-4 mr-2" />
            Crypto
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-purple-500">
            <Settings className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="branding" className="data-[state=active]:bg-purple-500">
            <Settings className="w-4 h-4 mr-2" />
            Branding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paypal">
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">PayPal Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Configure PayPal API credentials for payment processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paypal_client_id" className="text-gray-300">
                  Client ID
                </Label>
                <Input
                  id="paypal_client_id"
                  value={settings.paypal_client_id || ""}
                  onChange={(e) => updateSetting("paypal_client_id", e.target.value)}
                  placeholder="Enter PayPal Client ID"
                  className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paypal_client_secret" className="text-gray-300">
                  Client Secret
                </Label>
                <Input
                  id="paypal_client_secret"
                  type="password"
                  value={settings.paypal_client_secret || ""}
                  onChange={(e) => updateSetting("paypal_client_secret", e.target.value)}
                  placeholder="Enter PayPal Client Secret"
                  className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  <strong>Note:</strong> Currently configured for sandbox environment. Change to production when ready
                  to go live.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto">
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Cryptocurrency Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Configure crypto wallet addresses and BlockCypher API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blockcypher_api_key" className="text-gray-300">
                  BlockCypher API Key
                </Label>
                <Input
                  id="blockcypher_api_key"
                  value={settings.blockcypher_api_key || ""}
                  onChange={(e) => updateSetting("blockcypher_api_key", e.target.value)}
                  placeholder="Enter BlockCypher API Key"
                  className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="btc_wallet_address" className="text-gray-300">
                  Bitcoin Wallet Address
                </Label>
                <Input
                  id="btc_wallet_address"
                  value={settings.btc_wallet_address || ""}
                  onChange={(e) => updateSetting("btc_wallet_address", e.target.value)}
                  placeholder="Enter BTC wallet address"
                  className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ltc_wallet_address" className="text-gray-300">
                  Litecoin Wallet Address
                </Label>
                <Input
                  id="ltc_wallet_address"
                  value={settings.ltc_wallet_address || ""}
                  onChange={(e) => updateSetting("ltc_wallet_address", e.target.value)}
                  placeholder="Enter LTC wallet address"
                  className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eth_wallet_address" className="text-gray-300">
                  Ethereum Wallet Address
                </Label>
                <Input
                  id="eth_wallet_address"
                  value={settings.eth_wallet_address || ""}
                  onChange={(e) => updateSetting("eth_wallet_address", e.target.value)}
                  placeholder="Enter ETH wallet address"
                  className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">System Configuration</CardTitle>
              <CardDescription className="text-gray-400">Configure pricing and quota settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_price_usd" className="text-gray-300">
                    Monthly Price (USD)
                  </Label>
                  <Input
                    id="monthly_price_usd"
                    type="number"
                    step="0.01"
                    value={settings.monthly_price_usd || "1.00"}
                    onChange={(e) => updateSetting("monthly_price_usd", e.target.value)}
                    className="bg-black/20 border-gray-700 text-white focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free_quota_gb" className="text-gray-300">
                    Free Quota (GB)
                  </Label>
                  <Input
                    id="free_quota_gb"
                    type="number"
                    value={settings.free_quota_gb || "2"}
                    onChange={(e) => updateSetting("free_quota_gb", e.target.value)}
                    className="bg-black/20 border-gray-700 text-white focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paid_quota_gb" className="text-gray-300">
                  Paid Quota (GB)
                </Label>
                <Input
                  id="paid_quota_gb"
                  type="number"
                  value={settings.paid_quota_gb || "5"}
                  onChange={(e) => updateSetting("paid_quota_gb", e.target.value)}
                  className="bg-black/20 border-gray-700 text-white focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_url" className="text-gray-300">
                    Site URL
                  </Label>
                  <Input
                    id="site_url"
                    value={settings.site_url || ""}
                    onChange={(e) => updateSetting("site_url", e.target.value)}
                    placeholder="https://yourdomain.com"
                    className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support_email" className="text-gray-300">
                    Support Email
                  </Label>
                  <Input
                    id="support_email"
                    value={settings.support_email || ""}
                    onChange={(e) => updateSetting("support_email", e.target.value)}
                    placeholder="support@yourdomain.com"
                    className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase_url" className="text-gray-300">
                    Supabase URL
                  </Label>
                  <Input
                    id="supabase_url"
                    value={settings.supabase_url || ""}
                    onChange={(e) => updateSetting("supabase_url", e.target.value)}
                    placeholder="https://xxxx.supabase.co"
                    className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supabase_anon_key" className="text-gray-300">
                    Supabase Anon Key
                  </Label>
                  <Input
                    id="supabase_anon_key"
                    type="password"
                    value={settings.supabase_anon_key || ""}
                    onChange={(e) => updateSetting("supabase_anon_key", e.target.value)}
                    placeholder="eyJ..."
                    className="bg-black/20 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Branding & Theme</CardTitle>
              <CardDescription className="text-gray-400">Customize brand name, logo, and theme colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand_name" className="text-gray-300">
                    Brand Name
                  </Label>
                  <Input
                    id="brand_name"
                    value={settings.brand_name || "YukiFiles"}
                    onChange={(e) => updateSetting("brand_name", e.target.value)}
                    className="bg-black/20 border-gray-700 text-white focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary_gradient" className="text-gray-300">
                    Primary Gradient
                  </Label>
                  <Input
                    id="primary_gradient"
                    value={settings.primary_gradient || "linear-gradient(135deg,#8b5cf6,#22d3ee,#ec4899)"}
                    onChange={(e) => updateSetting("primary_gradient", e.target.value)}
                    className="bg-black/20 border-gray-700 text-white focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accent_glow" className="text-gray-300">
                    Accent Glow (rgba)
                  </Label>
                  <Input
                    id="accent_glow"
                    value={settings.accent_glow || "rgba(139,92,246,0.3)"}
                    onChange={(e) => updateSetting("accent_glow", e.target.value)}
                    className="bg-black/20 border-gray-700 text-white focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card_bg" className="text-gray-300">
                    Card Background (css)
                  </Label>
                  <Input
                    id="card_bg"
                    value={settings.card_bg || "linear-gradient(135deg,rgba(0,0,0,0.6),rgba(30,0,50,0.4),rgba(0,20,40,0.6))"}
                    onChange={(e) => updateSetting("card_bg", e.target.value)}
                    className="bg-black/20 border-gray-700 text-white focus:border-purple-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className={`${
            saved
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          } px-8`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

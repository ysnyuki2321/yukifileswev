"use server"

import { createServerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

// Helper function to get the current site URL
function getCurrentSiteUrl(): string {
  // Try to get from environment variable first
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // Try to get from Vercel URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Try to get from headers (for production)
  try {
    const headersList = headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'http'
    if (host) {
      return `${protocol}://${host}`
    }
  } catch (error) {
    console.warn("Could not get site URL from headers:", error)
  }
  
  // Fallback to localhost for development
  return "http://localhost:3000"
}

interface PayPalConfig {
  clientId: string
  clientSecret: string
  environment: "sandbox" | "production"
}

interface CryptoConfig {
  apiKey: string
  btcAddress: string
  ltcAddress: string
  ethAddress: string
}

export async function getPaymentConfig(): Promise<{ paypal: PayPalConfig | null; crypto: CryptoConfig | null }> {
  const supabase = createServerClient()
  if (!supabase) {
    return { paypal: null, crypto: null }
  }

  try {
    const { data: settings } = await supabase.from("admin_settings").select("*")

    if (!settings) {
      return { paypal: null, crypto: null }
    }

    const settingsMap = settings.reduce(
      (acc, setting) => {
        acc[setting.setting_key] = setting.setting_value
        return acc
      },
      {} as Record<string, string>,
    )

    const paypal = settingsMap.paypal_client_id
      ? {
          clientId: settingsMap.paypal_client_id,
          clientSecret: settingsMap.paypal_client_secret || "",
          environment: "sandbox" as const, // Change to production when ready
        }
      : null

    const crypto = settingsMap.blockcypher_api_key
      ? {
          apiKey: settingsMap.blockcypher_api_key,
          btcAddress: settingsMap.btc_wallet_address || "",
          ltcAddress: settingsMap.ltc_wallet_address || "",
          ethAddress: settingsMap.eth_wallet_address || "",
        }
      : null

    return { paypal, crypto }
  } catch (error) {
    console.error("Failed to get payment config:", error)
    return { paypal: null, crypto: null }
  }
}

export async function createPayPalOrder(userId: string, amount = 1.0) {
  const supabase = createServerClient()
  if (!supabase) {
    throw new Error("Database connection failed")
  }

  const { paypal } = await getPaymentConfig()
  if (!paypal) {
    throw new Error("PayPal not configured")
  }

  try {
    // Get PayPal access token
    const tokenResponse = await fetch(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${paypal.clientId}:${paypal.clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get current site URL
    const currentSiteUrl = getCurrentSiteUrl()

    // Create PayPal order
    const orderResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
            },
            description: "YukiFiles Premium Subscription - 1 Month",
          },
        ],
        application_context: {
          return_url: `${currentSiteUrl}/payment/success`,
          cancel_url: `${currentSiteUrl}/payment/cancel`,
        },
      }),
    })

    const orderData = await orderResponse.json()

    if (orderData.id) {
      // Save transaction record
      await supabase.from("transactions").insert({
        user_id: userId,
        payment_method: "paypal",
        payment_id: orderData.id,
        amount: amount,
        currency: "USD",
        status: "pending",
      })

      return { orderId: orderData.id, approvalUrl: orderData.links.find((link: any) => link.rel === "approve")?.href }
    }

    throw new Error("Failed to create PayPal order")
  } catch (error) {
    console.error("PayPal order creation error:", error)
    throw error
  }
}

export async function capturePayPalOrder(orderId: string) {
  const supabase = createServerClient()
  if (!supabase) {
    throw new Error("Database connection failed")
  }

  const { paypal } = await getPaymentConfig()
  if (!paypal) {
    throw new Error("PayPal not configured")
  }

  try {
    // Get PayPal access token
    const tokenResponse = await fetch(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${paypal.clientId}:${paypal.clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Capture the order
    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const captureData = await captureResponse.json()

    if (captureData.status === "COMPLETED") {
      // Update transaction status
      const { data: transaction } = await supabase
        .from("transactions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          metadata: captureData,
        })
        .eq("payment_id", orderId)
        .select("user_id")
        .single()

      if (transaction) {
        // Upgrade user to premium
        await upgradeUserToPremium(transaction.user_id)
      }

      return { success: true, captureId: captureData.id }
    }

    throw new Error("Payment capture failed")
  } catch (error) {
    console.error("PayPal capture error:", error)
    throw error
  }
}

export async function createCryptoPayment(userId: string, currency: "BTC" | "LTC" | "ETH", amount = 1.0) {
  const supabase = createServerClient()
  if (!supabase) {
    throw new Error("Database connection failed")
  }

  const { crypto } = await getPaymentConfig()
  if (!crypto) {
    throw new Error("Crypto payments not configured")
  }

  try {
    // Get current crypto price (mock implementation)
    const cryptoAmount = await getCryptoAmount(currency, amount)
    const walletAddress = getWalletAddress(currency, crypto)

    if (!walletAddress) {
      throw new Error(`${currency} wallet not configured`)
    }

    // Create transaction record
    const { data: transaction } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        payment_method: "crypto",
        amount: amount,
        currency: "USD",
        crypto_currency: currency,
        crypto_address: walletAddress,
        status: "pending",
        metadata: {
          crypto_amount: cryptoAmount,
          wallet_address: walletAddress,
        },
      })
      .select()
      .single()

    return {
      transactionId: transaction.id,
      walletAddress,
      cryptoAmount,
      currency,
    }
  } catch (error) {
    console.error("Crypto payment creation error:", error)
    throw error
  }
}

async function getCryptoAmount(currency: string, usdAmount: number): Promise<number> {
  // Mock crypto prices - in production, use real API like CoinGecko
  const mockPrices = {
    BTC: 45000,
    LTC: 100,
    ETH: 2500,
  }

  const price = mockPrices[currency as keyof typeof mockPrices] || 1
  return Number((usdAmount / price).toFixed(8))
}

function getWalletAddress(currency: string, config: CryptoConfig): string {
  switch (currency) {
    case "BTC":
      return config.btcAddress
    case "LTC":
      return config.ltcAddress
    case "ETH":
      return config.ethAddress
    default:
      return ""
  }
}

export async function upgradeUserToPremium(userId: string) {
  const supabase = createServerClient()
  if (!supabase) {
    throw new Error("Database connection failed")
  }

  try {
    // Calculate expiration date (1 month from now)
    const expirationDate = new Date()
    expirationDate.setMonth(expirationDate.getMonth() + 1)

    // Update user subscription
    await supabase
      .from("users")
      .update({
        subscription_type: "paid",
        subscription_expires_at: expirationDate.toISOString(),
        quota_limit: 5368709120, // 5GB in bytes
      })
      .eq("id", userId)

    console.log(`[v0] User ${userId} upgraded to premium`)
    return { success: true }
  } catch (error) {
    console.error("Failed to upgrade user:", error)
    throw error
  }
}

export async function checkCryptoPayment(transactionId: string) {
  const supabase = createServerClient()
  if (!supabase) {
    throw new Error("Database connection failed")
  }

  try {
    const { data: transaction } = await supabase.from("transactions").select("*").eq("id", transactionId).single()

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    // Mock verification - in production, use BlockCypher API
    const isConfirmed = Math.random() > 0.5 // 50% chance for demo

    if (isConfirmed) {
      await supabase
        .from("transactions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", transactionId)

      await upgradeUserToPremium(transaction.user_id)
      return { confirmed: true }
    }

    return { confirmed: false }
  } catch (error) {
    console.error("Crypto payment check error:", error)
    throw error
  }
}

export async function getSiteUrl() {
  try {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'http'
    
    if (host) {
      return `${protocol}://${host}`
    }
    
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  } catch (error) {
    console.error('Error getting site URL:', error)
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  }
}

export async function getPaymentSettings() {
  const supabase = createServerClient()
  if (!supabase) return null
  
  try {
    const { data: settings } = await supabase.from("admin_settings").select("*")
    
    if (!settings) return null
    
    const paymentSettings = settings.reduce((acc: any, setting: any) => {
      acc[setting.setting_key] = setting.setting_value
      return acc
    }, {})
    
    return paymentSettings
  } catch (error) {
    console.error("Error fetching payment settings:", error)
    return null
  }
}

"use server"

import { createServerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

interface DeviceFingerprint {
  userAgent: string
  screen: string
  timezone: string
  language: string
  platform: string
  cookieEnabled: boolean
  doNotTrack: string
  canvas: string
  webgl: string
}

interface IPInfo {
  ip: string
  country: string
  region: string
  city: string
  isp: string
  proxy: boolean
  vpn: boolean
  tor: boolean
  hosting: boolean
  residential: boolean
}

// Mock IP detection service (in production, use services like IPQualityScore, MaxMind, etc.)
async function detectIPInfo(ip: string): Promise<IPInfo> {
  // This is a mock implementation
  // In production, integrate with services like:
  // - IPQualityScore API
  // - MaxMind GeoIP2
  // - IPGeolocation API

  console.log(`[v0] Checking IP: ${ip}`)

  // Mock detection logic
  const isVPN = ip.includes("192.168") || ip.includes("10.") || ip.includes("172.") ? false : Math.random() > 0.8
  const isProxy = Math.random() > 0.9
  const isResidential = !isVPN && !isProxy && Math.random() > 0.2

  return {
    ip,
    country: "US",
    region: "California",
    city: "San Francisco",
    isp: "Example ISP",
    proxy: isProxy,
    vpn: isVPN,
    tor: false,
    hosting: false,
    residential: isResidential,
  }
}

export async function checkAntiClone(
  email: string,
  deviceFingerprint: DeviceFingerprint,
  action = "register",
): Promise<{ allowed: boolean; reason?: string; riskScore: number }> {
  const supabase = createServerClient()
  if (!supabase) {
    return { allowed: false, reason: "Database connection failed", riskScore: 100 }
  }

  const headersList = headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "127.0.0.1"

  const userAgent = headersList.get("user-agent") || ""

  console.log(`[v0] Anti-clone check for ${email} from IP ${ip}`)

  let riskScore = 0
  const reasons: string[] = []

  try {
    // 1. Check IP information
    const ipInfo = await detectIPInfo(ip)

    if (ipInfo.vpn) {
      riskScore += 50
      reasons.push("VPN detected")
    }

    if (ipInfo.proxy) {
      riskScore += 40
      reasons.push("Proxy detected")
    }

    if (!ipInfo.residential) {
      riskScore += 30
      reasons.push("Non-residential IP")
    }

    // 2. Check for existing users with same IP
    const { data: sameIPUsers } = await supabase
      .from("users")
      .select("email, created_at")
      .eq("registration_ip", ip)
      .neq("email", email)

    if (sameIPUsers && sameIPUsers.length > 0) {
      riskScore += 40
      reasons.push(`${sameIPUsers.length} accounts from same IP`)
    }

    // 3. Check device fingerprint similarity
    const fingerprintString = JSON.stringify(deviceFingerprint)
    const { data: similarDevices } = await supabase
      .from("users")
      .select("email, device_fingerprint")
      .neq("email", email)
      .not("device_fingerprint", "is", null)

    if (similarDevices) {
      for (const user of similarDevices) {
        if (user.device_fingerprint) {
          const similarity = calculateFingerprintSimilarity(fingerprintString, user.device_fingerprint)
          if (similarity > 0.8) {
            riskScore += 60
            reasons.push(`Similar device fingerprint to ${user.email}`)
            break
          }
        }
      }
    }

    // 4. Check recent IP logs for suspicious activity
    const { data: recentLogs } = await supabase
      .from("ip_logs")
      .select("*")
      .eq("ip_address", ip)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

    if (recentLogs && recentLogs.length > 10) {
      riskScore += 20
      reasons.push("High activity from IP")
    }

    // 5. Log this check
    await supabase.from("ip_logs").insert({
      user_id: null, // Will be set after user creation
      ip_address: ip,
      user_agent: userAgent,
      device_fingerprint: fingerprintString,
      is_vpn: ipInfo.vpn,
      is_proxy: ipInfo.proxy,
      is_residential: ipInfo.residential,
      country_code: ipInfo.country,
      action: action,
    })

    // Decision logic
    const allowed = riskScore < 70 // Threshold for blocking

    console.log(`[v0] Risk score: ${riskScore}, Allowed: ${allowed}, Reasons: ${reasons.join(", ")}`)

    return {
      allowed,
      reason: allowed ? undefined : reasons.join(", "),
      riskScore,
    }
  } catch (error) {
    console.error("Anti-clone check error:", error)
    return { allowed: true, reason: "Check failed, allowing", riskScore: 0 }
  }
}

function calculateFingerprintSimilarity(fp1: string, fp2: string): number {
  try {
    const obj1 = JSON.parse(fp1)
    const obj2 = JSON.parse(fp2)

    let matches = 0
    let total = 0

    for (const key in obj1) {
      total++
      if (obj1[key] === obj2[key]) {
        matches++
      }
    }

    return total > 0 ? matches / total : 0
  } catch {
    return 0
  }
}

export async function logUserActivity(userId: string, action: string, metadata?: any) {
  const supabase = createServerClient()
  if (!supabase) return

  const headersList = headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "127.0.0.1"
  const userAgent = headersList.get("user-agent") || ""

  try {
    const ipInfo = await detectIPInfo(ip)

    await supabase.from("ip_logs").insert({
      user_id: userId,
      ip_address: ip,
      user_agent: userAgent,
      is_vpn: ipInfo.vpn,
      is_proxy: ipInfo.proxy,
      is_residential: ipInfo.residential,
      country_code: ipInfo.country,
      action: action,
      metadata: metadata || {},
    })
  } catch (error) {
    console.error("Failed to log user activity:", error)
  }
}

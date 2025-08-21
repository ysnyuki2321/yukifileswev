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
  asn?: string
  org?: string
}

// IP detection service with optional external API; falls back to strict mock
async function detectIPInfo(ip: string): Promise<IPInfo> {
  try {
    const apiUrl = process.env.ANTI_ABUSE_API_URL
    const apiKey = process.env.ANTI_ABUSE_API_KEY
    if (apiUrl && apiKey) {
      const res = await fetch(`${apiUrl}?ip=${encodeURIComponent(ip)}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      })
      if (res.ok) {
        const j = await res.json()
        const hostingFlags = Boolean(
          j.hosting || j.is_datacenter || j.datacenter || j.is_hosting || j.asnType === "hosting" || j.is_cloud,
        )
        const residential = j.residential !== undefined ? Boolean(j.residential) : !(hostingFlags || j.proxy || j.vpn)
        return {
          ip,
          country: j.country || "",
          region: j.region || "",
          city: j.city || "",
          isp: j.isp || j.organization || "",
          proxy: Boolean(j.proxy || j.is_proxy),
          vpn: Boolean(j.vpn || j.is_vpn),
          tor: Boolean(j.tor || j.is_tor),
          hosting: hostingFlags,
          residential,
          asn: j.asn || j.ASN,
          org: j.organization || j.org,
        }
      }
    }
  } catch (e) {
    console.warn("[anti-clone] External IP check failed; falling back", e)
  }

  // Strict fallback defaults leaning on risk
  const isVPN = !(ip.includes("192.168") || ip.includes("10.") || ip.includes("172.")) && Math.random() > 0.6
  const isProxy = Math.random() > 0.7
  const isResidential = !isVPN && !isProxy && Math.random() > 0.5

  return {
    ip,
    country: "",
    region: "",
    city: "",
    isp: "",
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
  const supabase = await createServerClient()
  if (!supabase) {
    return { allowed: false, reason: "Database connection failed", riskScore: 100 }
  }

  const headersList = headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "127.0.0.1"

  const userAgent = headersList.get("user-agent") || ""

  console.log(`[v0] Anti-clone check for ${email} from IP ${ip}`)

  // Check if debug mode is enabled - bypass all checks
  try {
    const { data: settings } = await supabase.from("admin_settings").select("setting_key, setting_value")
    const map = (settings || []).reduce((acc: Record<string, string>, s: any) => {
      acc[s.setting_key] = s.setting_value
      return acc
    }, {} as Record<string, string>)
    if (map["debug_mode"] === "true") {
      console.log(`[v0] Debug mode enabled - bypassing anti-clone checks for ${email}`)
      return { allowed: true, reason: "Debug mode", riskScore: 0 }
    }
  } catch (e) {
    console.warn("[v0] Failed to check debug mode setting:", e)
  }

  let riskScore = 0
  const reasons: string[] = []

  try {
    // 1. Check IP information
    const ipInfo = await detectIPInfo(ip)

    const strictness = Number(process.env.ANTI_CLONE_STRICTNESS || 1) // 0=loose,1=normal,2=strict
    const vpnPenalty = strictness === 0 ? 15 : strictness === 2 ? 70 : 40
    const proxyPenalty = strictness === 0 ? 8 : strictness === 2 ? 55 : 25
    const nonResPenalty = strictness === 0 ? 5 : strictness === 2 ? 45 : 20
    const dcPenalty = strictness === 0 ? 25 : strictness === 2 ? 80 : 55

    if (ipInfo.vpn) {
      riskScore += vpnPenalty
      reasons.push("VPN detected")
    }

    if (ipInfo.proxy) {
      riskScore += proxyPenalty
      reasons.push("Proxy detected")
    }

    if (!ipInfo.residential) {
      riskScore += nonResPenalty
      reasons.push("Non-residential IP")
    }

    if (ipInfo.hosting) {
      riskScore += dcPenalty
      reasons.push("Datacenter network")
    }

    // 2. Check for existing users with same IP
    const { data: sameIPUsers } = await supabase
      .from("users")
      .select("email, created_at")
      .eq("registration_ip", ip)
      .neq("email", email)

    if (sameIPUsers && sameIPUsers.length > 0) {
      riskScore += Math.min(20 + sameIPUsers.length * 10, 60)
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
            riskScore += 70
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
      riskScore += 35
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

    // Decision logic (configurable threshold; relaxed default if unset)
    const threshold = Number(process.env.CLONE_PROTECTION_THRESHOLD || 85)
    const allowed = riskScore < threshold

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
  const supabase = await createServerClient()
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

// Basic per-identifier rate limit using `ip_logs` as storage.
// Resets automatically by querying the last `windowSeconds`.
export async function checkRateLimit(
  identifier: { ip: string; email?: string },
  action: "login" | "register",
  limit = 10,
  windowSeconds = 60 * 60,
): Promise<{ allowed: boolean; remaining: number; resetSeconds: number }> {
  const supabase = await createServerClient()
  if (!supabase) return { allowed: true, remaining: limit, resetSeconds: windowSeconds }

  const sinceISO = new Date(Date.now() - windowSeconds * 1000).toISOString()
  const attemptAction = action === "login" ? "login_attempt" : "register_attempt"

  // Count attempts in the window for this IP (and email if provided)
  let query = supabase
    .from("ip_logs")
    .select("id, created_at", { count: "exact", head: false })
    .eq("ip_address", identifier.ip)
    .eq("action", attemptAction)
    .gte("created_at", sinceISO)

  if (identifier.email) {
    // Note: we cannot filter by email directly (not stored). We rely on metadata
  }

  const { data } = await query
  const attempts = data ? data.length : 0

  const allowed = attempts < limit
  const remaining = Math.max(limit - attempts, 0)

  // Compute reset seconds based on earliest attempt in window
  let resetSeconds = windowSeconds
  if (data && data.length > 0) {
    const first = data[0]
    const firstTs = new Date(first.created_at).getTime()
    const elapsed = Math.floor((Date.now() - firstTs) / 1000)
    resetSeconds = Math.max(windowSeconds - elapsed, 0)
  }

  return { allowed, remaining, resetSeconds }
}

export async function logRateLimitAttempt(ip: string, userAgent: string, fingerprint: string | null, action: "login" | "register") {
  const supabase = await createServerClient()
  if (!supabase) return
  const attemptAction = action === "login" ? "login_attempt" : "register_attempt"
  await supabase.from("ip_logs").insert({
    user_id: null,
    ip_address: ip,
    user_agent: userAgent,
    device_fingerprint: fingerprint || undefined,
    is_vpn: false,
    is_proxy: false,
    is_residential: true,
    country_code: null,
    action: attemptAction,
  })
}

export async function getClientInfo() {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "127.0.0.1"
  const userAgent = headersList.get("user-agent") || ""
  
  return { ip, userAgent }
}

export async function logClientInfo() {
  const supabase = await createServerClient()
  if (!supabase) return
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "127.0.0.1"
  const userAgent = headersList.get("user-agent") || ""
  
  try {
    await supabase.from("ip_logs").insert({
      ip_address: ip,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
      action: "page_visit"
    })
  } catch (error) {
    console.error("Error logging client info:", error)
  }
}
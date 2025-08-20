export type PlanName = "free" | "paid" | "developer" | "team" | "enterprise"

export interface PlanConfig {
  name: PlanName
  quotaBytes: number | null // null = unlimited (enterprise configurable)
  uploadLimitBytes: number | null
  maxAccounts: number | null
  defaultExpiryDays: number | null // null = no auto-expire
  streamQuality: "720p" | "1080p" | "2160p" | "custom"
}

export const PLAN_CONFIG: Record<PlanName, PlanConfig> = {
  free: {
    name: "free",
    quotaBytes: 2 * 1024 * 1024 * 1024,
    uploadLimitBytes: 200 * 1024 * 1024,
    maxAccounts: 1,
    defaultExpiryDays: 30,
    streamQuality: "720p",
  },
  paid: {
    name: "paid",
    quotaBytes: 5 * 1024 * 1024 * 1024,
    uploadLimitBytes: 500 * 1024 * 1024,
    maxAccounts: 2,
    defaultExpiryDays: null,
    streamQuality: "1080p",
  },
  developer: {
    name: "developer",
    quotaBytes: 8 * 1024 * 1024 * 1024,
    uploadLimitBytes: 1024 * 1024 * 1024,
    maxAccounts: 3,
    defaultExpiryDays: null,
    streamQuality: "1080p",
  },
  team: {
    name: "team",
    quotaBytes: 10 * 1024 * 1024 * 1024,
    uploadLimitBytes: 1024 * 1024 * 1024,
    maxAccounts: null,
    defaultExpiryDays: null,
    streamQuality: "2160p",
  },
  enterprise: {
    name: "enterprise",
    quotaBytes: null,
    uploadLimitBytes: null,
    maxAccounts: null,
    defaultExpiryDays: null,
    streamQuality: "custom",
  },
}

export function resolvePlanFromUserRow(user: any): PlanConfig {
  const planKey = (user?.plan || user?.subscription_type || "free")?.toLowerCase() || "free"
  const plan = (PLAN_CONFIG as any)[planKey] || PLAN_CONFIG.free
  return plan
}

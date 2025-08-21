import { User, PlanName } from "@/lib/types"

export interface PlanConfig {
  name: string
  quotaBytes: number
  uploadLimitBytes: number | null
  maxAccounts: number
}

export const PLAN_CONFIG: Record<PlanName, PlanConfig> = {
  free: {
    name: "Free",
    quotaBytes: 2 * 1024 * 1024 * 1024, // 2GB
    uploadLimitBytes: 100 * 1024 * 1024, // 100MB per file
    maxAccounts: 1,
  },
  pro: {
    name: "Pro",
    quotaBytes: 50 * 1024 * 1024 * 1024, // 50GB
    uploadLimitBytes: 500 * 1024 * 1024, // 500MB per file
    maxAccounts: 1,
  },
  developer: {
    name: "Developer",
    quotaBytes: 200 * 1024 * 1024 * 1024, // 200GB
    uploadLimitBytes: 1024 * 1024 * 1024, // 1GB per file
    maxAccounts: 3,
  },
  team: {
    name: "Team",
    quotaBytes: 1024 * 1024 * 1024 * 1024, // 1TB
    uploadLimitBytes: 2 * 1024 * 1024 * 1024, // 2GB per file
    maxAccounts: 10,
  },
  enterprise: {
    name: "Enterprise",
    quotaBytes: 10 * 1024 * 1024 * 1024 * 1024, // 10TB
    uploadLimitBytes: null, // No limit
    maxAccounts: 100,
  },
}

export function resolvePlanFromUserRow(user: User | null): PlanConfig {
  if (!user) return PLAN_CONFIG.free
  
  const planKey = (user.plan || user.subscription_type || "free").toLowerCase() as PlanName
  const plan = PLAN_CONFIG[planKey] || PLAN_CONFIG.free
  return plan
}

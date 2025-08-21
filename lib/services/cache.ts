// Simple in-memory cache with TTL support
interface CacheItem<T> {
  data: T
  expires: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { data, expires })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
const cache = new MemoryCache()

// Cleanup expired items every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => cache.cleanup(), 5 * 60 * 1000)
}

export { cache }

// Cache keys for different data types
export const CACHE_KEYS = {
  USER_DATA: (userId: string) => `user:${userId}`,
  USER_FILES: (userId: string) => `files:${userId}`,
  ADMIN_SETTINGS: 'admin:settings',
  PAYMENT_CONFIG: 'payment:config',
  ANALYTICS_STATS: (timeframe: string) => `analytics:${timeframe}`,
  FILE_METADATA: (fileId: string) => `file:${fileId}`,
  PLAN_CONFIG: 'plans:config',
} as const

// Cached wrapper functions
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetcher()
  
  // Store in cache
  cache.set(key, data, ttl)
  
  return data
}

// Invalidate related cache entries
export function invalidateCache(pattern: string): void {
  const keys = Array.from(cache['cache'].keys())
  const keysToDelete = keys.filter(key => key.includes(pattern))
  keysToDelete.forEach(key => cache.delete(key))
}

// Cache warming functions
export async function warmCache(): Promise<void> {
  try {
    // Pre-warm commonly accessed data
    console.log('Warming cache with commonly accessed data...')
    
    // You can add specific cache warming logic here
    // For example, pre-load admin settings, plan configs, etc.
  } catch (error) {
    console.error('Cache warming failed:', error)
  }
}
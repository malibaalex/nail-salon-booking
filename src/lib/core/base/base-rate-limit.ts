import "server-only"

export type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
}

export type RateLimitStore = {
  consume: (key: string, limit: number, windowMs: number) => Promise<RateLimitResult>
}

export const createMemoryRateLimitStore = (): RateLimitStore => {
  const records = new Map<string, { count: number; resetAt: number }>()

  return {
    async consume(key, limit, windowMs) {
      const now = Date.now()
      let record = records.get(key)

      if (!record || record.resetAt <= now) {
        record = {
          count: 0,
          resetAt: now + windowMs,
        }

        records.set(key, record)
      }

      const allowed = record.count < limit

      if (allowed) {
        record.count++
      }

      return {
        allowed,
        limit,
        remaining: Math.max(0, limit - record.count),
        resetAt: record.resetAt,
      }
    },
  }
}

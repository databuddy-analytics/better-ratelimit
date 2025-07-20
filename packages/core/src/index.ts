import { RateLimiter, type RateLimiterOptions } from "./core/rate-limiter"
import { MemoryStore, type MemoryStoreOptions } from "./adapters/memory"
import { RedisAdapter, type RedisAdapterOptions } from "./adapters/redis"
import type { RateLimitStore } from "./types"

export type { RateLimitConfig, RateLimitResult, RateLimitStore, RateLimitOptions, StoreOptions } from "./types"
export { RateLimiter, type RateLimiterOptions } from "./core/rate-limiter"

export { MemoryStore, type MemoryStoreOptions } from "./adapters/memory"
export { RedisAdapter, type RedisAdapterOptions } from "./adapters/redis"

export { withRateLimiter, type ElysiaContext, type ElysiaApp, type ElysiaRateLimitOptions } from "./plugins/elysia"
export { withRateLimiter as withHonoRateLimiter, type HonoRateLimitOptions } from "./plugins/hono"
export { createRateLimitHandler, createNextJSRateLimiter, type NextJSRateLimitOptions } from "./plugins/nextjs"

export { parseDuration, formatDuration } from "./utils/duration"
export { getClientIP, getIPKey, isPrivateIP, getClientIPWithContext, type RequestContext } from "./utils/ip"

export { getStrategy, registerStrategy, getAvailableStrategies, type StrategyName } from "./strategies"
export { FixedWindowStrategy, SlidingWindowStrategy, ApproximatedSlidingWindowStrategy, type RateLimitStrategy } from "./strategies"

export function createRateLimiter(store?: RateLimitStore, options?: Partial<RateLimiterOptions>) {
    const defaultStore = store || new MemoryStore()
    return new RateLimiter(defaultStore, { limit: 100, duration: "1m", ...options })
}

// Convenience factory functions
export function createMemoryRateLimiter(limit: number, duration: string, options?: Partial<RateLimiterOptions & MemoryStoreOptions>) {
    return new RateLimiter(new MemoryStore(options), { limit, duration, ...options })
}

export function createRedisRateLimiter(url: string, limit: number, duration: string, options?: Partial<RateLimiterOptions & RedisAdapterOptions>) {
    return new RateLimiter(new RedisAdapter({ url, ...options }), { limit, duration, ...options })
}

export default createRateLimiter 
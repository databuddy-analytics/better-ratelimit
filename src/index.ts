import { RateLimiter } from "./core/rate-limiter"
import { MemoryStore } from "./adapters/memory"
import { RedisAdapter } from "./adapters/redis"
import type { RateLimitStore } from "./types"

export type { RateLimitConfig, RateLimitResult, RateLimitStore, RateLimitOptions, StoreOptions } from "./types"
export { RateLimiter, type RateLimiterOptions } from "./core/rate-limiter"

export { MemoryStore, type MemoryStoreOptions } from "./adapters/memory"
export { RedisAdapter, type RedisAdapterOptions } from "./adapters/redis"

export { withRateLimiter, type ElysiaContext, type ElysiaApp, type ElysiaRateLimitOptions } from "./plugins/elysia"

export { parseDuration, formatDuration } from "./utils/duration"
export { getClientIP, getIPKey, isPrivateIP, getClientIPWithContext, type RequestContext } from "./utils/ip"

export { getStrategy, registerStrategy, getAvailableStrategies, type StrategyName } from "./strategies"
export { FixedWindowStrategy, SlidingWindowStrategy, ApproximatedSlidingWindowStrategy, type RateLimitStrategy } from "./strategies"

export function createRateLimiter(store?: RateLimitStore) {
    const defaultStore = store || new MemoryStore()
    return new RateLimiter(defaultStore)
}

// Convenience factory functions
export function createMemoryRateLimiter(options?: any) {
    return new RateLimiter(new MemoryStore(options))
}

export function createRedisRateLimiter(url: string, options?: any) {
    return new RateLimiter(new RedisAdapter({ url, ...options }))
}

export default createRateLimiter 
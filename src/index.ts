export type { RateLimitConfig, RateLimitResult, RateLimitStore, RateLimitOptions, StoreOptions } from "./types"
export { RateLimiter, type RateLimiterOptions } from "./core/rate-limiter"

export { MemoryStore, type MemoryStoreOptions } from "./adapters/memory"

export { withRateLimiter, type ElysiaContext, type ElysiaApp, type ElysiaRateLimitOptions } from "./plugins/elysia"

export { parseDuration, formatDuration } from "./utils/duration"
export { getClientIP, getIPKey, isPrivateIP, getClientIPWithContext, type RequestContext } from "./utils/ip"

export { getStrategy, registerStrategy, getAvailableStrategies, type StrategyName } from "./strategies"
export { FixedWindowStrategy, SlidingWindowStrategy, type RateLimitStrategy } from "./strategies"

import { RateLimiter } from "./core/rate-limiter"
import { MemoryStore } from "./adapters/memory"
import type { RateLimitStore } from "./types"

export function createRateLimiter(store?: RateLimitStore) {
    const defaultStore = store || new MemoryStore()
    return new RateLimiter(defaultStore)
}

export default createRateLimiter 
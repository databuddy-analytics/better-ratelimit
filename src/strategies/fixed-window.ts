import type { RateLimitConfig, RateLimitResult } from "../types"
import type { RateLimitStrategy } from "./base"
import { parseDuration } from "../utils/duration"

export class FixedWindowStrategy implements RateLimitStrategy {
    name = "fixed-window"

    check(current: number, config: RateLimitConfig): RateLimitResult {
        const now = Date.now()
        const windowSize = parseDuration(config.duration)
        const windowStart = Math.floor(now / windowSize) * windowSize
        const windowEnd = windowStart + windowSize

        const allowed = current <= config.limit
        const remaining = Math.max(0, config.limit - current)

        return {
            allowed,
            remaining,
            resetTime: windowEnd,
            limit: config.limit,
            key: config.key,
            metadata: {
                strategy: this.name,
                windowStart,
                windowEnd,
                currentWindow: Math.floor(now / windowSize)
            }
        }
    }

    shouldReset(current: number, config: RateLimitConfig): boolean {
        const now = Date.now()
        const windowSize = parseDuration(config.duration)
        const currentWindow = Math.floor(now / windowSize)
        const lastWindow = Math.floor((now - windowSize) / windowSize)
        return currentWindow > lastWindow
    }
} 
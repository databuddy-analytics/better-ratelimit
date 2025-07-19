import type { RateLimitConfig, RateLimitResult } from "../types"
import type { RateLimitStrategy } from "./base"
import { parseDuration } from "../utils/duration"

export class SlidingWindowStrategy implements RateLimitStrategy {
    name = "sliding-window"

    check(current: number, config: RateLimitConfig): RateLimitResult {
        const now = Date.now()
        const windowSize = parseDuration(config.duration)
        const windowStart = now - windowSize

        const allowed = current <= config.limit
        const remaining = Math.max(0, config.limit - current)

        return {
            allowed,
            remaining,
            resetTime: now,
            limit: config.limit,
            key: config.key,
            metadata: {
                strategy: this.name,
                windowStart,
                windowEnd: now,
                windowSize
            }
        }
    }

    shouldReset(current: number, config: RateLimitConfig): boolean {
        return false
    }
} 
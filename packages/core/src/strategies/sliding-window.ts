import type { RateLimitConfig, RateLimitResult, RateLimitStrategy } from "../types"
import { parseDuration } from "../utils/duration"

export class SlidingWindowStrategy implements RateLimitStrategy {
    readonly name = "sliding-window"

    constructor(private readonly getNow: () => number = () => Date.now()) { }

    check(current: number, config: RateLimitConfig): RateLimitResult {
        const now = this.getNow()
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
                ...config.metadata,
                strategy: this.name,
                windowStart,
                windowEnd: now,
                windowSize
            }
        }
    }

    shouldReset(_current: number, _config: RateLimitConfig): boolean {
        return false
    }
} 
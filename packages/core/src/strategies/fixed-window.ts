import type { RateLimitConfig, RateLimitResult, RateLimitStrategy } from "../types"
import { parseDuration } from "../utils/duration"

export class FixedWindowStrategy implements RateLimitStrategy {
    readonly name = "fixed-window"

    constructor(private readonly getNow: () => number = () => Date.now()) { }

    check(current: number, config: RateLimitConfig): RateLimitResult {
        const now = this.getNow()
        const windowSize = parseDuration(config.duration)
        const currentWindow = Math.floor(now / windowSize)
        const windowStart = currentWindow * windowSize
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
                ...config.metadata, // Include user-provided metadata
                strategy: this.name,
                windowStart,
                windowEnd,
                currentWindow
            }
        }
    }

    shouldReset(current: number, config: RateLimitConfig): boolean {
        const now = this.getNow()
        const windowSize = parseDuration(config.duration)
        const currentWindow = Math.floor(now / windowSize)
        const lastWindow = Math.floor((now - windowSize) / windowSize)
        return currentWindow > lastWindow
    }
} 
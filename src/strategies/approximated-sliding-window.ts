import type { RateLimitConfig, RateLimitResult, RateLimitStrategy } from "../types"
import { parseDuration } from "../utils/duration"

export class ApproximatedSlidingWindowStrategy implements RateLimitStrategy {
    readonly name = "approximated-sliding-window"

    constructor(private readonly getNow: () => number = () => Date.now()) { }

    check(current: number, config: RateLimitConfig): RateLimitResult {
        const now = this.getNow()
        const windowSize = parseDuration(config.duration)
        const windowCount = 10
        const subWindowSize = windowSize / windowCount

        const currentSubWindow = Math.floor(now / subWindowSize)
        const windowStart = currentSubWindow * subWindowSize
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
                subWindowSize,
                windowCount,
                currentSubWindow
            }
        }
    }

    shouldReset(current: number, config: RateLimitConfig): boolean {
        const now = this.getNow()
        const windowSize = parseDuration(config.duration)
        const subWindowSize = windowSize / 10
        const currentSubWindow = Math.floor(now / subWindowSize)
        const lastSubWindow = Math.floor((now - subWindowSize) / subWindowSize)

        return currentSubWindow > lastSubWindow
    }
} 
import { Effect } from "effect"
import type { RateLimitConfig, RateLimitResult, RateLimitStore, RateLimitOptions } from "../types"
import { parseDuration } from "../utils/duration"
import { getStrategy, type StrategyName } from "../strategies"

export interface RateLimiterOptions {
    limit: number
    duration: string
    strategy?: StrategyName
    burst?: number
    prefix?: string
    metadata?: Record<string, unknown>
    onLimit?: (result: RateLimitResult) => void
    onSuccess?: (result: RateLimitResult) => void
}

export class RateLimiter {
    private options: Required<RateLimiterOptions>

    constructor(
        private store: RateLimitStore,
        options: RateLimiterOptions
    ) {
        this.options = {
            strategy: "fixed-window",
            burst: 0,
            prefix: "",
            metadata: {},
            onLimit: () => { },
            onSuccess: () => { },
            ...options
        }
    }

    async check(key: string): Promise<RateLimitResult> {
        const ttl = parseDuration(this.options.duration)

        // Increment first to get the new count atomically
        const current = await this.store.increment(key, ttl)

        const strategy = Effect.runSync(getStrategy(this.options.strategy))

        // Check if the incremented value is allowed
        const result = strategy.check(current, {
            key,
            limit: this.options.limit,
            duration: this.options.duration,
            strategy: this.options.strategy,
            burst: this.options.burst,
            prefix: this.options.prefix,
            metadata: this.options.metadata
        })

        if (result.allowed) {
            this.options.onSuccess(result)
        } else {
            const currentValue = await this.store.get(key) || 0
            if (currentValue > 0) {
                await this.store.set(key, currentValue - 1, ttl)
            }
            this.options.onLimit(result)
        }

        return result
    }

    withStore(store: RateLimitStore): RateLimiter {
        return new RateLimiter(store, this.options)
    }

    withOptions(options: Partial<RateLimiterOptions>): RateLimiter {
        return new RateLimiter(this.store, { ...this.options, ...options })
    }

    withStrategy(strategyName: StrategyName): RateLimiter {
        return new RateLimiter(this.store, { ...this.options, strategy: strategyName })
    }

    updateOptions(newOptions: Partial<RateLimiterOptions>): void {
        Object.assign(this.options, newOptions)
    }

    getOptions(): RateLimiterOptions {
        return { ...this.options }
    }

    async isAllowed(key: string): Promise<boolean> {
        const result = await this.check(key)
        return result.allowed
    }

    async getRemaining(key: string): Promise<number> {
        const result = await this.check(key)
        return result.remaining
    }

    async getResetTime(key: string): Promise<number> {
        const result = await this.check(key)
        return result.resetTime
    }

    async getInfo(key: string): Promise<{ allowed: boolean; remaining: number; resetTime: number; limit: number }> {
        const result = await this.check(key)
        return {
            allowed: result.allowed,
            remaining: result.remaining,
            resetTime: result.resetTime,
            limit: result.limit
        }
    }
} 
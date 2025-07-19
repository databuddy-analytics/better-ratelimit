import { Effect } from "effect"
import type { RateLimitConfig, RateLimitResult, RateLimitStore, RateLimitOptions } from "../types"
import { parseDuration } from "../utils/duration"
import { getStrategy, type StrategyName } from "../strategies"

export interface RateLimiterOptions {
    defaultStrategy?: StrategyName
    defaultBurst?: number
    defaultPrefix?: string
    onLimit?: (result: RateLimitResult) => void
    onSuccess?: (result: RateLimitResult) => void
    metadata?: Record<string, unknown>
}

export class RateLimiter {
    private options: Required<RateLimiterOptions>

    constructor(
        private store: RateLimitStore,
        options: RateLimiterOptions = {}
    ) {
        this.options = {
            defaultStrategy: "fixed-window",
            defaultBurst: 0,
            defaultPrefix: "rate-limit",
            onLimit: () => { },
            onSuccess: () => { },
            metadata: {},
            ...options
        }
    }

    async check(config: RateLimitConfig): Promise<RateLimitResult> {
        const ttl = parseDuration(config.duration)
        const current = await this.store.increment(config.key, ttl)

        const strategyName = config.strategy || this.options.defaultStrategy
        const strategy = Effect.runSync(getStrategy(strategyName))

        const result = strategy.check(current, {
            ...config,
            strategy: strategyName
        })

        result.metadata = {
            ...this.options.metadata,
            ...config.metadata,
            strategy: strategyName,
            burst: config.burst || this.options.defaultBurst,
            prefix: config.prefix || this.options.defaultPrefix
        }

        if (result.allowed) {
            this.options.onSuccess(result)
        } else {
            this.options.onLimit(result)
        }

        return result
    }

    async checkWithOptions(options: RateLimitOptions, key: string): Promise<RateLimitResult> {
        return this.check({
            key,
            limit: options.limit,
            duration: options.duration,
            strategy: options.strategy || this.options.defaultStrategy,
            burst: options.burst || this.options.defaultBurst,
            prefix: options.prefix || this.options.defaultPrefix,
            metadata: {
                ...this.options.metadata,
                ...options.metadata
            }
        })
    }

    async checkWithStrategy(strategyName: StrategyName, config: RateLimitConfig): Promise<RateLimitResult> {
        return this.check({
            ...config,
            strategy: strategyName
        })
    }

    withStore(store: RateLimitStore): RateLimiter {
        return new RateLimiter(store, this.options)
    }

    withOptions(options: Partial<RateLimiterOptions>): RateLimiter {
        return new RateLimiter(this.store, { ...this.options, ...options })
    }

    withStrategy(strategyName: StrategyName): RateLimiter {
        return new RateLimiter(this.store, { ...this.options, defaultStrategy: strategyName })
    }

    updateOptions(newOptions: Partial<RateLimiterOptions>): void {
        Object.assign(this.options, newOptions)
    }

    getOptions(): RateLimiterOptions {
        return { ...this.options }
    }
} 
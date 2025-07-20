import type { RateLimitResult, RateLimitStore } from "../types"
import type { StrategyName } from "../strategies"
import { RateLimiter } from "../core/rate-limiter"
import { MemoryStore } from "../adapters/memory"
import { getIPKey } from "../utils/ip"
import type { Context, Next } from "hono"

export interface HonoRateLimitOptions {
    key?: (ctx: Context) => string
    limit: number
    duration: string
    strategy?: StrategyName
    burst?: number
    prefix?: string
    metadata?: Record<string, unknown>
    store?: RateLimitStore
    onLimit?: (ctx: Context, result: RateLimitResult) => void
    onSuccess?: (ctx: Context, result: RateLimitResult) => void
    headers?: {
        enabled?: boolean
        prefix?: string
        includeMetadata?: boolean
    }
    response?: {
        status?: number
        message?: string
        includeHeaders?: boolean
    }
}

export function withRateLimiter(options: HonoRateLimitOptions) {
    const store = options.store || new MemoryStore()
    const rateLimiter = new RateLimiter(store, {
        limit: options.limit,
        duration: options.duration,
        strategy: options.strategy,
        burst: options.burst,
        prefix: options.prefix,
        metadata: options.metadata
    })

    const headerOptions = {
        enabled: true,
        prefix: "X-RateLimit",
        includeMetadata: false,
        ...options.headers
    }

    const responseOptions = {
        status: 429,
        message: "Too Many Requests",
        includeHeaders: true,
        ...options.response
    }

    return async (ctx: Context, next: Next) => {
        const key = options.key ? options.key(ctx) : getIPKey({ ip: ctx.req.header("x-forwarded-for") || ctx.req.header("x-real-ip") || "unknown" })

        const result = await rateLimiter.check(key)

        if (headerOptions.enabled) {
            const prefix = headerOptions.prefix
            ctx.header(`${prefix}-Limit`, result.limit.toString())
            ctx.header(`${prefix}-Remaining`, result.remaining.toString())
            ctx.header(`${prefix}-Reset`, new Date(result.resetTime).toISOString())

            if (headerOptions.includeMetadata && result.metadata) {
                ctx.header(`${prefix}-Metadata`, JSON.stringify(result.metadata))
            }
        }

        if (!result.allowed) {
            if (options.onLimit) {
                options.onLimit(ctx, result)
            }

            return ctx.json({
                error: responseOptions.message,
                retryAfter: new Date(result.resetTime).toISOString(),
                remaining: result.remaining,
                limit: result.limit
            }, responseOptions.status as 429)
        }

        if (options.onSuccess) {
            options.onSuccess(ctx, result)
        }

        await next()
    }
} 
import type { RateLimitResult, RateLimitStore } from "../types"
import type { StrategyName } from "../strategies"
import { RateLimiter } from "../core/rate-limiter"
import { MemoryStore } from "../adapters/memory"
import { getIPKey, getClientIP, type RequestContext } from "../utils/ip"
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

    // Only include strategy if it's defined to avoid overriding the default
    const rateLimiterOptions: any = {
        limit: options.limit,
        duration: options.duration,
        burst: options.burst,
        prefix: options.prefix,
        metadata: options.metadata
    }

    if (options.strategy) {
        rateLimiterOptions.strategy = options.strategy
    }

    const rateLimiter = new RateLimiter(store, rateLimiterOptions)

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
        // Create proper request context with all headers
        const requestContext: RequestContext = {
            ip: getClientIP({
                headers: ctx.req.header(),
                ip: ctx.req.header("x-forwarded-for") || ctx.req.header("x-real-ip")
            }),
            headers: ctx.req.header()
        }

        const key = options.key ? options.key(ctx) : getIPKey(requestContext)

        const result = await rateLimiter.check(key)

        const shouldSetHeaders = headerOptions.enabled &&
            (result.allowed || (responseOptions.includeHeaders && !result.allowed))

        if (shouldSetHeaders) {
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
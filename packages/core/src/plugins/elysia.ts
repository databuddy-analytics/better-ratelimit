import type { RateLimitResult, RateLimitStore } from "../types"
import type { StrategyName } from "../strategies"
import { RateLimiter } from "../core/rate-limiter"
import { MemoryStore } from "../adapters/memory"
import { getIPKey, getClientIP, type RequestContext } from "../utils/ip"

export interface ElysiaContext extends RequestContext {
    set: {
        status: number
        headers: Record<string, string>
    }
}

export interface ElysiaRateLimitOptions {
    key?: (ctx: ElysiaContext) => string
    limit: number
    duration: string
    strategy?: StrategyName
    burst?: number
    prefix?: string
    metadata?: Record<string, unknown>
    store?: RateLimitStore
    onLimit?: (ctx: ElysiaContext, result: RateLimitResult) => void
    onSuccess?: (ctx: ElysiaContext, result: RateLimitResult) => void
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

export interface ElysiaApp {
    onRequest: (handler: (ctx: ElysiaContext) => Promise<string | undefined>) => ElysiaApp
}

export function withRateLimiter(options: ElysiaRateLimitOptions) {
    const store = options.store || new MemoryStore()

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

    return (app: ElysiaApp) => {
        return app.onRequest(async (ctx: ElysiaContext) => {
            // Create proper request context with all headers
            const requestContext: RequestContext = {
                ip: getClientIP({
                    headers: ctx.headers || {},
                    ip: ctx.headers?.["x-forwarded-for"] || ctx.headers?.["x-real-ip"]
                }),
                headers: ctx.headers || {}
            }

            const key = options.key ? options.key(ctx) : getIPKey(requestContext)

            const result = await rateLimiter.check(key)

            const shouldSetHeaders = headerOptions.enabled &&
                (result.allowed || (responseOptions.includeHeaders && !result.allowed))

            if (shouldSetHeaders) {
                const prefix = headerOptions.prefix
                ctx.set.headers[`${prefix}-Limit`] = result.limit.toString()
                ctx.set.headers[`${prefix}-Remaining`] = result.remaining.toString()
                ctx.set.headers[`${prefix}-Reset`] = new Date(result.resetTime).toISOString()

                if (headerOptions.includeMetadata && result.metadata) {
                    ctx.set.headers[`${prefix}-Metadata`] = JSON.stringify(result.metadata)
                }
            }

            if (!result.allowed) {
                ctx.set.status = responseOptions.status

                if (options.onLimit) {
                    options.onLimit(ctx, result)
                }

                return responseOptions.message
            }

            if (options.onSuccess) {
                options.onSuccess(ctx, result)
            }
        })
    }
} 
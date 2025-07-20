import type { BaseRateLimitOptions } from "../types"
import { RateLimiter } from "../core/rate-limiter"
import { MemoryStore } from "../adapters/memory"
import { getIPKey } from "../utils/ip"

export interface BasePluginOptions<T = unknown> extends BaseRateLimitOptions<T> {
    setHeader: (ctx: T, name: string, value: string) => void
    json: (ctx: T, data: unknown, status?: number) => unknown
    getHeaders: (ctx: T) => Record<string, string>
    getIP: (ctx: T) => string
}

export function createRateLimitMiddleware<T>(options: BasePluginOptions<T>) {
    const store = options.store || new MemoryStore()

    const rateLimiterOptions = {
        limit: options.limit,
        duration: options.duration,
        strategy: options.strategy || "fixed-window",
        burst: options.burst || 0,
        prefix: options.prefix || "",
        metadata: options.metadata || {}
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

    return async (ctx: T) => {
        const headers = options.getHeaders(ctx)
        const key = options.key ? options.key(ctx) : getIPKey(headers)

        const result = await rateLimiter.check(key)

        const shouldSetHeaders = headerOptions.enabled &&
            (result.allowed || (responseOptions.includeHeaders && !result.allowed))

        if (shouldSetHeaders) {
            const prefix = headerOptions.prefix
            options.setHeader(ctx, `${prefix}-Limit`, result.limit.toString())
            options.setHeader(ctx, `${prefix}-Remaining`, result.remaining.toString())
            options.setHeader(ctx, `${prefix}-Reset`, new Date(result.resetTime).toISOString())

            if (headerOptions.includeMetadata && result.metadata) {
                options.setHeader(ctx, `${prefix}-Metadata`, JSON.stringify(result.metadata))
            }
        }

        if (!result.allowed) {
            if (options.onLimit) {
                options.onLimit(ctx, result)
            }

            return options.json(ctx, {
                error: responseOptions.message,
                retryAfter: new Date(result.resetTime).toISOString(),
                remaining: result.remaining,
                limit: result.limit
            }, responseOptions.status as 429)
        }

        if (options.onSuccess) {
            options.onSuccess(ctx, result)
        }

        return undefined
    }
} 
import type { RateLimitResult, RateLimitStore } from "../types"
import type { StrategyName } from "../strategies"
import { getClientIP } from "../utils/ip"
import { RateLimiter } from "../core/rate-limiter"
import { MemoryStore } from "../adapters/memory"

export interface NextJSRateLimitOptions {
    key?: (headers: Record<string, string>) => string
    limit: number
    duration: string
    strategy?: StrategyName
    burst?: number
    prefix?: string
    metadata?: Record<string, unknown>
    store?: RateLimitStore
    onLimit?: (result: RateLimitResult) => void
    onSuccess?: (result: RateLimitResult) => void
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

// Removed the problematic middleware function

// Simple approach that works with headers directly
export function createRateLimitHandler(options: NextJSRateLimitOptions) {
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

    return async (headers: Record<string, string>): Promise<{ allowed: boolean; result: RateLimitResult; headers: Record<string, string> }> => {
        const key = options.key ? options.key(headers) : getClientIP(headers)
        const result = await rateLimiter.check(key)

        const headerOptions = {
            enabled: true,
            prefix: "X-RateLimit",
            includeMetadata: false,
            ...options.headers
        }

        const responseHeaders: Record<string, string> = {}

        if (headerOptions.enabled) {
            const prefix = headerOptions.prefix
            responseHeaders[`${prefix}-Limit`] = result.limit.toString()
            responseHeaders[`${prefix}-Remaining`] = result.remaining.toString()
            responseHeaders[`${prefix}-Reset`] = new Date(result.resetTime).toISOString()

            if (headerOptions.includeMetadata && result.metadata) {
                responseHeaders[`${prefix}-Metadata`] = JSON.stringify(result.metadata)
            }
        }

        if (!result.allowed) {
            if (options.onLimit) {
                options.onLimit(result)
            }
        } else if (options.onSuccess) {
            options.onSuccess(result)
        }

        return {
            allowed: result.allowed,
            result,
            headers: responseHeaders
        }
    }
}

export function createNextJSRateLimiter(options: Omit<NextJSRateLimitOptions, 'store'>) {
    return createRateLimitHandler({
        ...options,
        store: new MemoryStore()
    })
} 
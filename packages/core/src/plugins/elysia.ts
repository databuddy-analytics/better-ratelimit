import type { RateLimitResult, RateLimitStore } from "../types"
import type { StrategyName } from "../strategies"
import { createRateLimitMiddleware } from "./base"
import { getClientIP } from "../utils/ip"

export interface ElysiaContext {
    headers?: Record<string, string>
    set: {
        status: number
        headers: Record<string, string>
    }
}

export interface ElysiaApp {
    onRequest: (handler: (ctx: ElysiaContext) => Promise<string | undefined>) => ElysiaApp
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

export function withRateLimiter(options: ElysiaRateLimitOptions) {
    const middleware = createRateLimitMiddleware({
        ...options,
        setHeader: (ctx, name, value) => {
            ctx.set.headers[name] = value
        },
        json: (ctx, data, status) => {
            ctx.set.status = status || 429
            const responseData = data as { error?: string }
            return responseData.error || "Too Many Requests"
        },
        getHeaders: (ctx) => ctx.headers || {},
        getIP: (ctx) => getClientIP(ctx.headers || {})
    })

    return (app: ElysiaApp) => {
        return app.onRequest(async (ctx: ElysiaContext) => {
            const result = await middleware(ctx)
            return result as string | undefined
        })
    }
} 
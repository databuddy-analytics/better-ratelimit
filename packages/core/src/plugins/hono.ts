import type { RateLimitResult, RateLimitStore } from "../types"
import type { StrategyName } from "../strategies"
import type { Context, Next } from "hono"
import { createRateLimitMiddleware } from "./base"
import { getClientIP } from "../utils/ip"

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
    const middleware = createRateLimitMiddleware({
        ...options,
        setHeader: (ctx, name, value) => {
            ctx.header(name, value)
        },
        json: (ctx, data, status) => {
            return ctx.json(data as Record<string, unknown>, status as 429)
        },
        getHeaders: (ctx) => ctx.req.header(),
        getIP: (ctx) => getClientIP(ctx.req.header())
    })

    return async (ctx: Context, next: Next): Promise<void | Response> => {
        const result = await middleware(ctx)
        if (result) {
            return result as Response
        }
        await next()
    }
} 
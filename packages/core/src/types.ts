import type { StrategyName } from "./strategies"

export interface RateLimitConfig {
    key: string
    limit: number
    duration: string
    strategy?: StrategyName
    burst?: number
    prefix?: string
    metadata?: Record<string, unknown>
}

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetTime: number
    limit: number
    key: string
    metadata?: Record<string, unknown>
}

export interface RateLimitStore {
    get(key: string): Promise<number | null>
    set(key: string, value: number, ttl: number): Promise<void>
    increment(key: string, ttl: number): Promise<number>
}

export interface RateLimitOptions {
    limit: number
    duration: string
    strategy?: StrategyName
    burst?: number
    prefix?: string
    metadata?: Record<string, unknown>
    onLimit?: (result: RateLimitResult) => void
    onSuccess?: (result: RateLimitResult) => void
}

export interface StoreOptions {
    maxSize?: number
    defaultTTL?: number
    cleanupInterval?: number
    enableStats?: boolean
}

export interface RateLimitStrategy {
    name: string
    check(current: number, config: RateLimitConfig): RateLimitResult
    shouldReset(current: number, config: RateLimitConfig): boolean
}

export interface BaseRateLimitOptions<T = unknown> {
    key?: (ctx: T) => string
    limit: number
    duration: string
    strategy?: StrategyName
    burst?: number
    prefix?: string
    metadata?: Record<string, unknown>
    store?: RateLimitStore
    onLimit?: (ctx: T, result: RateLimitResult) => void
    onSuccess?: (ctx: T, result: RateLimitResult) => void
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

export interface PluginContext {
    setHeader: (name: string, value: string) => void
    json: (data: unknown, status?: number) => unknown
    next: () => Promise<void>
    getHeaders: () => Record<string, string>
    getIP: () => string
}

export interface PluginAdapter<T = unknown> {
    createContext(ctx: T): PluginContext
    getRequestHeaders(ctx: T): Record<string, string>
    getClientIP(ctx: T): string
} 
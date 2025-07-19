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
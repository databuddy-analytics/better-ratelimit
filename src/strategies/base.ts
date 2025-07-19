import type { RateLimitConfig, RateLimitResult } from "../types"

export interface RateLimitStrategy {
    name: string
    check(current: number, config: RateLimitConfig): RateLimitResult
    shouldReset(current: number, config: RateLimitConfig): boolean
} 
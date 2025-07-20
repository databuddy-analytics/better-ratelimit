import type { RateLimitStore } from "../../types"
import { detectRuntime } from "./utils/detectRuntime"
import { parseRedisUrl } from "./utils/parseRedisUrl"
import { createRedisClient } from "./clients"

export interface RedisAdapterOptions {
    url: string
    prefix?: string
}

export class RedisAdapter implements RateLimitStore {
    private client: any
    private prefix: string

    constructor(options: RedisAdapterOptions) {
        const { url, prefix = "ratelimit" } = options
        const config = parseRedisUrl(url)
        const runtime = detectRuntime()

        this.client = createRedisClient(config, runtime)
        this.prefix = prefix
    }

    async get(key: string): Promise<number | null> {
        const fullKey = this.getFullKey(key)
        const value = await this.client.get(fullKey)
        return value ? parseInt(value, 10) : null
    }

    async set(key: string, value: number, ttl: number): Promise<void> {
        const fullKey = this.getFullKey(key)
        await this.client.set(fullKey, value.toString(), { ttl })
    }

    async increment(key: string, ttl: number): Promise<number> {
        const fullKey = this.getFullKey(key)
        const result = await this.client.incr(fullKey)

        if (result === 1) {
            await this.client.expire(fullKey, ttl)
        }

        return result
    }

    private getFullKey(key: string): string {
        return `${this.prefix}:${key}`
    }

    async close(): Promise<void> {
        if (this.client && typeof this.client.disconnect === 'function') {
            await this.client.disconnect()
        }
    }
} 
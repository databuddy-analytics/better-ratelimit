import type { Runtime } from "../utils/detectRuntime"
import type { RedisConfig } from "../utils/parseRedisUrl"

export interface InternalRedisClient {
    get(key: string): Promise<string | null>
    set(key: string, value: string, options?: { ttl?: number }): Promise<void>
    incr(key: string): Promise<number>
    expire(key: string, ttl: number): Promise<void>
    disconnect?(): Promise<void>
}

export function createRedisClient(config: RedisConfig, runtime: Runtime): InternalRedisClient {
    switch (runtime) {
        case "edge":
            return createUpstashRedisClient(config)
        case "bun":
        case "node":
        default:
            return createNodeRedisClient(config)
    }
}



function createNodeRedisClient(config: RedisConfig): InternalRedisClient {
    try {
        const { createClient } = require("@redis/client")

        const client = createClient({
            socket: {
                host: config.host,
                port: config.port,
                tls: config.tls
            },
            password: config.password || undefined,
            database: config.database || 0
        })

        client.connect()

        return {
            async get(key: string) {
                try {
                    return await client.get(key)
                } catch (error) {
                    throw new Error(`Redis GET failed: ${error}`)
                }
            },
            async set(key: string, value: string, options?: { ttl?: number }) {
                try {
                    if (options?.ttl) {
                        await client.setEx(key, options.ttl, value)
                    } else {
                        await client.set(key, value)
                    }
                } catch (error) {
                    throw new Error(`Redis SET failed: ${error}`)
                }
            },
            async incr(key: string) {
                try {
                    return await client.incr(key)
                } catch (error) {
                    throw new Error(`Redis INCR failed: ${error}`)
                }
            },
            async expire(key: string, ttl: number) {
                try {
                    await client.expire(key, ttl)
                } catch (error) {
                    throw new Error(`Redis EXPIRE failed: ${error}`)
                }
            },
            async disconnect() {
                try {
                    await client.disconnect()
                } catch (error) {
                    // Ignore disconnect errors
                }
            }
        }
    } catch (error) {
        throw new Error(`Node Redis not available: ${error}`)
    }
}

function createUpstashRedisClient(config: RedisConfig): InternalRedisClient {
    try {
        const { Redis } = require("@upstash/redis")

        const client = new Redis({
            url: `redis://${config.host}:${config.port}`,
            token: config.password
        })

        return {
            async get(key: string) {
                return await client.get(key)
            },
            async set(key: string, value: string, options?: { ttl?: number }) {
                if (options?.ttl) {
                    await client.setex(key, options.ttl, value)
                } else {
                    await client.set(key, value)
                }
            },
            async incr(key: string) {
                return await client.incr(key)
            },
            async expire(key: string, ttl: number) {
                await client.expire(key, ttl)
            }
        }
    } catch (error) {
        throw new Error(`Upstash Redis not available: ${error}`)
    }
} 
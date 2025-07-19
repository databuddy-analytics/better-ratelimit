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
        case "bun":
            return createBunRedisClient(config)
        case "edge":
            return createUpstashRedisClient(config)
        case "node":
        default:
            return createNodeRedisClient(config)
    }
}

function createBunRedisClient(config: RedisConfig): InternalRedisClient {
    try {
        const { connect } = require("bun:redis")

        const client = connect({
            hostname: config.host,
            port: config.port,
            password: config.password,
            db: config.database,
            tls: config.tls
        })

        return {
            async get(key: string) {
                return await client.get(key)
            },
            async set(key: string, value: string, options?: { ttl?: number }) {
                if (options?.ttl) {
                    await client.set(key, value, { ex: options.ttl })
                } else {
                    await client.set(key, value)
                }
            },
            async incr(key: string) {
                return await client.incr(key)
            },
            async expire(key: string, ttl: number) {
                await client.expire(key, ttl)
            },
            async disconnect() {
                await client.quit()
            }
        }
    } catch (error) {
        throw new Error(`Bun Redis not available: ${error}`)
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
            password: config.password,
            database: config.database
        })

        client.connect()

        return {
            async get(key: string) {
                return await client.get(key)
            },
            async set(key: string, value: string, options?: { ttl?: number }) {
                if (options?.ttl) {
                    await client.setEx(key, options.ttl, value)
                } else {
                    await client.set(key, value)
                }
            },
            async incr(key: string) {
                return await client.incr(key)
            },
            async expire(key: string, ttl: number) {
                await client.expire(key, ttl)
            },
            async disconnect() {
                await client.disconnect()
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
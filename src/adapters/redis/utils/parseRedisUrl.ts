export interface RedisConfig {
    host: string
    port: number
    password?: string
    database?: number
    tls?: boolean
}

export function parseRedisUrl(url: string): RedisConfig {
    try {
        const parsed = new URL(url)

        return {
            host: parsed.hostname,
            port: parsed.port ? parseInt(parsed.port, 10) : 6379,
            password: parsed.password || undefined,
            database: parsed.pathname ? parseInt(parsed.pathname.slice(1), 10) : 0,
            tls: parsed.protocol === "rediss:"
        }
    } catch (error) {
        throw new Error(`Invalid Redis URL: ${url} - ${error instanceof Error ? error.message : String(error)}`)
    }
} 
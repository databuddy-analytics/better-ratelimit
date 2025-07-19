import { describe, it, expect, beforeAll, afterAll } from "bun:test"
import chalk from "chalk"
import { RedisAdapter } from "./index"
import { RateLimiter } from "../../core/rate-limiter"

const databases = [
    { name: "Redis", url: process.env.REDIS_URL || "redis://localhost:6379" },
    { name: "Dragonfly", url: process.env.DRAGONFLY_URL || "redis://localhost:6380" },
    { name: "Valkey", url: process.env.VALKEY_URL || "redis://localhost:6381" }
]

describe("Redis Adapters", () => {
    let adapters: RedisAdapter[] = []
    let limiters: RateLimiter[] = []

    beforeAll(() => {
        console.log(chalk.blue.bold("\n🎯 Redis Adapters Demo"))
        console.log(chalk.gray("=".repeat(50)))

        for (const db of databases) {
            try {
                console.log(chalk.cyan(`📊 Testing ${db.name}: ${db.url}`))
                const adapter = new RedisAdapter({ url: db.url, prefix: `test:${db.name.toLowerCase()}` })
                const limiter = new RateLimiter(adapter)

                adapters.push(adapter)
                limiters.push(limiter)
            } catch (error) {
                console.log(chalk.yellow(`⚠️  ${db.name} not available: ${error}`))
                adapters.push(null as any)
                limiters.push(null as any)
            }
        }
        console.log()
    })

    afterAll(async () => {
        for (const adapter of adapters) {
            if (adapter) {
                await adapter.close()
            }
        }
    })

    for (let i = 0; i < databases.length; i++) {
        const db = databases[i]!
        const adapter = adapters[i]
        const limiter = limiters[i]

        describe(`${db.name} Adapter`, () => {
            it(`should demonstrate ${db.name} rate limiting`, async () => {
                if (!adapter || !limiter) {
                    console.log(chalk.yellow(`⏭️  Skipping ${db.name} test (not available)`))
                    return
                }

                const config = {
                    key: `test-user-${db.name.toLowerCase()}`,
                    limit: 3,
                    duration: "10s"
                }

                console.log(chalk.cyan(`📊 ${db.name} Config: ${config.limit} requests per ${config.duration}`))
                console.log()

                for (let j = 1; j <= 5; j++) {
                    const result = await limiter.check({
                        ...config,
                        strategy: "fixed-window"
                    })

                    const status = result.allowed ? chalk.green("✅ ALLOWED") : chalk.red("❌ BLOCKED")

                    console.log(chalk.white(`Request #${j.toString().padStart(2)}: ${status}`))
                    console.log(chalk.gray(`   Remaining: ${result.remaining} | Reset: ${new Date(result.resetTime).toISOString()}`))

                    await new Promise(resolve => setTimeout(resolve, 100))
                }

                console.log(chalk.gray(`\n${"=".repeat(50)}`))
                console.log(chalk.green.bold(`✅ ${db.name} test completed!\n`))
            })

            it(`should handle basic ${db.name} operations`, async () => {
                if (!adapter) {
                    console.log(chalk.yellow(`⏭️  Skipping ${db.name} test (not available)`))
                    return
                }

                const testKey = `test:basic:${db.name.toLowerCase()}`
                const testValue = 42

                await adapter.set(testKey, testValue, 60)
                const retrieved = await adapter.get(testKey)
                expect(retrieved).toBe(testValue)

                const incremented = await adapter.increment(testKey, 60)
                expect(incremented).toBe(testValue + 1)

                const final = await adapter.get(testKey)
                expect(final).toBe(testValue + 1)
            })
        })
    }
}) 
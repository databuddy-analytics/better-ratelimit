import { describe, it, expect, beforeAll, afterAll } from "bun:test"
import chalk from "chalk"
import { RedisAdapter } from "./index"
import { RateLimiter } from "../../core/rate-limiter"

describe("Redis Adapter", () => {
    let redisAdapter: RedisAdapter
    let rateLimiter: RateLimiter

    beforeAll(() => {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

        console.log(chalk.blue.bold("\n🎯 Redis Adapter Demo"))
        console.log(chalk.gray("=".repeat(50)))
        console.log(chalk.cyan(`📊 Using Redis: ${redisUrl}`))
        console.log()

        try {
            redisAdapter = new RedisAdapter({ url: redisUrl })
            rateLimiter = new RateLimiter(redisAdapter)
        } catch (error) {
            console.log(chalk.yellow(`⚠️  Redis not available: ${error}`))
            console.log(chalk.gray("Skipping Redis tests...\n"))
        }
    })

    afterAll(async () => {
        if (redisAdapter) {
            await redisAdapter.close()
        }
    })

    it("should demonstrate Redis-based rate limiting", async () => {
        if (!redisAdapter) {
            console.log(chalk.yellow("⏭️  Skipping Redis test (Redis not available)"))
            return
        }

        const config = {
            key: "test-user-redis",
            limit: 3,
            duration: "10s"
        }

        console.log(chalk.cyan(`📊 Config: ${config.limit} requests per ${config.duration}`))
        console.log()

        for (let i = 1; i <= 5; i++) {
            const result = await rateLimiter.check({
                ...config,
                strategy: "fixed-window"
            })

            const status = result.allowed ? chalk.green("✅ ALLOWED") : chalk.red("❌ BLOCKED")

            console.log(chalk.white(`Request #${i.toString().padStart(2)}: ${status}`))
            console.log(chalk.gray(`   Remaining: ${result.remaining} | Reset: ${new Date(result.resetTime).toISOString()}`))

            await new Promise(resolve => setTimeout(resolve, 100))
        }

        console.log(chalk.gray(`\n${"=".repeat(50)}`))
        console.log(chalk.green.bold("✅ Redis adapter test completed!\n"))
    })

    it("should handle basic Redis operations", async () => {
        if (!redisAdapter) {
            console.log(chalk.yellow("⏭️  Skipping Redis test (Redis not available)"))
            return
        }

        const testKey = "test:basic"
        const testValue = 42

        await redisAdapter.set(testKey, testValue, 60)
        const retrieved = await redisAdapter.get(testKey)
        expect(retrieved).toBe(testValue)

        const incremented = await redisAdapter.increment(testKey, 60)
        expect(incremented).toBe(testValue + 1)

        const final = await redisAdapter.get(testKey)
        expect(final).toBe(testValue + 1)
    })
}) 
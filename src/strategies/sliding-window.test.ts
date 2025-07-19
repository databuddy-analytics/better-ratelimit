import { describe, it, expect } from "bun:test"
import chalk from "chalk"
import { SlidingWindowStrategy } from "./sliding-window"
import { parseDuration } from "../utils/duration"

describe("Sliding Window Strategy", () => {
    it("should demonstrate sliding window behavior", async () => {
        console.log(chalk.blue.bold("\n🎯 Sliding Window Rate Limiting Demo"))
        console.log(chalk.gray("=".repeat(50)))

        // Create strategy with mock time for deterministic testing
        let mockTime = 1000000000000 // Start at a fixed timestamp
        const strategy = new SlidingWindowStrategy(() => mockTime)

        const config = {
            key: "test-user",
            limit: 5,
            duration: "2s"
        }

        const windowSize = parseDuration("2s")
        console.log(chalk.cyan(`📊 Config: ${config.limit} requests per ${config.duration}`))
        console.log(chalk.cyan(`⏰ Window size: ${windowSize}ms (sliding continuously)`))
        console.log()

        // Simulate requests over time
        const requests = [
            { time: 0, count: 1 },
            { time: 500, count: 2 },
            { time: 1000, count: 3 },
            { time: 1500, count: 4 },
            { time: 2000, count: 5 },
            { time: 2500, count: 6 }, // Should be blocked (over limit)
            { time: 3000, count: 4 }, // Should be allowed (old requests expired)
            { time: 3500, count: 5 }, // Should be blocked again
        ]

        for (const request of requests) {
            mockTime = 1000000000000 + request.time
            const result = strategy.check(request.count, config)
            const status = result.allowed ? chalk.green("✅ ALLOWED") : chalk.red("❌ BLOCKED")
            const windowStart = new Date(result.metadata?.windowStart as number || 0).toISOString()
            const windowEnd = new Date(result.metadata?.windowEnd as number || 0).toISOString()

            console.log(chalk.white(`Request at +${request.time}ms (count: ${request.count}): ${status}`))
            console.log(chalk.gray(`   Remaining: ${result.remaining} | Window: ${windowStart} → ${windowEnd}`))

            if (request.time === 2000) {
                console.log(chalk.yellow("\n🔄 Note: At 2s, old requests start expiring from sliding window...\n"))
            }
        }

        console.log(chalk.gray("\n" + "=".repeat(50)))
        console.log(chalk.green.bold("✅ Sliding window test completed!\n"))
    })

    it("should handle edge cases correctly", () => {
        const strategy = new SlidingWindowStrategy()
        const config = { key: "test", limit: 10, duration: "1m" }

        // Test exactly at limit
        const atLimit = strategy.check(10, config)
        expect(atLimit.allowed).toBe(true)
        expect(atLimit.remaining).toBe(0)

        // Test just over limit
        const overLimit = strategy.check(11, config)
        expect(overLimit.allowed).toBe(false)
        expect(overLimit.remaining).toBe(0)

        // Test just under limit
        const underLimit = strategy.check(9, config)
        expect(underLimit.allowed).toBe(true)
        expect(underLimit.remaining).toBe(1)
    })
}) 
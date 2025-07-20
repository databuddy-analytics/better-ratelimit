import { describe, it, expect } from "bun:test"
import chalk from "chalk"
import { ApproximatedSlidingWindowStrategy } from "./approximated-sliding-window"
import { parseDuration } from "../utils/duration"

describe("Approximated Sliding Window Strategy", () => {
    it("should demonstrate approximated sliding window behavior", async () => {
        console.log(chalk.blue.bold("\n🎯 Approximated Sliding Window Rate Limiting Demo"))
        console.log(chalk.gray("=".repeat(50)))

        // Create strategy with mock time for deterministic testing
        let mockTime = 1000000000000 // Start at a fixed timestamp
        const strategy = new ApproximatedSlidingWindowStrategy(() => mockTime)

        const config = {
            key: "test-user",
            limit: 5,
            duration: "10s"
        }

        const windowSize = parseDuration("10s")
        const subWindowSize = windowSize / 10
        console.log(chalk.cyan(`📊 Config: ${config.limit} requests per ${config.duration}`))
        console.log(chalk.cyan(`⏰ Window size: ${windowSize}ms with ${subWindowSize}ms sub-windows`))
        console.log()

        // Simulate requests over time
        const requests = [
            { time: 0, count: 1 },
            { time: 1000, count: 2 },
            { time: 2000, count: 3 },
            { time: 3000, count: 4 },
            { time: 4000, count: 5 },
            { time: 5000, count: 6 }, // Should be blocked (over limit)
            { time: 10000, count: 4 }, // Should be allowed (new window)
            { time: 11000, count: 5 }, // Should be blocked again
        ]

        for (const request of requests) {
            mockTime = 1000000000000 + request.time
            const result = strategy.check(request.count, config)
            const status = result.allowed ? chalk.green("✅ ALLOWED") : chalk.red("❌ BLOCKED")
            const currentSubWindow = result.metadata?.currentSubWindow as number || 0
            const windowStart = new Date(result.metadata?.windowStart as number || 0).toISOString()
            const windowEnd = new Date(result.metadata?.windowEnd as number || 0).toISOString()

            console.log(chalk.white(`Request at +${request.time}ms (count: ${request.count}): ${status}`))
            console.log(chalk.gray(`   Remaining: ${result.remaining} | Sub-window: ${currentSubWindow} | Window: ${windowStart} → ${windowEnd}`))

            if (request.time === 10000) {
                console.log(chalk.yellow("\n🔄 Note: At 10s, window resets with approximated sliding behavior...\n"))
            }
        }

        console.log(chalk.gray(`\n${"=".repeat(50)}`))
        console.log(chalk.green.bold("✅ Approximated sliding window test completed!\n"))
    })

    it("should handle edge cases correctly", () => {
        const strategy = new ApproximatedSlidingWindowStrategy()
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
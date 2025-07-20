import { describe, it, expect } from "bun:test"
import chalk from "chalk"
import { FixedWindowStrategy } from "./fixed-window"
import { parseDuration } from "../utils/duration"

describe("Fixed Window Strategy", () => {
    it("should demonstrate rate limiting behavior", async () => {
        console.log(chalk.blue.bold("\n🎯 Fixed Window Rate Limiting Demo"))
        console.log(chalk.gray("=".repeat(50)))

        // Create strategy with mock time for deterministic testing
        let mockTime = 1000000000000 // Start at a fixed timestamp
        const strategy = new FixedWindowStrategy(() => mockTime)

        const config = {
            key: "test-user",
            limit: 5,
            duration: "1s"
        }

        const windowSize = parseDuration("1s")
        console.log(chalk.cyan(`📊 Config: ${config.limit} requests per ${config.duration}`))
        console.log(chalk.cyan(`⏰ Window size: ${windowSize}ms`))
        console.log()

        // Simulate requests
        for (let i = 1; i <= 8; i++) {
            const result = strategy.check(i, config)
            const status = result.allowed ? chalk.green("✅ ALLOWED") : chalk.red("❌ BLOCKED")
            const window = Math.floor(mockTime / windowSize)

            console.log(chalk.white(`Request #${i.toString().padStart(2)}: ${status}`))
            console.log(chalk.gray(`   Remaining: ${result.remaining} | Window: ${window} | Reset: ${new Date(result.resetTime).toISOString()}`))

            // Move to next second after 5 requests
            if (i === 5) {
                mockTime += windowSize
                console.log(chalk.yellow("\n🔄 Window reset! Moving to next time window...\n"))
            }
        }

        console.log(chalk.gray(`\n${"=".repeat(50)}`))
        console.log(chalk.green.bold("✅ Fixed window test completed!\n"))
    })

    it("should handle edge cases correctly", () => {
        const strategy = new FixedWindowStrategy()
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
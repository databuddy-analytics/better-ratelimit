/**
 * Simple example demonstrating better-ratelimit
 */

import { createRateLimiter, RateLimiter, MemoryStore } from "./src"

async function basicExample() {
    console.log("=== Basic Rate Limiting Example ===\n")

    // Create a rate limiter with memory storage
    const rateLimiter = createRateLimiter()

    // Test rate limiting
    const config = {
        key: "user:123",
        limit: 3,
        duration: "1m"
    }

    console.log("Testing rate limit with 3 requests per minute...\n")

    for (let i = 1; i <= 5; i++) {
        const result = await rateLimiter.check(config.key)

        console.log(`Request ${i}:`)
        console.log(`  Allowed: ${result.allowed}`)
        console.log(`  Remaining: ${result.remaining}`)
        console.log(`  Reset Time: ${new Date(result.resetTime).toLocaleTimeString()}`)
        console.log("")
    }
}

async function customStoreExample() {
    console.log("=== Custom Store Example ===\n")

    // Create a custom memory store with smaller cache
    const store = new MemoryStore({ maxSize: 10 })
    const rateLimiter = new RateLimiter(store, { limit: 2, duration: "30s" })

    const config = {
        key: "api:test",
        limit: 2,
        duration: "30s"
    }

    console.log("Testing with custom store (max 10 entries)...\n")

    for (let i = 1; i <= 3; i++) {
        const result = await rateLimiter.check(config.key)

        console.log(`Request ${i}:`)
        console.log(`  Allowed: ${result.allowed}`)
        console.log(`  Remaining: ${result.remaining}`)
        console.log(`  Store Stats:`, store.getStats())
        console.log("")
    }
}

// Run examples
async function main() {
    try {
        await basicExample()
        await customStoreExample()
    } catch (error) {
        console.error("Error:", error)
    }
}

main() 
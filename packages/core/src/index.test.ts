import { describe, it, expect } from "bun:test"
import {
    createRateLimiter,
    createMemoryRateLimiter,
    createRedisRateLimiter,
    RateLimiter,
    MemoryStore,
    RedisAdapter,
    parseDuration,
    formatDuration,
    getClientIP,
    getIPKey,
    isPrivateIP,
    getClientIPWithContext,
    getStrategy,
    getAvailableStrategies,
    FixedWindowStrategy,
    SlidingWindowStrategy,
    ApproximatedSlidingWindowStrategy,
    type RateLimitConfig,
    type RateLimitResult,
    type RateLimitStore,
    type RateLimitOptions,
    type RequestContext
} from "./index"

describe("Public API", () => {
    describe("createRateLimiter", () => {
        it("should create rate limiter with default options", () => {
            const limiter = createRateLimiter()

            expect(limiter).toBeInstanceOf(RateLimiter)
            const options = limiter.getOptions()
            expect(options.limit).toBe(100)
            expect(options.duration).toBe("1m")
            expect(options.strategy).toBe("fixed-window")
        })

        it("should create rate limiter with custom options", () => {
            const limiter = createRateLimiter(undefined, {
                limit: 50,
                duration: "30s",
                strategy: "sliding-window"
            })

            expect(limiter).toBeInstanceOf(RateLimiter)
            const options = limiter.getOptions()
            expect(options.limit).toBe(50)
            expect(options.duration).toBe("30s")
            expect(options.strategy).toBe("sliding-window")
        })

        it("should create rate limiter with custom store", () => {
            const store = new MemoryStore({ maxSize: 100 })
            const limiter = createRateLimiter(store, {
                limit: 25,
                duration: "1h"
            })

            expect(limiter).toBeInstanceOf(RateLimiter)
            const options = limiter.getOptions()
            expect(options.limit).toBe(25)
            expect(options.duration).toBe("1h")
        })
    })

    describe("createMemoryRateLimiter", () => {
        it("should create memory-based rate limiter", () => {
            const limiter = createMemoryRateLimiter(10, "5m", {
                strategy: "fixed-window",
                maxSize: 50
            })

            expect(limiter).toBeInstanceOf(RateLimiter)
            const options = limiter.getOptions()
            expect(options.limit).toBe(10)
            expect(options.duration).toBe("5m")
            expect(options.strategy).toBe("fixed-window")
        })

        it("should use memory store options", () => {
            const limiter = createMemoryRateLimiter(5, "1m", {
                maxSize: 25,
                defaultTTL: 5000
            })

            expect(limiter).toBeInstanceOf(RateLimiter)
        })
    })

    describe("createRedisRateLimiter", () => {
        it("should create Redis-based rate limiter", () => {
            const limiter = createRedisRateLimiter("redis://localhost:6379", 20, "10m", {
                strategy: "sliding-window"
            })

            expect(limiter).toBeInstanceOf(RateLimiter)
            const options = limiter.getOptions()
            expect(options.limit).toBe(20)
            expect(options.duration).toBe("10m")
            expect(options.strategy).toBe("sliding-window")
        })
    })

    describe("utility functions", () => {
        it("should export duration utilities", () => {
            expect(parseDuration("30s")).toBe(30000)
            expect(formatDuration(30000)).toBe("30s")
        })

        it("should export IP utilities", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": "203.0.113.1"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.1")
            expect(getIPKey(ctx)).toBe("ip:203.0.113.1")
            expect(isPrivateIP("192.168.1.1")).toBe(true)
            expect(isPrivateIP("203.0.113.1")).toBe(false)

            const result = getClientIPWithContext(ctx)
            expect(result.ip).toBe("203.0.113.1")
            expect(result.source).toBe("x-forwarded-for")
        })
    })

    describe("strategy exports", () => {
        it("should export strategy functions", () => {
            expect(typeof getStrategy).toBe("function")
            expect(typeof getAvailableStrategies).toBe("function")
        })

        it("should export strategy classes", () => {
            expect(FixedWindowStrategy).toBeDefined()
            expect(SlidingWindowStrategy).toBeDefined()
            expect(ApproximatedSlidingWindowStrategy).toBeDefined()
        })

        it("should get available strategies", () => {
            const strategies = getAvailableStrategies()
            expect(Array.isArray(strategies)).toBe(true)
            expect(strategies).toContain("fixed-window")
            expect(strategies).toContain("sliding-window")
            expect(strategies).toContain("approximated-sliding-window")
        })

        it("should get strategy by name", () => {
            const fixedStrategy = getStrategy("fixed-window")
            const slidingStrategy = getStrategy("sliding-window")
            const approximatedStrategy = getStrategy("approximated-sliding-window")

            expect(fixedStrategy).toBeDefined()
            expect(slidingStrategy).toBeDefined()
            expect(approximatedStrategy).toBeDefined()
        })
    })

    describe("type exports", () => {
        it("should export all necessary types", () => {
            // These should not throw TypeScript errors
            const config: RateLimitConfig = {
                key: "test",
                limit: 10,
                duration: "1m"
            }

            const result: RateLimitResult = {
                allowed: true,
                remaining: 5,
                resetTime: Date.now(),
                limit: 10,
                key: "test"
            }

            const options: RateLimitOptions = {
                limit: 10,
                duration: "1m"
            }

            const store: RateLimitStore = {
                async get() { return null },
                async set() { },
                async increment() { return 1 }
            }

            const ctx: RequestContext = {
                headers: {}
            }

            expect(config).toBeDefined()
            expect(result).toBeDefined()
            expect(options).toBeDefined()
            expect(store).toBeDefined()
            expect(ctx).toBeDefined()
        })
    })

    describe("default export", () => {
        it("should export createRateLimiter as default", async () => {
            const defaultExport = await import("./index")
            expect(defaultExport.default).toBe(createRateLimiter)
        })
    })

    describe("integration test", () => {
        it("should work end-to-end with memory store", async () => {
            const limiter = createRateLimiter(undefined, {
                limit: 3,
                duration: "1m"
            })

            // First 3 requests should be allowed
            for (let i = 0; i < 3; i++) {
                const result = await limiter.check("test-key")
                expect(result.allowed).toBe(true)
                expect(result.remaining).toBe(2 - i)
            }

            // 4th request should be blocked
            const blockedResult = await limiter.check("test-key")
            expect(blockedResult.allowed).toBe(false)
            expect(blockedResult.remaining).toBe(0)
        })

        it("should work with different strategies", async () => {
            const limiter = createRateLimiter(undefined, {
                limit: 2,
                duration: "1m",
                strategy: "sliding-window"
            })

            const result = await limiter.check("test-key")
            expect(result.allowed).toBe(true)
            expect(result.remaining).toBeGreaterThanOrEqual(0)
        })
    })
}) 
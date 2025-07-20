import { describe, it, expect, beforeEach } from "bun:test"
import { RateLimiter } from "./rate-limiter"
import { MemoryStore } from "../adapters/memory"
import type { RateLimitStore, RateLimitResult } from "../types"

// Mock store for testing
class MockStore implements RateLimitStore {
    private data = new Map<string, number>()
    private ttlData = new Map<string, number>()

    async get(key: string): Promise<number | null> {
        const value = this.data.get(key)
        const ttl = this.ttlData.get(key)

        if (value && ttl && Date.now() < ttl) {
            return value
        }

        if (value) {
            this.data.delete(key)
            this.ttlData.delete(key)
        }

        return null
    }

    async set(key: string, value: number, ttl: number): Promise<void> {
        this.data.set(key, value)
        this.ttlData.set(key, Date.now() + ttl)
    }

    async increment(key: string, ttl: number): Promise<number> {
        const current = await this.get(key) ?? 0
        const newValue = current + 1
        await this.set(key, newValue, ttl)
        return newValue
    }
}

describe("RateLimiter", () => {
    let store: RateLimitStore
    let rateLimiter: RateLimiter

    beforeEach(() => {
        store = new MockStore()
        rateLimiter = new RateLimiter(store, {
            limit: 5,
            duration: "1m"
        })
    })

    describe("constructor", () => {
        it("should set default options correctly", () => {
            const limiter = new RateLimiter(store, { limit: 10, duration: "30s" })
            const options = limiter.getOptions()

            expect(options.limit).toBe(10)
            expect(options.duration).toBe("30s")
            expect(options.strategy).toBe("fixed-window")
            expect(options.burst).toBe(0)
            expect(options.prefix).toBe("")
        })

        it("should override default options", () => {
            const limiter = new RateLimiter(store, {
                limit: 10,
                duration: "30s",
                strategy: "sliding-window",
                burst: 2,
                prefix: "test:",
                metadata: { test: true }
            })

            const options = limiter.getOptions()
            expect(options.strategy).toBe("sliding-window")
            expect(options.burst).toBe(2)
            expect(options.prefix).toBe("test:")
            expect(options.metadata).toEqual({ test: true })
        })
    })

    describe("check", () => {
        it("should allow requests within limit", async () => {
            const results: RateLimitResult[] = []

            for (let i = 0; i < 5; i++) {
                const result = await rateLimiter.check("test-key")
                results.push(result)
            }

            expect(results[0].allowed).toBe(true)
            expect(results[0].remaining).toBe(4)
            expect(results[4].allowed).toBe(true)
            expect(results[4].remaining).toBe(0)
        })

        it("should block requests over limit", async () => {
            // Make 5 requests (at limit)
            for (let i = 0; i < 5; i++) {
                await rateLimiter.check("test-key")
            }

            // 6th request should be blocked
            const result = await rateLimiter.check("test-key")
            expect(result.allowed).toBe(false)
            expect(result.remaining).toBe(0)
        })

        it("should call onSuccess callback for allowed requests", async () => {
            let successCalled = false
            let limitCalled = false
            let successResult: RateLimitResult | undefined = undefined

            const onSuccess = (result: RateLimitResult) => {
                successCalled = true
                successResult = result
            }
            const onLimit = () => {
                limitCalled = true
            }

            const limiter = new RateLimiter(store, {
                limit: 3,
                duration: "1m",
                onSuccess,
                onLimit
            })

            await limiter.check("test-key")

            expect(successCalled).toBe(true)
            expect(limitCalled).toBe(false)
            expect(successResult?.allowed).toBe(true)
        })

        it("should call onLimit callback for blocked requests", async () => {
            let successCalled = false
            let limitCalled = false
            let limitResult: RateLimitResult | undefined = undefined

            const onSuccess = () => {
                successCalled = true
            }
            const onLimit = (result: RateLimitResult) => {
                limitCalled = true
                limitResult = result
            }

            const limiter = new RateLimiter(store, {
                limit: 1,
                duration: "1m",
                onSuccess,
                onLimit
            })

            await limiter.check("test-key") // First request
            await limiter.check("test-key") // Second request (blocked)

            expect(successCalled).toBe(true)
            expect(limitCalled).toBe(true)
            expect(limitResult?.allowed).toBe(false)
        })
    })

    describe("withStore", () => {
        it("should create new instance with different store", () => {
            const newStore = new MemoryStore()
            const newLimiter = rateLimiter.withStore(newStore)

            expect(newLimiter).toBeInstanceOf(RateLimiter)
            expect(newLimiter).not.toBe(rateLimiter)

            const options = newLimiter.getOptions()
            expect(options.limit).toBe(5)
            expect(options.duration).toBe("1m")
        })
    })

    describe("withOptions", () => {
        it("should create new instance with updated options", () => {
            const newLimiter = rateLimiter.withOptions({
                limit: 10,
                duration: "30s",
                strategy: "sliding-window"
            })

            expect(newLimiter).toBeInstanceOf(RateLimiter)
            expect(newLimiter).not.toBe(rateLimiter)

            const options = newLimiter.getOptions()
            expect(options.limit).toBe(10)
            expect(options.duration).toBe("30s")
            expect(options.strategy).toBe("sliding-window")
        })
    })

    describe("withStrategy", () => {
        it("should create new instance with different strategy", () => {
            const newLimiter = rateLimiter.withStrategy("sliding-window")

            expect(newLimiter).toBeInstanceOf(RateLimiter)
            expect(newLimiter).not.toBe(rateLimiter)

            const options = newLimiter.getOptions()
            expect(options.strategy).toBe("sliding-window")
            expect(options.limit).toBe(5) // Other options unchanged
        })
    })

    describe("updateOptions", () => {
        it("should update options in place", () => {
            rateLimiter.updateOptions({
                limit: 10,
                duration: "30s"
            })

            const options = rateLimiter.getOptions()
            expect(options.limit).toBe(10)
            expect(options.duration).toBe("30s")
        })
    })

    describe("getOptions", () => {
        it("should return a copy of options", () => {
            const options = rateLimiter.getOptions()
            expect(options).toEqual({
                limit: 5,
                duration: "1m",
                strategy: "fixed-window",
                burst: 0,
                prefix: "",
                metadata: {},
                onLimit: expect.any(Function),
                onSuccess: expect.any(Function)
            })
        })
    })

    describe("convenience methods", () => {
        it("isAllowed should return boolean", async () => {
            const allowed = await rateLimiter.isAllowed("test-key")
            expect(typeof allowed).toBe("boolean")
            expect(allowed).toBe(true)
        })

        it("getRemaining should return number", async () => {
            const remaining = await rateLimiter.getRemaining("test-key")
            expect(typeof remaining).toBe("number")
            expect(remaining).toBe(4)
        })

        it("getResetTime should return number", async () => {
            const resetTime = await rateLimiter.getResetTime("test-key")
            expect(typeof resetTime).toBe("number")
            expect(resetTime).toBeGreaterThan(Date.now())
        })

        it("getInfo should return complete info", async () => {
            const info = await rateLimiter.getInfo("test-key")
            expect(info).toEqual({
                allowed: true,
                remaining: 4,
                resetTime: expect.any(Number),
                limit: 5
            })
        })
    })

    describe("error handling", () => {
        it("should handle store errors gracefully", async () => {
            const errorStore: RateLimitStore = {
                async get() { throw new Error("Store error") },
                async set() { throw new Error("Store error") },
                async increment() { throw new Error("Store error") }
            }

            const limiter = new RateLimiter(errorStore, {
                limit: 5,
                duration: "1m"
            })

            await expect(limiter.check("test-key")).rejects.toThrow("Store error")
        })

        it("should handle invalid duration format", async () => {
            const limiter = new RateLimiter(store, {
                limit: 5,
                duration: "invalid"
            })

            await expect(limiter.check("test-key")).rejects.toThrow("Invalid duration format")
        })
    })

    describe("different strategies", () => {
        it("should work with sliding-window strategy", async () => {
            const limiter = rateLimiter.withStrategy("sliding-window")

            const result = await limiter.check("test-key")
            expect(result.allowed).toBe(true)
            expect(result.remaining).toBeGreaterThanOrEqual(0)
        })

        it("should work with approximated-sliding-window strategy", async () => {
            const limiter = rateLimiter.withStrategy("approximated-sliding-window")

            const result = await limiter.check("test-key")
            expect(result.allowed).toBe(true)
            expect(result.remaining).toBeGreaterThanOrEqual(0)
        })
    })
}) 
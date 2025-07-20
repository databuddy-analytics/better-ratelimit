import { describe, it, expect, beforeEach } from "bun:test"
import { withRateLimiter, type ElysiaContext, type ElysiaRateLimitOptions } from "./elysia"
import { MemoryStore } from "../adapters/memory"
import type { RateLimitResult } from "../types"

// Mock Elysia app
class MockElysiaApp {
    private requestHandlers: Array<(ctx: ElysiaContext) => Promise<string | undefined>> = []

    onRequest(handler: (ctx: ElysiaContext) => Promise<string | undefined>) {
        this.requestHandlers.push(handler)
        return this
    }

    async simulateRequest(ctx: ElysiaContext): Promise<string | undefined> {
        for (const handler of this.requestHandlers) {
            const result = await handler(ctx)
            if (result) return result
        }
        return undefined
    }
}

describe("Elysia Plugin", () => {
    let app: MockElysiaApp
    let ctx: ElysiaContext

    beforeEach(() => {
        app = new MockElysiaApp()
        ctx = {
            headers: {
                "x-forwarded-for": "203.0.113.1"
            },
            set: {
                status: 200,
                headers: {}
            }
        }
    })

    describe("withRateLimiter", () => {
        it("should create plugin with default options", () => {
            const plugin = withRateLimiter({
                limit: 5,
                duration: "1m"
            })

            expect(typeof plugin).toBe("function")
        })

        it("should apply plugin to app", () => {
            const plugin = withRateLimiter({
                limit: 5,
                duration: "1m"
            })

            const result = plugin(app)
            expect(result).toBe(app)
        })
    })

    describe("rate limiting behavior", () => {
        it("should allow requests within limit", async () => {
            const plugin = withRateLimiter({
                limit: 3,
                duration: "1m"
            })

            plugin(app)

            // First 3 requests should be allowed
            for (let i = 0; i < 3; i++) {
                const result = await app.simulateRequest(ctx)
                expect(result).toBeUndefined()
                expect(ctx.set.status).toBe(200)
            }
        })

        it("should block requests over limit", async () => {
            const plugin = withRateLimiter({
                limit: 2,
                duration: "1m"
            })

            plugin(app)

            // First 2 requests should be allowed
            await app.simulateRequest(ctx)
            await app.simulateRequest(ctx)

            // 3rd request should be blocked
            const result = await app.simulateRequest(ctx)
            expect(result).toBe("Too Many Requests")
            expect(ctx.set.status).toBe(429)
        })

        it("should use custom key function", async () => {
            const plugin = withRateLimiter({
                limit: 1,
                duration: "1m",
                key: (ctx) => `custom:${ctx.headers?.["user-id"] || "anonymous"}`
            })

            plugin(app)

            // First request should be allowed
            await app.simulateRequest(ctx)

            // Second request should be blocked
            const result = await app.simulateRequest(ctx)
            expect(result).toBe("Too Many Requests")
        })
    })

    describe("headers", () => {
        it("should set rate limit headers", async () => {
            const plugin = withRateLimiter({
                limit: 5,
                duration: "1m",
                headers: {
                    enabled: true,
                    prefix: "X-RateLimit"
                }
            })

            plugin(app)
            await app.simulateRequest(ctx)

            expect(ctx.set.headers["X-RateLimit-Limit"]).toBe("5")
            expect(ctx.set.headers["X-RateLimit-Remaining"]).toBe("4")
            expect(ctx.set.headers["X-RateLimit-Reset"]).toBeDefined()
        })

        it("should not set headers when disabled", async () => {
            const plugin = withRateLimiter({
                limit: 5,
                duration: "1m",
                headers: {
                    enabled: false
                }
            })

            plugin(app)
            await app.simulateRequest(ctx)

            expect(ctx.set.headers["X-RateLimit-Limit"]).toBeUndefined()
            expect(ctx.set.headers["X-RateLimit-Remaining"]).toBeUndefined()
        })

        it("should use custom header prefix", async () => {
            const plugin = withRateLimiter({
                limit: 5,
                duration: "1m",
                headers: {
                    prefix: "X-Custom"
                }
            })

            plugin(app)
            await app.simulateRequest(ctx)

            expect(ctx.set.headers["X-Custom-Limit"]).toBe("5")
            expect(ctx.set.headers["X-Custom-Remaining"]).toBe("4")
        })

        it("should include metadata in headers when enabled", async () => {
            const plugin = withRateLimiter({
                limit: 5,
                duration: "1m",
                metadata: { test: "value" },
                headers: {
                    includeMetadata: true
                }
            })

            plugin(app)
            await app.simulateRequest(ctx)

            const metadata = JSON.parse(ctx.set.headers["X-RateLimit-Metadata"] || "{}")
            expect(metadata.test).toBe("value")
            expect(metadata.strategy).toBe("fixed-window")
        })
    })

    describe("response customization", () => {
        it("should use custom status code", async () => {
            const plugin = withRateLimiter({
                limit: 1,
                duration: "1m",
                response: {
                    status: 418
                }
            })

            plugin(app)
            await app.simulateRequest(ctx) // First request
            const result = await app.simulateRequest(ctx) // Second request

            expect(ctx.set.status).toBe(418)
            expect(result).toBe("Too Many Requests")
        })

        it("should use custom message", async () => {
            const plugin = withRateLimiter({
                limit: 1,
                duration: "1m",
                response: {
                    message: "Rate limit exceeded"
                }
            })

            plugin(app)
            await app.simulateRequest(ctx) // First request
            const result = await app.simulateRequest(ctx) // Second request

            expect(result).toBe("Rate limit exceeded")
        })

        it("should not include headers when disabled", async () => {
            const plugin = withRateLimiter({
                limit: 1,
                duration: "1m",
                response: {
                    includeHeaders: false
                }
            })

            plugin(app)
            await app.simulateRequest(ctx) // First request - allowed

            // Create fresh context for second request
            const ctx2: ElysiaContext = {
                headers: { "x-forwarded-for": "203.0.113.1" },
                set: { status: 200, headers: {} }
            }
            const result = await app.simulateRequest(ctx2) // Second request - blocked

            // Headers should not be set on the blocked request when includeHeaders is false
            expect(result).toBe("Too Many Requests")
            expect(ctx2.set.headers["X-RateLimit-Limit"]).toBeUndefined()
        })
    })

    describe("callbacks", () => {
        it("should call onLimit callback", async () => {
            let limitCalled = false
            let limitCtx: ElysiaContext | null = null
            let limitResult: RateLimitResult | null = null

            const plugin = withRateLimiter({
                limit: 1,
                duration: "1m",
                onLimit: function (ctx: ElysiaContext, result: RateLimitResult) {
                    limitCalled = true
                    limitCtx = ctx
                    limitResult = result
                }
            })

            plugin(app)
            await app.simulateRequest(ctx) // First request
            await app.simulateRequest(ctx) // Second request

            expect(limitCalled).toBe(true)
            expect(limitCtx).toBe(ctx)
            expect(limitResult?.allowed).toBe(false)
        })

        it("should call onSuccess callback", async () => {
            let successCalled = false
            let successCtx: ElysiaContext | undefined = undefined
            let successResult: RateLimitResult | undefined = undefined

            const plugin = withRateLimiter({
                limit: 5,
                duration: "1m",
                onSuccess: function (ctx: ElysiaContext, result: RateLimitResult) {
                    successCalled = true
                    successCtx = ctx
                    successResult = result
                }
            })

            plugin(app)
            await app.simulateRequest(ctx)

            expect(successCalled).toBe(true)
            expect(successCtx).toBe(ctx)
            expect(successResult?.allowed).toBe(true)
        })
    })

    describe("store integration", () => {
        it("should use custom store", async () => {
            const customStore = new MemoryStore({ maxSize: 10 })
            const plugin = withRateLimiter({
                limit: 2,
                duration: "1m",
                store: customStore
            })

            plugin(app)

            // Test that the store is being used
            await app.simulateRequest(ctx)
            await app.simulateRequest(ctx)
            const result = await app.simulateRequest(ctx)

            expect(result).toBe("Too Many Requests")
        })
    })

    describe("strategy integration", () => {
        it("should work with different strategies", async () => {
            const plugin = withRateLimiter({
                limit: 3,
                duration: "1m",
                strategy: "sliding-window"
            })

            plugin(app)

            // Should work with sliding window strategy
            const result = await app.simulateRequest(ctx)
            expect(result).toBeUndefined()
            expect(ctx.set.status).toBe(200)
        })
    })

    describe("edge cases", () => {
        it("should handle missing headers", async () => {
            const ctxWithoutHeaders: ElysiaContext = {
                headers: {},
                set: {
                    status: 200,
                    headers: {}
                }
            }

            const plugin = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            plugin(app)
            const result = await app.simulateRequest(ctxWithoutHeaders)

            expect(result).toBeUndefined()
        })

        it("should handle empty context", async () => {
            const emptyCtx: ElysiaContext = {
                set: {
                    status: 200,
                    headers: {}
                }
            }

            const plugin = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            plugin(app)
            const result = await app.simulateRequest(emptyCtx)

            expect(result).toBeUndefined()
        })

        it("should handle concurrent requests", async () => {
            const plugin = withRateLimiter({
                limit: 2,
                duration: "1m"
            })

            plugin(app)

            // Simulate concurrent requests
            const promises: Array<Promise<string | undefined>> = []
            for (let i = 0; i < 5; i++) {
                promises.push(app.simulateRequest(ctx))
            }

            const results = await Promise.all(promises)
            const blockedCount = results.filter(r => r === "Too Many Requests").length

            expect(blockedCount).toBeGreaterThan(0)
        })
    })

    describe("IP key generation", () => {
        it("should use IP-based keys by default", async () => {
            const plugin = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            plugin(app)

            // First request from IP
            await app.simulateRequest(ctx)

            // Second request from same IP should be blocked
            const result = await app.simulateRequest(ctx)
            expect(result).toBe("Too Many Requests")
        })

        it("should handle different IPs separately", async () => {
            const plugin = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            plugin(app)

            const ctx1: ElysiaContext = {
                headers: { "x-forwarded-for": "203.0.113.1" },
                set: { status: 200, headers: {} }
            }

            const ctx2: ElysiaContext = {
                headers: { "x-forwarded-for": "203.0.113.2" },
                set: { status: 200, headers: {} }
            }

            // Both should be allowed (different IPs)
            const result1 = await app.simulateRequest(ctx1)
            const result2 = await app.simulateRequest(ctx2)

            expect(result1).toBeUndefined()
            expect(result2).toBeUndefined()
        })
    })
}) 
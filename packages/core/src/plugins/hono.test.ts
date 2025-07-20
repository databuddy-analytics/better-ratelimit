import { describe, it, expect, beforeEach } from "bun:test"
import { withRateLimiter, type HonoRateLimitOptions } from "./hono"
import { MemoryStore } from "../adapters/memory"
import type { RateLimitResult } from "../types"
import { Hono } from "hono"

describe("Hono Plugin", () => {
    let app: Hono

    beforeEach(() => {
        app = new Hono()
    })

    describe("withRateLimiter", () => {
        it("should create middleware with default options", () => {
            const middleware = withRateLimiter({
                limit: 5,
                duration: "1m"
            })

            expect(typeof middleware).toBe("function")
        })

        it("should apply middleware to context", async () => {
            const middleware = withRateLimiter({
                limit: 5,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            const res = await app.request("/", {
                headers: {
                    "x-forwarded-for": "203.0.113.1"
                }
            })

            expect(res.status).toBe(200)
        })
    })

    describe("rate limiting behavior", () => {
        it("should allow requests within limit", async () => {
            const middleware = withRateLimiter({
                limit: 3,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            // First 3 requests should be allowed
            for (let i = 0; i < 3; i++) {
                const res = await app.request("/", {
                    headers: {
                        "x-forwarded-for": "203.0.113.1"
                    }
                })
                expect(res.status).toBe(200)
            }
        })

        it("should block requests over limit", async () => {
            const middleware = withRateLimiter({
                limit: 2,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            // First 2 requests should be allowed
            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })
            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })

            // 3rd request should be blocked
            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })
            expect(res.status).toBe(429)
        })

        it("should use custom key function", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m",
                key: (ctx) => `custom:${ctx.req.header("user-id") || "anonymous"}`
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            // First request should be allowed
            await app.request("/", {
                headers: { "user-id": "user1" }
            })

            // Second request should be blocked
            const res = await app.request("/", {
                headers: { "user-id": "user1" }
            })
            expect(res.status).toBe(429)
        })
    })

    describe("headers", () => {
        it("should set rate limit headers", async () => {
            const middleware = withRateLimiter({
                limit: 5,
                duration: "1m",
                headers: {
                    enabled: true,
                    prefix: "X-RateLimit"
                }
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })

            expect(res.headers.get("X-RateLimit-Limit")).toBe("5")
            expect(res.headers.get("X-RateLimit-Remaining")).toBe("4")
            expect(res.headers.get("X-RateLimit-Reset")).toBeDefined()
        })

        it("should not set headers when disabled", async () => {
            const middleware = withRateLimiter({
                limit: 5,
                duration: "1m",
                headers: {
                    enabled: false
                }
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })

            expect(res.headers.get("X-RateLimit-Limit")).toBeNull()
            expect(res.headers.get("X-RateLimit-Remaining")).toBeNull()
        })

        it("should use custom header prefix", async () => {
            const middleware = withRateLimiter({
                limit: 5,
                duration: "1m",
                headers: {
                    prefix: "X-Custom"
                }
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })

            expect(res.headers.get("X-Custom-Limit")).toBe("5")
            expect(res.headers.get("X-Custom-Remaining")).toBe("4")
        })

        it("should include metadata in headers when enabled", async () => {
            const middleware = withRateLimiter({
                limit: 5,
                duration: "1m",
                metadata: { test: "value" },
                headers: {
                    includeMetadata: true
                }
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })

            expect(res.headers.get("X-RateLimit-Metadata")).toBe('{"test":"value"}')
        })
    })

    describe("response customization", () => {
        it("should use custom status code", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m",
                response: {
                    status: 418
                }
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // First request
            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // Second request

            expect(res.status).toBe(418)
        })

        it("should use custom message", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m",
                response: {
                    message: "Rate limit exceeded"
                }
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // First request
            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // Second request

            const body = await res.json()
            expect(body.error).toBe("Rate limit exceeded")
        })

        it("should include retry information in response", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // First request
            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // Second request

            const body = await res.json()
            expect(body).toHaveProperty("retryAfter")
            expect(body).toHaveProperty("remaining")
            expect(body).toHaveProperty("limit")
        })
    })

    describe("callbacks", () => {
        it("should call onLimit callback", async () => {
            let limitCalled = false
            let limitCtx: any = null
            let limitResult: RateLimitResult | null = null

            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m",
                onLimit: (ctx: any, result: RateLimitResult) => {
                    limitCalled = true
                    limitCtx = ctx
                    limitResult = result
                }
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // First request
            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // Second request

            expect(limitCalled).toBe(true)
            expect(limitCtx).toBeDefined()
            expect(limitResult?.allowed).toBe(false)
        })

        it("should call onSuccess callback", async () => {
            let successCalled = false
            let successCtx: any = null
            let successResult: RateLimitResult | null = null

            const middleware = withRateLimiter({
                limit: 5,
                duration: "1m",
                onSuccess: (ctx: any, result: RateLimitResult) => {
                    successCalled = true
                    successCtx = ctx
                    successResult = result
                }
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })

            expect(successCalled).toBe(true)
            expect(successCtx).toBeDefined()
            expect(successResult?.allowed).toBe(true)
        })
    })

    describe("store integration", () => {
        it("should use custom store", async () => {
            const customStore = new MemoryStore({ maxSize: 10 })
            const middleware = withRateLimiter({
                limit: 2,
                duration: "1m",
                store: customStore
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            // Test that the store is being used
            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })
            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })
            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })

            expect(res.status).toBe(429)
        })
    })

    describe("strategy integration", () => {
        it("should work with different strategies", async () => {
            const middleware = withRateLimiter({
                limit: 3,
                duration: "1m",
                strategy: "sliding-window"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            // Should work with sliding window strategy
            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })
            expect(res.status).toBe(200)
        })
    })

    describe("IP detection", () => {
        it("should use x-forwarded-for header", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.2" }
            })
            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.2" }
            })

            expect(res.status).toBe(429)
        })

        it("should fall back to x-real-ip header", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            await app.request("/", {
                headers: { "x-real-ip": "203.0.113.3" }
            })
            const res = await app.request("/", {
                headers: { "x-real-ip": "203.0.113.3" }
            })

            expect(res.status).toBe(429)
        })

        it("should handle missing IP headers", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            await app.request("/")
            const res = await app.request("/")

            expect(res.status).toBe(429)
        })
    })

    describe("edge cases", () => {
        it("should handle concurrent requests", async () => {
            const middleware = withRateLimiter({
                limit: 2,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            // Simulate concurrent requests
            const promises: Array<Promise<Response> | Response> = []
            for (let i = 0; i < 5; i++) {
                promises.push(app.request("/", {
                    headers: {
                        "x-forwarded-for": `203.0.113.${i}`
                    }
                }))
            }

            const responses = await Promise.all(promises)
            const blockedCount = responses.filter(res => res.status === 429).length

            expect(blockedCount).toBeGreaterThan(0)
        })

        it("should handle different IPs separately", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            // Both should be allowed (different IPs)
            const res1 = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            })
            const res2 = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.2" }
            })

            expect(res1.status).toBe(200)
            expect(res2.status).toBe(200)
        })

        it("should handle custom key with different values", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m",
                key: (ctx) => `user:${ctx.req.header("user-id") || "anonymous"}`
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            // Both should be allowed (different users)
            const res1 = await app.request("/", {
                headers: { "user-id": "user1" }
            })
            const res2 = await app.request("/", {
                headers: { "user-id": "user2" }
            })

            expect(res1.status).toBe(200)
            expect(res2.status).toBe(200)
        })
    })

    describe("response format", () => {
        it("should return proper JSON response on limit exceeded", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m"
            })

            app.use("*", middleware)
            app.get("/", (c) => c.json({ message: "Hello" }))

            await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // First request
            const res = await app.request("/", {
                headers: { "x-forwarded-for": "203.0.113.1" }
            }) // Second request

            const body = await res.json()
            expect(body).toHaveProperty("error")
            expect(body).toHaveProperty("retryAfter")
            expect(body).toHaveProperty("remaining")
            expect(body).toHaveProperty("limit")
            expect(typeof body.retryAfter).toBe("string")
            expect(typeof body.remaining).toBe("number")
            expect(typeof body.limit).toBe("number")
        })
    })
}) 
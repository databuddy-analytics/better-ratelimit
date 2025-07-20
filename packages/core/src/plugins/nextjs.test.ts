import { describe, it, expect, beforeEach, mock } from "bun:test"
import { NextRequest, NextResponse } from "next/server"
import { createRateLimitHandler, withRateLimiter } from "./nextjs"
import { MemoryStore } from "../adapters/memory"

// Mock NextRequest and NextResponse
const createMockRequest = (headers: Record<string, string> = {}): NextRequest => {
    const mockHeaders = new Map(Object.entries(headers))
    return {
        headers: {
            forEach: (callback: (value: string, key: string) => void) => {
                mockHeaders.forEach((value, key) => callback(value, key))
            },
            get: (name: string) => mockHeaders.get(name) || null,
            has: (name: string) => mockHeaders.has(name),
            set: (name: string, value: string) => mockHeaders.set(name, value),
            append: (name: string, value: string) => {
                const existing = mockHeaders.get(name)
                mockHeaders.set(name, existing ? `${existing}, ${value}` : value)
            },
            delete: (name: string) => mockHeaders.delete(name),
            entries: () => mockHeaders.entries(),
            keys: () => mockHeaders.keys(),
            values: () => mockHeaders.values(),
            [Symbol.iterator]: () => mockHeaders[Symbol.iterator]()
        }
    } as unknown as NextRequest
}

describe("NextJS Rate Limiter", () => {
    let store: MemoryStore

    beforeEach(() => {
        store = new MemoryStore()
        mock.restore()
    })

    describe("createRateLimitHandler", () => {
        it("should allow requests within limit", async () => {
            const handler = createRateLimitHandler({
                limit: 5,
                duration: "1m",
                store
            })

            const req = createMockRequest({
                "cf-connecting-ip": "192.168.1.1"
            })

            const result = await handler(req)
            expect(result).toBeNull()
        })

        it("should block requests over limit", async () => {
            const handler = createRateLimitHandler({
                limit: 2,
                duration: "1m",
                store
            })

            const req = createMockRequest({
                "cf-connecting-ip": "192.168.1.1"
            })

            // First two requests should pass
            expect(await handler(req)).toBeNull()
            expect(await handler(req)).toBeNull()

            // Third request should be blocked
            const result = await handler(req)
            expect(result).toBeInstanceOf(NextResponse)
            expect(result?.status).toBe(429)
        })

        it("should set rate limit headers", async () => {
            const handler = createRateLimitHandler({
                limit: 1,
                duration: "1m",
                store,
                headers: {
                    enabled: true,
                    prefix: "X-RateLimit"
                }
            })

            const req = createMockRequest({
                "cf-connecting-ip": "192.168.1.1"
            })

            // First request should pass
            expect(await handler(req)).toBeNull()

            // Second request should be blocked with headers
            const result = await handler(req)
            expect(result).toBeInstanceOf(NextResponse)
            expect(result?.headers.get("X-RateLimit-Limit")).toBe("1")
            expect(result?.headers.get("X-RateLimit-Remaining")).toBe("0")
            expect(result?.headers.has("X-RateLimit-Reset")).toBe(true)
        })

        it("should use custom key function", async () => {
            let calledWith: NextRequest | null = null
            const customKey = (req: NextRequest) => {
                calledWith = req
                return "custom-key"
            }

            const handler = createRateLimitHandler({
                limit: 1,
                duration: "1m",
                store,
                key: customKey
            })

            const req = createMockRequest({
                "cf-connecting-ip": "192.168.1.1"
            })

            await handler(req)
            expect(calledWith).not.toBeNull()
        })

        it("should prioritize Cloudflare IP headers", async () => {
            const handler = createRateLimitHandler({
                limit: 1,
                duration: "1m",
                store
            })

            const req = createMockRequest({
                "cf-connecting-ip": "203.0.113.1",
                "x-forwarded-for": "10.0.0.1, 203.0.113.1",
                "x-real-ip": "192.168.1.1"
            })

            await handler(req)

            // Check that the rate limit was applied using the Cloudflare IP
            const result = await handler(req)
            expect(result).toBeInstanceOf(NextResponse)
        })

        it("should handle private IPs with fallback", async () => {
            const handler = createRateLimitHandler({
                limit: 1,
                duration: "1m",
                store
            })

            const req = createMockRequest({
                "x-forwarded-for": "192.168.1.1" // Private IP
            })

            await handler(req)

            // Should use fallback key for private IPs
            const result = await handler(req)
            expect(result).toBeInstanceOf(NextResponse)
        })

        it("should call onLimit callback", async () => {
            let onLimitCalled = false
            const onLimit = () => {
                onLimitCalled = true
            }

            const handler = createRateLimitHandler({
                limit: 1,
                duration: "1m",
                store,
                onLimit
            })

            const req = createMockRequest({
                "cf-connecting-ip": "192.168.1.1"
            })

            await handler(req) // First request
            await handler(req) // Second request (blocked)

            expect(onLimitCalled).toBe(true)
        })

        it("should call onSuccess callback", async () => {
            let onSuccessCalled = false
            const onSuccess = () => {
                onSuccessCalled = true
            }

            const handler = createRateLimitHandler({
                limit: 2,
                duration: "1m",
                store,
                onSuccess
            })

            const req = createMockRequest({
                "cf-connecting-ip": "192.168.1.1"
            })

            await handler(req) // First request

            expect(onSuccessCalled).toBe(true)
        })

        it("should handle different strategies", async () => {
            const handler = createRateLimitHandler({
                limit: 2,
                duration: "1m",
                strategy: "sliding-window",
                store
            })

            const req = createMockRequest({
                "cf-connecting-ip": "192.168.1.1"
            })

            // Should work with sliding window strategy
            expect(await handler(req)).toBeNull()
            expect(await handler(req)).toBeNull()

            const result = await handler(req)
            expect(result).toBeInstanceOf(NextResponse)
        })
    })

    describe("withRateLimiter", () => {
        it("should create middleware function", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m",
                store
            })

            const req = createMockRequest({
                "cf-connecting-ip": "192.168.1.1"
            })

            const result = await middleware(req)
            expect(result).toBeNull() // First request should pass
        })

        it("should return response when rate limited", async () => {
            const middleware = withRateLimiter({
                limit: 1,
                duration: "1m",
                store
            })

            const req = createMockRequest({
                "cf-connecting-ip": "192.168.1.1"
            })

            await middleware(req) // First request
            const result = await middleware(req) // Second request

            expect(result).toBeInstanceOf(NextResponse)
            expect(result?.status).toBe(429)
        })
    })
}) 
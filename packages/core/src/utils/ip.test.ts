import { describe, it, expect } from "bun:test"
import {
    getClientIP,
    parseXForwardedFor,
    isPrivateIP,
    getIPKey,
    getClientIPWithContext,
    type RequestContext
} from "./ip"

describe("IP Utils", () => {
    describe("getClientIP", () => {
        it("should prioritize Cloudflare IP headers", () => {
            const ctx: RequestContext = {
                headers: {
                    "cf-connecting-ip": "203.0.113.1",
                    "x-forwarded-for": "192.168.1.1, 203.0.113.1",
                    "x-real-ip": "10.0.0.1"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.1")
        })

        it("should prioritize Fastly IP headers", () => {
            const ctx: RequestContext = {
                headers: {
                    "fastly-client-ip": "203.0.113.2",
                    "x-forwarded-for": "192.168.1.1, 203.0.113.2",
                    "x-real-ip": "10.0.0.1"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.2")
        })

        it("should parse x-forwarded-for correctly", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": "192.168.1.1, 203.0.113.3, 10.0.0.1"
                }
            }

            expect(getClientIP(ctx)).toBe("192.168.1.1")
        })

        it("should handle x-real-ip", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-real-ip": "203.0.113.4"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.4")
        })

        it("should handle x-client-ip", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-client-ip": "203.0.113.5"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.5")
        })

        it("should handle x-forwarded", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded": "203.0.113.6"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.6")
        })

        it("should handle x-cluster-client-ip", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-cluster-client-ip": "203.0.113.7"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.7")
        })

        it("should handle Vercel headers", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-vercel-forwarded-for": "203.0.113.8"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.8")
        })

        it("should handle Netlify headers", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-netlify-forwarded-for": "203.0.113.9"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.9")
        })

        it("should use ctx.ip when available", () => {
            const ctx: RequestContext = {
                ip: "203.0.113.10"
            }

            expect(getClientIP(ctx)).toBe("203.0.113.10")
        })

        it("should use connection.remoteAddress", () => {
            const ctx: RequestContext = {
                connection: {
                    remoteAddress: "203.0.113.11"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.11")
        })

        it("should use socket.remoteAddress", () => {
            const ctx: RequestContext = {
                socket: {
                    remoteAddress: "203.0.113.12"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.12")
        })

        it("should return 'unknown' when no IP found", () => {
            const ctx: RequestContext = {}
            expect(getClientIP(ctx)).toBe("unknown")
        })

        it("should handle empty headers", () => {
            const ctx: RequestContext = {
                headers: {}
            }
            expect(getClientIP(ctx)).toBe("unknown")
        })

        it("should handle empty x-forwarded-for", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": ""
                }
            }
            expect(getClientIP(ctx)).toBe("unknown")
        })

        it("should handle whitespace in x-forwarded-for", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": "  203.0.113.13  ,  192.168.1.1  "
                }
            }
            expect(getClientIP(ctx)).toBe("203.0.113.13")
        })
    })

    describe("parseXForwardedFor", () => {
        it("should parse single IP", () => {
            expect(parseXForwardedFor("203.0.113.1")).toBe("203.0.113.1")
        })

        it("should parse multiple IPs and return first", () => {
            expect(parseXForwardedFor("192.168.1.1, 203.0.113.2, 10.0.0.1")).toBe("192.168.1.1")
        })

        it("should handle whitespace", () => {
            expect(parseXForwardedFor("  203.0.113.3  ,  192.168.1.1  ")).toBe("203.0.113.3")
        })

        it("should return 'unknown' for empty string", () => {
            expect(parseXForwardedFor("")).toBe("unknown")
        })

        it("should return 'unknown' for undefined", () => {
            expect(parseXForwardedFor(undefined as any)).toBe("unknown")
        })

        it("should handle single IP with whitespace", () => {
            expect(parseXForwardedFor("  203.0.113.4  ")).toBe("203.0.113.4")
        })
    })

    describe("isPrivateIP", () => {
        it("should identify private IPs", () => {
            expect(isPrivateIP("10.0.0.1")).toBe(true)
            expect(isPrivateIP("10.255.255.255")).toBe(true)
            expect(isPrivateIP("172.16.0.1")).toBe(true)
            expect(isPrivateIP("172.31.255.255")).toBe(true)
            expect(isPrivateIP("192.168.0.1")).toBe(true)
            expect(isPrivateIP("192.168.255.255")).toBe(true)
            expect(isPrivateIP("127.0.0.1")).toBe(true)
            expect(isPrivateIP("169.254.0.1")).toBe(true)
        })

        it("should identify public IPs", () => {
            expect(isPrivateIP("203.0.113.1")).toBe(false)
            expect(isPrivateIP("8.8.8.8")).toBe(false)
            expect(isPrivateIP("1.1.1.1")).toBe(false)
        })

        it("should handle IPv6 addresses", () => {
            expect(isPrivateIP("::1")).toBe(true)
            expect(isPrivateIP("fe80::1")).toBe(true)
            expect(isPrivateIP("fc00::1")).toBe(true)
            expect(isPrivateIP("fd00::1")).toBe(true)
            expect(isPrivateIP("2001:4860:4860::8888")).toBe(false)
        })

        it("should handle IPv4-mapped IPv6", () => {
            expect(isPrivateIP("::ffff:10.0.0.1")).toBe(true)
            expect(isPrivateIP("::ffff:192.168.1.1")).toBe(true)
            expect(isPrivateIP("::ffff:203.0.113.1")).toBe(false)
        })

        it("should handle edge cases", () => {
            expect(isPrivateIP("")).toBe(false)
            expect(isPrivateIP("unknown")).toBe(false)
            expect(isPrivateIP("invalid")).toBe(false)
            expect(isPrivateIP("10.0.0")).toBe(false)
        })

        it("should handle boundary cases", () => {
            expect(isPrivateIP("9.255.255.255")).toBe(false)
            expect(isPrivateIP("11.0.0.0")).toBe(false)
            expect(isPrivateIP("172.15.255.255")).toBe(false)
            expect(isPrivateIP("172.32.0.0")).toBe(false)
            expect(isPrivateIP("192.167.255.255")).toBe(false)
            expect(isPrivateIP("192.169.0.0")).toBe(false)
        })
    })

    describe("getIPKey", () => {
        it("should return fallback for unknown IP", () => {
            const ctx: RequestContext = {}
            expect(getIPKey(ctx)).toBe("ip:fallback")
        })

        it("should return fallback for private IP", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": "192.168.1.1"
                }
            }
            expect(getIPKey(ctx)).toBe("ip:fallback")
        })

        it("should return IP key for public IP", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": "203.0.113.1"
                }
            }
            expect(getIPKey(ctx)).toBe("ip:203.0.113.1")
        })

        it("should use custom prefix", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": "203.0.113.1"
                }
            }
            expect(getIPKey(ctx, "rate-limit")).toBe("rate-limit:203.0.113.1")
        })

        it("should handle IPv6 addresses", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": "2001:4860:4860::8888"
                }
            }
            expect(getIPKey(ctx)).toBe("ip:2001:4860:4860::8888")
        })
    })

    describe("getClientIPWithContext", () => {
        it("should return complete IP information", () => {
            const ctx: RequestContext = {
                headers: {
                    "cf-connecting-ip": "203.0.113.1",
                    "x-forwarded-for": "192.168.1.1, 203.0.113.1"
                }
            }

            const result = getClientIPWithContext(ctx)

            expect(result.ip).toBe("203.0.113.1")
            expect(result.source).toBe("cloudflare")
            expect(result.isPrivate).toBe(false)
            expect(result.headers).toContain("cf-connecting-ip")
            expect(result.headers).toContain("x-forwarded-for")
        })

        it("should identify private IPs", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": "192.168.1.1"
                }
            }

            const result = getClientIPWithContext(ctx)

            expect(result.ip).toBe("192.168.1.1")
            expect(result.isPrivate).toBe(true)
        })

        it("should identify source correctly", () => {
            const testCases: Array<{ ctx: RequestContext; expected: string }> = [
                { ctx: { headers: { "cf-connecting-ip": "203.0.113.1" } }, expected: "cloudflare" },
                { ctx: { headers: { "fastly-client-ip": "203.0.113.2" } }, expected: "fastly" },
                { ctx: { headers: { "x-forwarded-for": "203.0.113.3" } }, expected: "x-forwarded-for" },
                { ctx: { headers: { "x-real-ip": "203.0.113.4" } }, expected: "x-real-ip" },
                { ctx: { ip: "203.0.113.5", headers: {} }, expected: "ctx.ip" },
                { ctx: { connection: { remoteAddress: "203.0.113.6" }, headers: {} }, expected: "connection.remoteAddress" },
                { ctx: { socket: { remoteAddress: "203.0.113.7" }, headers: {} }, expected: "socket.remoteAddress" }
            ]

            for (const testCase of testCases) {
                const result = getClientIPWithContext(testCase.ctx)
                expect(result.source).toBe(testCase.expected)
            }
        })

        it("should return 'unknown' source when no IP found", () => {
            const ctx: RequestContext = {}
            const result = getClientIPWithContext(ctx)

            expect(result.ip).toBe("unknown")
            expect(result.source).toBe("unknown")
            expect(result.isPrivate).toBe(false)
        })

        it("should include all relevant headers", () => {
            const ctx: RequestContext = {
                headers: {
                    "cf-connecting-ip": "203.0.113.1",
                    "x-forwarded-for": "192.168.1.1",
                    "x-real-ip": "10.0.0.1",
                    "user-agent": "Mozilla/5.0",
                    "content-type": "application/json"
                }
            }

            const result = getClientIPWithContext(ctx)

            expect(result.headers).toContain("cf-connecting-ip")
            expect(result.headers).toContain("x-forwarded-for")
            expect(result.headers).toContain("x-real-ip")
            expect(result.headers).not.toContain("user-agent")
            expect(result.headers).not.toContain("content-type")
        })
    })

    describe("header priority order", () => {
        it("should follow correct priority order", () => {
            const ctx: RequestContext = {
                headers: {
                    "cf-connecting-ip": "203.0.113.1",
                    "fastly-client-ip": "203.0.113.2",
                    "x-forwarded-for": "203.0.113.3",
                    "x-real-ip": "203.0.113.4",
                    "x-client-ip": "203.0.113.5",
                    "x-forwarded": "203.0.113.6",
                    "x-cluster-client-ip": "203.0.113.7",
                    "x-vercel-forwarded-for": "203.0.113.8",
                    "x-netlify-forwarded-for": "203.0.113.9"
                },
                ip: "203.0.113.10",
                connection: { remoteAddress: "203.0.113.11" },
                socket: { remoteAddress: "203.0.113.12" }
            }

            // Should prioritize Cloudflare
            expect(getClientIP(ctx)).toBe("203.0.113.1")
        })

        it("should fall back to next priority when higher priority is missing", () => {
            const ctx: RequestContext = {
                headers: {
                    "x-forwarded-for": "203.0.113.3",
                    "x-real-ip": "203.0.113.4"
                }
            }

            expect(getClientIP(ctx)).toBe("203.0.113.3")
        })
    })
}) 
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
            const headers = {
                "cf-connecting-ip": "203.0.113.1",
                "x-forwarded-for": "192.168.1.1, 203.0.113.1",
                "x-real-ip": "10.0.0.1"
            }

            expect(getClientIP(headers)).toBe("203.0.113.1")
        })

        it("should prioritize Fastly IP headers", () => {
            const headers = {
                "fastly-client-ip": "203.0.113.2",
                "x-forwarded-for": "192.168.1.1, 203.0.113.2",
                "x-real-ip": "10.0.0.1"
            }

            expect(getClientIP(headers)).toBe("203.0.113.2")
        })

        it("should parse x-forwarded-for correctly", () => {
            const headers = {
                "x-forwarded-for": "192.168.1.1, 203.0.113.3, 10.0.0.1"
            }

            expect(getClientIP(headers)).toBe("192.168.1.1")
        })

        it("should handle x-real-ip", () => {
            const headers = {
                "x-real-ip": "203.0.113.4"
            }

            expect(getClientIP(headers)).toBe("203.0.113.4")
        })

        it("should handle x-client-ip", () => {
            const headers = {
                "x-client-ip": "203.0.113.5"
            }

            expect(getClientIP(headers)).toBe("203.0.113.5")
        })

        it("should handle x-forwarded", () => {
            const headers = {
                "x-forwarded": "203.0.113.6"
            }

            expect(getClientIP(headers)).toBe("203.0.113.6")
        })

        it("should handle x-cluster-client-ip", () => {
            const headers = {
                "x-cluster-client-ip": "203.0.113.7"
            }

            expect(getClientIP(headers)).toBe("203.0.113.7")
        })

        it("should handle Vercel headers", () => {
            const headers = {
                "x-vercel-forwarded-for": "203.0.113.8"
            }

            expect(getClientIP(headers)).toBe("203.0.113.8")
        })

        it("should handle Netlify headers", () => {
            const headers = {
                "x-netlify-forwarded-for": "203.0.113.9"
            }

            expect(getClientIP(headers)).toBe("203.0.113.9")
        })

        it("should return 'unknown' when no IP found", () => {
            const headers = {}
            expect(getClientIP(headers)).toBe("unknown")
        })

        it("should handle empty headers", () => {
            const headers = {}
            expect(getClientIP(headers)).toBe("unknown")
        })

        it("should handle empty x-forwarded-for", () => {
            const headers = {
                "x-forwarded-for": ""
            }
            expect(getClientIP(headers)).toBe("unknown")
        })

        it("should handle whitespace in x-forwarded-for", () => {
            const headers = {
                "x-forwarded-for": "  203.0.113.13  ,  192.168.1.1  "
            }
            expect(getClientIP(headers)).toBe("203.0.113.13")
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
            const headers = {}
            expect(getIPKey(headers)).toBe("ip:fallback")
        })

        it("should return fallback for private IP", () => {
            const headers = {
                "x-forwarded-for": "192.168.1.1"
            }
            expect(getIPKey(headers)).toBe("ip:fallback")
        })

        it("should return IP key for public IP", () => {
            const headers = {
                "x-forwarded-for": "203.0.113.1"
            }
            expect(getIPKey(headers)).toBe("ip:203.0.113.1")
        })

        it("should use custom prefix", () => {
            const headers = {
                "x-forwarded-for": "203.0.113.1"
            }
            expect(getIPKey(headers, "rate-limit")).toBe("rate-limit:203.0.113.1")
        })

        it("should handle IPv6 addresses", () => {
            const headers = {
                "x-forwarded-for": "2001:4860:4860::8888"
            }
            expect(getIPKey(headers)).toBe("ip:2001:4860:4860::8888")
        })
    })

    describe("getClientIPWithContext", () => {
        it("should return complete IP information", () => {
            const headers = {
                "cf-connecting-ip": "203.0.113.1",
                "x-forwarded-for": "192.168.1.1, 203.0.113.1"
            }

            const result = getClientIPWithContext(headers)

            expect(result.ip).toBe("203.0.113.1")
            expect(result.source).toBe("cloudflare")
            expect(result.isPrivate).toBe(false)
            expect(result.headers).toContain("cf-connecting-ip")
            expect(result.headers).toContain("x-forwarded-for")
        })

        it("should identify private IPs", () => {
            const headers = {
                "x-forwarded-for": "192.168.1.1"
            }

            const result = getClientIPWithContext(headers)

            expect(result.ip).toBe("192.168.1.1")
            expect(result.isPrivate).toBe(true)
        })

        it("should identify source correctly", () => {
            const testCases: Array<{ headers: Record<string, string>; expected: string }> = [
                { headers: { "cf-connecting-ip": "203.0.113.1" }, expected: "cloudflare" },
                { headers: { "fastly-client-ip": "203.0.113.2" }, expected: "fastly" },
                { headers: { "x-forwarded-for": "203.0.113.3" }, expected: "x-forwarded-for" },
                { headers: { "x-real-ip": "203.0.113.4" }, expected: "x-real-ip" }
            ]

            for (const testCase of testCases) {
                const result = getClientIPWithContext(testCase.headers)
                expect(result.source).toBe(testCase.expected)
            }
        })

        it("should return 'unknown' source when no IP found", () => {
            const headers = {}
            const result = getClientIPWithContext(headers)

            expect(result.ip).toBe("unknown")
            expect(result.source).toBe("unknown")
            expect(result.isPrivate).toBe(false)
        })

        it("should include all relevant headers", () => {
            const headers = {
                "cf-connecting-ip": "203.0.113.1",
                "x-forwarded-for": "192.168.1.1",
                "x-real-ip": "10.0.0.1",
                "user-agent": "Mozilla/5.0",
                "content-type": "application/json"
            }

            const result = getClientIPWithContext(headers)

            expect(result.headers).toContain("cf-connecting-ip")
            expect(result.headers).toContain("x-forwarded-for")
            expect(result.headers).toContain("x-real-ip")
            expect(result.headers).not.toContain("user-agent")
            expect(result.headers).not.toContain("content-type")
        })
    })

    describe("header priority order", () => {
        it("should follow correct priority order", () => {
            const headers = {
                "cf-connecting-ip": "203.0.113.1",
                "fastly-client-ip": "203.0.113.2",
                "x-forwarded-for": "203.0.113.3",
                "x-real-ip": "203.0.113.4",
                "x-client-ip": "203.0.113.5",
                "x-forwarded": "203.0.113.6",
                "x-cluster-client-ip": "203.0.113.7",
                "x-vercel-forwarded-for": "203.0.113.8",
                "x-netlify-forwarded-for": "203.0.113.9"
            }

            // Should prioritize Cloudflare
            expect(getClientIP(headers)).toBe("203.0.113.1")
        })

        it("should fall back to next priority when higher priority is missing", () => {
            const headers = {
                "x-forwarded-for": "203.0.113.3",
                "x-real-ip": "203.0.113.4"
            }

            expect(getClientIP(headers)).toBe("203.0.113.3")
        })
    })
}) 
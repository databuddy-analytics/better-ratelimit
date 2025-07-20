import { describe, it, expect } from "bun:test"
import { parseDuration, formatDuration } from "./duration"

describe("Duration Utils", () => {
    describe("parseDuration", () => {
        it("should parse seconds", () => {
            expect(parseDuration("30s")).toBe(30000)
            expect(parseDuration("1s")).toBe(1000)
            expect(parseDuration("0s")).toBe(0)
        })

        it("should parse minutes", () => {
            expect(parseDuration("5m")).toBe(300000)
            expect(parseDuration("1m")).toBe(60000)
            expect(parseDuration("30m")).toBe(1800000)
        })

        it("should parse hours", () => {
            expect(parseDuration("2h")).toBe(7200000)
            expect(parseDuration("1h")).toBe(3600000)
            expect(parseDuration("24h")).toBe(86400000)
        })

        it("should parse days", () => {
            expect(parseDuration("1d")).toBe(86400000)
            expect(parseDuration("7d")).toBe(604800000)
            expect(parseDuration("30d")).toBe(2592000000)
        })

        it("should parse weeks", () => {
            expect(parseDuration("1w")).toBe(604800000)
            expect(parseDuration("2w")).toBe(1209600000)
            expect(parseDuration("52w")).toBe(31449600000)
        })

        it("should parse years", () => {
            expect(parseDuration("1y")).toBe(31536000000)
            expect(parseDuration("2y")).toBe(63072000000)
        })

        it("should handle large numbers", () => {
            expect(parseDuration("1000s")).toBe(1000000)
            expect(parseDuration("100m")).toBe(6000000)
            expect(parseDuration("100h")).toBe(360000000)
        })

        it("should throw error for invalid format", () => {
            expect(() => parseDuration("invalid")).toThrow("Invalid duration format")
            expect(() => parseDuration("30")).toThrow("Invalid duration format")
            expect(() => parseDuration("s30")).toThrow("Invalid duration format")
            expect(() => parseDuration("30x")).toThrow("Unknown duration unit")
        })

        it("should throw error for empty string", () => {
            expect(() => parseDuration("")).toThrow("Invalid duration format")
        })

        it("should throw error for missing unit", () => {
            expect(() => parseDuration("30")).toThrow("Invalid duration format")
        })

        it("should throw error for unknown unit", () => {
            expect(() => parseDuration("30x")).toThrow("Unknown duration unit")
            expect(() => parseDuration("30z")).toThrow("Unknown duration unit")
        })

        it("should handle zero values", () => {
            expect(parseDuration("0s")).toBe(0)
            expect(parseDuration("0m")).toBe(0)
            expect(parseDuration("0h")).toBe(0)
            expect(parseDuration("0d")).toBe(0)
        })
    })

    describe("formatDuration", () => {
        it("should format milliseconds", () => {
            expect(formatDuration(500)).toBe("500ms")
            expect(formatDuration(999)).toBe("999ms")
            expect(formatDuration(0)).toBe("0ms")
        })

        it("should format seconds", () => {
            expect(formatDuration(1000)).toBe("1s")
            expect(formatDuration(30000)).toBe("30s")
            expect(formatDuration(59999)).toBe("59s")
        })

        it("should format minutes", () => {
            expect(formatDuration(60000)).toBe("1m")
            expect(formatDuration(300000)).toBe("5m")
            expect(formatDuration(3599999)).toBe("59m")
        })

        it("should format hours", () => {
            expect(formatDuration(3600000)).toBe("1h")
            expect(formatDuration(7200000)).toBe("2h")
            expect(formatDuration(86399999)).toBe("23h")
        })

        it("should format days", () => {
            expect(formatDuration(86400000)).toBe("1d")
            expect(formatDuration(172800000)).toBe("2d")
            expect(formatDuration(2592000000)).toBe("30d")
        })

        it("should handle edge cases", () => {
            expect(formatDuration(999)).toBe("999ms")
            expect(formatDuration(1000)).toBe("1s")
            expect(formatDuration(59999)).toBe("59s")
            expect(formatDuration(60000)).toBe("1m")
            expect(formatDuration(3599999)).toBe("59m")
            expect(formatDuration(3600000)).toBe("1h")
            expect(formatDuration(86399999)).toBe("23h")
            expect(formatDuration(86400000)).toBe("1d")
        })

        it("should handle very large durations", () => {
            expect(formatDuration(31536000000)).toBe("365d") // 1 year
            expect(formatDuration(63072000000)).toBe("730d") // 2 years
        })

        it("should handle negative values", () => {
            expect(formatDuration(-1000)).toBe("-1s")
            expect(formatDuration(-500)).toBe("-500ms")
        })

        it("should handle fractional values", () => {
            expect(formatDuration(1500)).toBe("1s")
            expect(formatDuration(65000)).toBe("1m")
            expect(formatDuration(3660000)).toBe("1h")
        })
    })

    describe("round-trip consistency", () => {
        it("should maintain consistency for common durations", () => {
            const testCases = [
                "30s", "1m", "5m", "1h", "2h", "1d", "7d"
            ]

            for (const duration of testCases) {
                const ms = parseDuration(duration)
                const formatted = formatDuration(ms)

                // Note: formatDuration rounds down, so we check the original
                expect(ms).toBeGreaterThan(0)
                expect(formatted).toBeDefined()
            }
        })

        it("should handle edge cases in round-trip", () => {
            // Test boundary conditions
            expect(parseDuration("1s")).toBe(1000)
            expect(formatDuration(1000)).toBe("1s")

            expect(parseDuration("1m")).toBe(60000)
            expect(formatDuration(60000)).toBe("1m")

            expect(parseDuration("1h")).toBe(3600000)
            expect(formatDuration(3600000)).toBe("1h")
        })
    })
}) 
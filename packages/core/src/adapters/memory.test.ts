import { describe, it, expect, beforeEach, afterEach } from "bun:test"
import { MemoryStore } from "./memory"

describe("MemoryStore", () => {
    let store: MemoryStore

    beforeEach(() => {
        store = new MemoryStore()
    })

    afterEach(() => {
        store.destroy()
    })

    describe("constructor", () => {
        it("should set default options correctly", () => {
            const stats = store.getStats()
            expect(stats.maxSize).toBe(1000)
            expect(stats.options.defaultTTL).toBe(1000 * 60 * 60) // 1 hour
            expect(stats.options.cleanupInterval).toBe(1000 * 60 * 5) // 5 minutes
        })

        it("should override default options", () => {
            const customStore = new MemoryStore({
                maxSize: 50,
                defaultTTL: 5000,
                cleanupInterval: 10000,
                enableStats: true
            })

            const stats = customStore.getStats()
            expect(stats.maxSize).toBe(50)
            expect(stats.options.defaultTTL).toBe(5000)
            expect(stats.options.cleanupInterval).toBe(10000)
            expect(stats.options.enableStats).toBe(true)

            customStore.destroy()
        })

        it("should disable cleanup timer when interval is 0", () => {
            const store = new MemoryStore({ cleanupInterval: 0 })
            const stats = store.getStats()
            expect(stats.options.cleanupInterval).toBe(0)
            store.destroy()
        })
    })

    describe("basic operations", () => {
        it("should set and get values", async () => {
            await store.set("test-key", 42, 60000)
            const value = await store.get("test-key")
            expect(value).toBe(42)
        })

        it("should increment values", async () => {
            await store.increment("test-key", 60000)
            let value = await store.get("test-key")
            expect(value).toBe(1)

            await store.increment("test-key", 60000)
            value = await store.get("test-key")
            expect(value).toBe(2)
        })

        it("should return null for non-existent keys", async () => {
            const value = await store.get("non-existent")
            expect(value).toBe(null)
        })

        it("should handle multiple keys", async () => {
            await store.set("key1", 1, 60000)
            await store.set("key2", 2, 60000)

            expect(await store.get("key1")).toBe(1)
            expect(await store.get("key2")).toBe(2)
        })
    })

    describe("TTL handling", () => {
        it("should expire values after TTL", async () => {
            await store.set("test-key", 42, 100) // 100ms TTL

            // Value should exist immediately
            expect(await store.get("test-key")).toBe(42)

            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 150))

            // Value should be expired
            expect(await store.get("test-key")).toBe(null)
        })

        it("should handle different TTLs for same key", async () => {
            await store.set("test-key", 1, 100)
            await store.set("test-key", 2, 200)

            expect(await store.get("test-key")).toBe(2)

            // Wait for first TTL but not second
            await new Promise(resolve => setTimeout(resolve, 150))
            expect(await store.get("test-key")).toBe(2)

            // Wait for second TTL
            await new Promise(resolve => setTimeout(resolve, 100))
            expect(await store.get("test-key")).toBe(null)
        })

        it("should not expire values with long TTL", async () => {
            await store.set("test-key", 42, 60000) // 1 minute TTL
            expect(await store.get("test-key")).toBe(42)
        })
    })

    describe("LRU behavior", () => {
        it("should respect maxSize limit", () => {
            const smallStore = new MemoryStore({ maxSize: 2 })

            // Add 3 items to exceed maxSize
            smallStore.set("key1", 1, 60000)
            smallStore.set("key2", 2, 60000)
            smallStore.set("key3", 3, 60000)

            // First item should be evicted
            expect(smallStore.has("key1")).toBe(false)
            expect(smallStore.has("key2")).toBe(true)
            expect(smallStore.has("key3")).toBe(true)

            smallStore.destroy()
        })

        it("should evict least recently used items", () => {
            const smallStore = new MemoryStore({ maxSize: 2 })

            smallStore.set("key1", 1, 60000)
            smallStore.set("key2", 2, 60000)

            // Access key1 to make it recently used
            smallStore.get("key1")

            // Add new item
            smallStore.set("key3", 3, 60000)

            // key2 should be evicted (least recently used)
            expect(smallStore.has("key1")).toBe(true)
            expect(smallStore.has("key2")).toBe(false)
            expect(smallStore.has("key3")).toBe(true)

            smallStore.destroy()
        })
    })

    describe("cleanup", () => {
        it("should clean up expired items", async () => {
            await store.set("expired", 1, 50) // Short TTL
            await store.set("valid", 2, 60000) // Long TTL

            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 100))

            // Manually trigger cleanup
            store.cleanup()

            expect(await store.get("expired")).toBe(null)
            expect(await store.get("valid")).toBe(2)
        })

        it("should handle cleanup with no expired items", () => {
            store.set("key1", 1, 60000)
            store.set("key2", 2, 60000)

            const beforeSize = store.getStats().size
            store.cleanup()
            const afterSize = store.getStats().size

            expect(afterSize).toBe(beforeSize)
        })
    })

    describe("callbacks", () => {
        it("should call onSet callback", async () => {
            let setCalled = false
            let setKey = ""
            let setValue: any = null

            const store = new MemoryStore({
                onSet: (key, value) => {
                    setCalled = true
                    setKey = key
                    setValue = value
                }
            })

            await store.set("test-key", 42, 60000)

            expect(setCalled).toBe(true)
            expect(setKey).toBe("test-key")
            expect(setValue.value).toBe(42)

            store.destroy()
        })

        it("should call onGet callback", async () => {
            let getCalled = false
            let getKey = ""

            const store = new MemoryStore({
                onGet: (key, value) => {
                    getCalled = true
                    getKey = key
                }
            })

            await store.set("test-key", 42, 60000)
            await store.get("test-key")

            expect(getCalled).toBe(true)
            expect(getKey).toBe("test-key")

            store.destroy()
        })

        it("should call onEvict callback", () => {
            let evictCalled = false
            let evictKey = ""

            const store = new MemoryStore({
                maxSize: 1,
                onEvict: (key, value) => {
                    evictCalled = true
                    evictKey = key
                }
            })

            store.set("key1", 1, 60000)
            store.set("key2", 2, 60000) // This should evict key1

            expect(evictCalled).toBe(true)
            expect(evictKey).toBe("key1")

            store.destroy()
        })
    })

    describe("utility methods", () => {
        it("should clear all data", async () => {
            await store.set("key1", 1, 60000)
            await store.set("key2", 2, 60000)

            expect(store.getStats().size).toBe(2)

            store.clear()

            expect(store.getStats().size).toBe(0)
            expect(await store.get("key1")).toBe(null)
            expect(await store.get("key2")).toBe(null)
        })

        it("should check if key exists", async () => {
            expect(store.has("test-key")).toBe(false)

            await store.set("test-key", 42, 60000)
            expect(store.has("test-key")).toBe(true)
        })

        it("should delete specific keys", async () => {
            await store.set("key1", 1, 60000)
            await store.set("key2", 2, 60000)

            expect(store.delete("key1")).toBe(true)
            expect(store.delete("non-existent")).toBe(false)

            expect(await store.get("key1")).toBe(null)
            expect(await store.get("key2")).toBe(2)
        })

        it("should return all keys", async () => {
            await store.set("key1", 1, 60000)
            await store.set("key2", 2, 60000)

            const keys = store.keys()
            expect(keys).toContain("key1")
            expect(keys).toContain("key2")
            expect(keys.length).toBe(2)
        })
    })

    describe("stats", () => {
        it("should return basic stats", () => {
            const stats = store.getStats()
            expect(stats).toHaveProperty("size")
            expect(stats).toHaveProperty("maxSize")
            expect(stats).toHaveProperty("options")
        })

        it("should include additional stats when enabled", () => {
            const store = new MemoryStore({ enableStats: true })
            const stats = store.getStats()

            expect(stats).toHaveProperty("cleanupInterval")
            expect(stats).toHaveProperty("defaultTTL")

            store.destroy()
        })
    })

    describe("updateOptions", () => {
        it("should update options in place", () => {
            const originalStats = store.getStats()

            store.updateOptions({
                maxSize: 500,
                cleanupInterval: 10000
            })

            const newStats = store.getStats()
            expect(newStats.maxSize).toBe(1000)
            expect(newStats.options.cleanupInterval).toBe(10000)
            expect(newStats.options.maxSize).toBe(500)
        })

        it("should restart cleanup timer when interval changes", () => {
            // Create store with cleanup disabled
            const store = new MemoryStore({ cleanupInterval: 0 })

            // Enable cleanup
            store.updateOptions({ cleanupInterval: 1000 })
            const stats = store.getStats()
            expect(stats.options.cleanupInterval).toBe(1000)

            store.destroy()
        })
    })

    describe("destroy", () => {
        it("should clean up resources", () => {
            const store = new MemoryStore({ cleanupInterval: 1000 })

            // Add some data
            store.set("key1", 1, 60000)
            expect(store.getStats().size).toBe(1)

            // Destroy should clear data and stop timer
            store.destroy()
            expect(store.getStats().size).toBe(0)
        })
    })

    describe("edge cases", () => {
        it("should handle zero TTL", async () => {
            await store.set("test-key", 42, 0)
            expect(await store.get("test-key")).toBe(null)
        })

        it("should handle negative TTL", async () => {
            await store.set("test-key", 42, -1000)
            expect(await store.get("test-key")).toBe(null)
        })

        it("should handle concurrent access", async () => {
            const promises: Promise<number>[] = []
            for (let i = 0; i < 10; i++) {
                promises.push(store.increment("concurrent-key", 60000))
            }

            const results = await Promise.all(promises)
            expect(results).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        })

        it("should handle very large values", async () => {
            const largeValue = Number.MAX_SAFE_INTEGER
            await store.set("large-key", largeValue, 60000)
            expect(await store.get("large-key")).toBe(largeValue)
        })
    })
}) 
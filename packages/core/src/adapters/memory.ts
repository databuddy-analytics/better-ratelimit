import type { RateLimitStore, StoreOptions } from "../types"
import { LRUCache } from "lru-cache"

interface CacheEntry {
    value: number
    expires: number
}

export interface MemoryStoreOptions extends StoreOptions {
    maxSize?: number
    defaultTTL?: number
    cleanupInterval?: number
    enableStats?: boolean
    onEvict?: (key: string, value: CacheEntry) => void
    onSet?: (key: string, value: CacheEntry) => void
    onGet?: (key: string, value: CacheEntry | null) => void
}

export class MemoryStore implements RateLimitStore {
    private cache: LRUCache<string, CacheEntry>
    private options: Required<MemoryStoreOptions>
    private cleanupTimer?: NodeJS.Timeout

    constructor(options: MemoryStoreOptions = {}) {
        this.options = {
            maxSize: 1000,
            defaultTTL: 1000 * 60 * 60, // 1 hour
            cleanupInterval: 1000 * 60 * 5, // 5 minutes
            enableStats: false,
            onEvict: () => { },
            onSet: () => { },
            onGet: () => { },
            ...options
        }

        this.cache = new LRUCache<string, CacheEntry>({
            max: this.options.maxSize,
            ttl: this.options.defaultTTL,
            updateAgeOnGet: false,
            allowStale: false,
            dispose: (value, key) => {
                this.options.onEvict(key, value)
            }
        })

        if (this.options.cleanupInterval > 0) {
            this.startCleanupTimer()
        }
    }

    async get(key: string): Promise<number | null> {
        const entry = this.cache.get(key)
        this.options.onGet(key, entry || null)

        if (!entry || entry.expires < Date.now()) {
            this.cache.delete(key)
            return null
        }
        return entry.value
    }

    async set(key: string, value: number, ttl: number): Promise<void> {
        const expires = Date.now() + ttl
        const entry = { value, expires }

        if (ttl <= 0) {
            this.options.onSet(key, entry)
            return
        }

        this.cache.set(key, entry, { ttl })
        this.options.onSet(key, entry)
    }

    async increment(key: string, ttl: number): Promise<number> {
        const entry = this.cache.get(key)
        let current = 0

        if (entry && entry.expires >= Date.now()) {
            current = entry.value
        }

        const newValue = current + 1
        const expires = Date.now() + ttl
        const newEntry = { value: newValue, expires }

        if (ttl <= 0) {
            this.options.onSet(key, newEntry)
            return newValue
        }

        this.cache.set(key, newEntry, { ttl })
        this.options.onSet(key, newEntry)
        return newValue
    }

    cleanup(): void {
        const now = Date.now()
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expires < now) {
                this.cache.delete(key)
            }
        }
    }

    getStats() {
        const stats = {
            size: this.cache.size,
            maxSize: this.cache.max,
            options: this.options
        }

        if (this.options.enableStats) {
            // Add additional stats if needed
            Object.assign(stats, {
                cleanupInterval: this.options.cleanupInterval,
                defaultTTL: this.options.defaultTTL
            })
        }

        return stats
    }

    // Additional LRU-specific methods
    clear(): void {
        this.cache.clear()
    }

    has(key: string): boolean {
        return this.cache.has(key)
    }

    delete(key: string): boolean {
        return this.cache.delete(key)
    }

    keys(): string[] {
        return Array.from(this.cache.keys())
    }

    // Configuration methods
    updateOptions(newOptions: Partial<MemoryStoreOptions>): void {
        Object.assign(this.options, newOptions)

        // Update cache settings if needed
        if (newOptions.maxSize !== undefined) {
            // Note: LRU cache max size cannot be changed after creation
            // We would need to recreate the cache to change max size
        }

        if (newOptions.cleanupInterval !== undefined) {
            this.stopCleanupTimer()
            if (newOptions.cleanupInterval > 0) {
                this.startCleanupTimer()
            }
        }
    }

    private startCleanupTimer(): void {
        this.cleanupTimer = setInterval(() => {
            this.cleanup()
        }, this.options.cleanupInterval)
    }

    private stopCleanupTimer(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer)
            this.cleanupTimer = undefined
        }
    }

    destroy(): void {
        this.stopCleanupTimer()
        this.cache.clear()
    }
} 
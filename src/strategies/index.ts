import type { RateLimitStrategy } from "./base"
import { FixedWindowStrategy } from "./fixed-window"
import { SlidingWindowStrategy } from "./sliding-window"

export type StrategyName = "fixed-window" | "sliding-window"

const strategies = new Map<StrategyName, RateLimitStrategy>([
    ["fixed-window", new FixedWindowStrategy()],
    ["sliding-window", new SlidingWindowStrategy()]
])

export function getStrategy(name: StrategyName): RateLimitStrategy {
    const strategy = strategies.get(name)
    if (!strategy) {
        throw new Error(`Unknown strategy: ${name}. Available strategies: ${Array.from(strategies.keys()).join(", ")}`)
    }
    return strategy
}

export function registerStrategy(name: string, strategy: RateLimitStrategy): void {
    strategies.set(name as StrategyName, strategy)
}

export function getAvailableStrategies(): StrategyName[] {
    return Array.from(strategies.keys()) as StrategyName[]
}

export { FixedWindowStrategy, SlidingWindowStrategy }
export type { RateLimitStrategy } from "./base" 
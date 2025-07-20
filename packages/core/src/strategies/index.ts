import { Effect } from "effect"
import type { RateLimitStrategy } from "../types"
import { FixedWindowStrategy } from "./fixed-window"
import { SlidingWindowStrategy } from "./sliding-window"
import { ApproximatedSlidingWindowStrategy } from "./approximated-sliding-window"

export type StrategyName = "fixed-window" | "sliding-window" | "approximated-sliding-window"

const strategies = new Map<StrategyName, RateLimitStrategy>([
    ["fixed-window", new FixedWindowStrategy()],
    ["sliding-window", new SlidingWindowStrategy()],
    ["approximated-sliding-window", new ApproximatedSlidingWindowStrategy()]
])

export function getStrategy(name: StrategyName): Effect.Effect<RateLimitStrategy, Error, never> {
    const strategy = strategies.get(name)
    if (!strategy) {
        return Effect.fail(new Error(`Unknown strategy: ${name}. Available strategies: ${Array.from(strategies.keys()).join(", ")}`))
    }
    return Effect.succeed(strategy)
}

export function registerStrategy(name: string, strategy: RateLimitStrategy): void {
    strategies.set(name as StrategyName, strategy)
}

export function getAvailableStrategies(): StrategyName[] {
    return Array.from(strategies.keys()) as StrategyName[]
}

export { FixedWindowStrategy, SlidingWindowStrategy, ApproximatedSlidingWindowStrategy }
export type { RateLimitStrategy } from "../types" 
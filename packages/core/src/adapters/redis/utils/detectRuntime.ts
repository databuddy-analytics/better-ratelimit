export type Runtime = "node" | "bun" | "edge"

export function detectRuntime(): Runtime {
    if (typeof Bun !== "undefined") {
        return "bun"
    }

    if (
        typeof globalThis !== "undefined" &&
        ("EdgeRuntime" in globalThis ||
            (typeof WebSocket === "function" && typeof (globalThis as any).window === "undefined"))
    ) {
        return "edge"
    }

    return "node"
}

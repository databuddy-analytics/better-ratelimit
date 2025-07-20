export function parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([a-zA-Z])$/)
    if (!match) {
        throw new Error(`Invalid duration format: ${duration}. Expected format like "30s", "5m", "2h", "1d", "1w", "1y"`)
    }

    const [, value, unit] = match
    if (!value || !unit) {
        throw new Error(`Invalid duration format: ${duration}`)
    }
    const num = parseInt(value, 10)

    switch (unit) {
        case 's': return num * 1000
        case 'm': return num * 60 * 1000
        case 'h': return num * 60 * 60 * 1000
        case 'd': return num * 24 * 60 * 60 * 1000
        case 'w': return num * 7 * 24 * 60 * 60 * 1000
        case 'y': return num * 365 * 24 * 60 * 60 * 1000
        default: throw new Error(`Unknown duration unit: ${unit}`)
    }
}

export function formatDuration(ms: number): string {
    const absMs = Math.abs(ms)
    const sign = ms < 0 ? "-" : ""

    if (absMs < 1000) return `${sign}${absMs}ms`
    if (absMs < 60000) return `${sign}${Math.floor(absMs / 1000)}s`
    if (absMs < 3600000) return `${sign}${Math.floor(absMs / 60000)}m`
    if (absMs < 86400000) return `${sign}${Math.floor(absMs / 3600000)}h`
    return `${sign}${Math.floor(absMs / 86400000)}d`
} 
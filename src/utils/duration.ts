export function parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/)
    if (!match) {
        throw new Error(`Invalid duration format: ${duration}. Expected format like "30s", "5m", "2h", "1d"`)
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
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${Math.floor(ms / 1000)}s`
    if (ms < 3600000) return `${Math.floor(ms / 60000)}m`
    if (ms < 86400000) return `${Math.floor(ms / 3600000)}h`
    return `${Math.floor(ms / 86400000)}d`
} 
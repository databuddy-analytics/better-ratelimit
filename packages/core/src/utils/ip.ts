export interface RequestContext {
    ip?: string
    headers?: Record<string, string>
    connection?: {
        remoteAddress?: string
    }
    socket?: {
        remoteAddress?: string
    }
}

export function getClientIP(ctx: RequestContext): string {
    const headers = ctx.headers || {}

    if (headers["cf-connecting-ip"]) return headers["cf-connecting-ip"]
    if (headers["fastly-client-ip"]) return headers["fastly-client-ip"]
    if (headers["x-forwarded-for"]) {
        const forwarded = headers["x-forwarded-for"]
        return forwarded?.split(",")[0]?.trim() || "unknown"
    }
    if (headers["x-real-ip"]) return headers["x-real-ip"]
    if (headers["x-client-ip"]) return headers["x-client-ip"]
    if (headers["x-forwarded"]) return headers["x-forwarded"]
    if (headers["x-cluster-client-ip"]) return headers["x-cluster-client-ip"]
    if (headers["x-vercel-forwarded-for"]) return headers["x-vercel-forwarded-for"]
    if (headers["x-netlify-forwarded-for"]) return headers["x-netlify-forwarded-for"]
    if (ctx.ip) return ctx.ip
    if (ctx.connection?.remoteAddress) return ctx.connection.remoteAddress
    if (ctx.socket?.remoteAddress) return ctx.socket.remoteAddress

    return "unknown"
}

export function parseXForwardedFor(header: string): string {
    if (!header) return "unknown"
    const ips = header.split(",").map(ip => ip.trim())
    return ips[0] || "unknown"
}

export function isPrivateIP(ip: string): boolean {
    if (!ip || ip === "unknown") return false

    const cleanIP = ip.replace(/^::ffff:/, "")

    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^[0-9a-fA-F:]+$/

    if (!ipv4Regex.test(cleanIP) && !ipv6Regex.test(cleanIP)) {
        return false
    }

    const privateRanges = [
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^127\./,
        /^169\.254\./,
        /^::1$/,
        /^fe80:/,
        /^fc00:/,
        /^fd00:/
    ]

    return privateRanges.some(range => range.test(cleanIP))
}

export function getIPKey(ctx: RequestContext, prefix = "ip"): string {
    const ip = getClientIP(ctx)
    if (ip === "unknown" || isPrivateIP(ip)) {
        return `${prefix}:fallback`
    }
    return `${prefix}:${ip}`
}

export function getClientIPWithContext(ctx: RequestContext): {
    ip: string
    source: string
    isPrivate: boolean
    headers: string[]
} {
    const headers = ctx.headers || {}
    const availableHeaders = Object.keys(headers).filter(key =>
        key.toLowerCase().includes("ip") ||
        key.toLowerCase().includes("forwarded") ||
        key.toLowerCase().includes("client")
    )

    const ip = getClientIP(ctx)
    const isPrivate = isPrivateIP(ip)

    let source = "unknown"
    if (headers["cf-connecting-ip"]) source = "cloudflare"
    else if (headers["fastly-client-ip"]) source = "fastly"
    else if (headers["x-forwarded-for"]) source = "x-forwarded-for"
    else if (headers["x-real-ip"]) source = "x-real-ip"
    else if (ctx.ip) source = "ctx.ip"
    else if (ctx.connection?.remoteAddress) source = "connection.remoteAddress"
    else if (ctx.socket?.remoteAddress) source = "socket.remoteAddress"

    return {
        ip,
        source,
        isPrivate,
        headers: availableHeaders
    }
} 
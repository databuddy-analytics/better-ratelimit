export interface RequestContext {
    headers?: Record<string, string>
    connection?: {
        remoteAddress?: string
    }
    socket?: {
        remoteAddress?: string
    }
}

type HeadersInput = Record<string, string> | RequestContext

function extractHeaders(input: HeadersInput): Record<string, string> {
    if ('headers' in input && input.headers && typeof input.headers === 'object') {
        return input.headers
    }
    return input as Record<string, string>
}

export function getClientIP(input: HeadersInput): string {
    const headers = extractHeaders(input)

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

export function getIPKey(input: HeadersInput, prefix = "ip"): string {
    const headers = extractHeaders(input)
    const ip = getClientIP(headers)
    if (ip === "unknown" || isPrivateIP(ip)) {
        return `${prefix}:fallback`
    }
    return `${prefix}:${ip}`
}

export function getClientIPWithContext(input: HeadersInput): {
    ip: string
    source: string
    isPrivate: boolean
    headers: string[]
} {
    const headers = extractHeaders(input)

    const availableHeaders = Object.keys(headers).filter(key =>
        key.toLowerCase().includes("ip") ||
        key.toLowerCase().includes("forwarded") ||
        key.toLowerCase().includes("client")
    )

    const ip = getClientIP(headers)
    const isPrivate = isPrivateIP(ip)

    let source = "unknown"
    if (headers["cf-connecting-ip"]) source = "cloudflare"
    else if (headers["fastly-client-ip"]) source = "fastly"
    else if (headers["x-forwarded-for"]) source = "x-forwarded-for"
    else if (headers["x-real-ip"]) source = "x-real-ip"

    return {
        ip,
        source,
        isPrivate,
        headers: availableHeaders
    }
} 
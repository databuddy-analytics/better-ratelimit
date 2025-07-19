# better-ratelimit

> A **framework-agnostic**, **Effect-powered**, **observability-native** rate limiter designed for real-world infrastructure.

[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Effect](https://img.shields.io/badge/Effect-000000?logo=effect&logoColor=white)](https://effect.website/)

## 🚀 **Installation**

```bash
bun add better-ratelimit
```

## 📚 **Real-World Examples**

### **1. API Rate Limiting**

```typescript
import { createRedisRateLimiter } from "better-ratelimit"

// API endpoint rate limiting: 100 requests per hour per user
const apiLimiter = createRedisRateLimiter(
  process.env.REDIS_URL,
  100,
  "1h",
  { 
    prefix: "api:ratelimit",
    strategy: "sliding-window"
  }
)

// In your API route handler
async function handleApiRequest(userId: string) {
  const result = await apiLimiter.check(`user:${userId}`)
  
  if (!result.allowed) {
    return {
      error: "Rate limit exceeded",
      retryAfter: new Date(result.resetTime).toISOString(),
      remaining: result.remaining
    }
  }
  
  // Process the request...
  return { success: true, remaining: result.remaining }
}
```

### **2. Login Attempt Protection**

```typescript
import { createRedisRateLimiter } from "better-ratelimit"

// Login protection: 5 attempts per 15 minutes per IP
const loginLimiter = createRedisRateLimiter(
  process.env.REDIS_URL,
  5,
  "15m",
  { 
    prefix: "login:ratelimit",
    strategy: "fixed-window"
  }
)

// In your login endpoint
async function handleLogin(ip: string, email: string) {
  const result = await loginLimiter.check(`ip:${ip}`)
  
  if (!result.allowed) {
    return {
      error: "Too many login attempts",
      retryAfter: new Date(result.resetTime).toISOString()
    }
  }
  
  // Attempt login...
  return { success: true }
}
```

### **3. File Upload Limiting**

```typescript
import { createMemoryRateLimiter } from "better-ratelimit"

// File upload: 10 files per day per user
const uploadLimiter = createMemoryRateLimiter(10, "24h")

// In your upload handler
async function handleFileUpload(userId: string) {
  const result = await uploadLimiter.check(`upload:${userId}`)
  
  if (!result.allowed) {
    return {
      error: "Upload limit reached",
      remaining: result.remaining,
      resetDate: new Date(result.resetTime).toLocaleDateString()
    }
  }
  
  // Process upload...
  return { success: true, remaining: result.remaining }
}
```

### **4. Webhook Rate Limiting**

```typescript
import { createRedisRateLimiter } from "better-ratelimit"

// Webhook delivery: 1000 calls per hour per webhook
const webhookLimiter = createRedisRateLimiter(
  process.env.REDIS_URL,
  1000,
  "1h",
  { 
    prefix: "webhook:ratelimit",
    strategy: "approximated-sliding-window"
  }
)

// In your webhook sender
async function sendWebhook(webhookId: string, payload: any) {
  const result = await webhookLimiter.check(`webhook:${webhookId}`)
  
  if (!result.allowed) {
    console.log(`Webhook ${webhookId} rate limited, will retry later`)
    return { queued: true }
  }
  
  // Send webhook...
  return { sent: true, remaining: result.remaining }
}
```

### **5. Helper Methods & Common Patterns**

```typescript
import { createRedisRateLimiter } from "better-ratelimit"

const limiter = createRedisRateLimiter(process.env.REDIS_URL, 100, "1h")

// Simple boolean check
if (await limiter.isAllowed("user:123")) {
  // Process request
}

// Get remaining requests
const remaining = await limiter.getRemaining("user:123")
console.log(`${remaining} requests remaining`)

// Get reset time
const resetTime = await limiter.getResetTime("user:123")
console.log(`Resets at ${new Date(resetTime).toISOString()}`)

// Get all info at once
const info = await limiter.getInfo("user:123")
if (!info.allowed) {
  return {
    error: "Rate limit exceeded",
    remaining: info.remaining,
    retryAfter: new Date(info.resetTime).toISOString()
  }
}
```

### **6. Middleware Pattern**

```typescript
import { createRedisRateLimiter } from "better-ratelimit"

const apiLimiter = createRedisRateLimiter(process.env.REDIS_URL, 100, "1h")

// Express-style middleware
async function rateLimitMiddleware(req: any, res: any, next: any) {
  const key = `user:${req.userId}`
  
  if (!(await apiLimiter.isAllowed(key))) {
    const info = await apiLimiter.getInfo(key)
    return res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: new Date(info.resetTime).toISOString(),
      remaining: info.remaining
    })
  }
  
  next()
}
```

### **7. Better Error Handling**

```typescript
import { createRedisRateLimiter } from "better-ratelimit"

const limiter = createRedisRateLimiter(process.env.REDIS_URL, 100, "1h")

// Utility function for consistent error responses
function createRateLimitError(result: any) {
  return {
    error: "Rate limit exceeded",
    retryAfter: new Date(result.resetTime).toISOString(),
    remaining: result.remaining,
    limit: result.limit,
    resetTime: result.resetTime
  }
}

// In your API handler
async function handleApiRequest(userId: string) {
  const result = await limiter.check(`user:${userId}`)
  
  if (!result.allowed) {
    return createRateLimitError(result)
  }
  
  // Process request...
  return { 
    success: true, 
    remaining: result.remaining,
    resetTime: new Date(result.resetTime).toISOString()
  }
}
```

### **With Elysia**

```typescript
import { Elysia } from "elysia"
import { withRateLimiter } from "better-ratelimit"

const app = new Elysia()
  .use(withRateLimiter({
    key: ctx => ctx.ip,
    limit: 100,
    duration: "1m",
    strategy: "fixed-window",
    headers: {
      enabled: true,
      prefix: "X-RateLimit"
    },
    response: {
      status: 429,
      message: "Too Many Requests"
    }
  }))
  .get("/api/data", () => ({ data: "..." }))
  .listen(3000)
```

### **With Hono**

```typescript
import { Hono } from "hono"
import { withHonoRateLimiter } from "better-ratelimit"

const app = new Hono()

app.use(withHonoRateLimiter({
  key: ctx => ctx.req.header("x-user-id") || "anonymous",
  limit: 100,
  duration: "1m",
  strategy: "sliding-window",
  headers: {
    enabled: true,
    prefix: "X-RateLimit"
  },
  response: {
    status: 429,
    message: "Too Many Requests"
  }
}))

app.get("/api/data", (c) => c.json({ data: "..." }))
```

### **Custom Key Generation**

```typescript
import { getIPKey } from "better-ratelimit"

const result = await limiter.check({
  key: getIPKey(ctx), // Handles Cloudflare, AWS, Vercel, etc.
  limit: 50,
  duration: "5m"
})
```

## 🎯 **Features**

### **Multiple Storage Backends**
- **Memory** - Fast, in-memory storage for development
- **Redis** - Production-ready with Dragonfly/Valkey support
- **ClickHouse** - Analytics and historical data
- **BunKV** - Edge function storage (coming soon)

### **Rate Limiting Strategies**
- **Fixed Window** - Simple, predictable limits
- **Sliding Window** - Smooth rate limiting
- **Approximated Sliding Window** - Efficient sliding with sub-windows

### **Framework Integrations**
- **Elysia** - First-class support
- **Hono** - Coming soon
- **Express** - Coming soon
- **Edge Functions** - Coming soon

### **Observability**
- **Structured logging** - Every decision logged
- **Performance metrics** - Response times, throughput
- **Analytics ready** - Export to ClickHouse, Prometheus, etc.

## 🏗️ **API Reference**

### **Improved API Design**

The API is designed to be **intuitive and practical**:

```typescript
import { RateLimiter } from "better-ratelimit"

// ✅ Configure once, use many times
const limiter = new RateLimiter(store, {
  limit: 100,
  duration: "1m",
  strategy: "fixed-window"
})

// ✅ Simple check - just pass the key
const result = await limiter.check("user:123")

// ✅ Helper methods for common patterns
if (await limiter.isAllowed("user:123")) {
  // Process request
}

const remaining = await limiter.getRemaining("user:123")
const info = await limiter.getInfo("user:123")
```

### **Why This Design?**

- **🎯 Configure Once**: Set limits, duration, strategy at initialization
- **🚀 Simple Usage**: Just pass the key to check
- **🛠️ Helper Methods**: Common patterns like `isAllowed()`, `getRemaining()`
- **📊 Rich Results**: Full information about rate limit status
- **🔄 Consistent**: Same behavior across all checks

### **RateLimiter**

```typescript
import { RateLimiter } from "better-ratelimit"

const limiter = new RateLimiter(store, {
  limit: 100,
  duration: "1m",
  strategy: "fixed-window"
})

// Check rate limit
const result = await limiter.check("user:123")

// Result
interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
  key: string
  metadata?: Record<string, unknown>
}
```

### **Storage Adapters**

```typescript
// Memory (default)
import { MemoryStore } from "better-ratelimit"
const store = new MemoryStore({ maxSize: 1000 })

// Redis
import { RedisAdapter } from "better-ratelimit"
const store = new RedisAdapter({ 
  url: "redis://localhost:6379",
  prefix: "ratelimit"
})
```

### **Framework Plugins**

```typescript
// Elysia
import { withRateLimiter } from "better-ratelimit"

app.use(withRateLimiter({
  key: ctx => ctx.ip,
  limit: 100,
  duration: "1m",
  strategy: "fixed-window",
  onLimit: (ctx, result) => {
    // Custom handling
  }
}))
```

## 🚀 **Quick Start**

### Installation

```bash
bun add better-ratelimit-core
bun add better-ratelimit-adapter-redis
bun add better-ratelimit-plugin-elysia
```

### Basic Usage

```typescript
import { Elysia } from "elysia"
import { withRateLimiter } from "better-ratelimit-plugin-elysia"
import { RedisLayer } from "better-ratelimit-adapter-redis"

const app = new Elysia()
  .use(withRateLimiter({
    key: ctx => ctx.ip,
    limit: 100,
    duration: "1m",
    storage: RedisLayer
  }))
  .get("/", () => "Hello World!")
  .listen(3000)
```

### Advanced Usage

```typescript
import { Effect, Layer } from "effect"
import { RateLimitCore } from "better-ratelimit-core"
import { RedisLayer } from "better-ratelimit-adapter-redis"
import { DatabuddyLayer } from "better-ratelimit-observability-databuddy"

const program = Effect.gen(function* (_) {
  const rateLimiter = yield* _(RateLimitCore)
  
  const result = yield* _(
    rateLimiter.check({
      key: "user:123",
      limit: 50,
      duration: "1h"
    })
  )
  
  return result
})

const runtime = Layer.provide(
  Layer.merge(RateLimitCore, RedisLayer),
  Layer.provide(DatabuddyLayer, program)
)

const result = await Effect.runPromise(runtime)
```

## 🔧 **Configuration**

### Rate Limiting Strategies

```typescript
// Token Bucket (default)
{
  strategy: "token-bucket",
  limit: 100,
  duration: "1m",
  burst: 10
}

// Sliding Window
{
  strategy: "sliding-window", 
  limit: 100,
  duration: "1m"
}

// Fixed Window
{
  strategy: "fixed-window",
  limit: 100,
  duration: "1m"
}
```

### Storage Options

```typescript
// Redis
import { RedisLayer } from "better-ratelimit-adapter-redis"

// ClickHouse for analytics
import { ClickHouseLayer } from "better-ratelimit-adapter-clickhouse"

// Memory for testing
import { MemoryLayer } from "better-ratelimit-adapter-memory"

// BunKV for edge
import { BunKVLayer } from "better-ratelimit-adapter-bunkv"
```

### Observability

```typescript
// Auto-log to Databuddy
import { DatabuddyLayer } from "better-ratelimit-observability-databuddy"

// Console logging
import { ConsoleLayer } from "better-ratelimit-observability-console"

// Custom observability
import { CustomLayer } from "better-ratelimit-observability-custom"
```

## 🧪 **Testing**

```typescript
import { describe, it, expect } from "bun:test"
import { RateLimiter, MemoryStore } from "better-ratelimit"

describe("Rate Limiting", () => {
  it("should limit requests correctly", async () => {
    const limiter = new RateLimiter(new MemoryStore())
    
    // First request - allowed
    const result1 = await limiter.check({
      key: "test:user",
      limit: 2,
      duration: "1m"
    })
    expect(result1.allowed).toBe(true)
    expect(result1.remaining).toBe(1)
    
    // Second request - allowed
    const result2 = await limiter.check({
      key: "test:user",
      limit: 2,
      duration: "1m"
    })
    expect(result2.allowed).toBe(true)
    expect(result2.remaining).toBe(0)
    
    // Third request - blocked
    const result3 = await limiter.check({
      key: "test:user",
      limit: 2,
      duration: "1m"
    })
    expect(result3.allowed).toBe(false)
    expect(result3.remaining).toBe(0)
  })
})
```

## 🐳 **Development**

### **Start Databases**

```bash
# Start Redis, Dragonfly, Valkey, ClickHouse
docker-compose up -d

# Test all databases
bun test src/adapters/redis/redis.test.ts
```

### **Environment Variables**

```bash
# Copy example
cp env.example .env

# Configure databases
REDIS_URL=redis://localhost:6379
DRAGONFLY_URL=redis://localhost:6380
VALKEY_URL=redis://localhost:6381
```

## 📊 **Observability**

Every rate limit decision is automatically logged with structured data:

```typescript
interface RateLimitEvent {
  timestamp: string
  key: string
  allowed: boolean
  limit: number
  remaining: number
  resetTime: string
  strategy: string
  responseTime: number
  metadata?: Record<string, unknown>
}
```

## 🌍 **Framework Support**

- **Elysia** ✅ - First-class support
- **Hono** 🚧 - Coming soon
- **Express** 🚧 - Coming soon
- **Edge Functions** 🚧 - Coming soon

## 🤝 **Contributing**

Built with **[Bun](https://bun.sh)**, **[Effect](https://effect.website/)**, and **[TypeScript](https://www.typescriptlang.org/)**.

```bash
# Install dependencies
bun install

# Run tests
bun test

# Start development databases
docker-compose up -d
```

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

---

**better-ratelimit** - Making rate limiting composable, observable, and developer-friendly.

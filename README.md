# better-ratelimit

> A **framework-agnostic**, **Effect-powered**, **observability-native** rate limiter designed for real-world infrastructure, not just demo apps.

[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Effect](https://img.shields.io/badge/Effect-000000?logo=effect&logoColor=white)](https://effect.website/)

## 🌟 **What Makes This Different**

`better-ratelimit` is built to be **composable, pluggable, and invisible by default** — but gives you deep control when you need it.

### 🚫 **Not like other rate limiters:**

- ❌ `express-rate-limit` → hardcoded to Express
- ❌ `rate-limiter-flexible` → imperative, low observability  
- ❌ `upstash/ratelimit` → Redis only, no flexibility
- ❌ Others → DIY observability, no analytics, no structured events

### ✅ **Instead:**

- ✅ Works anywhere (`bun`, `edge`, `node`, etc.)
- ✅ Stores limits wherever you want (Redis, ClickHouse, Memory, BunKV)
- ✅ Auto-instruments everything with observability
- ✅ Fully testable and mockable with Effect
- ✅ Zero-config for 90% of use cases

## 🎯 **Core Goals**

### 1. **Simple for Developers**

```typescript
import { withRateLimiter } from "better-ratelimit-plugin-elysia"

app.use(withRateLimiter({ key: ctx => ctx.ip }))
```

Or programmatically:

```typescript
import { checkRateLimit } from "better-ratelimit-core"

const result = await checkRateLimit({
  key: "ip:1.2.3.4",
  limit: 10,
  duration: "1m"
})
```

### 2. **Pluggable Adapters**

Storage is abstracted behind a common interface:

- **Redis** for fast limits
- **ClickHouse** for historical analytics  
- **Memory** for tests
- **BunKV** for edge functions

Swap storage with one line:

```typescript
import { RedisLayer } from "better-ratelimit-adapter-redis"
```

### 3. **Observability-Native**

Every request automatically logs structured events:

- Who was limited and when
- How much quota was used
- Which backend was used
- Response times and performance metrics

You can graph it, alert on it, or even bill off it — all out of the box.

### 4. **Layer-First & Testable**

Everything is an Effect `Layer`. That means:

- Composable in real applications
- Fully testable with mocks
- Clean dependency encoding

No weird globals. No side effects. Just functional, typed building blocks.

## 🏗️ **Architecture**

```
better-ratelimit/
├── core/                    # Pure rate limiting logic
├── adapter-*/              # Storage backends
│   ├── redis/
│   ├── clickhouse/
│   ├── memory/
│   └── bunkv/
├── plugin-*/               # Framework integrations
│   ├── elysia/
│   ├── hono/
│   ├── express/
│   └── edge/
└── observability-*/        # Logging & metrics
    ├── databuddy/
    ├── console/
    └── custom/
```

### **Core Components**

#### `better-ratelimit-core`
- Pure rate limiting algorithms
- Token bucket, sliding window, fixed window
- No storage, no logging, no framework assumptions

#### `better-ratelimit-adapter-*`
- Pluggable storage backends
- Implement shared `RateLimitStore` interface
- Expose typed `Layer`s for dependency injection

#### `better-ratelimit-plugin-*`
- Framework integrations
- Wrap request lifecycle and call the limiter
- Inject configuration, handle blocking responses

#### `better-ratelimit-observability-*`
- Log every decision as a structured event
- Emit metrics and performance data
- Push to ClickHouse, console, Kafka, etc.

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
import { Effect, TestContext } from "effect"
import { RateLimitCore } from "better-ratelimit-core"
import { MemoryLayer } from "better-ratelimit-adapter-memory"

const testProgram = Effect.gen(function* (_) {
  const rateLimiter = yield* _(RateLimitCore)
  
  const result1 = yield* _(
    rateLimiter.check({
      key: "test:user",
      limit: 2,
      duration: "1m"
    })
  )
  
  const result2 = yield* _(
    rateLimiter.check({
      key: "test:user", 
      limit: 2,
      duration: "1m"
    })
  )
  
  return { result1, result2 }
})

const testRuntime = Layer.provide(
  Layer.merge(RateLimitCore, MemoryLayer),
  testProgram
)

const result = await Effect.runPromise(testRuntime)
// result.result1.allowed = true
// result.result2.allowed = false (limit exceeded)
```

## 📊 **Observability Events**

Every rate limit decision generates structured events:

```typescript
interface RateLimitEvent {
  timestamp: string
  key: string
  allowed: boolean
  limit: number
  remaining: number
  resetTime: string
  duration: string
  backend: string
  responseTime: number
  metadata?: Record<string, unknown>
}
```

## 🌍 **Framework Support**

- **Elysia** - `better-ratelimit-plugin-elysia`
- **Hono** - `better-ratelimit-plugin-hono`  
- **Express** - `better-ratelimit-plugin-express`
- **Edge Functions** - `better-ratelimit-plugin-edge`
- **Raw HTTP** - Use core directly

## 🤝 **Contributing**

This project is built with:

- **[Bun](https://bun.sh)** - Fast JavaScript runtime
- **[Effect](https://effect.website/)** - Functional programming toolkit
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build
```

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

---

**better-ratelimit** - Making rate limiting composable, observable, and developer-friendly.

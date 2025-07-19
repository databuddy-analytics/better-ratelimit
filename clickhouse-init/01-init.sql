-- Create database for rate limiting
CREATE DATABASE IF NOT EXISTS ratelimit;

-- Create table for rate limit counters
CREATE TABLE IF NOT EXISTS ratelimit.counters (
    key String,
    value UInt64,
    ttl UInt32,
    created_at DateTime64(3) DEFAULT now(),
    updated_at DateTime64(3) DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (key, created_at)
TTL created_at + INTERVAL ttl SECOND;

-- Create table for rate limit events (for analytics)
CREATE TABLE IF NOT EXISTS ratelimit.events (
    id UUID DEFAULT generateUUIDv4(),
    key String,
    action Enum8('increment' = 1, 'get' = 2, 'set' = 3),
    value UInt64,
    ttl UInt32,
    strategy String,
    allowed Boolean,
    remaining UInt64,
    reset_time DateTime64(3),
    metadata String,
    created_at DateTime64(3) DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (key, created_at)
TTL created_at + INTERVAL 30 DAY;

-- Create materialized view for real-time analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS ratelimit.events_mv
ENGINE = SummingMergeTree()
ORDER BY (key, toStartOfMinute(created_at))
AS SELECT
    key,
    toStartOfMinute(created_at) as minute,
    count() as request_count,
    sumIf(value, action = 'increment') as total_increments,
    sumIf(value, allowed = 1) as allowed_requests,
    sumIf(value, allowed = 0) as blocked_requests
FROM ratelimit.events
GROUP BY key, minute; 
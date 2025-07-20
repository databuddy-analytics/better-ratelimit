"use client";

import { Check, X, Code, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Comparison() {
    return (
        <div className="md:w-10/12 mx-auto font-geist relative md:border-l-0 md:border-b-0 md:border-[1.2px] border-border rounded-none -pr-2 bg-background/95">
            <div className="w-full md:mx-0">
                {/* Code Example Header */}
                <div className="border-l-[1.2px] border-t-[1.2px] border-border md:border-t-0 p-10 pb-2">
                    <div className="flex items-center gap-2 my-1">
                        <Code className="w-4 h-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            Code Example
                        </p>
                    </div>
                    <div className="mt-2">
                        <div className="max-w-full">
                            <div className="flex gap-3">
                                <p className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl text-foreground">
                                    A full example in under 30 lines
                                </p>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-left text-muted-foreground">
                            Get started with better-ratelimit in minutes. No complex setup required.
                        </p>
                    </div>
                </div>

                {/* Code Block */}
                <div className="border-l-[1.2px] border-t-[1.2px] border-border p-10">
                    <div className="bg-muted/30 rounded-lg p-6 font-mono text-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-muted-foreground">TypeScript</span>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <pre className="text-sm leading-relaxed">
                            <code className="text-foreground">
                                {`import { RateLimiter, RedisAdapter } from 'better-ratelimit';

const limiter = new RateLimiter({
  adapter: new RedisAdapter(redisClient),
  namespace: 'auth-login',
  key: (req) => req.headers['x-api-key'],
  limit: 5,
  duration: '10m'
});

const result = await limiter.check(req);

if (!result.success) {
  return new Response('Too Many Requests', {
    status: 429,
    headers: { 'Retry-After': result.resetAfter.toString() }
  });
}`}
                            </code>
                        </pre>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="border-l-[1.2px] border-t-[1.2px] border-border p-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                Ready to implement?
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                See the full API documentation and get started in minutes.
                            </p>
                        </div>
                        <Link
                            href="/docs/api"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            See full API
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 
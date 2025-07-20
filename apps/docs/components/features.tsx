"use client";

// Credits to better-auth for the inspiration

import {
	Shield,
	Plus,
	Users,
	Zap,
	Globe2Icon,
	TrendingUp,
	AlertTriangle,
	BarChart3,
	Code,
	Package,
	CheckCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

const whyWeExist = [
	{
		id: 1,
		label: "Runtime limitations",
		title: "Most rate limiters <strong>only work in one environment</strong>",
		description:
			"Express rate limiters don't work in edge functions. Cloudflare rate limiters don't work in Node.js. You need different solutions for different environments.",
		icon: AlertTriangle,
	},
	{
		id: 2,
		label: "Vendor lock-in",
		title: "Platform-specific solutions <strong>tie you to one vendor</strong>",
		description:
			"Once you build with a platform-specific rate limiter, you're stuck. Migrating to a different platform means rewriting your rate limiting logic.",
		icon: BarChart3,
	},
	{
		id: 3,
		label: "Poor developer experience",
		title: "Most solutions lack <strong>proper TypeScript support</strong>",
		description:
			"Without good types, you spend more time debugging than building. Runtime errors that could be caught at compile time.",
		icon: Users,
	},
];

const whatYouGet = [
	{
		id: 4,
		label: "Adapter-based by design",
		title: "Drop in Redis, LRU, Bun KV, or write your own custom adapter. <strong>No vendor lock-in, no assumptions.</strong>",
		description:
			"Choose the storage backend that fits your infrastructure. From in-memory for development to Redis for production scale.",
		icon: Shield,
	},
	{
		id: 5,
		label: "Works everywhere",
		title: "Supports Node.js, Bun, Edge runtimes like Cloudflare Workers and Vercel Edge Functions. <strong>No hacks required.</strong>",
		description:
			"Universal runtime support means you can use the same code across different environments without modification.",
		icon: TrendingUp,
	},
	{
		id: 6,
		label: "Precise algorithms",
		title: "Use sliding window counters, leaky bucket, or token bucket algorithms. <strong>Choose performance vs accuracy.</strong>",
		description:
			"Different algorithms for different use cases. Sliding window for accuracy, fixed window for performance.",
		icon: Zap,
	},
	{
		id: 7,
		label: "Type-safe configuration",
		title: "Everything is strongly typed from setup to enforcement. <strong>Get full IntelliSense in any modern editor.</strong>",
		description:
			"Full TypeScript support with comprehensive type definitions. Catch errors at compile time, not runtime.",
		icon: Globe2Icon,
	},
	{
		id: 8,
		label: "Smart namespacing",
		title: "Rate limit by user ID, IP, API key, or scoped actions. <strong>Compose keys however you want.</strong>",
		description:
			"Flexible key generation allows you to rate limit by any criteria. Perfect for complex multi-tenant applications.",
		icon: Code,
	},
	{
		id: 9,
		label: "Minimal footprint",
		title: "Zero-dependency core. <strong>Small bundle. Ideal for cold starts and serverless runtimes.</strong>",
		description:
			"Tiny bundle size and zero dependencies make it perfect for edge functions and serverless environments.",
		icon: Package,
	}
];

interface FeaturesProps {
	stars: string | null;
}

export default function Features({ stars }: FeaturesProps) {
	return (
		<div className="md:w-10/12 mx-auto font-geist relative md:border-l-0 md:border-b-0 md:border-[1.2px] border-border rounded-none -pr-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="w-full md:mx-0">
				{/* Why We Exist Section */}
				<div className="border-l-[1.2px] border-t-[1.2px] border-border md:border-t-0 p-12 pb-6">
					<div className="flex items-center gap-3 my-2">
						<AlertTriangle className="w-5 h-5 text-red-500" />
						<p className="text-muted-foreground font-medium">
							The Problem
						</p>
					</div>
					<div className="mt-4">
						<div className="max-w-full">
							<div className="flex gap-3">
								<p className="max-w-lg text-2xl font-normal tracking-tighter md:text-3xl text-foreground">
									Building rate limiting that works everywhere is hard
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 relative md:grid-rows-1 md:grid-cols-3 border-t-[1.2px] border-border">
					<div className="hidden md:grid top-1/2 left-0 -translate-y-1/2 w-full grid-cols-3 z-10 pointer-events-none select-none absolute">
						<Plus className="w-8 h-8 text-muted-foreground translate-x-[16.5px] translate-y-[.5px] ml-auto" />
						<Plus className="w-8 h-8 text-muted-foreground ml-auto translate-x-[16.5px] translate-y-[.5px]" />
					</div>
					{whyWeExist.map((item, index) => (
						<div
							key={item.id}
							className={cn(
								"justify-center border-l-[1.2px] border-border md:min-h-[280px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col p-12 hover:bg-muted/30 transition-colors duration-200",
							)}
						>
							<div className="flex items-center gap-3 my-2">
								<item.icon className="w-5 h-5 text-red-500" />
								<p className="text-muted-foreground font-medium">
									{item.label}
								</p>
							</div>
							<div className="mt-4">
								<div className="max-w-full">
									<div className="flex gap-3">
										<p
											className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl text-foreground"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
											dangerouslySetInnerHTML={{ __html: item.title }}
										/>
									</div>
								</div>
								<p className="mt-4 text-sm text-left text-muted-foreground leading-relaxed">
									{item.description}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* What You Get Section */}
				<div className="border-l-[1.2px] border-t-[1.2px] border-border p-12 pb-6">
					<div className="flex items-center gap-3 my-2">
						<CheckCircle className="w-5 h-5 text-green-500" />
						<p className="text-muted-foreground font-medium">
							The Solution
						</p>
					</div>
					<div className="mt-4">
						<div className="max-w-full">
							<div className="flex gap-3">
								<p className="max-w-lg text-2xl font-normal tracking-tighter md:text-3xl text-foreground">
									Why better-ratelimit?
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 relative md:grid-rows-1 md:grid-cols-3 border-t-[1.2px] border-border">
					<div className="hidden md:grid top-1/2 left-0 -translate-y-1/2 w-full grid-cols-3 z-10 pointer-events-none select-none absolute">
						<Plus className="w-8 h-8 text-muted-foreground translate-x-[16.5px] translate-y-[.5px] ml-auto" />
						<Plus className="w-8 h-8 text-muted-foreground ml-auto translate-x-[16.5px] translate-y-[.5px]" />
					</div>
					{whatYouGet.map((item, index) => (
						<div
							key={item.id}
							className={cn(
								"justify-center border-l-[1.2px] border-border border-b-[1.2px] md:min-h-[280px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col p-12 hover:bg-muted/30 transition-colors duration-200",
							)}
						>
							<div className="flex items-center gap-3 my-2">
								<item.icon className="w-5 h-5 text-green-500" />
								<p className="text-muted-foreground font-medium">
									{item.label}
								</p>
							</div>
							<div className="mt-4">
								<div className="max-w-full">
									<div className="flex gap-3">
										<p
											className="max-w-lg text-xl font-normal tracking-tighter md:text-2xl text-foreground"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
											dangerouslySetInnerHTML={{ __html: item.title }}
										/>
									</div>
								</div>
								<p className="mt-4 text-sm text-left text-muted-foreground leading-relaxed">
									{item.description}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* For Who Section */}
				<div className="border-l-[1.2px] border-t-[1.2px] border-border p-12 pb-6">
					<div className="flex items-center gap-3 my-2">
						<Users className="w-5 h-5 text-blue-500" />
						<p className="text-muted-foreground font-medium">
							For Who?
						</p>
					</div>
					<div className="mt-4">
						<div className="max-w-full">
							<div className="flex gap-3">
								<p className="max-w-lg text-2xl font-normal tracking-tighter md:text-3xl text-foreground">
									If you're a developer who wants to:
								</p>
							</div>
						</div>
						<div className="mt-6 space-y-3">
							<div className="flex items-center gap-3">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								<span className="text-sm text-muted-foreground">Build rate limiting that works everywhere</span>
							</div>
							<div className="flex items-center gap-3">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								<span className="text-sm text-muted-foreground">Have type-safe configuration with full IntelliSense</span>
							</div>
							<div className="flex items-center gap-3">
								<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								<span className="text-sm text-muted-foreground">Avoid vendor lock-in with adapter-based design</span>
							</div>
						</div>
						<p className="mt-6 text-sm text-muted-foreground font-medium">
							Then better-ratelimit is for you.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
} 
"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
	return (
		<section className="relative overflow-hidden min-h-screen">
			{/* Enhanced Background Effects */}
			<div className="absolute inset-0 bg-background" />
			<div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_2px,transparent_2px),linear-gradient(90deg,rgba(var(--primary),0.03)_2px,transparent_2px)] bg-[size:60px_60px]" />
			<div className="absolute inset-0 bg-[linear-gradient(rgba(var(--border),0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--border),0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

			{/* Enhanced Gradient Overlays */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.08)_0%,transparent_60%)]" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary),0.06)_0%,transparent_60%)]" />

			{/* Floating Elements */}
			<div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
			<div className="absolute top-40 right-20 w-1 h-1 bg-primary/30 rounded-full animate-ping" />
			<div className="absolute bottom-40 left-20 w-3 h-3 bg-primary/10 rounded-full animate-bounce" />

			<div className="relative z-10 container mx-auto px-4 py-16">
				<div className="flex flex-col items-center justify-center space-y-12">
					{/* Text Content */}
					<div className="text-center space-y-8 max-w-4xl mx-auto">
						{/* Enhanced Badge */}
						<div className="inline-flex items-center gap-3 rounded-full border border-border/50 bg-muted/50 backdrop-blur-sm px-6 py-3 shadow-sm">
							<div className="flex items-center gap-2">
								<Sparkles className="h-4 w-4 text-primary" />
								<span className="text-sm text-muted-foreground font-medium">
									Universal • Type-safe • Adapter-based
								</span>
							</div>
						</div>

						{/* Enhanced Main headline */}
						<div className="space-y-6">
							<h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
								<span className="text-foreground">The last rate limiter</span>
								<br />
								<span className="bg-gradient-to-r from-foreground via-primary to-muted-foreground bg-clip-text text-transparent">
									you'll ever need
								</span>
							</h1>

							{/* Enhanced Subheadline */}
							<p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
								Universal, type-safe, adapter-based rate limiting for every runtime.
								Build better APIs with confidence.
							</p>
						</div>
					</div>

					{/* Enhanced CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/docs"
							className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 bg-primary rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow-lg hover:shadow-primary/20"
						>
							<span className="flex items-center gap-2">
								Get Started
								<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
							</span>
							<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</Link>
						<Link
							href="https://github.com/databuddy-analytics/better-ratelimit"
							className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-foreground transition-all duration-300 bg-background/50 border border-border/50 backdrop-blur-sm rounded-xl hover:bg-background hover:border-border focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-background shadow-lg hover:shadow-border/20"
						>
							<span className="flex items-center gap-2">
								View on GitHub
								<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
							</span>
						</Link>
					</div>

					{/* Enhanced Stats */}
					<div className="flex flex-wrap gap-12 justify-center">
						<div className="text-center group">
							<div className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">Universal</div>
							<div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Works everywhere</div>
						</div>
						<div className="text-center group">
							<div className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">Type-safe</div>
							<div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Full IntelliSense</div>
						</div>
						<div className="text-center group">
							<div className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">Adapter-based</div>
							<div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">No vendor lock-in</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
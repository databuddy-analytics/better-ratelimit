"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function CTA() {
    return (
        <div className="md:w-10/12 mx-auto font-geist relative md:border-l-0 md:border-b-0 md:border-[1.2px] border-border rounded-none -pr-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full md:mx-0">
                {/* Simple CTA Section */}
                <div className="relative border-l-[1.2px] border-t-[1.2px] border-border min-h-[400px] overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

                    <div className="relative z-10 p-12 h-full">
                        <div className="flex flex-col items-center justify-center w-full h-full gap-8 text-center">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground">
                                    Ready to get started?
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                                    Integrate better-ratelimit in minutes and never worry about abuse again.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    href="/docs"
                                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 bg-primary rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow-lg hover:shadow-primary/20"
                                >
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        Browse the Docs
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </Link>
                                <Link
                                    href="https://github.com/databuddy-analytics/better-ratelimit"
                                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-foreground transition-all duration-300 bg-background/50 border border-border/50 backdrop-blur-sm rounded-xl hover:bg-background hover:border-border focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-background shadow-lg hover:shadow-border/20"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="flex items-center gap-2">
                                        View on GitHub
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 
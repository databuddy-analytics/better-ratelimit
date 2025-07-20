"use client"

import { ArrowRight, Check, BarChart2, Zap, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import LiquidChrome from "../bits/liquid"

const ctaItems = [
    {
        title: "Get started",
        description: "Drop your site in and see what your users are doing in seconds",
        href: "https://app.databuddy.cc",
        primary: true
    },
    {
        title: "Read Documentation",
        description: "Learn how to integrate Databuddy with your tech stack.",
        href: "/docs",
        primary: false
    }
]

export default function CTA() {
    return (
        <div className="md:w-10/12 mx-auto font-geist relative md:border-l-0 md:border-b-0 md:border-[1.2px] border-border rounded-none -pr-2 bg-background/95">
            <div className="w-full md:mx-0">
                {/* CTA grid */}
                <div className="grid grid-cols-1 relative md:grid-rows-1 md:grid-cols-3 border-t-[1.2px] border-border">
                    <div className="hidden md:grid top-1/2 left-0 -translate-y-1/2 w-full grid-cols-3 z-10 pointer-events-none select-none absolute">
                        <Plus className="w-8 h-8 text-muted-foreground translate-x-[16.5px] translate-y-[.5px] ml-auto" />
                        <Plus className="w-8 h-8 text-muted-foreground ml-auto translate-x-[16.5px] translate-y-[.5px]" />
                    </div>

                    {ctaItems.map((item, index) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                                "justify-center border-l-[1.2px] border-border md:min-h-[240px] border-t-[1.2px] md:border-t-0 transform-gpu flex flex-col p-10 group hover:bg-muted/50 transition-colors",
                            )}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                            <div className="flex items-center gap-2 my-1">
                                {item.primary ? (
                                    <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                        <ArrowRight className="w-2 h-2 text-primary-foreground" />
                                    </div>
                                ) : (
                                    <div className="w-4 h-4 border border-border rounded-sm flex items-center justify-center">
                                        <ArrowRight className="w-2 h-2 text-muted-foreground" />
                                    </div>
                                )}
                                <p className="text-muted-foreground text-xs">
                                    {item.primary ? 'Try Now' : 'Learn More'}
                                </p>
                            </div>
                            <div className="mt-2">
                                <div className="max-w-full">
                                    <div className="flex gap-3 items-center">
                                        <p className={cn(
                                            "max-w-lg text-lg font-medium tracking-tight group-hover:text-primary transition-colors text-foreground",
                                            item.primary && "text-primary"
                                        )}>
                                            {item.title}
                                        </p>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-left text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Liquid Chrome CTA Section */}
                <div className="relative border-l-[1.2px] border-t-[1.2px] border-border min-h-[400px] overflow-hidden">
                    {/* Liquid Chrome Background */}
                    <div className="absolute inset-0 opacity-30">
                        <LiquidChrome
                            speed={0.3}
                            amplitude={0.4}
                            frequencyX={2.5}
                            frequencyY={1.8}
                            interactive={false}
                        />
                    </div>

                    {/* Gradient overlays for edge fading - theme aware */}
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-background/40" />

                    <div className="relative z-10 p-10 h-full">
                        <div className="flex flex-col items-center justify-center w-full h-full gap-8 text-center">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground">
                                    Ready to get started?
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                    Join developers who've ditched Google Analytics for something better.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <a
                                    href="https://app.databuddy.cc"
                                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 bg-primary rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow-lg hover:shadow-xl transform hover:scale-105"
                                    data-track="cta-get-started-click"
                                    data-section="cta"
                                    data-button-type="primary-cta"
                                    data-destination="register"
                                >
                                    Get started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </div>

                            <div className="flex items-center gap-8 text-sm text-muted-foreground opacity-60">
                                <span>Rivo.gg</span>
                                <span>Better-auth</span>
                                <span>Confinity</span>
                                <span>Wouldyoubot</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
} 
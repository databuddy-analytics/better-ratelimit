import Link from "next/link";
import { Github, Twitter, Mail, ExternalLink } from "lucide-react";
import Logo from "./logo";

export default function Footer() {
    return (
        <footer className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-3">
                            <Logo />
                            <p className="mt-6 text-base text-muted-foreground max-w-lg leading-relaxed">
                                Universal, type-safe, adapter-based rate limiting for every runtime.
                                Build better APIs with confidence.
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <a
                                    href="https://github.com/databuddy-analytics/better-ratelimit"
                                    className="group p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all duration-200"
                                    aria-label="GitHub"
                                >
                                    <Github className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </a>
                                <a
                                    href="https://x.com/betterratelimit"
                                    className="group p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all duration-200"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </a>
                                <a
                                    href="mailto:support@better-ratelimit.com"
                                    className="group p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all duration-200"
                                    aria-label="Email"
                                >
                                    <Mail className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </a>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">Contact</h3>
                            <ul className="space-y-4 text-sm">
                                <li>
                                    <a
                                        href="mailto:support@better-ratelimit.com"
                                        className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Contact Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} better-ratelimit. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                MIT licensed
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
} 
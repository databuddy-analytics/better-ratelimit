import { Mail, MessageCircle, Github, Twitter, Home } from 'lucide-react';
import { LogoContent } from './logo';

export function Footer() {
    return (
        <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-3">
                        <LogoContent />
                        <p className="text-sm text-muted-foreground">
                            Privacy-first web analytics without compromising user data.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/docs" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                            <li><a href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                            <li><a href="https://app.databuddy.cc" className="text-muted-foreground hover:text-foreground">Dashboard</a></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/blog" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                            <li><a href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                            <li><a href="/terms" className="text-muted-foreground hover:text-foreground">Terms</a></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="mailto:support@databuddy.cc" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                    <Mail className="h-4 w-4" />
                                    support@databuddy.cc
                                </a>
                            </li>
                            <li>
                                <a href="https://discord.gg/JTk7a38tCZ" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                    <MessageCircle className="h-4 w-4" />
                                    Discord
                                </a>
                            </li>
                        </ul>
                        <div className="flex gap-2 pt-2">
                            <a href="https://github.com/databuddy-analytics" className="p-2 rounded bg-muted hover:bg-muted/80" aria-label="GitHub">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="https://x.com/trydatabuddy" className="p-2 rounded bg-muted hover:bg-muted/80" aria-label="Twitter">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="https://app.databuddy.cc" className="p-2 rounded bg-muted hover:bg-muted/80" aria-label="Dashboard">
                                <Home className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Databuddy</p>
                    <p className="text-sm text-muted-foreground">Privacy-first analytics</p>
                </div>
            </div>
        </footer>
    );
} 
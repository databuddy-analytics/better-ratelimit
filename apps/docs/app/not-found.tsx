"use client";

import Link from "next/link";
import { Home, ArrowLeft, Link2Off } from "lucide-react";
import { Button } from "@/components/ui/button";
import LiquidChrome from "@/components/bits/liquid";
import { Navbar } from "@/components/navbar";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ['latin'] });

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950">
        <Navbar />
        <div className="relative flex-grow w-full h-full overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Liquid Chrome Background */}
            <div className="absolute inset-0 opacity-40">
                <LiquidChrome
                    speed={0.3}
                    amplitude={0.2}
                    frequencyX={3.0}
                    frequencyY={2.2}
                    interactive={true}
                />
            </div>

            {/* Gradient overlays for edge fading */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent" />
            
            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
                <h1 className={`text-4xl md:text-5xl font-bold text-white tracking-tighter mb-3 ${geist.className}`}>
                    Page Not Found
                </h1>
                
                <p className="text-neutral-400 max-w-sm mb-8">
                    The content you're looking for seems to have been moved or no longer exists.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                    <Button asChild size="lg" className="flex-1 bg-sky-600 hover:bg-sky-700">
                        <Link href="/" className={geist.className} >
                            <Home className="h-4 w-4 mr-2" />
                            Go Home
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-sky-500/20 hover:bg-sky-500/5"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
} 
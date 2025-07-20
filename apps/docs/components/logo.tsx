import Link from "next/link";
import Image from "next/image";
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-geist-mono',
});

export function LogoContent() {
    return (
        <div className="flex items-center gap-3 group">
            <div className="relative flex-shrink-0">
                <Image
                    src="/logo.svg"
                    alt="DataBuddy Logo"
                    width={32}
                    height={32}
                    className="drop-shadow-sm invert dark:invert-0"
                    priority
                />
            </div>
            <div className="flex items-center">
                <h1 className={`
          ${geistMono.variable}
          text-lg 
          tracking-wider
          font-semibold
          leading-none
          select-none
          transition-colors 
          duration-200
        `}>
                    DATABUDDY
                </h1>
            </div>
        </div>
    );
}

// Full Logo component with Link wrapper - for standalone use
export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
                <Image
                    src="/logo.svg"
                    alt="DataBuddy Logo"
                    width={32}
                    height={32}
                    className="drop-shadow-sm"
                    priority
                />
            </div>
            <div className="flex items-center">
                <h1 className="
          font-mono
          text-lg 
          tracking-wider
          font-semibold
          leading-none
          select-none
          transition-colors 
          duration-200
        ">
                    DATABUDDY
                </h1>
            </div>
        </Link>
    );
} 
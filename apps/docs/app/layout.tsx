import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Databuddy } from "@databuddy/sdk";
import "./global.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "better-ratelimit - Universal Rate Limiting for Every Runtime",
  description: "Universal, type-safe, adapter-based rate limiting for every runtime. Build better APIs with confidence.",
  authors: [{ name: "better-ratelimit Team" }],
  creator: "better-ratelimit",
  publisher: "better-ratelimit",
  metadataBase: new URL("https://better-ratelimit.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://better-ratelimit.com",
    title: "better-ratelimit - Universal Rate Limiting for Every Runtime",
    description: "Universal, type-safe, adapter-based rate limiting for every runtime. Build better APIs with confidence.",
    siteName: "better-ratelimit",
  },
  twitter: {
    card: "summary_large_image",
    title: "better-ratelimit - Universal Rate Limiting for Every Runtime",
    description: "Universal, type-safe, adapter-based rate limiting for every runtime. Build better APIs with confidence.",
    creator: "@betterratelimit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geist.variable,
          geistMono.variable
        )}
      >
        <Databuddy clientId="RGqg09Ja1rhVvtd5kczlx" trackErrors trackWebVitals trackInteractions trackOutgoingLinks />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

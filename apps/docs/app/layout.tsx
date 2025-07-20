import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { ThemeProvider } from "next-themes";
import { Databuddy } from '@databuddy/sdk';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from "next";
import { Geist } from 'next/font/google';
import Script from 'next/script';
import { Footer } from '@/components/footer';

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist'
});

export const metadata: Metadata = {
  title: "Databuddy - Privacy-First Web Analytics",
  description: "Experience powerful, privacy-first analytics that matches Google Analytics feature-for-feature without compromising user data. Zero cookies required, 100% data ownership, and AI-powered insights to help your business grow while staying compliant.",
  keywords: ["analytics", "web analytics", "privacy", "GDPR compliant", "cookieless", "website tracking", "data ownership", "performance analytics", "AI analytics", "privacy-first"],
  authors: [{ name: "Databuddy Team" }],
  creator: "Databuddy",
  publisher: "Databuddy",
  metadataBase: new URL("https://www.databuddy.cc"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.databuddy.cc",
    title: "Databuddy - Privacy-First Web Analytics",
    description: "Experience powerful, privacy-first analytics that matches Google Analytics feature-for-feature without compromising user data. Zero cookies required, 100% data ownership, and AI-powered insights to help your business grow while staying compliant.",
    siteName: "Databuddy",
    images: [
      {
        url: "og.webp",
        width: 1200,
        height: 630,
        alt: "Databuddy Dashboard"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Databuddy - Privacy-First Web Analytics",
    description: "Experience powerful, privacy-first analytics that matches Google Analytics feature-for-feature without compromising user data. Zero cookies required, 100% data ownership, and AI-powered insights to help your business grow while staying compliant.",
    images: ["og.webp"],
    creator: "@databuddyps",
    site: "@databuddyps"
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
  alternates: {
    canonical: "https://www.databuddy.cc",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  userScalable: true,
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <Script src="https://cdn.databuddy.cc/databuddy.js" strategy="afterInteractive" async
        data-client-id="OXmNQsViBT-FOS_wZCTHc"
        data-track-attributes={true}
        data-track-errors={true}
        data-track-outgoing-links={true}
        data-track-web-vitals={true}
      />
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootProvider >
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

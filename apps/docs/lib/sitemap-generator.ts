import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { blogSource } from "@/lib/blog-source";

export function generateSitemapEntries(): MetadataRoute.Sitemap {
	const baseUrl = "https://www.databuddy.cc";
	const lastModified = new Date();
	const entries: MetadataRoute.Sitemap = [];

	try {
		// Get all pages from the source
		const pages = source.getPages();
		const blogPages = blogSource.getPages();
		const nonDocPages = ["/privacy", "/demo", "/llms.txt"];

		// Priority mapping for different page types
		const priorityMap: Record<string, number> = {
			"/docs": 1.0,
			"/docs/getting-started": 0.9,
			"/docs/sdk": 0.9,
			"/docs/comparisons/databuddy-vs-google-analytics": 0.95,
			"/docs/compliance/gdpr-compliance-guide": 0.9,
			"/docs/performance/core-web-vitals-guide": 0.85,
			"/docs/domain-verification": 0.8,
			"/docs/dashboard": 0.8,
			"/docs/security": 0.8,
			"/docs/Integrations": 0.8,
			"/docs/api": 0.7,
			"/privacy": 0.5,
			"/demo": 0.6,
			"/llms.txt": 0.4,
		};

		// Change frequency mapping
		const changeFrequencyMap: Record<string, "weekly" | "monthly" | "yearly"> =
			{
				"/docs": "weekly",
				"/docs/getting-started": "weekly",
				"/docs/sdk": "weekly",
				"/docs/comparisons/databuddy-vs-google-analytics": "monthly",
				"/docs/compliance/gdpr-compliance-guide": "monthly",
				"/docs/performance/core-web-vitals-guide": "monthly",
				"/docs/domain-verification": "monthly",
				"/docs/dashboard": "weekly",
				"/docs/security": "monthly",
				"/docs/Integrations": "weekly",
				"/docs/api": "monthly",
				"/privacy": "yearly",
				"/demo": "monthly",
				"/llms.txt": "weekly",
			};

		// Process all pages from fumadocs source
		for (const page of pages) {
			const url = page.url;
			const priority =
				priorityMap[url] || (url.includes("/Integrations/") ? 0.7 : 0.6);
			const changeFrequency = changeFrequencyMap[url] || "weekly";

			entries.push({
				url: `${baseUrl}${url}`,
				lastModified,
				changeFrequency,
				priority,
			});
		}

		for (const page of blogPages) {
			entries.push({
				url: `${baseUrl}${page.url}`,
				lastModified,
				changeFrequency: "weekly",
				priority: 0.5,
			});
		}

		for (const page of nonDocPages) {
			entries.push({
				url: `${baseUrl}${page}`,
				lastModified,
				changeFrequency: "yearly",
				priority: 0.5,
			});
		}

		// Add integration pages with higher priority for React/Next.js
		const integrationPattern = /\/docs\/Integrations\/(.+)/;
		for (const entry of entries) {
			const match = entry.url.match(integrationPattern);
			if (match) {
				const integrationName = match[1];
				if (integrationName === "react" || integrationName === "nextjs") {
					entry.priority = 0.8;
				}
			}
		}
	} catch (error) {
		// Fallback to static entries if dynamic generation fails
		console.warn("Failed to generate dynamic sitemap, using fallback:", error);

		const fallbackEntries = [
			{ url: "/docs", priority: 1.0, changeFrequency: "weekly" as const },
			{
				url: "/docs/getting-started",
				priority: 0.9,
				changeFrequency: "weekly" as const,
			},
			{ url: "/docs/sdk", priority: 0.9, changeFrequency: "weekly" as const },
			{
				url: "/docs/domain-verification",
				priority: 0.8,
				changeFrequency: "monthly" as const,
			},
			{
				url: "/docs/dashboard",
				priority: 0.8,
				changeFrequency: "weekly" as const,
			},
			{
				url: "/docs/security",
				priority: 0.8,
				changeFrequency: "monthly" as const,
			},
			{ url: "/docs/api", priority: 0.7, changeFrequency: "monthly" as const },
			{
				url: "/docs/Integrations",
				priority: 0.8,
				changeFrequency: "weekly" as const,
			},
			{
				url: "/docs/Integrations/react",
				priority: 0.8,
				changeFrequency: "weekly" as const,
			},
			{
				url: "/docs/Integrations/nextjs",
				priority: 0.8,
				changeFrequency: "weekly" as const,
			},
			{
				url: "/docs/Integrations/wordpress",
				priority: 0.8,
				changeFrequency: "weekly" as const,
			},
			{
				url: "/docs/Integrations/shopify",
				priority: 0.8,
				changeFrequency: "weekly" as const,
			},
			{
				url: "/docs/Integrations/stripe",
				priority: 0.8,
				changeFrequency: "weekly" as const,
			},
			{
				url: "/docs/Integrations/framer",
				priority: 0.7,
				changeFrequency: "weekly" as const,
			},
			{
				url: "/docs/Integrations/gtm",
				priority: 0.7,
				changeFrequency: "weekly" as const,
			},
			{ url: "/privacy", priority: 0.5, changeFrequency: "yearly" as const },
			{ url: "/demo", priority: 0.6, changeFrequency: "monthly" as const },
			{ url: "/llms.txt", priority: 0.4, changeFrequency: "weekly" as const },
		];

		for (const entry of fallbackEntries) {
			entries.push({
				url: `${baseUrl}${entry.url}`,
				lastModified,
				changeFrequency: entry.changeFrequency,
				priority: entry.priority,
			});
		}
	}

	return entries;
}

export function getSitemapMetadata() {
	return {
		title: "Databuddy Documentation Sitemap",
		description:
			"Dynamically generated sitemap of Databuddy documentation including all guides, integrations, and API references.",
		keywords: [
			"databuddy",
			"analytics",
			"documentation",
			"sitemap",
			"privacy-first",
			"web analytics",
		],
	};
}

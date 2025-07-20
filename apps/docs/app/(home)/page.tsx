import Hero from "@/components/landing/hero";
import Features from "@/components/features";
import FAQ from "@/components/landing/faq";
import CTA from "@/components/landing/cta";

// async function getGitHubStars() {
// 	try {
// 		const response = await fetch(
// 			"https://api.github.com/repos/databuddy-analytics",
// 			{
// 				headers: {
// 					Accept: "application/vnd.github.v3+json",
// 				},
// 				next: { revalidate: 3600 }, // Cache for 1 hour
// 			}
// 		);

// 		if (!response.ok) {
// 			throw new Error("Failed to fetch GitHub data");
// 		}

// 		const data = await response.json();
// 		return data.stargazers_count?.toLocaleString() || null;
// 	} catch (error) {
// 		console.error("Error fetching GitHub stars:", error);
// 		return null;
// 	}
// }

export default async function HomePage() {
	// const stars = await getGitHubStars();

	return (
		<div className="min-h-screen">
			<Hero />

			<Features stars={null} />

			<FAQ />

			<CTA />

		</div>
	);
}
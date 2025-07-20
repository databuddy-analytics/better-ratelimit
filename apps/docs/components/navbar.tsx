"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "./nav-link";
import Logo from "./logo";

export const Navbar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<div className="flex flex-col sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border/50 z-30 shadow-sm">
			<nav>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo Section */}
						<div className="flex-shrink-0">
							<Logo />
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:block">
							<ul className="flex items-center divide-x divide-border/30">
								{navMenu.map((menu, i) => (
									<NavLink key={menu.name} href={menu.path} external={menu.external}>
										{menu.name}
									</NavLink>
								))}
								<NavLink
									href="https://github.com/databuddy-analytics/better-ratelimit"
									className="bg-muted/30 hover:bg-muted/50 border border-border/30 hover:border-border/50 transition-all duration-200"
									external
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.4em"
										height="1.4em"
										viewBox="0 0 496 512"
										className="transition-transform duration-200 hover:scale-110"
									>
										<title>GitHub</title>
										<path
											fill="currentColor"
											d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6m-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3m44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8M97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1m-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7m32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1m-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2"
										/>
									</svg>
								</NavLink>
							</ul>
						</div>

						{/* Mobile Burger Menu Button */}
						<button
							type="button"
							onClick={toggleMobileMenu}
							className="md:hidden p-2.5 rounded-lg hover:bg-muted/50 active:bg-muted/70 transition-all duration-200 relative group border border-transparent hover:border-border/30"
							aria-label="Toggle mobile menu"
						>
							<div className="relative w-6 h-6">
								<Menu
									className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-out ${isMobileMenuOpen ? 'rotate-90 opacity-0 scale-90' : 'rotate-0 opacity-100 scale-100'
										}`}
								/>
								<X
									className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-out ${isMobileMenuOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-90'
										}`}
								/>
							</div>
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Navigation Menu */}
			<div
				className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${isMobileMenuOpen
					? 'max-h-96 opacity-100 border-b border-border/50'
					: 'max-h-0 opacity-0'
					}`}
			>
				<div className="bg-background/95 backdrop-blur-sm">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-1">
						{navMenu.map((menu, index) => (
							<Link
								key={menu.name}
								href={menu.path}
								className={`block px-4 py-3 rounded-lg text-base font-medium hover:bg-muted/50 active:bg-muted/70 transition-all duration-200 transform hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-primary/20 ${isMobileMenuOpen
									? 'translate-x-0 opacity-100'
									: '-translate-x-4 opacity-0'
									}`}
								style={{
									transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
								}}
								onClick={() => setIsMobileMenuOpen(false)}
								{...(menu.external && { target: "_blank", rel: "noopener noreferrer" })}
							>
								{menu.name}
							</Link>
						))}
						<Link
							href="https://github.com/databuddy-analytics/better-ratelimit"
							className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-muted/50 active:bg-muted/70 transition-all duration-200 transform hover:translate-x-1 border border-border/30 hover:border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 ${isMobileMenuOpen
								? 'translate-x-0 opacity-100'
								: '-translate-x-4 opacity-0'
								}`}
							style={{
								transitionDelay: isMobileMenuOpen ? `${navMenu.length * 50}ms` : '0ms'
							}}
							onClick={() => setIsMobileMenuOpen(false)}
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1.2em"
								height="1.2em"
								viewBox="0 0 496 512"
								className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0"
							>
								<title>GitHub</title>
								<path
									fill="currentColor"
									d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6m-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3m44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8M97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1m-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7m32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1m-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2"
								/>
							</svg>
							<span>GitHub</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export const navMenu = [
	{
		name: "Home",
		path: "/",
		external: false,
	},
]; 
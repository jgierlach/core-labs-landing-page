<!-- Header.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let servicesOpen = $state(false);
	let mobileMenuOpen = $state(false);

	// Navigation items for reuse
	const navItems = [
		{ href: '/', label: 'Home', exact: true },
		{ href: '/services', label: 'Services', hasDropdown: true },
		{ href: 'https://client.corelabs.digital/', label: 'Client Portal', external: true },
		{ href: '/#intake-form', label: 'Work with us' },
		{ href: '/contact', label: 'Contact' }
	];

	// Check if a nav item is active
	function isActive(href: string, exact = false): boolean {
		const currentPath = $page.url.pathname;
		if (exact) {
			return currentPath === href;
		}
		if (href.startsWith('#') || href.includes('#')) {
			return false;
		}
		return currentPath.startsWith(href);
	}

	// Close mobile menu when route changes
	$effect(() => {
		$page.url.pathname;
		mobileMenuOpen = false;
	});

	// Prevent body scroll when mobile menu is open
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
		}
	});

	// Listen for custom event to close mobile menu
	function handleCloseMobileMenu() {
		mobileMenuOpen = false;
	}

	onMount(() => {
		window.addEventListener('closeMobileMenu', handleCloseMobileMenu);
		return () => {
			window.removeEventListener('closeMobileMenu', handleCloseMobileMenu);
		};
	});
</script>

<header class="absolute top-0 right-0 left-0 z-50">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex h-20 items-center justify-between">
			<!-- Logo / Brand Option 5 - Rounded Square with CL -->
			<div class="flex items-center">
				<a href="/" class="logo-app-icon group flex items-center">
					<div
						class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#334fff] to-[#7433ff]"
					>
						<span class="text-lg font-bold tracking-tight text-white">CL</span>
					</div>
				</a>
			</div>

			<!-- Desktop Nav -->
			<nav class="hidden md:block" aria-label="Primary">
				<div class="flex items-center space-x-8">
					<a
						href="/"
						class="nav-link px-3 py-2 text-sm font-medium transition-colors hover:text-white {isActive(
							'/',
							true
						)
							? 'active text-white'
							: 'text-white/70'}"
					>
						Home
					</a>
					<div class="relative">
						<button
							class="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-white {servicesOpen
								? 'text-white'
								: 'text-white/70'}"
							onclick={() => (servicesOpen = !servicesOpen)}
							onblur={() => setTimeout(() => (servicesOpen = false), 150)}
						>
							Services
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 transition-transform {servicesOpen ? 'rotate-180' : ''}"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						{#if servicesOpen}
							<div
								class="absolute top-full left-0 mt-2 w-48 rounded-lg border border-white/10 bg-[#1a1035] py-2 shadow-xl"
							>
								<a
									href="/#intake-form"
									class="block px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
								>
									Website
								</a>
								<a
									href="/#intake-form"
									class="block px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
								>
									Custom Software
								</a>
							</div>
						{/if}
					</div>
					<!-- <a
						href="https://client.corelabs.digital/"
						target="_blank"
						class="nav-link block px-4 py-2 text-sm text-white/70 hover:text-white"
					>
						Client Portal
					</a> -->
					<a
						href="/#intake-form"
						class="nav-link px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
					>
						Work with us
					</a>
					<a
						href="/contact"
						class="nav-link block px-4 py-2 text-sm transition-colors hover:text-white {isActive(
							'/contact'
						)
							? 'active text-white'
							: 'text-white/70'}"
					>
						Contact
					</a>
				</div>
			</nav>

			<!-- Mobile Menu Button & CTA -->
			<div class="flex items-center gap-4">
				<!-- Contact CTA (hidden on mobile when menu is open) -->
				<a
					href="/#intake-form"
					class="nav-cta-gradient btn-animate group inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-5 text-sm font-medium text-white shadow-lg {mobileMenuOpen
						? 'hidden md:inline-flex'
						: ''}"
				>
					Get Started
					<span
						class="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-3 w-3"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
						</svg>
					</span>
				</a>

				<!-- Hamburger Menu Button -->
				<button
					class="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 md:hidden"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={mobileMenuOpen}
				>
					<div class="hamburger {mobileMenuOpen ? 'open' : ''}">
						<span class="hamburger-line"></span>
						<span class="hamburger-line"></span>
						<span class="hamburger-line"></span>
					</div>
				</button>
			</div>
		</div>
	</div>
</header>

<!-- Mobile Menu Overlay -->
{#if mobileMenuOpen}
	<button
		type="button"
		class="mobile-menu-overlay"
		onclick={() => (mobileMenuOpen = false)}
		aria-label="Close menu"
	></button>
{/if}

<!-- Mobile Menu -->
<nav
	class="mobile-menu {mobileMenuOpen ? 'open' : ''}"
	aria-label="Mobile navigation"
	aria-hidden={!mobileMenuOpen}
>
	<div class="flex h-full flex-col justify-start px-8 pt-24">
		<ul class="space-y-2">
			<li class="mobile-nav-item" style="--delay: 0">
				<a
					href="/"
					class="mobile-nav-link {isActive('/', true) ? 'active' : ''}"
					onclick={() => (mobileMenuOpen = false)}
				>
					Home
				</a>
			</li>
			<li class="mobile-nav-item" style="--delay: 1">
				<a href="/#intake-form" class="mobile-nav-link" onclick={() => (mobileMenuOpen = false)}>
					Services
				</a>
			</li>
			<!-- <li class="mobile-nav-item" style="--delay: 2">
				<a
					href="https://client.corelabs.digital/"
					target="_blank"
					class="mobile-nav-link"
					onclick={() => (mobileMenuOpen = false)}
				>
					Client Portal
				</a>
			</li> -->
			<li class="mobile-nav-item" style="--delay: 3">
				<a href="/#intake-form" class="mobile-nav-link" onclick={() => (mobileMenuOpen = false)}>
					Work with us
				</a>
			</li>
			<li class="mobile-nav-item" style="--delay: 4">
				<a
					href="/contact"
					class="mobile-nav-link {isActive('/contact') ? 'active' : ''}"
					onclick={() => (mobileMenuOpen = false)}
				>
					Contact
				</a>
			</li>
		</ul>

		<!-- Mobile CTA -->
		<div class="mobile-nav-item mt-8 sm:mt-12" style="--delay: 5">
			<a
				href="/#intake-form"
				class="nav-cta-gradient inline-flex items-center gap-2 rounded-full py-3 pr-3 pl-6 text-base font-medium text-white shadow-lg"
				onclick={() => (mobileMenuOpen = false)}
			>
				Get Started
				<span
					class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
					</svg>
				</span>
			</a>
		</div>
	</div>
</nav>

<style>
	.logo-circle {
		background: linear-gradient(135deg, #334fff 0%, #7433ff 100%);
		box-shadow: 0 0 20px rgba(116, 51, 255, 0.3);
		transition: all 0.3s ease;
	}

	.logo-circle:hover {
		box-shadow: 0 0 25px rgba(116, 51, 255, 0.5);
		transform: scale(1.05);
	}

	/* Option 2 - Code Brackets */
	.logo-brackets {
		transition: all 0.3s ease;
	}

	.logo-brackets:hover .bracket {
		transform: scaleX(1.1);
	}

	.logo-brackets .bracket {
		display: inline-block;
		transition: all 0.3s ease;
	}

	/* Option 3 - Hexagon */
	.logo-hexagon {
		background: linear-gradient(135deg, #334fff 0%, #7433ff 100%);
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
		transition: all 0.3s ease;
		filter: drop-shadow(0 0 8px rgba(116, 51, 255, 0.4));
	}

	.logo-hexagon:hover {
		transform: scale(1.1);
		filter: drop-shadow(0 0 15px rgba(116, 51, 255, 0.6));
	}

	/* Option 4 - Abstract Monogram */
	.logo-monogram svg {
		filter: drop-shadow(0 0 8px rgba(116, 51, 255, 0.3));
		transition: all 0.3s ease;
	}

	.logo-monogram:hover svg {
		filter: drop-shadow(0 0 12px rgba(116, 51, 255, 0.5));
		transform: scale(1.1);
	}

	.logo-monogram .c-path {
		transition: all 0.3s ease;
	}

	.logo-monogram .l-path {
		transition: all 0.3s ease;
	}

	.logo-monogram:hover .l-path {
		stroke: url(#logoGradient);
	}

	/* Option 5 - Rounded Square App Icon */
	.logo-app-icon > div {
		box-shadow: 0 4px 15px rgba(116, 51, 255, 0.3);
		transition: all 0.3s ease;
	}

	.logo-app-icon:hover > div {
		transform: scale(1.1);
		box-shadow: 0 6px 20px rgba(116, 51, 255, 0.5);
	}

	.nav-cta-gradient {
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
	}

	.nav-cta-gradient:hover {
		background: linear-gradient(109deg, #4560ff 13.24%, #8344ff 92.35%);
	}

	/* Desktop Nav Active State */
	.nav-link.active {
		position: relative;
	}

	.nav-link.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 20px;
		height: 2px;
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
		border-radius: 1px;
	}

	/* Hamburger Menu Styles */
	.hamburger {
		width: 24px;
		height: 18px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.hamburger-line {
		display: block;
		width: 100%;
		height: 2px;
		background-color: white;
		border-radius: 2px;
		transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
		transform-origin: center;
	}

	.hamburger.open .hamburger-line:nth-child(1) {
		transform: translateY(8px) rotate(45deg);
	}

	.hamburger.open .hamburger-line:nth-child(2) {
		opacity: 0;
		transform: scaleX(0);
	}

	.hamburger.open .hamburger-line:nth-child(3) {
		transform: translateY(-8px) rotate(-45deg);
	}

	/* Mobile Menu Overlay */
	.mobile-menu-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		z-index: 40;
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Mobile Menu */
	.mobile-menu {
		position: fixed;
		top: 0;
		right: 0;
		width: 100%;
		max-width: 400px;
		height: 100vh;
		height: 100dvh;
		background: linear-gradient(180deg, #0f0a1f 0%, #1a1035 100%);
		z-index: 45;
		transform: translateX(100%);
		transition: transform 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
		overflow-y: auto;
	}

	.mobile-menu.open {
		transform: translateX(0);
	}

	/* Staggered Link Animation */
	.mobile-nav-item {
		opacity: 0;
		transform: translateX(30px);
	}

	.mobile-menu.open .mobile-nav-item {
		animation: slideIn 0.4s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
		animation-delay: calc(0.1s + var(--delay) * 0.08s);
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Mobile Nav Links */
	.mobile-nav-link {
		display: block;
		padding: 0.75rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.7);
		transition: all 0.3s ease;
		position: relative;
	}

	/* Larger font on taller screens */
	@media (min-height: 700px) {
		.mobile-nav-link {
			padding: 1rem 0;
			font-size: 1.75rem;
		}
	}

	.mobile-nav-link:hover,
	.mobile-nav-link.active {
		color: white;
		transform: translateX(8px);
	}

	.mobile-nav-link.active::before {
		content: '';
		position: absolute;
		left: -16px;
		top: 50%;
		transform: translateY(-50%);
		width: 4px;
		height: 24px;
		background: linear-gradient(180deg, #334fff 0%, #7433ff 100%);
		border-radius: 2px;
	}

	/* Hide mobile menu on desktop */
	@media (min-width: 768px) {
		.mobile-menu,
		.mobile-menu-overlay {
			display: none;
		}
	}
</style>

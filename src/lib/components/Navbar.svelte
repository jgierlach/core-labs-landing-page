<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let servicesOpen = $state(false);
	let mobileMenuOpen = $state(false);

	/** @param {string} href */
	/** @param {boolean} [exact] */
	function isActive(href, exact = false) {
		const currentPath = $page.url.pathname;
		if (exact) {
			return currentPath === href;
		}
		if (href.startsWith('#') || href.includes('#')) {
			return false;
		}
		return currentPath.startsWith(href);
	}

	$effect(() => {
		$page.url.pathname;
		mobileMenuOpen = false;
	});

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
		}
	});

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
			<div class="flex items-center">
				<a href="/" class="logo-app-icon group flex items-center">
					<div
						class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#334fff] to-[#7433ff]"
					>
						<span class="text-lg font-bold tracking-tight text-white">CL</span>
					</div>
				</a>
			</div>

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

			<div class="flex items-center gap-4">
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

{#if mobileMenuOpen}
	<button
		type="button"
		class="mobile-menu-overlay"
		onclick={() => (mobileMenuOpen = false)}
		aria-label="Close menu"
	></button>
{/if}

<nav
	class="mobile-menu {mobileMenuOpen ? 'open' : ''}"
	aria-label="Mobile navigation"
	aria-hidden={!mobileMenuOpen}
	inert={!mobileMenuOpen ? true : undefined}
>
	<div class="flex h-full flex-col justify-start px-8 pt-24">
		<ul class="space-y-2">
			<li class="mobile-nav-item" style="--delay: 0">
				<a
					href="/"
					class="mobile-nav-link {isActive('/', true) ? 'active' : ''}"
					onclick={() => (mobileMenuOpen = false)}
					tabindex={mobileMenuOpen ? 0 : -1}
				>
					Home
				</a>
			</li>
			<li class="mobile-nav-item" style="--delay: 1">
				<a href="/#intake-form" class="mobile-nav-link" onclick={() => (mobileMenuOpen = false)} tabindex={mobileMenuOpen ? 0 : -1}>
					Services
				</a>
			</li>
			<li class="mobile-nav-item" style="--delay: 3">
				<a href="/#intake-form" class="mobile-nav-link" onclick={() => (mobileMenuOpen = false)} tabindex={mobileMenuOpen ? 0 : -1}>
					Work with us
				</a>
			</li>
			<li class="mobile-nav-item" style="--delay: 4">
				<a
					href="/contact"
					class="mobile-nav-link {isActive('/contact') ? 'active' : ''}"
					onclick={() => (mobileMenuOpen = false)}
					tabindex={mobileMenuOpen ? 0 : -1}
				>
					Contact
				</a>
			</li>
		</ul>

		<div class="mobile-nav-item mt-8 sm:mt-12" style="--delay: 5">
			<a
				href="/#intake-form"
				class="nav-cta-gradient inline-flex items-center gap-2 rounded-full py-3 pr-3 pl-6 text-base font-medium text-white shadow-lg"
				onclick={() => (mobileMenuOpen = false)}
				tabindex={mobileMenuOpen ? 0 : -1}
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

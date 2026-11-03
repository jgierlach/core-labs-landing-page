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

	// ===== Scroll-spy for homepage section links =====
	// Sections the nav links to. A section counts as "current" while it crosses a thin
	// band just above the middle of the viewport, so only one is ever active at a time.
	const SPY_SECTIONS = ['recent-work', 'pricing'];
	let activeSection = $state('');

	$effect(() => {
		if ($page.url.pathname !== '/') {
			activeSection = '';
			return;
		}

		const targets = SPY_SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
		if (!targets.length) return;

		const visible = new Set();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) visible.add(entry.target.id);
					else visible.delete(entry.target.id);
				}
				activeSection = SPY_SECTIONS.find((id) => visible.has(id)) ?? '';
			},
			{ rootMargin: '-40% 0px -55% 0px' }
		);
		targets.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});

	/** True when a homepage section link should show as current. @param {string} id */
	function isSectionActive(id) {
		return $page.url.pathname === '/' && activeSection === id;
	}

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

<header class="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
	<div
		class="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-white/10 bg-background/75 pr-2 pl-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:pl-4"
	>
		<a href="/" class="logo-app-icon group flex items-center gap-2.5" aria-label="Core Labs home">
			<div
				class="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-violet"
			>
				<span class="text-base font-bold tracking-tight text-white">CL</span>
			</div>
			<span class="font-heading text-lg font-semibold tracking-tight text-white">Core Labs</span>
		</a>

		<nav class="hidden md:block" aria-label="Primary">
			<div class="flex items-center gap-1 lg:gap-2">
				<div class="relative">
					<button
						class="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-white {servicesOpen
							? 'text-white'
							: 'text-white/70'}"
						aria-expanded={servicesOpen}
						onclick={() => (servicesOpen = !servicesOpen)}
						onblur={() => setTimeout(() => (servicesOpen = false), 150)}
					>
						Services
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-lilac transition-transform {servicesOpen ? 'rotate-180' : ''}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{#if servicesOpen}
						<div
							class="absolute top-full left-0 mt-3 w-56 rounded-2xl border border-white/10 bg-surface-raised p-2 shadow-2xl"
						>
							<a
								href="/#intake-form"
								class="block rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
							>
								Websites
							</a>
							<a
								href="/#intake-form"
								class="block rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
							>
								Custom Software
							</a>
							<a
								href="/website-redesign"
								class="block rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
							>
								Free Website Redesign
							</a>
						</div>
					{/if}
				</div>
				<a
					href="/#recent-work"
					onclick={() => (activeSection = 'recent-work')}
					aria-current={isSectionActive('recent-work') ? 'location' : undefined}
					class="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-white {isSectionActive(
						'recent-work'
					)
						? 'bg-white/10 text-white'
						: 'text-white/70'}"
				>
					Our work
				</a>
				<!-- Pricing link hidden while the homepage #pricing section is commented out
				<a
					href="/#pricing"
					onclick={() => (activeSection = 'pricing')}
					aria-current={isSectionActive('pricing') ? 'location' : undefined}
					class="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-white {isSectionActive(
						'pricing'
					)
						? 'bg-white/10 text-white'
						: 'text-white/70'}"
				>
					Pricing
				</a>
				-->
				<a
					href="/contact"
					aria-current={isActive('/contact') ? 'page' : undefined}
					class="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-white {isActive(
						'/contact'
					)
						? 'bg-white/10 text-white'
						: 'text-white/70'}"
				>
					Contact
				</a>
			</div>
		</nav>

		<div class="flex items-center gap-2">
			<a
				href="/contact"
				class="hidden rounded-full bg-white px-4 py-2.5 font-mono text-xs tracking-wider text-background uppercase transition-colors hover:bg-white/85 lg:inline-flex"
			>
				Book a call
			</a>
			<a
				href="/#intake-form"
				class="nav-cta-gradient items-center rounded-full px-4 py-2.5 font-mono text-xs tracking-wider text-white uppercase shadow-lg transition-shadow hover:shadow-brand-violet/40 {mobileMenuOpen
					? 'hidden md:inline-flex'
					: 'inline-flex'}"
			>
				Get started
			</a>

			<button
				class="relative z-50 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 md:hidden"
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
					class="mobile-nav-link {isActive('/', true) && !activeSection ? 'active' : ''}"
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
			<li class="mobile-nav-item" style="--delay: 2">
				<a href="/#recent-work" class="mobile-nav-link {isSectionActive('recent-work') ? 'active' : ''}" aria-current={isSectionActive('recent-work') ? 'location' : undefined} onclick={() => { activeSection = 'recent-work'; mobileMenuOpen = false; }} tabindex={mobileMenuOpen ? 0 : -1}>
					Our work
				</a>
			</li>
			<!-- Pricing link hidden while the homepage #pricing section is commented out
			<li class="mobile-nav-item" style="--delay: 2">
				<a href="/#pricing" class="mobile-nav-link {isSectionActive('pricing') ? 'active' : ''}" aria-current={isSectionActive('pricing') ? 'location' : undefined} onclick={() => { activeSection = 'pricing'; mobileMenuOpen = false; }} tabindex={mobileMenuOpen ? 0 : -1}>
					Pricing
				</a>
			</li>
			-->
			<li class="mobile-nav-item" style="--delay: 3">
				<a href="/website-redesign" class="mobile-nav-link {isActive('/website-redesign') ? 'active' : ''}" onclick={() => (mobileMenuOpen = false)} tabindex={mobileMenuOpen ? 0 : -1}>
					Free redesign
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
				class="nav-cta-gradient inline-flex items-center gap-4 rounded-full py-2 pr-2 pl-6 font-mono text-sm tracking-wider text-white uppercase shadow-lg"
				onclick={() => (mobileMenuOpen = false)}
				tabindex={mobileMenuOpen ? 0 : -1}
			>
				Get started
				<span class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-violet">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</span>
			</a>
		</div>
	</div>
</nav>

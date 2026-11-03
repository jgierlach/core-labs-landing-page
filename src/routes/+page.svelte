<script>
	import { onMount } from 'svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal.js';
	import { splitWords, scramble, countUp } from '$lib/actions/motion.js';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';

	// ===== Features Data =====
	// Each reason is paired with a real build that shows it, rendered in the tabbed panel.
	let features = $state([
		{
			title: 'Unified Platform',
			description: 'Replace multiple SaaS subscriptions with one comprehensive custom solution that handles all your business needs under one roof.',
			points: ['One login for the whole team', 'One source of truth', 'No more copy-paste between tools'],
			stat: '1',
			statLabel: 'Platform, not ten',
			image: 'hometown.jpg',
			client: 'Hometown Industries',
			caption: 'Warehouse management platform'
		},
		{
			title: '100% Custom Built',
			description: 'Every feature is built specifically for your business processes. No more settling for 60% functionality from off-the-shelf solutions.',
			points: ['Built around your workflow', 'Your terms, your screens', 'Features only you need'],
			stat: '100%',
			statLabel: 'Custom fit',
			image: 'rai.jpg',
			client: 'RAI Digital Assets',
			caption: 'Crypto tax-loss harvesting engine'
		},
		{
			title: 'Massive Cost Savings',
			description: 'Replace a stack of expensive SaaS subscriptions with one. Our custom solutions typically cost 40% less than multiple vendor subscriptions.',
			points: ['No stacked subscriptions', 'One monthly subscription', 'Pays for itself'],
			stat: '40%',
			statLabel: 'Typical cost savings',
			image: 'purposeinexpenses.webp',
			client: 'Purpose In Expenses',
			caption: 'Expense-to-donation platform'
		},
		{
			title: 'Evolves With You',
			description: 'Unlike static SaaS products, your custom platform grows and adapts as your business needs change over time.',
			points: ['Ongoing feature development', 'Scales as you grow', '24/7 priority support'],
			stat: '24/7',
			statLabel: 'Support',
			image: 'greysource-landing-20260923.webp',
			client: 'GreySource',
			caption: 'Recruiting platform'
		}
	]);

	let activeFeature = $state(0);

	// ===== Stats Data =====
	let stats = $state([
		{ value: '40%', label: 'Cost Savings' },
		{ value: '100%', label: 'Custom Fit' },
		{ value: '24/7', label: 'Support' },
		{ value: '∞', label: 'Scalability' }
	]);

	// ===== Free Website Redesign =====
	// Mirrors the promises on /website-redesign — keep the two in step.
	const redesignPerks = [
		'Homepage and key pages, designed for desktop and mobile',
		'Delivered within 5 business days',
		'Professional design valued at $2,500+, free'
	];

	// ===== What we've built recently =====
	// Screenshots live in /static/portfolio and were captured from the live sites.
	let recentBuilds = $state([
		{
			title: 'Creator roster and brand pipeline',
			client: 'Never Settle Media',
			tag: 'Creative Agency',
			url: 'https://www.neversettlemedia.com/',
			image: 'neversettle.jpg',
			description:
				'A roster, brand-partnership pipeline, and booking front door for a boutique management company representing underrepresented creators.'
		},
		{
			title: 'Expense-to-donation platform',
			client: 'Purpose In Expenses',
			tag: 'Social Impact',
			url: 'https://www.purposeinexpenses.com/',
			image: 'purposeinexpenses.webp',
			description:
				'Turns the bills a business already pays into recurring donations to nonprofits, with a live impact estimator that prices the good before anyone signs up.'
		},
		{
			title: 'Warehouse management platform',
			client: 'Hometown Industries',
			tag: 'Operations',
			url: 'https://www.hometown-industries.com/',
			image: 'hometown.jpg',
			description:
				'Receiving, storage, and fulfilment for a full-service supply chain partner, wired to the systems that already hold the inventory.'
		},
		{
			title: 'Food pantry and volunteer site',
			client: 'Wilkinsburg Community Ministry',
			tag: 'Nonprofit',
			url: 'https://www.wcm15221.org/',
			image: 'wcm.jpg',
			description:
				'A choice-model pantry where neighbours walk the aisles and take what their family will eat, free. Pantry hours, volunteer signup, and giving campaigns in one place.'
		},
		{
			title: 'Crypto tax-loss harvesting platform',
			client: 'RAI Digital Assets',
			tag: 'Fintech',
			url: 'https://www.raidigitalsolutions.com/',
			image: 'rai.jpg',
			description:
				'Automated tax optimisation for digital asset portfolios — a lot-selection engine that scans continuously and executes across every account under management.'
		},
		{
			title: 'Recruiting platform',
			client: 'GreySource',
			tag: 'Hiring',
			url: 'https://greysource.com/',
			image: 'greysource-landing-20260923.webp',
			description:
				'Sourcing, screening, and scheduling for a certified DEI recruiting team, built around how they actually place candidates.'
		},
		{
			title: 'Hotel management portfolio',
			client: 'Alberigo Hotel Management',
			tag: 'Hospitality',
			url: 'https://www.alberigohotelmgt.com/',
			image: 'alberigo.jpg',
			description:
				'Properties, leadership, and careers for a hotel management group, with every brand they operate presented in one place.'
		},
		{
			title: 'Permit processing site',
			client: 'Permits & More',
			tag: 'Trades',
			url: 'https://www.permitsandmore.com/',
			image: 'permits.jpg',
			description:
				'Services, project history, and intake for a permit expediting firm that moves builds from first concept to final approval.'
		}
	]);

	let railElement = $state(null);
	let railIndex = $state(0);

	// A snapping container cancels animated programmatic scrolls, so the arrows set the
	// position directly. Landing on the exact card offset means the snap agrees with it,
	// and touch swiping keeps native momentum and snapping untouched.
	function scrollRail(direction) {
		if (!railElement) return;
		const cards = railElement.querySelectorAll('[data-rail-card]');
		if (!cards.length) return;
		railIndex = Math.min(Math.max(railIndex + direction, 0), cards.length - 1);
		railElement.scrollLeft = cards[railIndex].offsetLeft - cards[0].offsetLeft;
	}

	// ===== Pricing Data =====
	let plans = $state([
		{
			name: 'Custom Build',
			price: 'From $25K',
			description: 'Complete custom software solution built for your specific needs',
			features: [
				'Fully custom platform',
				'Mobile & web compatible',
				'Database migration',
				'Advanced integrations',
				'Dedicated development team',
				'Training & documentation',
				'Ongoing feature development',
				'24/7 priority support'
			],
			cta: 'Get Started',
			popular: true
		}
	]);

	const CONTACT_FORM_SLUG = 'contact-c54421';
	const CONTACT_FORM_URL = 'https://api.corelabs.digital/api/forms/contact-c54421/submit';
	const HCAPTCHA_SITEKEY = '9f64291e-4d3a-4ae8-b4ee-5692268481b2';

	// ===== Intake Form State =====
	let fullName = $state('');
	let companyName = $state('');
	let email = $state('');
	let phone = $state('');
	let projectDetails = $state('');
	let foundUsVia = $state('');
	let helpWith = $state('');
	let utmSource = $state('');
	let selectedCountry = $state({ code: '+1', flag: '🇺🇸', name: 'United States' });
	let showCountryDropdown = $state(false);
	let formElement = $state(null);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let hcaptchaWidgetId = $state(null);
	let hcaptchaContainer = $state(null);

	let countries = $state([
		{ code: '+1', flag: '🇺🇸', name: 'United States' },
		{ code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
		{ code: '+57', flag: '🇨🇴', name: 'Colombia' },
		{ code: '+34', flag: '🇪🇸', name: 'Spain' },
		{ code: '+49', flag: '🇩🇪', name: 'Germany' },
		{ code: '+33', flag: '🇫🇷', name: 'France' },
		{ code: '+39', flag: '🇮🇹', name: 'Italy' },
		{ code: '+81', flag: '🇯🇵', name: 'Japan' },
		{ code: '+86', flag: '🇨🇳', name: 'China' },
		{ code: '+91', flag: '🇮🇳', name: 'India' },
		{ code: '+55', flag: '🇧🇷', name: 'Brazil' },
		{ code: '+52', flag: '🇲🇽', name: 'Mexico' },
		{ code: '+61', flag: '🇦🇺', name: 'Australia' },
		{ code: '+82', flag: '🇰🇷', name: 'South Korea' },
		{ code: '+31', flag: '🇳🇱', name: 'Netherlands' }
	]);

	let foundUsOptions = $state(['Google search', 'Word of mouth', 'Ad', 'Other']);
	let helpWithOptions = $state(['Website', 'Custom Software', 'Other']);

	function loadHcaptcha() {
		if (typeof window === 'undefined') return;

		if (!window._hcaptchaLoader) {
			window._hcaptchaLoader = new Promise((resolve) => {
				window._hcaptchaOnLoad = () => resolve(window.hcaptcha);
				const script = document.createElement('script');
				script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=_hcaptchaOnLoad';
				script.async = true;
				document.head.append(script);
			});
		}

		window._hcaptchaLoader.then((hcaptcha) => {
			if (hcaptchaWidgetId === null && hcaptchaContainer) {
				hcaptchaWidgetId = hcaptcha.render(hcaptchaContainer, { sitekey: HCAPTCHA_SITEKEY });
			}
		});
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		utmSource = params.get('utm_source') || '';

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					observer.disconnect();
					loadHcaptcha();
				}
			},
			{ rootMargin: '300px', threshold: 0 }
		);

		if (formElement) observer.observe(formElement);
		formElement?.addEventListener('focusin', loadHcaptcha, { once: true });

		return () => {
			observer.disconnect();
		};
	});

	function selectCountry(country) {
		selectedCountry = country;
		showCountryDropdown = false;
	}

	function validateForm() {
		if (!fullName.trim()) return 'Please enter your name.';
		if (!foundUsVia) return 'Please select how you found us.';
		if (!helpWith) return 'Please select what you need help with.';
		if (!email.trim()) return 'Please enter your email.';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return 'Please enter a valid email address.';
		if (!projectDetails.trim()) return 'Please provide project details.';
		return '';
	}

	async function handleSubmit(event) {
		event.preventDefault();
		errorMessage = '';
		const validation = validateForm();
		if (validation) {
			errorMessage = validation;
			return;
		}

		const hcaptchaResponse =
			hcaptchaWidgetId === null ? '' : window.hcaptcha?.getResponse(hcaptchaWidgetId) || '';
		if (!hcaptchaResponse) {
			errorMessage = 'Please complete the CAPTCHA.';
			return;
		}

		isSubmitting = true;
		const data = new FormData(formElement);
		data.set('h-captcha-response', hcaptchaResponse);

		try {
			const response = await fetch(CONTACT_FORM_URL, {
				method: 'POST',
				body: new URLSearchParams(data)
			});
			const body = await response.json().catch(() => ({}));

			if (!response.ok) {
				errorMessage =
					body?.details?.map((detail) => detail.message).join(' ') ||
					body?.error ||
					'Something went wrong. Please try again.';
				isSubmitting = false;
				window.hcaptcha?.reset(hcaptchaWidgetId);
				return;
			}

			window.location.assign(
				`https://www.corelabs.digital/f/${CONTACT_FORM_SLUG}/success?sid=${body.submission_id}`
			);
		} catch {
			errorMessage = 'Something went wrong. Please try again.';
			isSubmitting = false;
			window.hcaptcha?.reset(hcaptchaWidgetId);
		}
	}

	function handleClickOutside() {
		if (showCountryDropdown) {
			showCountryDropdown = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<svelte:head>
	<title>Core Labs - Custom Software Solutions</title>
	<meta
		name="description"
		content="Replace expensive SaaS subscriptions with custom software built specifically for your business. Reduce costs by 70% with unified solutions."
	/>
	<link rel="canonical" href="https://www.corelabs.digital/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Core Labs" />
	<meta property="og:title" content="Core Labs - Custom Software Solutions" />
	<meta property="og:description" content="Replace expensive SaaS subscriptions with custom software built specifically for your business. Reduce costs by 70% with unified solutions." />
	<meta property="og:url" content="https://www.corelabs.digital/" />
	<meta property="og:image" content="https://www.corelabs.digital/logos/core-labs-full-logo.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Core Labs - Custom Software Solutions" />
	<meta name="twitter:description" content="Replace expensive SaaS subscriptions with custom software built specifically for your business. Reduce costs by 70% with unified solutions." />
	<meta name="twitter:image" content="https://www.corelabs.digital/logos/core-labs-full-logo.png" />
</svelte:head>

{#snippet eyebrow(text, centered = false)}
	<p
		class="flex gap-6 font-mono text-xs tracking-widest text-white/50 uppercase {centered
			? 'justify-center'
			: ''}"
	>
		<span aria-hidden="true">/</span><span use:scramble>{text}</span>
	</p>
{/snippet}

{#snippet arrowIcon(size = 'h-4 w-4')}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class={size}
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
	</svg>
{/snippet}

{#snippet checkIcon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-4 w-4 shrink-0 text-lilac"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
	</svg>
{/snippet}

<!-- Hero: an inset rounded panel, headline anchored bottom-left, real work on the right -->
<section class="px-2 pt-2 sm:px-3 sm:pt-3">
	<div class="hero-gradient sd-recede relative isolate overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
		<div
			class="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]"
			aria-hidden="true"
		></div>

		<div class="container mx-auto px-5 pt-28 pb-12 sm:px-8 sm:pt-40 sm:pb-16 lg:px-12 lg:pt-44 lg:pb-20">
			<div class="grid items-end gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
				<div class="sd-lift">
					<p class="flex items-center gap-3 font-mono text-xs tracking-widest text-white/60 uppercase">
						<span class="h-2 w-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-violet"></span>
						Custom software &amp; websites
					</p>
					<h1
						class="font-heading mt-6 text-[2.6rem] leading-[1.04] font-medium tracking-tight text-balance text-white sm:text-6xl lg:text-7xl"
					>
						We create stunning software and websites for leading <span class="text-gradient-purple"
							>brands</span
						>
					</h1>
					<p class="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/70 sm:text-xl">
						With the team and platform to take your project from idea to launch.
					</p>

					<div class="mt-10 flex flex-wrap items-center gap-3">
						<a
							href="/#intake-form"
							class="btn-gradient btn-animate group inline-flex items-center gap-4 rounded-full py-2 pr-2 pl-6 font-mono text-sm tracking-wider text-white uppercase shadow-lg"
						>
							Get started
							<span
								class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-violet transition-transform group-hover:translate-x-0.5"
							>
								{@render arrowIcon()}
							</span>
						</a>
						<a
							href="/contact"
							class="inline-flex min-h-14 items-center rounded-full border border-white/20 px-6 font-mono text-sm tracking-wider text-white uppercase transition-colors hover:bg-white/10"
						>
							Contact us
						</a>
					</div>
				</div>

				<!-- Two real builds, stacked like windows -->
				<div class="hero-window-in relative mx-auto w-full max-w-xl pb-6 lg:max-w-none">
					<div
						class="absolute top-0 right-0 w-[72%] rotate-3 overflow-hidden rounded-2xl border border-white/10 opacity-60 shadow-2xl"
					>
						<img
							src="/portfolio/neversettle.jpg"
							alt=""
							width="1200"
							height="750"
							decoding="async"
							class="aspect-[16/10] w-full object-cover object-top"
						/>
					</div>

					<div
						class="relative mt-12 w-[90%] rounded-[1.5rem] border border-white/15 bg-surface p-2 shadow-[0_30px_80px_-20px_rgba(116,51,255,0.55)] sm:mt-16"
					>
						<div class="flex items-center gap-1.5 px-3 pt-1.5 pb-2.5" aria-hidden="true">
							<span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
							<span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
							<span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
							<span
								class="ml-3 truncate rounded-full bg-white/5 px-3 py-0.5 font-mono text-[10px] tracking-wider text-white/40"
								>purposeinexpenses.com</span
							>
						</div>
						<img
							src="/portfolio/purposeinexpenses.webp"
							alt="Purpose In Expenses homepage, built by Core Labs"
							width="1200"
							height="750"
							fetchpriority="high"
							class="aspect-[16/10] w-full rounded-[1.1rem] object-cover object-top"
						/>
					</div>

					<div
						class="hero-chip-in absolute right-0 bottom-0 rounded-2xl border border-white/10 bg-surface-raised/95 px-5 py-4 shadow-xl backdrop-blur"
					>
						<p class="font-heading text-3xl font-medium text-white tabular-nums" use:countUp>40%</p>
						<span
							class="mt-1 inline-flex rounded-md bg-lilac/15 px-2 py-0.5 font-mono text-[10px] tracking-wider text-lilac uppercase"
							>Lower cost vs. SaaS</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Client wall -->
<section aria-labelledby="clients-heading" class="py-20 sm:py-28">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid gap-6 lg:grid-cols-[1fr_2fr]">
			{@render eyebrow('Who we build for')}
			<h2
				use:splitWords
				id="clients-heading"
				class="font-heading text-3xl leading-[1.1] font-medium tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				The businesses outgrowing off-the-shelf software build with <span
					class="text-gradient-purple">Core Labs</span
				>
			</h2>
		</div>

		<ul
			class="mt-14 grid grid-cols-2 border-t border-l border-white/10 sm:grid-cols-4"
			use:scrollReveal={{ stagger: true, staggerDelay: 70 }}
		>
			{#each recentBuilds as build}
				<li class="border-r border-b border-white/10">
					<a
						href={build.url}
						target="_blank"
						rel="noopener"
						class="flex h-24 items-center justify-center px-3 text-center font-heading text-sm font-semibold text-balance text-white/55 transition-colors hover:bg-white/[0.03] hover:text-white sm:h-28 sm:text-base"
					>
						{build.client}<span class="sr-only"> (opens in a new tab)</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Free Website Redesign: one centred statement over a framed before/after tile -->
<section
	id="free-website-redesign"
	aria-labelledby="free-website-redesign-heading"
	class="scroll-mt-24 pb-20 sm:pb-28"
>
	<div class="container mx-auto px-4 text-center sm:px-6 lg:px-8">
		<div>
			{@render eyebrow('Free design preview', true)}
			<h2
				use:splitWords
				id="free-website-redesign-heading"
				class="font-heading mx-auto mt-6 max-w-4xl text-3xl leading-[1.1] font-medium tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
			>
				<span class="text-gradient-purple">Free Website Redesign.</span> See what your site could look
				like, tailored to your business.
			</h2>
			<p class="mx-auto mt-6 max-w-xl text-lg text-pretty text-white/60" use:scrollReveal={{ delay: 250 }}>
				A free custom design preview. No commitment, no credit card required.
			</p>
		</div>

		<div
			class="sd-rise relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-surface px-6 pt-10 pb-14 sm:px-14 sm:pt-14"
		>
			<div
				class="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-violet/25 blur-3xl"
				aria-hidden="true"
			></div>

			<!-- Before → after mockup. Decorative: the copy around it carries the offer. -->
			<div class="relative mx-auto w-full max-w-md text-left" aria-hidden="true">
				<div
					class="sd-fall-back absolute top-0 left-0 w-[70%] -rotate-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 opacity-60"
				>
					<div class="flex items-center gap-1.5">
						<span class="h-2 w-2 rounded-full bg-white/20"></span>
						<span class="h-2 w-2 rounded-full bg-white/20"></span>
						<span class="h-2 w-2 rounded-full bg-white/20"></span>
						<span class="ml-2 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">Today</span>
					</div>
					<div class="mt-4 space-y-2">
						<div class="h-2.5 w-2/3 rounded bg-white/15"></div>
						<div class="h-2 w-full rounded bg-white/10"></div>
						<div class="h-2 w-5/6 rounded bg-white/10"></div>
						<div class="mt-3 h-14 rounded bg-white/5"></div>
					</div>
				</div>

				<div
					class="relative mt-16 ml-auto w-[85%] rounded-2xl border border-white/15 bg-background shadow-2xl shadow-brand-violet/20"
				>
					<div class="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
						<span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-white/20"></span>
						<span class="ml-3 h-4 flex-1 rounded-full bg-white/5"></span>
					</div>
					<div class="p-5 sm:p-6">
						<div class="rounded-xl bg-gradient-to-br from-brand-blue/40 to-brand-violet/40 p-5">
							<div class="h-3 w-3/4 rounded bg-white/90"></div>
							<div class="mt-2 h-3 w-1/2 rounded bg-white/90"></div>
							<div class="mt-4 h-2 w-5/6 rounded bg-white/40"></div>
							<div class="btn-gradient mt-5 h-6 w-24 rounded-full"></div>
						</div>
						<div class="mt-4 grid grid-cols-3 gap-3">
							<div class="h-14 rounded-lg border border-white/10 bg-white/5"></div>
							<div class="h-14 rounded-lg border border-white/10 bg-white/5"></div>
							<div class="h-14 rounded-lg border border-white/10 bg-white/5"></div>
						</div>
					</div>

					<div
						class="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-full border border-white/15 bg-surface-raised px-4 py-2 font-mono text-[11px] tracking-wider text-white uppercase shadow-lg sm:-left-8"
					>
						<span class="h-2 w-2 rounded-full bg-lilac"></span>
						Preview in 5 business days
					</div>
				</div>
			</div>
		</div>

		<ul
			class="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2"
			use:scrollReveal={{ stagger: true, staggerDelay: 90 }}
		>
			{#each redesignPerks as perk}
				<li
					class="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-left text-sm text-white/85"
				>
					{@render checkIcon()}
					{perk}
				</li>
			{/each}
		</ul>

		<div class="mt-10 flex flex-col items-center gap-3">
			<a
				href="/website-redesign"
				class="btn-gradient btn-animate group inline-flex items-center gap-4 rounded-full py-2 pr-2 pl-6 font-mono text-sm tracking-wider text-white uppercase shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
			>
				Get my free design preview
				<span
					class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-violet transition-transform group-hover:translate-x-0.5"
				>
					{@render arrowIcon()}
				</span>
			</a>
			<p class="text-sm text-white/50">Takes less than a minute to request</p>
		</div>
	</div>
</section>

<!-- Why custom: numbered tabs over a single panel -->
<section id="features" class="scroll-mt-24 px-2 sm:px-3">
	<div class="sd-rise rounded-[2rem] bg-surface py-20 sm:rounded-[2.5rem] sm:py-28">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid gap-6 lg:grid-cols-[1fr_2fr]">
				{@render eyebrow('Why custom')}
				<div>
					<h2
				use:splitWords
						class="font-heading text-3xl leading-[1.1] font-medium tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
					>
						Software that adapts to your business, <span class="text-white/40"
							>not the other way around.</span
						>
					</h2>
					<p class="mt-5 max-w-2xl text-lg text-pretty text-white/60" use:scrollReveal={{ delay: 250 }}>
						Traditional SaaS forces you to adapt your business to their software. We build software
						that adapts to your business.
					</p>
				</div>
			</div>

			<div
				role="tablist"
				aria-label="Why businesses choose custom over SaaS"
				class="mt-14 grid grid-cols-2 gap-2 lg:grid-cols-4"
			>
				{#each features as feature, i}
					<button
						type="button"
						role="tab"
						id="feature-tab-{i}"
						aria-selected={activeFeature === i}
						aria-controls="feature-panel"
						tabindex={activeFeature === i ? 0 : -1}
						onclick={() => (activeFeature = i)}
						onkeydown={(e) => {
							if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
							e.preventDefault();
							activeFeature =
								(activeFeature + (e.key === 'ArrowRight' ? 1 : -1) + features.length) %
								features.length;
							document.getElementById(`feature-tab-${activeFeature}`)?.focus();
						}}
						class="flex min-h-14 items-center gap-3 rounded-[1.25rem] border p-1.5 pr-4 text-left text-sm font-medium transition-colors sm:rounded-full sm:text-base {activeFeature ===
						i
							? 'btn-gradient border-transparent text-white'
							: 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white'}"
					>
						<span
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs {activeFeature ===
							i
								? 'bg-white text-brand-violet'
								: 'bg-background text-white/80 ring-1 ring-white/10'}">0{i + 1}</span
						>
						{feature.title}
					</button>
				{/each}
			</div>

			{#each [features[activeFeature]] as feature (activeFeature)}
				<div
					id="feature-panel"
					role="tabpanel"
					aria-labelledby="feature-tab-{activeFeature}"
					class="mt-4 grid gap-10 rounded-[1.75rem] border border-white/10 bg-background/60 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-12"
				>
					<div
						class="flex flex-col"
						in:fly={{ y: 24, duration: prefersReducedMotion.current ? 0 : 600, opacity: 0 }}
					>
						<h3 class="font-heading flex items-center gap-3 text-2xl font-medium text-white sm:text-3xl">
							<span class="h-2.5 w-2.5 shrink-0 rounded-full bg-lilac" aria-hidden="true"></span>
							{feature.title}
						</h3>
						<p class="mt-5 max-w-md text-lg leading-relaxed text-pretty text-white/70">
							{feature.description}
						</p>
						<ul class="mt-6 space-y-2.5 font-mono text-xs tracking-wider text-white/50 uppercase">
							{#each feature.points as point}
								<li class="flex gap-3"><span class="text-lilac" aria-hidden="true">+</span>{point}</li>
							{/each}
						</ul>
						<div class="mt-10 lg:mt-auto lg:pt-12">
							<p
								class="font-heading text-6xl font-medium tracking-tight text-white tabular-nums sm:text-7xl"
								use:countUp
							>
								{feature.stat}
							</p>
							<span
								class="mt-3 inline-flex rounded-md bg-lilac/15 px-2.5 py-1 font-mono text-xs tracking-wider text-lilac uppercase"
								>{feature.statLabel}</span
							>
						</div>
					</div>

					<div class="sd-drift self-center">
						<figure
							in:fly={{ y: 40, duration: prefersReducedMotion.current ? 0 : 750, delay: 80, opacity: 0 }}
							class="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-brand-blue/40 to-brand-violet/40 p-3 sm:p-5"
						>
							<img
								src="/portfolio/{feature.image}"
								alt="{feature.client} {feature.caption.toLowerCase()}"
								width="1200"
								height="750"
								loading="lazy"
								decoding="async"
								class="aspect-[16/10] w-full rounded-[1rem] border border-white/10 object-cover object-top shadow-2xl"
							/>
							<figcaption
								class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 font-mono text-[11px] tracking-wider text-white/70 uppercase"
							>
								<span class="rounded-md bg-background/80 px-2 py-0.5 text-white">{feature.client}</span>
								{feature.caption}
							</figcaption>
						</figure>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>


<!-- What we've built recently -->
<section id="recent-work" class="scroll-mt-24 py-20 sm:py-28">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-wrap items-end justify-between gap-6">
			<div class="max-w-2xl">
				{@render eyebrow('Recent work')}
				<h2
				use:splitWords
					class="font-heading mt-6 text-3xl leading-[1.1] font-medium tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
				>
					What we've built <span class="text-gradient-purple">recently</span>
				</h2>
			</div>

			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => scrollRail(-1)}
					aria-label="Show previous projects"
					class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white hover:text-background"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5M11 18l-6-6 6-6" />
					</svg>
				</button>
				<button
					type="button"
					onclick={() => scrollRail(1)}
					aria-label="Show next projects"
					class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white hover:text-background"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Native scroll-snap rail: drags, swipes, and arrow-keys without hijacking the page scroll. -->
	<div class="container mx-auto mt-14 px-4 sm:px-6 lg:px-8">
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- A scrollable region has to be focusable, or keyboard users cannot scroll it. -->
		<div
			bind:this={railElement}
			use:scrollReveal={{ stagger: true, staggerDelay: 90 }}
				class="rail-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
			tabindex="0"
			role="region"
			aria-label="Recent projects, scrollable"
		>
			{#each recentBuilds as build}
				<article data-rail-card class="w-[19rem] shrink-0 snap-start sm:w-[23rem]">
					<a
						href={build.url}
						target="_blank"
						rel="noopener"
						class="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
					>
						<div
							class="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface p-2"
						>
							<img
								src="/portfolio/{build.image}"
								alt="{build.client} homepage"
								width="1200"
								height="750"
								loading="lazy"
								decoding="async"
								class="aspect-[16/10] w-full rounded-[1.1rem] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
							/>
						</div>

						<div class="mt-5">
							<span
								class="inline-flex rounded-md bg-lilac/15 px-2 py-0.5 font-mono text-[11px] tracking-wider text-lilac uppercase"
							>
								{build.tag}
							</span>
							<h3 class="font-heading mt-3 text-xl font-medium text-balance text-white">
								{build.title}
							</h3>
							<p class="mt-1 text-sm text-white/50">{build.client}</p>
							<p class="mt-3 text-sm leading-relaxed text-pretty text-white/60">
								{build.description}
							</p>
							<span
								class="relative mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-white"
							>
								Visit site
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-3.5 w-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
								</svg>
								<span class="sr-only">(opens in a new tab)</span>
							</span>
						</div>
					</a>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- Outcomes bento, with the plan — COMMENTED OUT for now (2026-11-03).
To restore: remove this comment wrapper, and re-enable the "Pricing" links in
Navbar.svelte and Footer.svelte.
<section id="pricing" class="scroll-mt-24 py-20 sm:py-28">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid gap-6 lg:grid-cols-[1fr_2fr]">
			{@render eyebrow('Outcomes')}
			<div>
				<h2
					class="font-heading text-3xl leading-[1.1] font-medium tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
				>
					An investment that <span class="text-gradient-purple">pays for itself</span>
				</h2>
				<p class="mt-5 max-w-2xl text-lg text-pretty text-white/60" use:scrollReveal={{ delay: 250 }}>
					Compare one Core Labs subscription to everything you pay SaaS vendors today.
				</p>
			</div>
		</div>

		<div class="mt-14 grid gap-4 lg:grid-cols-3" use:scrollReveal={{ delay: 100 }}>
			<div
				class="relative flex min-h-[22rem] flex-col items-center justify-center gap-4 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-blue to-brand-violet p-8 lg:row-span-2"
			>
				<p class="absolute top-6 left-7 font-mono text-xs tracking-widest text-white/70 uppercase">
					/ Typical results
				</p>
				<div class="glass-pill rounded-full px-10 py-5 text-center text-white">
					<p class="font-heading text-4xl font-medium tabular-nums sm:text-5xl">{stats[0].value}</p>
					<p class="mt-1 text-lg">{stats[0].label}</p>
				</div>
				<div class="glass-pill scale-90 rounded-full px-10 py-5 text-center text-white/80">
					<p class="font-heading text-4xl font-medium tabular-nums sm:text-5xl">{stats[1].value}</p>
					<p class="mt-1 text-lg">{stats[1].label}</p>
				</div>
			</div>

			{#each plans as plan}
				<div class="rounded-[1.75rem] border border-white/10 bg-surface p-7 sm:p-10 lg:col-span-2">
					<div class="flex flex-wrap items-start justify-between gap-6">
						<div class="max-w-sm">
							{#if plan.popular}
								<span
									class="inline-flex rounded-md bg-lilac/15 px-2.5 py-1 font-mono text-xs tracking-wider text-lilac uppercase"
									>Most popular</span
								>
							{/if}
							<h3 class="font-heading mt-4 text-2xl font-medium text-white sm:text-3xl">{plan.name}</h3>
							<p class="mt-2 text-white/60">{plan.description}</p>
						</div>
						<p class="font-heading text-4xl font-medium tracking-tight text-white sm:text-5xl">
							{plan.price}
						</p>
					</div>

					<ul class="mt-8 grid gap-x-8 gap-y-3 border-t border-white/10 pt-8 sm:grid-cols-2">
						{#each plan.features as feature}
							<li class="flex items-center gap-3 text-white/85">
								{@render checkIcon()}
								{feature}
							</li>
						{/each}
					</ul>

					<a
						href="/#intake-form"
						class="btn-gradient btn-animate group mt-10 inline-flex items-center gap-4 rounded-full py-2 pr-2 pl-6 font-mono text-sm tracking-wider text-white uppercase shadow-lg"
					>
						{plan.cta}
						<span
							class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-violet transition-transform group-hover:translate-x-0.5"
						>
							{@render arrowIcon()}
						</span>
					</a>
				</div>
			{/each}

			{#each [stats[2], stats[3]] as stat, i}
				<div class="flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-surface p-7 sm:p-8">
					<p class="font-heading text-5xl font-medium tracking-tight text-white tabular-nums">
						{stat.value}
					</p>
					<div class="mt-8">
						<span
							class="inline-flex rounded-md bg-white/10 px-2.5 py-1 font-mono text-xs tracking-wider text-white/80 uppercase"
							>{stat.label}</span
						>
						<p class="mt-3 text-white/60">
							{i === 0
								? 'Priority support for every platform we ship, whenever your team needs it.'
								: 'Built to grow with you, from your first user to your thousandth.'}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
-->

<!-- Closing CTA + intake form in one dark panel -->
<section id="intake-form" class="scroll-mt-20 px-2 pb-2 sm:px-3 sm:pb-3">
	<div class="dot-field sd-rise rounded-[2rem] border border-white/10 py-20 sm:rounded-[2.5rem] sm:py-28">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid gap-6 lg:grid-cols-[1fr_2fr]">
				{@render eyebrow('Start a project')}
				<div>
					<h2
				use:splitWords
						class="font-heading text-3xl leading-[1.1] font-medium tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
					>
						Ready to bring your vision to <span class="text-gradient-purple">life?</span>
					</h2>
					<p class="mt-5 max-w-2xl text-lg text-pretty text-white/60" use:scrollReveal={{ delay: 250 }}>
						Let's build something extraordinary together. From concept to launch, we're here to make
						it happen.
					</p>
					<p class="mt-6 font-mono text-xs tracking-widest text-white/50 uppercase" use:scrollReveal={{ delay: 250 }}>
						Free consultation · No commitment · Response within 24 hours
					</p>
				</div>
			</div>

			<div class="mx-auto mt-14 max-w-5xl" use:scrollReveal={{ delay: 100 }}>
			<form
				bind:this={formElement}
				class="intake-form-shadow rounded-[1.75rem] bg-white p-6 sm:p-12"
				method="POST"
				onsubmit={handleSubmit}
			>
				<input
					type="text"
					name="website"
					aria-hidden="true"
					aria-label="Leave this field empty"
					class="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
					tabindex="-1"
					autocomplete="off"
				/>

				<input type="hidden" name="utm_source" value={utmSource} />

					{#if errorMessage}
						<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
							{errorMessage}
						</div>
					{/if}

					<div
						class="mb-8 flex flex-wrap items-center gap-2 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span class="shrink-0">Hi! My name is</span>
						<div class="relative inline-flex min-w-44 flex-1 items-center">
							<label for="intake-name" class="sr-only">Full name</label>
							<input
								id="intake-name"
								type="text"
								name="name"
								bind:value={fullName}
								placeholder="Type your full name"
								required
								class="inline-input w-full border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400"
							/>
							<span class="ml-1 shrink-0 text-lg">👋</span>
						</div>
						<span class="shrink-0">and I work at</span>
						<label for="intake-company" class="sr-only">Company name</label>
						<input
							id="intake-company"
							type="text"
							name="company"
							bind:value={companyName}
							placeholder="Type a company name"
							class="inline-input min-w-44 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400"
						/>
					</div>

					<div
						class="mb-8 flex flex-wrap items-center gap-3 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span>I found Core Labs using</span>
						<div class="flex flex-wrap gap-2">
							{#each foundUsOptions as option}
								<button
									type="button"
									class="pill-button rounded-full border-2 px-4 py-2 text-base font-medium transition-all {foundUsVia ===
									option
										? 'border-brand-violet bg-brand-violet/10 text-brand-violet'
										: 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}"
									onclick={() => (foundUsVia = option)}
								>
									{option}
								</button>
							{/each}
						</div>
						<input type="hidden" name="how_did_you_find_us" value={foundUsVia} />
					</div>

					<div
						class="mb-8 flex flex-wrap items-center gap-3 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span>I'm looking for help with:</span>
						<div class="flex flex-wrap gap-2">
							{#each helpWithOptions as option}
								<button
									type="button"
									class="pill-button rounded-full border-2 px-4 py-2 text-base font-medium transition-all {helpWith ===
									option
										? 'border-brand-violet bg-brand-violet/10 text-brand-violet'
										: 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}"
									onclick={() => (helpWith = option)}
								>
									{option}
								</button>
							{/each}
						</div>
						<input type="hidden" name="what_do_you_need_help_with" value={helpWith} />
					</div>

					<div
						class="mb-8 flex flex-wrap items-center gap-2 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span>Feel free to email me at</span>
						<label for="intake-email" class="sr-only">Email address</label>
						<input
							id="intake-email"
							type="email"
							name="email"
							bind:value={email}
							placeholder="Type your contact email"
							required
							class="inline-input w-52 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400 sm:w-60"
						/>
						<span>Or call me at</span>
						<div class="relative inline-flex items-center gap-1">
							<button
								type="button"
								class="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-base hover:bg-gray-50"
								onclick={(e) => {
									e.stopPropagation();
									showCountryDropdown = !showCountryDropdown;
								}}
							>
								<span class="text-lg">{selectedCountry.flag}</span>
								<svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							{#if showCountryDropdown}
								<div
									class="absolute top-full left-0 z-50 mt-1 max-h-48 w-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
									role="listbox"
									tabindex="-1"
									onclick={(e) => e.stopPropagation()}
									onkeydown={(e) => e.stopPropagation()}
								>
									{#each countries as country}
										<button
											type="button"
											class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100"
											onclick={() => selectCountry(country)}
										>
											<span>{country.flag}</span>
											<span class="text-gray-700">{country.name}</span>
											<span class="ml-auto text-gray-500">{country.code}</span>
										</button>
									{/each}
								</div>
							{/if}
						</div>
						<label for="intake-phone" class="sr-only">Phone number</label>
						<input
							id="intake-phone"
							type="tel"
							bind:value={phone}
							placeholder={selectedCountry.code}
							class="inline-input w-28 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400"
						/>
						<input type="hidden" name="phone" value="{selectedCountry.code} {phone}" />
					</div>

					<div
						class="mb-8 flex flex-wrap items-start gap-2 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span class="mt-2">Here is more information about the project:</span>
						<label for="intake-message" class="sr-only">Project details</label>
						<input
							id="intake-message"
							type="text"
							name="message"
							bind:value={projectDetails}
							placeholder="Type your project details"
							required
							class="inline-input min-w-64 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-gray-600 placeholder:text-gray-400"
						/>
					</div>

					<div
						class="flex flex-wrap items-center justify-center gap-6 border-t border-gray-200 pt-6"
					>
						<div bind:this={hcaptchaContainer} class="min-h-[78px]"></div>

						<button
							type="submit"
							disabled={isSubmitting}
							class="btn-gradient btn-animate group inline-flex items-center gap-4 rounded-full py-2 pr-2 pl-6 font-mono text-sm tracking-wider text-white uppercase shadow-lg disabled:cursor-not-allowed disabled:opacity-60 {isSubmitting ? 'btn-loading' : ''}"
							>
								<span class={isSubmitting ? 'opacity-0' : ''}>Send</span>
								<span
									class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-violet {isSubmitting ? 'opacity-0' : ''}"
								>
									{@render arrowIcon()}
								</span>
							</button>
					</div>
			</form>
			</div>
		</div>
	</div>
</section>

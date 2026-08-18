<script>
	import { onMount } from 'svelte';
	import { scrollReveal, pageLoad } from '$lib/actions/scrollReveal.js';

	// ===== Features Data =====
	let features = $state([
		{
			title: 'Unified Platform',
			description:
				'Replace multiple SaaS subscriptions with one comprehensive custom solution that handles all your business needs under one roof.',
			icon: '🏗️'
		},
		{
			title: '100% Custom Built',
			description:
				'Every feature is built specifically for your business processes. No more settling for 60% functionality from off-the-shelf solutions.',
			icon: '⚡'
		},
		{
			title: 'Massive Cost Savings',
			description:
				'Eliminate expensive monthly subscriptions. Our custom solutions typically cost 40% less than multiple vendor subscriptions.',
			icon: '💰'
		},
		{
			title: 'Evolves With You',
			description:
				'Unlike static SaaS products, your custom platform grows and adapts as your business needs change over time.',
			icon: '🚀'
		}
	]);

	// ===== Stats Data =====
	let stats = $state([
		{ value: '40%', label: 'Cost Savings' },
		{ value: '100%', label: 'Custom Fit' },
		{ value: '24/7', label: 'Support' },
		{ value: '∞', label: 'Scalability' }
	]);

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
	let showSuccess = $state(false);
	let errorMessage = $state('');
	let hcaptchaWidgetId = $state(null);
	let hcaptchaContainer = $state(null);
	let hcaptchaLoaded = $state(false);
	let sectionElement = $state(null);

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

	function loadHcaptchaScript() {
		if (hcaptchaLoaded || typeof window === 'undefined') return;
		if (window.hcaptcha) {
			hcaptchaLoaded = true;
			return;
		}
		const script = document.createElement('script');
		script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);
		hcaptchaLoaded = true;
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		utmSource = params.get('utm_source') || '';

		let checkInterval;

		const renderCaptcha = () => {
			if (
				hcaptchaContainer &&
				typeof window !== 'undefined' &&
				typeof window.hcaptcha !== 'undefined'
			) {
				if (hcaptchaWidgetId !== null) return true;
				if (hcaptchaContainer.querySelector('iframe')) return true;
				try {
					hcaptchaWidgetId = window.hcaptcha.render(hcaptchaContainer, {
						sitekey: '9f64291e-4d3a-4ae8-b4ee-5692268481b2'
					});
					return true;
				} catch (e) {
					console.warn('hCaptcha render failed, will retry:', e);
					return false;
				}
			}
			return false;
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						loadHcaptchaScript();
						observer.disconnect();
						checkInterval = setInterval(() => {
							if (renderCaptcha()) {
								clearInterval(checkInterval);
							}
						}, 100);
					}
				});
			},
			{ rootMargin: '200px', threshold: 0 }
		);

		if (sectionElement) {
			observer.observe(sectionElement);
		}

		return () => {
			observer.disconnect();
			if (checkInterval) clearInterval(checkInterval);
		};
	});

	function selectCountry(country) {
		selectedCountry = country;
		showCountryDropdown = false;
	}

	function validateForm() {
		if (!fullName.trim()) return 'Please enter your name.';
		if (!companyName.trim()) return 'Please enter your company name.';
		if (!foundUsVia) return 'Please select how you found us.';
		if (!helpWith) return 'Please select what you need help with.';
		if (!email.trim()) return 'Please enter your email.';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return 'Please enter a valid email address.';
		if (!projectDetails.trim()) return 'Please provide project details.';
		const hcaptchaResponse = formElement?.querySelector('[name="h-captcha-response"]')?.value;
		if (!hcaptchaResponse) return 'Please complete the CAPTCHA.';
		return '';
	}

	function handleSubmit(event) {
		errorMessage = '';
		const validation = validateForm();
		if (validation) {
			event.preventDefault();
			errorMessage = validation;
			if (
				typeof window !== 'undefined' &&
				typeof window.hcaptcha !== 'undefined' &&
				hcaptchaWidgetId !== null
			) {
				window.hcaptcha.reset(hcaptchaWidgetId);
			}
			return;
		}
		isSubmitting = true;
	}

	function handleClickOutside(event) {
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
	<meta
		property="og:description"
		content="Replace expensive SaaS subscriptions with custom software built specifically for your business. Reduce costs by 70% with unified solutions."
	/>
	<meta property="og:url" content="https://www.corelabs.digital/" />
	<meta property="og:image" content="https://www.corelabs.digital/logos/core-labs-full-logo.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Core Labs - Custom Software Solutions" />
	<meta
		name="twitter:description"
		content="Replace expensive SaaS subscriptions with custom software built specifically for your business. Reduce costs by 70% with unified solutions."
	/>
	<meta name="twitter:image" content="https://www.corelabs.digital/logos/core-labs-full-logo.png" />
</svelte:head>

<!-- section:hero {"type":"hero","id":"hero-1"} -->
<section
	class="hero-gradient relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-36 lg:pt-48 lg:pb-44"
>
	<div
		class="bg-brand-purple/20 absolute top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl sm:h-96 sm:w-96"
		aria-hidden="true"
	></div>
	<div
		class="bg-brand-blue/20 absolute right-0 bottom-12 h-56 w-56 rounded-full blur-3xl sm:h-80 sm:w-80"
		aria-hidden="true"
	></div>
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-5xl text-center">
			<div class="mb-7" use:pageLoad={{ delay: 0 }}>
				<span
					class="border-brand-violet/30 text-brand-violet shadow-brand-purple/25 inline-flex items-center rounded-full border bg-white/10 px-5 py-2 text-sm font-semibold tracking-wide shadow-lg backdrop-blur-sm sm:text-base"
					>The future of business software</span
				>
			</div>

			<h1
				class="font-heading text-foreground text-5xl leading-[0.95] font-bold tracking-[-0.06em] text-balance sm:text-7xl lg:text-8xl"
				use:pageLoad={{ delay: 100 }}
			>
				We create stunning software and websites for leading <span class="text-brand-violet"
					>brands</span
				>
			</h1>

			<p
				class="mx-auto mt-7 max-w-2xl text-lg leading-8 text-pretty text-white/70 sm:text-2xl sm:leading-9"
				use:pageLoad={{ delay: 200 }}
			>
				With the team and platform to take your project from idea to launch
			</p>

			<div
				class="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
				use:pageLoad={{ delay: 300 }}
			>
				<a
					href="/#intake-form"
					class="btn-gradient btn-animate group shadow-brand-purple/25 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full py-3.5 pr-3.5 pl-7 text-lg font-semibold text-white shadow-lg sm:w-auto sm:text-xl"
				>
					Get Started
					<span
						class="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
						</svg>
					</span>
				</a>
				<a
					href="/contact"
					class="btn-secondary-animate group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-white/25 bg-white/5 py-3.5 pr-3.5 pl-7 text-lg font-semibold text-white shadow-sm backdrop-blur-sm hover:bg-white/10 sm:w-auto sm:text-xl"
				>
					Contact Us
					<span
						class="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white/10"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
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

			<div
				class="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-sm md:grid-cols-4"
				use:pageLoad={{ delay: 400, stagger: true, staggerDelay: 100 }}
			>
				{#each stats as stat}
					<div class="bg-brand-night/55 px-5 py-6 text-center sm:py-7">
						<div class="text-foreground text-3xl font-bold tabular-nums sm:text-4xl">
							{stat.value}
						</div>
						<div class="mt-1 text-sm font-medium tracking-wide text-white/60 sm:text-base">
							{stat.label}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
<!-- /section:hero -->

<!-- section:features {"type":"features","id":"features-1"} -->
<section id="features" class="features-gradient relative py-24 sm:py-32 lg:py-40">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid items-end gap-8 lg:grid-cols-[0.95fr_1.05fr]" use:scrollReveal>
			<h2
				class="font-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				Why businesses choose custom over SaaS
			</h2>
			<p class="max-w-2xl text-lg leading-8 text-pretty text-white/70 lg:justify-self-end">
				Traditional SaaS forces you to adapt your business to their software. We build software that
				adapts to your business.
			</p>
		</div>

		<div class="mx-auto mt-14 max-w-7xl sm:mt-20">
			<div
				class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6"
				use:scrollReveal={{ stagger: true, staggerDelay: 100 }}
			>
				{#each features as feature}
					<div
						class="glass-card card-animate group hover:border-brand-violet/40 relative overflow-hidden rounded-3xl border border-white/10 p-7 backdrop-blur-sm hover:bg-white/10 sm:p-8 lg:p-9"
					>
						<div
							class="via-brand-violet/50 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
							aria-hidden="true"
						></div>
						<div
							class="from-brand-blue/25 to-brand-purple/25 mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl ring-1 ring-white/10"
						>
							{feature.icon}
						</div>
						<h3 class="text-2xl font-semibold tracking-tight text-white">{feature.title}</h3>
						<p class="mt-4 max-w-xl leading-7 text-white/70">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
<!-- /section:features -->

<!-- section:pricing {"type":"pricing","id":"pricing-1"} -->
<section id="pricing" class="pricing-gradient relative overflow-hidden py-24 sm:py-32 lg:py-40">
	<div
		class="bg-brand-purple/10 absolute top-1/4 left-8 h-64 w-64 rounded-full blur-3xl"
		aria-hidden="true"
	></div>
	<div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
			<div class="lg:pr-8" use:scrollReveal>
				<h2
					class="font-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-6xl"
				>
					Investment that pays for itself
				</h2>
				<p class="mt-6 max-w-xl text-lg leading-8 text-pretty text-white/70">
					Compare our one-time investment to your annual SaaS subscription costs
				</p>
			</div>

			<div class="mx-auto w-full max-w-xl lg:max-w-none" use:scrollReveal={{ delay: 100 }}>
				<div class="flex justify-center">
					{#each plans as plan}
						<div
							class="glass-card card-animate relative w-full rounded-3xl border border-white/10 p-7 shadow-2xl shadow-black/25 backdrop-blur-sm sm:p-10"
						>
							{#if plan.popular}
								<div class="absolute -top-3 left-8 transform sm:left-10">
									<span
										class="popular-badge shadow-brand-purple/25 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-lg"
									>
										Most Popular
									</span>
								</div>
							{/if}

							<div class="border-b border-white/10 pt-2 pb-8">
								<h3 class="text-3xl font-semibold tracking-tight text-white">{plan.name}</h3>
								<p class="mt-4 max-w-md leading-7 text-white/70">{plan.description}</p>
							</div>

							<div class="space-y-8 pt-8">
								<ul class="grid gap-4 sm:grid-cols-2">
									{#each plan.features as feature}
										<li class="flex items-start gap-3">
											<span
												class="bg-brand-blue/20 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="text-brand-violet h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													stroke-width="2"
												>
													<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
												</svg>
											</span>
											<span class="leading-6 text-white/90">{feature}</span>
										</li>
									{/each}
								</ul>
								<a
									href="/#intake-form"
									class="btn-gradient btn-animate group shadow-brand-purple/25 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full py-3 pr-3 pl-6 text-lg font-semibold text-white shadow-lg"
								>
									{plan.cta}
									<span
										class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M7 17L17 7M17 7H7M17 7v10"
											/>
										</svg>
									</span>
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
<!-- /section:pricing -->

<!-- section:cta {"type":"cta","id":"cta-1"} -->
<section class="cta-section-gradient relative py-16 sm:py-24 lg:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div
			class="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] px-6 py-12 text-center shadow-2xl shadow-black/20 backdrop-blur-sm sm:px-10 sm:py-16 lg:px-16"
		>
			<h2
				class="font-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-6xl"
				use:scrollReveal
			>
				Ready to bring your vision to life?
			</h2>
			<p
				class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-pretty text-white/70 sm:text-xl"
				use:scrollReveal={{ delay: 100 }}
			>
				Let's build something extraordinary together. From concept to launch, we're here to make it
				happen.
			</p>
			<div
				class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
				use:scrollReveal={{ delay: 200 }}
			>
				<a
					href="/#intake-form"
					class="btn-gradient btn-animate group shadow-brand-purple/25 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full py-3 pr-3 pl-6 text-lg font-semibold text-white shadow-lg sm:w-auto"
				>
					Start a Project
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
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
				<a
					href="/contact"
					class="btn-secondary-animate group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-white/25 bg-white/5 py-3 pr-3 pl-6 text-lg font-semibold text-white shadow-sm hover:bg-white/10 sm:w-auto"
				>
					Book a Call
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white/10"
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
			<p
				class="mt-8 text-sm font-medium tracking-wide text-white/55"
				use:scrollReveal={{ delay: 300 }}
			>
				Free consultation • No commitment • Response within 24 hours
			</p>
		</div>
	</div>
</section>
<!-- /section:cta -->

<!-- section:contact {"type":"contact","id":"contact-intake"} -->
<section
	id="intake-form"
	class="intake-section-gradient relative py-24 sm:py-32 lg:py-40"
	bind:this={sectionElement}
>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl" use:scrollReveal>
			{#if showSuccess}
				<div class="rounded-[2rem] bg-white p-8 text-center shadow-2xl sm:p-12">
					<div class="mb-4 text-5xl">🎉</div>
					<h3 class="mb-2 text-2xl font-bold text-gray-900">Thank you!</h3>
					<p class="text-gray-600">
						Your message has been sent successfully. We'll be in touch shortly.
					</p>
					<button
						type="button"
						class="from-brand-blue to-brand-purple mt-6 rounded-full bg-gradient-to-r px-6 py-2 text-white transition hover:opacity-90"
						onclick={() => (showSuccess = false)}
					>
						Submit another inquiry
					</button>
				</div>
			{:else}
				<form
					bind:this={formElement}
					class="intake-form-shadow rounded-[2rem] bg-white p-6 sm:p-10 lg:p-14"
					action="__FORM_ACTION__"
					method="POST"
					onsubmit={handleSubmit}
				>
					<input
						type="text"
						name="website"
						aria-hidden="true"
						aria-label="Leave this field empty"
						class="absolute top-auto left-[-10000px] h-px w-px overflow-hidden"
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
						class="mb-10 flex flex-wrap items-center gap-x-3 gap-y-5 text-xl leading-relaxed font-medium text-gray-900 sm:text-2xl"
					>
						<span class="shrink-0">Hi! My name is</span>
						<div class="relative inline-flex min-w-44 flex-1 items-center">
							<input
								type="text"
								name="name"
								bind:value={fullName}
								placeholder="Type your full name"
								required
								class="inline-input focus:border-brand-purple w-full border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-700 placeholder:text-gray-400 focus:ring-0"
							/>
							<span class="ml-1 shrink-0 text-lg">👋</span>
						</div>
						<span class="shrink-0">and I work at</span>
						<input
							type="text"
							name="company"
							bind:value={companyName}
							placeholder="Type a company name"
							required
							class="inline-input focus:border-brand-purple min-w-44 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-700 placeholder:text-gray-400 focus:ring-0"
						/>
					</div>

					<div
						class="mb-10 flex flex-wrap items-center gap-x-4 gap-y-4 text-xl leading-relaxed font-medium text-gray-900 sm:text-2xl"
					>
						<span>I found Core Labs using</span>
						<div class="flex flex-wrap gap-2">
							{#each foundUsOptions as option}
								<button
									type="button"
									class="pill-button rounded-full border-2 px-4 py-2 text-base font-medium transition-all {foundUsVia ===
									option
										? 'border-brand-purple bg-brand-purple/10 text-brand-purple'
										: 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}"
									onclick={() => (foundUsVia = option)}
								>
									{option}
								</button>
							{/each}
						</div>
						<input type="hidden" name="found_via" value={foundUsVia} />
					</div>

					<div
						class="mb-10 flex flex-wrap items-center gap-x-4 gap-y-4 text-xl leading-relaxed font-medium text-gray-900 sm:text-2xl"
					>
						<span>I'm looking for help with:</span>
						<div class="flex flex-wrap gap-2">
							{#each helpWithOptions as option}
								<button
									type="button"
									class="pill-button rounded-full border-2 px-4 py-2 text-base font-medium transition-all {helpWith ===
									option
										? 'border-brand-purple bg-brand-purple/10 text-brand-purple'
										: 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}"
									onclick={() => (helpWith = option)}
								>
									{option}
								</button>
							{/each}
						</div>
						<input type="hidden" name="help_with" value={helpWith} />
					</div>

					<div
						class="mb-10 flex flex-wrap items-center gap-x-3 gap-y-5 text-xl leading-relaxed font-medium text-gray-900 sm:text-2xl"
					>
						<span>Feel free to email me at</span>
						<input
							type="email"
							name="email"
							bind:value={email}
							placeholder="Type your contact email"
							required
							class="inline-input min-w-64 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-700 placeholder:text-gray-400 focus:border-brand-purple focus:ring-0 sm:max-w-72"
						/>
						<span>Or call me at</span>
						<div class="relative inline-flex items-center gap-1">
							<button
								type="button"
								class="inline-flex min-h-11 items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-base hover:bg-gray-50"
								onclick={(e) => {
									e.stopPropagation();
									showCountryDropdown = !showCountryDropdown;
								}}
							>
								<span class="text-lg">{selectedCountry.flag}</span>
								<svg
									class="h-4 w-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
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
						<input
							type="tel"
							bind:value={phone}
							placeholder={selectedCountry.code}
							class="inline-input w-36 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-700 placeholder:text-gray-400 focus:border-brand-purple focus:ring-0"
						/>
						<input type="hidden" name="phone" value="{selectedCountry.code} {phone}" />
					</div>

					<div
						class="mb-10 flex flex-wrap items-start gap-x-3 gap-y-5 text-xl leading-relaxed font-medium text-gray-900 sm:text-2xl"
					>
						<span class="mt-2">Here is more information about the project:</span>
						<input
							type="text"
							name="message"
							bind:value={projectDetails}
							placeholder="Type your project details"
							required
							class="inline-input focus:border-brand-purple min-w-64 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-gray-700 placeholder:text-gray-400 focus:ring-0"
						/>
					</div>

					<div
						class="flex flex-wrap items-center justify-between gap-6 border-t border-gray-200 pt-8"
					>
						<div
							class="h-captcha"
							data-sitekey="9f64291e-4d3a-4ae8-b4ee-5692268481b2"
							bind:this={hcaptchaContainer}
						></div>

						<button
							type="submit"
							disabled={isSubmitting}
							class="btn-gradient btn-animate group shadow-brand-purple/25 inline-flex min-h-12 items-center gap-3 rounded-full py-3 pr-3 pl-7 text-base font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60 {isSubmitting
								? 'btn-loading'
								: ''}"
						>
							<span class={isSubmitting ? 'opacity-0' : ''}>Send</span>
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 {isSubmitting
									? 'opacity-0'
									: ''}"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M7 17L17 7M17 7H7M17 7v10"
									/>
								</svg>
							</span>
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</section>
<!-- /section:contact -->

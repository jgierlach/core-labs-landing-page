<script>
	import { onMount } from 'svelte';
	import { scrollReveal, pageLoad } from '$lib/actions/scrollReveal.js';

	// ===== Features Data =====
	let features = $state([
		{
			title: 'Unified Platform',
			description: 'Replace multiple SaaS subscriptions with one comprehensive custom solution that handles all your business needs under one roof.',
			icon: '🏗️'
		},
		{
			title: '100% Custom Built',
			description: 'Every feature is built specifically for your business processes. No more settling for 60% functionality from off-the-shelf solutions.',
			icon: '⚡'
		},
		{
			title: 'Massive Cost Savings',
			description: 'Eliminate expensive monthly subscriptions. Our custom solutions typically cost 40% less than multiple vendor subscriptions.',
			icon: '💰'
		},
		{
			title: 'Evolves With You',
			description: 'Unlike static SaaS products, your custom platform grows and adapts as your business needs change over time.',
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
			if (hcaptchaContainer && typeof window !== 'undefined' && typeof window.hcaptcha !== 'undefined') {
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
			if (typeof window !== 'undefined' && typeof window.hcaptcha !== 'undefined' && hcaptchaWidgetId !== null) {
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
</svelte:head>

<!-- section:hero {"type":"hero","id":"hero-1"} -->
<section class="hero-gradient relative pt-32 pb-20 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<div class="mb-8" use:pageLoad={{ delay: 0 }}>
				<span
					class="bg-accent/10 text-accent ring-accent/20 inline-flex items-center rounded-full px-4 py-1.5 text-base font-medium ring-1 ring-inset"
					>The future of business software</span
				>
			</div>

			<h1
				class="font-heading text-foreground text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
				use:pageLoad={{ delay: 100 }}
			>
				We create stunning software and websites for leading <span class="text-accent">brands</span>
			</h1>

			<p
				class="text-muted-foreground mx-auto mt-8 max-w-3xl text-xl leading-8 text-pretty sm:text-2xl"
				use:pageLoad={{ delay: 200 }}
			>
				With the team and platform to take your project from idea to launch
			</p>

			<div
				class="mt-12 flex flex-wrap items-center justify-center gap-5"
				use:pageLoad={{ delay: 300 }}
			>
				<a
					href="/#intake-form"
					class="btn-gradient btn-animate group inline-flex items-center gap-3 rounded-full py-4 pr-4 pl-7 text-xl font-medium text-white shadow-lg"
				>
					Get Started
					<span
						class="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
						</svg>
					</span>
				</a>
				<a
					href="/contact"
					class="btn-secondary-animate group inline-flex items-center gap-3 rounded-full border border-white/30 bg-transparent py-4 pr-4 pl-7 text-xl font-medium text-white shadow-sm hover:bg-white/10"
				>
					Contact Us
					<span
						class="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white/10"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
						</svg>
					</span>
				</a>
			</div>

			<div
				class="mt-20 grid grid-cols-2 gap-10 md:grid-cols-4"
				use:pageLoad={{ delay: 400, stagger: true, staggerDelay: 100 }}
			>
				{#each stats as stat}
					<div class="text-center">
						<div class="text-foreground text-4xl font-bold">{stat.value}</div>
						<div class="text-muted-foreground text-base">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
<!-- /section:hero -->

<!-- section:features {"type":"features","id":"features-1"} -->
<section id="features" class="features-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<h2 class="font-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
				Why businesses choose custom over SaaS
			</h2>
			<p class="mt-4 text-lg text-white/70 text-pretty">
				Traditional SaaS forces you to adapt your business to their software. We build software that
				adapts to your business.
			</p>
		</div>

		<div class="mx-auto mt-16 max-w-7xl">
			<div
				class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
				use:scrollReveal={{ stagger: true, staggerDelay: 100 }}
			>
				{#each features as feature}
					<div
						class="glass-card card-animate group relative rounded-2xl border border-white/10 p-6 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
					>
						<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#334fff]/20 to-[#7433ff]/20 text-3xl">
							{feature.icon}
						</div>
						<h3 class="text-xl font-semibold text-white">{feature.title}</h3>
						<p class="mt-4 leading-relaxed text-white/70">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
<!-- /section:features -->

<!-- section:pricing {"type":"pricing","id":"pricing-1"} -->
<section id="pricing" class="pricing-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<h2
				class="font-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				Investment that pays for itself
			</h2>
			<p class="mt-4 text-lg text-pretty text-white/70">
				Compare our one-time investment to your annual SaaS subscription costs
			</p>
		</div>

		<div class="mx-auto mt-16 max-w-lg" use:scrollReveal={{ delay: 100 }}>
			<div class="flex justify-center">
				{#each plans as plan}
					<div
						class="glass-card card-animate relative w-full rounded-2xl border border-white/10 p-8 backdrop-blur-sm"
					>
						{#if plan.popular}
							<div class="absolute -top-3 left-1/2 -translate-x-1/2 transform">
								<span
									class="popular-badge inline-flex rounded-full px-4 py-1 text-sm font-medium text-white"
								>
									Most Popular
								</span>
							</div>
						{/if}

						<div class="pb-8 text-center">
							<h3 class="text-2xl font-semibold text-white">{plan.name}</h3>
							<p class="mt-4 text-white/70">{plan.description}</p>
						</div>

						<div class="space-y-6">
							<ul class="space-y-4">
								{#each plan.features as feature}
									<li class="flex items-center">
										<span
											class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#334fff]/20"
										>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#7433ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										</span>
										<span class="text-white/90">{feature}</span>
									</li>
								{/each}
							</ul>
							<a
								href="/#intake-form"
								class="btn-gradient btn-animate group inline-flex w-full items-center justify-center gap-3 rounded-full py-3 pr-3 pl-6 text-lg font-medium text-white shadow-lg"
							>
								{plan.cta}
								<span
									class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
									</svg>
								</span>
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
<!-- /section:pricing -->

<!-- section:cta {"type":"cta","id":"cta-1"} -->
<section class="cta-section-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h2
				class="font-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
				use:scrollReveal
			>
				Ready to bring your vision to life?
			</h2>
			<p
				class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70 text-pretty"
				use:scrollReveal={{ delay: 100 }}
			>
				Let's build something extraordinary together. From concept to launch, we're here to make it happen.
			</p>
			<div
				class="mt-10 flex flex-wrap items-center justify-center gap-4"
				use:scrollReveal={{ delay: 200 }}
			>
				<a
					href="/#intake-form"
					class="btn-gradient btn-animate group inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-6 text-lg font-medium text-white shadow-lg"
				>
					Start a Project
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
						</svg>
					</span>
				</a>
				<a
					href="/contact"
					class="btn-secondary-animate group inline-flex items-center gap-3 rounded-full border border-white/30 bg-transparent py-3 pr-3 pl-6 text-lg font-medium text-white shadow-sm hover:bg-white/10"
				>
					Book a Call
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white/10"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
						</svg>
					</span>
				</a>
			</div>
			<p
				class="mt-8 text-sm text-white/50"
				use:scrollReveal={{ delay: 300 }}
			>
				Free consultation • No commitment • Response within 24 hours
			</p>
		</div>
	</div>
</section>
<!-- /section:cta -->

<!-- section:contact {"type":"contact","id":"contact-intake"} -->
<section id="intake-form" class="intake-section-gradient relative py-20 sm:py-32" bind:this={sectionElement}>
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-5xl" use:scrollReveal>
			{#if showSuccess}
				<div class="rounded-2xl bg-white p-8 text-center shadow-2xl sm:p-12">
					<div class="mb-4 text-5xl">🎉</div>
					<h3 class="mb-2 text-2xl font-bold text-gray-900">Thank you!</h3>
					<p class="text-gray-600">
						Your message has been sent successfully. We'll be in touch shortly.
					</p>
					<button
						type="button"
						class="mt-6 rounded-full bg-gradient-to-r from-[#334fff] to-[#7433ff] px-6 py-2 text-white transition hover:opacity-90"
						onclick={() => (showSuccess = false)}
					>
						Submit another inquiry
					</button>
				</div>
			{:else}
				<form
					bind:this={formElement}
					class="intake-form-shadow rounded-2xl bg-white p-8 sm:p-12"
					action="__FORM_ACTION__"
					method="POST"
					onsubmit={handleSubmit}
				>
				<input
					type="text"
					name="website"
					aria-hidden="true"
					aria-label="Leave this field empty"
					style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden"
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
							<input
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
						<input
							type="text"
							name="company"
							bind:value={companyName}
							placeholder="Type a company name"
							required
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
										? 'border-[#7433ff] bg-[#f0ebff] text-[#7433ff]'
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
						class="mb-8 flex flex-wrap items-center gap-3 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span>I'm looking for help with:</span>
						<div class="flex flex-wrap gap-2">
							{#each helpWithOptions as option}
								<button
									type="button"
									class="pill-button rounded-full border-2 px-4 py-2 text-base font-medium transition-all {helpWith ===
									option
										? 'border-[#7433ff] bg-[#f0ebff] text-[#7433ff]'
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
						class="mb-8 flex flex-wrap items-center gap-2 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span>Feel free to email me at</span>
						<input
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
						<input
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
						<input
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
						<div class="h-captcha" data-sitekey="9f64291e-4d3a-4ae8-b4ee-5692268481b2" bind:this={hcaptchaContainer}></div>

						<button
							type="submit"
							disabled={isSubmitting}
							class="btn-gradient btn-animate group inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-6 text-base font-medium text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60 {isSubmitting ? 'btn-loading' : ''}"
						>
							<span class={isSubmitting ? 'opacity-0' : ''}>Send</span>
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 {isSubmitting ? 'opacity-0' : ''}"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
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

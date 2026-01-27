<script>
	import { onMount } from 'svelte';
	import { scrollReveal, pageLoad } from '$lib/actions/scrollReveal.js';

	// Contact form fields
	let name = $state('');
	let email = $state('');
	let company = $state('');
	let message = $state('');

	let isSubmitting = $state(false);
	let errorMessage = $state('');

	// hCaptcha site key
	const HCAPTCHA_SITEKEY = '9f64291e-4d3a-4ae8-b4ee-5692268481b2';

	// hCaptcha state
	let hcaptchaWidgetId = $state(null);
	let hcaptchaContainer = $state(null);

	onMount(() => {
		let checkInterval;

		const renderCaptcha = () => {
			if (hcaptchaContainer && typeof window !== 'undefined' && typeof window.hcaptcha !== 'undefined') {
				// Already rendered successfully
				if (hcaptchaWidgetId !== null) {
					return true;
				}
				// Check if widget was rendered by auto-render (has iframe)
				if (hcaptchaContainer.querySelector('iframe')) {
					return true;
				}
				// Try to render
				try {
					hcaptchaWidgetId = window.hcaptcha.render(hcaptchaContainer, {
						sitekey: HCAPTCHA_SITEKEY,
						theme: 'dark'
					});
					return true;
				} catch (e) {
					console.warn('hCaptcha render failed, will retry:', e);
					return false;
				}
			}
			return false;
		};

		// Try immediately, then poll if not ready
		if (!renderCaptcha()) {
			checkInterval = setInterval(() => {
				if (renderCaptcha()) {
					clearInterval(checkInterval);
				}
			}, 100);
		}

		return () => {
			if (checkInterval) clearInterval(checkInterval);
		};
	});

	// Form endpoint
	const FORM_ENDPOINT = 'https://www.corelabs.digital/f/74bcbe36-65c1-4ca2-b0c6-7d817681f319';

	function validateForm() {
		if (!name.trim() || !email.trim() || !message.trim()) {
			return 'Please fill in all required fields.';
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return 'Please enter a valid email address.';
		}
		return '';
	}

	function handleFormSubmit(event) {
		errorMessage = '';

		// Validate form fields
		const validation = validateForm();
		if (validation) {
			event.preventDefault();
			errorMessage = validation;
			return;
		}

		// Check hCaptcha
		const form = event.target;
		const hcaptchaResponse = form.querySelector('[name="h-captcha-response"]')?.value || '';

		if (!hcaptchaResponse) {
			event.preventDefault();
			errorMessage = 'Please complete the CAPTCHA verification.';
			return;
		}

		// Form is valid - allow native submission
		isSubmitting = true;
	}

	const contactMethods = [
		{
			icon: 'mail',
			title: 'Email Us',
			description: 'Our friendly team is here to help.',
			value: 'hello@corelabs.digital',
			href: 'mailto:hello@corelabs.digital'
		},
		{
			icon: 'clock',
			title: 'Response Time',
			description: 'We typically respond within',
			value: '24 hours',
			href: null
		},
		{
			icon: 'globe',
			title: 'Based In',
			description: 'Serving clients worldwide from',
			value: 'United States',
			href: null
		}
	];

	const faqs = [
		{
			question: 'What types of projects do you take on?',
			answer:
				'We specialize in custom web websites, SaaS platforms, e-commerce solutions, and business automation tools. From MVPs to enterprise-grade systems, we handle projects of all sizes.'
		},
		{
			question: 'How long does a typical project take?',
			answer:
				"Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications may take 2-4 months. We'll provide a detailed timeline after understanding your requirements."
		},
		{
			question: 'Do you offer ongoing support and maintenance?',
			answer:
				'Absolutely! We offer flexible support packages including bug fixes, feature updates, performance monitoring, and 24/7 emergency support for mission-critical applications.'
		}
	];
</script>

<svelte:head>
	<title>Contact Us - Core Labs</title>
	<meta
		name="description"
		content="Get in touch with Core Labs. Let's discuss your custom software project and bring your vision to life."
	/>
	<script src="https://js.hcaptcha.com/1/api.js?render=explicit" async defer></script>
</svelte:head>

<!-- Hero Section -->
<section class="hero-gradient relative pt-32 pb-16 sm:pt-40 sm:pb-20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<div class="mb-8" use:pageLoad={{ delay: 0 }}>
				<span
					class="bg-accent/10 text-accent ring-accent/20 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset"
				>
					Let's work together
				</span>
			</div>

			<h1
				class="hero-heading text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
				use:pageLoad={{ delay: 100 }}
			>
				Get in <span class="text-accent">touch</span>
			</h1>

			<p
				class="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8 text-pretty"
				use:pageLoad={{ delay: 200 }}
			>
				Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to
				you as soon as possible.
			</p>
		</div>
	</div>
</section>

<!-- Contact Methods -->
<section class="contact-methods-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div
			class="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
			use:scrollReveal={{ stagger: true, staggerDelay: 100 }}
		>
			{#each contactMethods as method}
				<div
					class="contact-card card-animate group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
				>
					<div
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#334fff]/20 to-[#7433ff]/20"
					>
						{#if method.icon === 'mail'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
								/>
							</svg>
						{:else if method.icon === 'clock'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						{:else if method.icon === 'globe'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
								/>
							</svg>
						{/if}
					</div>
					<h3 class="text-lg font-semibold text-white">{method.title}</h3>
					<p class="mt-1 text-sm text-white/60">{method.description}</p>
					{#if method.href}
						<a
							href={method.href}
							class="text-accent hover:text-accent/80 link-animate mt-3 inline-block font-medium transition-colors"
						>
							{method.value}
						</a>
					{:else}
						<p class="text-accent mt-3 font-medium">{method.value}</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Main Contact Form Section -->
<section class="form-gradient relative py-20 sm:py-28">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
				<!-- Left side: Info -->
				<div use:scrollReveal>
					<h2 class="section-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Let's build something <span class="text-gradient">extraordinary</span>
					</h2>
					<p class="mt-6 text-lg leading-relaxed text-white/70">
						Whether you're looking to replace expensive SaaS subscriptions, build a custom platform,
						or bring a new idea to life — we're here to help.
					</p>
					<p class="mt-4 leading-relaxed text-white/70">
						Fill out the form and we'll get back to you within 24 hours to discuss your project in
						detail.
					</p>

					<!-- What to expect -->
					<div class="mt-10">
						<h3 class="mb-4 text-lg font-semibold text-white">What happens next?</h3>
						<div class="space-y-4">
							<div class="flex items-start gap-4">
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#334fff] to-[#7433ff] text-sm font-bold text-white"
								>
									1
								</div>
								<div>
									<p class="font-medium text-white">We review your message</p>
									<p class="text-sm text-white/60">Our team carefully reads every inquiry</p>
								</div>
							</div>
							<div class="flex items-start gap-4">
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#334fff] to-[#7433ff] text-sm font-bold text-white"
								>
									2
								</div>
								<div>
									<p class="font-medium text-white">We schedule a call</p>
									<p class="text-sm text-white/60">A quick chat to understand your needs</p>
								</div>
							</div>
							<div class="flex items-start gap-4">
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#334fff] to-[#7433ff] text-sm font-bold text-white"
								>
									3
								</div>
								<div>
									<p class="font-medium text-white">We create a proposal</p>
									<p class="text-sm text-white/60">Detailed scope, timeline, and pricing</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Right side: Form -->
				<div use:scrollReveal={{ delay: 150 }}>
					<form
						class="contact-form rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
						action={FORM_ENDPOINT}
						method="POST"
						onsubmit={handleFormSubmit}
					>
						<!-- Honeypot field for spam protection -->
						<input
							type="text"
							name="website"
							style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden"
							tabindex="-1"
							autocomplete="off"
						/>
						{#if errorMessage}
							<div
								class="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
							>
								{errorMessage}
							</div>
						{/if}

						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div class="sm:col-span-1">
								<label for="name" class="mb-2 block text-sm font-medium text-white">
									Full name <span class="text-red-400">*</span>
								</label>
								<input
									id="name"
									name="name"
									type="text"
									class="input-animate w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition outline-none placeholder:text-white/40 focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
									placeholder="Jane Doe"
									bind:value={name}
									autocomplete="name"
									required
								/>
							</div>
							<div class="sm:col-span-1">
								<label for="email" class="mb-2 block text-sm font-medium text-white">
									Email <span class="text-red-400">*</span>
								</label>
								<input
									id="email"
									name="email"
									type="email"
									class="input-animate w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition outline-none placeholder:text-white/40 focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
									placeholder="you@company.com"
									bind:value={email}
									autocomplete="email"
									required
								/>
							</div>
							<div class="sm:col-span-2">
								<label for="company" class="mb-2 block text-sm font-medium text-white">
									Company name <span class="text-white/40">(optional)</span>
								</label>
								<input
									id="company"
									name="company"
									type="text"
									class="input-animate w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition outline-none placeholder:text-white/40 focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
									placeholder="Acme Inc."
									bind:value={company}
									autocomplete="organization"
								/>
							</div>
							<div class="sm:col-span-2">
								<label for="message" class="mb-2 block text-sm font-medium text-white">
									How can we help? <span class="text-red-400">*</span>
								</label>
								<textarea
									id="message"
									name="message"
									rows="5"
									class="input-animate w-full resize-y rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition outline-none placeholder:text-white/40 focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
									placeholder="Tell us about your project, goals, and timeline..."
									bind:value={message}
									required
								></textarea>
							</div>
						</div>

						<!-- hCaptcha Widget -->
						<div class="mt-6">
							<div bind:this={hcaptchaContainer} class="h-captcha"></div>
						</div>

						<div class="mt-8">
							<button
								type="submit"
								class="submit-button btn-animate group inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-lg font-medium text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:transform-none"
								disabled={isSubmitting}
							>
								{#if isSubmitting}
									<span>Sending...</span>
									<span
										class="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10"
									>
										<svg
											class="h-4 w-4 animate-spin"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
									</span>
								{:else}
									<span>Send Message</span>
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
								{/if}
							</button>
						</div>

						<p class="mt-4 text-center text-sm text-white/50">
							We respect your privacy. Your information is never shared.
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section class="faq-gradient relative py-20 sm:py-28">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl">
			<div class="text-center" use:scrollReveal>
				<h2 class="section-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
					Frequently asked questions
				</h2>
				<p class="mt-4 text-lg text-white/70">Quick answers to questions you might have.</p>
			</div>

			<div
				class="mt-12 space-y-6"
				use:scrollReveal={{ delay: 150, stagger: true, staggerDelay: 100 }}
			>
				{#each faqs as faq}
					<div class="faq-card rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
						<h3 class="text-lg font-semibold text-white">{faq.question}</h3>
						<p class="mt-3 leading-relaxed text-white/70">{faq.answer}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.hero-gradient {
		background: radial-gradient(
				ellipse 80% 50% at 50% 100%,
				rgba(116, 51, 255, 0.4) 0%,
				rgba(51, 79, 255, 0.2) 40%,
				transparent 70%
			),
			linear-gradient(109deg, #0a0f2a 0%, #0d0a1f 30%, #150d2a 60%, #1a1035 100%);
	}

	.contact-methods-gradient {
		background: linear-gradient(180deg, #1a1035 0%, #0d0a1f 100%);
	}

	.form-gradient {
		background: radial-gradient(
				ellipse 60% 40% at 80% 20%,
				rgba(116, 51, 255, 0.12) 0%,
				transparent 60%
			),
			radial-gradient(ellipse 60% 40% at 20% 80%, rgba(51, 79, 255, 0.08) 0%, transparent 60%),
			linear-gradient(180deg, #0d0a1f 0%, #0a0f2a 50%, #1a1035 100%);
	}

	.faq-gradient {
		background: radial-gradient(
				ellipse 80% 50% at 50% 0%,
				rgba(116, 51, 255, 0.15) 0%,
				rgba(51, 79, 255, 0.08) 40%,
				transparent 70%
			),
			linear-gradient(180deg, #1a1035 0%, #0d0a1f 50%, #0a0f2a 100%);
	}

	.hero-heading,
	.section-heading {
		font-family: 'Poppins', sans-serif;
	}

	.text-gradient {
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.contact-card,
	.contact-form,
	.faq-card {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(255, 255, 255, 0.02) 100%
		);
	}

	.submit-button {
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
	}

	.submit-button:hover:not(:disabled) {
		background: linear-gradient(109deg, #4560ff 13.24%, #8344ff 92.35%);
	}
</style>

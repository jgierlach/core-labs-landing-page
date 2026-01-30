<script>
	import { onMount } from 'svelte';
	import { pageLoad } from '$lib/actions/scrollReveal.js';

	// Form fields
	let name = $state('');
	let email = $state('');
	let currentWebsite = $state('');
	let creativeDirection = $state('');
	
	// Urgency - spots remaining (persistent per session)
	let spotsRemaining = $state(7);

	// Submission state
	let isSubmitting = $state(false);
	let showSuccess = $state(false);
	let errorMessage = $state('');

	// hCaptcha state
	let hcaptchaWidgetId = $state(null);
	let hcaptchaContainer = $state(null);
	let formElement = $state(null);

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
						sitekey: '9f64291e-4d3a-4ae8-b4ee-5692268481b2',
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

	function validateForm() {
		if (!name.trim()) return 'Please enter your name.';
		if (!email.trim()) return 'Please enter your email.';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return 'Please enter a valid email address.';

		// Check hCaptcha
		const hcaptchaResponse = formElement?.querySelector('[name="h-captcha-response"]')?.value;
		if (!hcaptchaResponse) return 'Please complete the CAPTCHA.';

		return '';
	}

  function handleSubmit(event) {
  // Prevent accidental double submits
  if (isSubmitting) {
    event.preventDefault();
    return;
  }

  errorMessage = '';

  const validation = validateForm();
  if (validation) {
    event.preventDefault();
    errorMessage = validation;
    if (typeof window !== 'undefined' && window.hcaptcha && hcaptchaWidgetId !== null) {
      window.hcaptcha.reset(hcaptchaWidgetId);
    }
    return;
  }

  // Stop the browser's default POST so the pixel event isn't lost
  event.preventDefault();

  isSubmitting = true;

  // Fire Meta Pixel Lead event (scoped to this form/page)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Website Redesign',
      lead_type: 'Free Design'
    });
  }

  // Submit the form for real after a brief delay
  setTimeout(() => {
    if (formElement) {
      formElement.submit();
    } else {
      isSubmitting = false;
      errorMessage = 'Something went wrong. Please try again.';
    }
  }, 150);
}


	// function handleSubmit(event) {
  //   errorMessage = '';

  //   const validation = validateForm();
  //   if (validation) {
  //       event.preventDefault();
  //       errorMessage = validation;
  //       if (typeof window !== 'undefined' && typeof window.hcaptcha !== 'undefined' && hcaptchaWidgetId !== null) {
  //           window.hcaptcha.reset(hcaptchaWidgetId);
  //       }
  //       return;
  //   }

  //   // Fire Meta Pixel Lead event
  //   if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
  //       window.fbq('track', 'Lead');
  //   }

  //   isSubmitting = true;
	// }

	function resetForm() {
		name = '';
		email = '';
		currentWebsite = '';
		creativeDirection = '';
		showSuccess = false;
		errorMessage = '';
	}
	
	// Scroll to form on mobile
	function scrollToForm() {
		const form = document.querySelector('.form-card');
		if (form) {
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<svelte:head>
	<title>Free Website Redesign - Core Labs</title>
	<meta
		name="description"
		content="Get a free professional website redesign or custom design created from scratch. Limited availability - claim your free design today."
	/>
	<script src="https://js.hcaptcha.com/1/api.js?render=explicit" async defer></script>
</svelte:head>

<section class="hero-section relative min-h-dvh pt-24 pb-16 sm:pt-40 sm:pb-32">
	<!-- Background decorations -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[#7433ff]/10 blur-3xl"></div>
		<div class="absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-[#334fff]/10 blur-3xl"></div>
		<div class="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#7433ff]/5 blur-3xl"></div>
	</div>

	<div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<div class="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
				<!-- Left column: Copy -->
				<div class="text-center lg:text-left">
					<div class="mb-4 sm:mb-6" use:pageLoad={{ delay: 0 }}>
						<span
							class="inline-flex items-center gap-2 rounded-full bg-[#ff4444]/10 px-4 py-1.5 text-sm font-medium text-[#ff6b6b] ring-1 ring-inset ring-[#ff4444]/20"
						>
							<span class="relative flex h-2 w-2">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff4444] opacity-75"></span>
								<span class="relative inline-flex h-2 w-2 rounded-full bg-[#ff6b6b]"></span>
							</span>
							Only {spotsRemaining} spots left this month
						</span>
					</div>

					<h1
						class="hero-heading text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
						use:pageLoad={{ delay: 100 }}
					>
						Get a <span class="text-gradient">Free Website</span> Design
					</h1>

					<p
						class="mt-4 sm:mt-6 text-base leading-7 text-white/70 sm:text-xl sm:leading-8"
						use:pageLoad={{ delay: 200 }}
					>
						Whether you need a complete redesign or a brand new website built from scratch, our design team will create a stunning, high-converting design for you — <strong class="text-white">completely free</strong>.
					</p>

					<div class="mt-6 sm:mt-10 mx-auto max-w-md lg:mx-0 lg:max-w-none space-y-3 sm:space-y-4" use:pageLoad={{ delay: 300 }}>
						<div class="flex items-start gap-3">
							<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#10b981]/20">
								<svg class="h-4 w-4 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<span class="text-base text-white/90 sm:text-lg">Professional design valued at $2,500+</span>
						</div>
						<div class="flex items-start gap-3">
							<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#10b981]/20">
								<svg class="h-4 w-4 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<span class="text-base text-white/90 sm:text-lg">Custom mockups delivered within 5 days</span>
						</div>
						<div class="flex items-start gap-3">
							<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#10b981]/20">
								<svg class="h-4 w-4 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<span class="text-base text-white/90 sm:text-lg">No commitment, no credit card required</span>
						</div>
					</div>
				</div>

				<!-- Right column: Form -->
				<div use:pageLoad={{ delay: 200 }}>
					{#if showSuccess}
						<div class="form-card rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl text-center">
							<div class="mb-4 text-5xl">🎉</div>
							<h3 class="mb-2 text-2xl font-bold text-white">You're In!</h3>
							<p class="text-white/70 mb-6">
								Your request has been submitted successfully. We'll be in touch within 24 hours with your free design preview.
							</p>
							<button
								type="button"
								class="submit-button btn-animate group inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-6 text-base font-medium text-white shadow-lg"
								onclick={resetForm}
							>
								<span>Submit Another Request</span>
								<span class="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20">
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
									</svg>
								</span>
							</button>
						</div>
					{:else}
						<form
							bind:this={formElement}
							class="form-card rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur-xl"
							action="https://www.corelabs.digital/f/88cb8b1a-9ca0-4a91-8c99-abf67b402dd3"
							method="POST"
							onsubmit={handleSubmit}
						>
							<!-- Honeypot field -->
							<input
								type="text"
								name="website"
								style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden"
								tabindex="-1"
								autocomplete="off"
							/>

							<div class="mb-6 text-center">
								<h2 class="text-xl font-semibold text-white sm:text-2xl">Claim Your Free Design</h2>
								<p class="mt-1 text-sm text-white/50">Takes less than 1 minute</p>
							</div>

							{#if errorMessage}
								<div class="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
									{errorMessage}
								</div>
							{/if}

							<div class="space-y-4 sm:space-y-5">
								<!-- Name -->
								<div>
									<label for="name" class="mb-2 block text-sm font-medium text-white">
										Name <span class="text-[#a78bfa]">*</span>
									</label>
									<input
										id="name"
										name="name"
										type="text"
										class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-base text-white placeholder:text-white/40 outline-none transition focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
										placeholder="Your name"
										bind:value={name}
										autocomplete="name"
										required
									/>
								</div>

								<!-- Email -->
								<div>
									<label for="email" class="mb-2 block text-sm font-medium text-white">
										Email <span class="text-[#a78bfa]">*</span>
									</label>
									<input
										id="email"
										name="email"
										type="email"
										class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-base text-white placeholder:text-white/40 outline-none transition focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
										placeholder="you@example.com"
										bind:value={email}
										autocomplete="email"
										required
									/>
								</div>

								<!-- Current Website (optional) -->
								<div>
									<label for="current-website" class="mb-2 block text-sm font-medium text-white">
										Current Website <span class="text-white/40">(optional)</span>
									</label>
									<input
										id="current-website"
										name="current_website"
										type="text"
										class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-base text-white placeholder:text-white/40 outline-none transition focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
										placeholder="https://yourwebsite.com"
										bind:value={currentWebsite}
									/>
								</div>

								<!-- Creative Direction -->
								<div>
									<label for="creative-direction" class="mb-2 block text-sm font-medium text-white">
										Creative Direction <span class="text-white/40">(optional)</span>
									</label>
									<textarea
										id="creative-direction"
										name="creative_direction"
										rows="3"
										class="w-full resize-y rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-base text-white placeholder:text-white/40 outline-none transition focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
										placeholder="Describe your vision — colors, style, vibe, inspiration sites, or specific features you'd like."
										bind:value={creativeDirection}
									></textarea>
								</div>

								<!-- hCaptcha -->
								<div class="flex justify-center pt-2">
									<div bind:this={hcaptchaContainer} class="h-captcha"></div>
								</div>

								<!-- Submit -->
								<button
									type="submit"
									disabled={isSubmitting}
									class="submit-button btn-animate group w-full inline-flex items-center justify-center gap-3 rounded-full py-4 px-6 text-lg font-medium text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60 {isSubmitting ? 'btn-loading' : ''}"
								>
									<span class={isSubmitting ? 'opacity-0' : ''}>Get My Free Design</span>
									<span
										class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20 {isSubmitting ? 'opacity-0' : ''}"
									>
										<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
										</svg>
									</span>
								</button>

								<!-- Trust indicators -->
								<div class="flex items-center justify-center gap-4 pt-2">
									<div class="flex items-center gap-1.5 text-xs text-white/50">
										<svg class="h-3.5 w-3.5 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
										100% Free
									</div>
									<div class="flex items-center gap-1.5 text-xs text-white/50">
										<svg class="h-3.5 w-3.5 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
										No Card Required
									</div>
								</div>

								<p class="text-center text-xs text-white/40">
									By submitting, you agree to receive communications from Core Labs LLC.
								</p>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Sticky Mobile CTA -->
<div class="sticky-cta fixed bottom-0 left-0 right-0 z-50 p-4 lg:hidden">
	<button
		type="button"
		onclick={scrollToForm}
		class="submit-button w-full inline-flex items-center justify-center gap-2 rounded-full py-4 px-6 text-base font-semibold text-white shadow-2xl"
	>
		<span>Claim Your Free Design</span>
		<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
		</svg>
	</button>
</div>

<!-- FAQ Section for additional conversion optimization -->
<section class="faq-section relative py-20 pb-32 lg:pb-20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl text-center mb-12">
			<h2 class="text-2xl font-bold text-white sm:text-3xl">Frequently Asked Questions</h2>
		</div>

		<div class="mx-auto max-w-3xl space-y-4">
			<div class="faq-card rounded-xl border border-white/10 bg-white/5 p-6">
				<h3 class="text-lg font-medium text-white mb-2">Is this really free?</h3>
				<p class="text-white/60">Yes, 100% free. We create a complete design concept for your website at no cost. If you love it and want us to build it, we can discuss development options — but there's absolutely no obligation.</p>
			</div>

			<div class="faq-card rounded-xl border border-white/10 bg-white/5 p-6">
				<h3 class="text-lg font-medium text-white mb-2">What will I receive?</h3>
				<p class="text-white/60">You'll receive a professional design mockup of your homepage and key pages, showing exactly how your new website could look. This includes responsive designs for desktop and mobile.</p>
			</div>

			<div class="faq-card rounded-xl border border-white/10 bg-white/5 p-6">
				<h3 class="text-lg font-medium text-white mb-2">How long does it take?</h3>
				<p class="text-white/60">We typically deliver your custom design within 5 business days. You'll receive an email with your design preview and a link to schedule a walkthrough call if you'd like.</p>
			</div>

			<div class="faq-card rounded-xl border border-white/10 bg-white/5 p-6">
				<h3 class="text-lg font-medium text-white mb-2">What if I don't have a current website?</h3>
				<p class="text-white/60">No problem! We work with businesses launching their first website all the time. Just describe your vision in the Creative Direction field, and we'll create something amazing from scratch.</p>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-section {
		background: 
			radial-gradient(
				ellipse 80% 50% at 50% 100%,
				rgba(116, 51, 255, 0.25) 0%,
				rgba(51, 79, 255, 0.12) 40%,
				transparent 70%
			),
			linear-gradient(180deg, #0a0f2a 0%, #0d0a1f 50%, #1a1035 100%);
	}

	.faq-section {
		background: linear-gradient(180deg, #1a1035 0%, #0d0a1f 50%, #0a0f2a 100%);
	}

	.hero-heading {
		font-family: 'Poppins', sans-serif;
	}

	.text-gradient {
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.form-card {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.08) 0%,
			rgba(255, 255, 255, 0.02) 100%
		);
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(255, 255, 255, 0.05);
	}

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

	.sticky-cta {
		background: linear-gradient(
			to top,
			rgba(10, 15, 42, 0.98) 0%,
			rgba(10, 15, 42, 0.95) 50%,
			rgba(10, 15, 42, 0) 100%
		);
		padding-bottom: env(safe-area-inset-bottom, 16px);
	}
</style>

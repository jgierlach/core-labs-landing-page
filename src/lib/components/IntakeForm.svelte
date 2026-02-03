<script>
	import { onMount } from 'svelte';
	import { scrollReveal } from '$lib/actions/scrollReveal.js';

	// Form fields
	let fullName = $state('');
	let companyName = $state('');
	let email = $state('');
	let phone = $state('');
	let projectDetails = $state('');

	// Selection states
	let foundUsVia = $state('');
	let helpWith = $state('');

	// Country code for phone
	let selectedCountry = $state({ code: '+1', flag: '🇺🇸', name: 'United States' });
	let showCountryDropdown = $state(false);

	// Form element reference
	let formElement = $state(null);

	const countries = [
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
	];

	const foundUsOptions = ['Google search', 'Word of mouth', 'Ad', 'Other'];
	const helpWithOptions = ['Website', 'Custom Software', 'Other'];

	// Submission state
	let isSubmitting = $state(false);
	let showSuccess = $state(false);
	let errorMessage = $state('');

	// hCaptcha state
	let hcaptchaWidgetId = $state(null);
	let hcaptchaContainer = $state(null);
	let hcaptchaLoaded = $state(false);
	let sectionElement = $state(null);

	// Lazy-load hCaptcha script
	function loadHcaptchaScript() {
		if (hcaptchaLoaded || typeof window === 'undefined') return;
		
		// Check if already loaded
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

		// Use Intersection Observer to lazy-load hCaptcha when form is near viewport
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						loadHcaptchaScript();
						observer.disconnect();
						
						// Start polling for hCaptcha to be ready
						checkInterval = setInterval(() => {
							if (renderCaptcha()) {
								clearInterval(checkInterval);
							}
						}, 100);
					}
				});
			},
			{
				rootMargin: '200px', // Start loading 200px before form is visible
				threshold: 0
			}
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

		// Check hCaptcha
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
			// Reset hCaptcha if validation failed due to captcha
			if (typeof window !== 'undefined' && typeof window.hcaptcha !== 'undefined' && hcaptchaWidgetId !== null) {
				window.hcaptcha.reset(hcaptchaWidgetId);
			}
			return;
		}

		// Form is valid - allow native submission
		isSubmitting = true;
	}

	function handleClickOutside(event) {
		if (showCountryDropdown) {
			showCountryDropdown = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<section id="intake-form" class="intake-section relative py-20 sm:py-32" bind:this={sectionElement}>
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
					class="intake-form rounded-2xl bg-white p-8 shadow-2xl sm:p-12"
					action="https://www.corelabs.digital/f/042ede32-d0d7-41a3-9140-87f484cfc6aa"
					method="POST"
					onsubmit={handleSubmit}
				>
				<!-- Honeypot field for spam protection -->
				<input
					type="text"
					name="website"
					aria-hidden="true"
					aria-label="Leave this field empty"
					style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden"
					tabindex="-1"
					autocomplete="off"
				/>

					{#if errorMessage}
						<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
							{errorMessage}
						</div>
					{/if}

					<!-- Row 1: Name and Company -->
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
								class="inline-input input-animate w-full border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400"
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
							class="inline-input input-animate min-w-44 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400"
						/>
					</div>

					<!-- Row 2: How did you find us -->
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
						<!-- Hidden input to submit the selected value -->
						<input type="hidden" name="found_via" value={foundUsVia} />
					</div>

					<!-- Row 3: What do you need help with -->
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
						<!-- Hidden input to submit the selected value -->
						<input type="hidden" name="help_with" value={helpWith} />
					</div>

					<!-- Row 4: Contact info -->
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
							class="inline-input input-animate w-52 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400 sm:w-60"
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
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<div
									class="absolute top-full left-0 z-50 mt-1 max-h-48 w-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
									onclick={(e) => e.stopPropagation()}
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
							class="inline-input input-animate w-28 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400"
						/>
						<!-- Hidden input for full phone number -->
						<input type="hidden" name="phone" value="{selectedCountry.code} {phone}" />
					</div>

					<!-- Row 5: Project details -->
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
							class="inline-input input-animate min-w-64 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-gray-600 placeholder:text-gray-400"
						/>
					</div>

					<!-- Bottom row: Captcha and Submit -->
					<div
						class="flex flex-wrap items-center justify-center gap-6 border-t border-gray-200 pt-6"
					>
						<!-- hCaptcha -->
						<div bind:this={hcaptchaContainer} class="h-captcha"></div>

						<!-- Submit button -->
						<button
							type="submit"
							disabled={isSubmitting}
							class="submit-button btn-animate group inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-6 text-base font-medium text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60 {isSubmitting ? 'btn-loading' : ''}"
						>
							<span class={isSubmitting ? 'opacity-0' : ''}>Send</span>
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 {isSubmitting ? 'opacity-0' : ''}"
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

<style>
	.intake-section {
		background: 
			/* Bottom glow */
			radial-gradient(
				ellipse 80% 50% at 50% 100%,
				rgba(116, 51, 255, 0.15) 0%,
				rgba(51, 79, 255, 0.08) 40%,
				transparent 70%
			),
			/* Dark base gradient */ linear-gradient(180deg, #0a0f2a 0%, #0d0a1f 50%, #1a1035 100%);
	}

	.intake-form {
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.25),
			0 0 0 1px rgba(255, 255, 255, 0.1);
	}

	.inline-input {
		font-size: inherit;
		font-weight: 400;
	}

	.pill-button {
		white-space: nowrap;
	}

	.submit-button {
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
	}

	.submit-button:hover:not(:disabled) {
		background: linear-gradient(109deg, #4560ff 13.24%, #8344ff 92.35%);
	}
</style>

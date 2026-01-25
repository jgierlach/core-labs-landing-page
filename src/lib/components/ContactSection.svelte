<script>
	// Contact form fields
	let name = $state('');
	let email = $state('');
	let message = $state('');

	function resetFormFields() {
		name = '';
		email = '';
		message = '';
	}

	let showSubmissionSuccess = $state(false);
	let isSubmitting = $state(false);
	let errorMessage = $state('');

	function validateForm() {
		if (!name.trim() || !email.trim() || !message.trim()) {
			return 'Please fill in all fields.';
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return 'Please enter a valid email address.';
		}
		return '';
	}
	async function submitContactForm(event) {
		event.preventDefault();
		errorMessage = '';
		const validation = validateForm();
		if (validation) {
			errorMessage = validation;
			return;
		}
		isSubmitting = true;
		try {
			const response = await fetch('/api/contact-form-submission', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
					email,
					message
				})
			});
			if (response.ok) {
				showSubmissionSuccess = true;
				resetFormFields();
			} else {
				const data = await response.json().catch(() => ({}));
				console.error(data);
				errorMessage = data?.error || 'Contact form submission unsuccessful.';
			}
		} catch (err) {
			console.error(err);
			errorMessage = 'Network error. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section id="contact" class="contact-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="contact-heading text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
				Let's build your custom platform
			</h2>
			<p class="mt-4 text-pretty text-lg text-white/70">
				Tell us a bit about your needs and we'll get back to you as soon as we can.
			</p>
		</div>

		<div class="mx-auto mt-12 max-w-2xl">
			{#if showSubmissionSuccess}
				<div class="mb-8 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-400">
					Thank you! Your message has been sent. We'll be in touch shortly.
				</div>
			{/if}

			{#if errorMessage}
				<div
					class="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
				>
					{errorMessage}
				</div>
			{/if}

			<form
				class="contact-form rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
				action="https://www.corelabs.digital/f/74bcbe36-65c1-4ca2-b0c6-7d817681f319"
				method="POST"
			>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div class="sm:col-span-1">
						<label for="name" class="mb-2 block text-sm font-medium text-white"
							>Full name</label
						>
						<input
							id="name"
							name="name"
							type="text"
							class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
							placeholder="Jane Doe"
							bind:value={name}
							autocomplete="name"
							required
						/>
					</div>
					<div class="sm:col-span-1">
						<label for="email" class="mb-2 block text-sm font-medium text-white">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
							placeholder="you@company.com"
							bind:value={email}
							autocomplete="email"
							required
						/>
					</div>
					<div class="sm:col-span-2">
						<label for="message" class="mb-2 block text-sm font-medium text-white"
							>How can we help?</label
						>
						<textarea
							id="message"
							name="message"
							rows="6"
							class="w-full resize-y rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]"
							placeholder="Share a short description of your project, goals, and timeline."
							bind:value={message}
							required
						></textarea>
					</div>
				</div>

				<div class="mt-8 flex justify-end">
					<button
						type="submit"
						class="submit-button group inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-6 text-lg font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
						disabled={isSubmitting}
					>
						{#if isSubmitting}
							<span>Sending…</span>
						{:else}
							<span>Send message</span>
						{/if}
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
					</button>
				</div>
			</form>
		</div>
	</div>
</section>

<style>
	.contact-gradient {
		background: 
			/* Bottom glow */
			radial-gradient(
				ellipse 80% 50% at 50% 100%,
				rgba(116, 51, 255, 0.15) 0%,
				rgba(51, 79, 255, 0.08) 40%,
				transparent 70%
			),
			/* Dark base gradient */
			linear-gradient(180deg, #0a0f2a 0%, #0d0a1f 50%, #1a1035 100%);
	}

	.contact-heading {
		font-family: 'Poppins', sans-serif;
	}

	.contact-form {
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

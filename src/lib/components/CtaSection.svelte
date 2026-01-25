<!-- CTASection.svelte -->
<script lang="ts">
	import { scrollReveal } from '$lib/actions/scrollReveal.js';

	export let onDiscoveryCall: (() => void) | undefined;
	export let onCalculateSavings: (() => void) | undefined;

	const handleDiscovery = (e: MouseEvent) => {
		if (onDiscoveryCall) {
			e.preventDefault();
			onDiscoveryCall();
		}
	};

	const handleSavings = (e: MouseEvent) => {
		if (onCalculateSavings) {
			e.preventDefault();
			onCalculateSavings();
		}
	};
</script>

<section class="cta-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h2 
				class="cta-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
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
					href="/#contact"
					class="cta-button btn-animate group inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-6 text-lg font-medium text-white shadow-lg"
					on:click={handleDiscovery}
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
					href="/#contact"
					class="btn-secondary-animate group inline-flex items-center gap-3 rounded-full border border-white/30 bg-transparent py-3 pr-3 pl-6 text-lg font-medium text-white shadow-sm hover:bg-white/10"
					on:click={handleSavings}
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
				class="mt-8 text-sm text-white/50"
				use:scrollReveal={{ delay: 300 }}
			>
				Free consultation • No commitment • Response within 24 hours
			</p>
		</div>
	</div>
</section>

<style>
	.cta-gradient {
		background: 
			/* Radial glow at top */
			radial-gradient(
				ellipse 80% 50% at 50% 0%,
				rgba(116, 51, 255, 0.3) 0%,
				rgba(51, 79, 255, 0.15) 40%,
				transparent 70%
			),
			/* Dark base gradient */
			linear-gradient(109deg, #0a0f2a 0%, #0d0a1f 30%, #150d2a 60%, #1a1035 100%);
	}

	.cta-heading {
		font-family: 'Poppins', sans-serif;
	}

	.cta-button {
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
	}

	.cta-button:hover {
		background: linear-gradient(109deg, #4560ff 13.24%, #8344ff 92.35%);
	}
</style>

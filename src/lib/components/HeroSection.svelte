<!-- HeroSection.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollReveal, pageLoad } from '$lib/actions/scrollReveal.js';

	export let onGetCustomSolution: (() => void) | undefined;
	export let onViewCaseStudies: (() => void) | undefined;

	const handlePrimary = (e: MouseEvent) => {
		if (onGetCustomSolution) {
			e.preventDefault();
			onGetCustomSolution();
		}
	};

	const handleSecondary = (e: MouseEvent) => {
		if (onViewCaseStudies) {
			e.preventDefault();
			onViewCaseStudies();
		}
	};
</script>

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
				class="hero-heading text-foreground text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
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
					class="cta-gradient btn-animate group inline-flex items-center gap-3 rounded-full py-4 pr-4 pl-7 text-xl font-medium text-white shadow-lg"
					on:click={handlePrimary}
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
					class="btn-secondary-animate group inline-flex items-center gap-3 rounded-full border border-white/30 bg-transparent py-4 pr-4 pl-7 text-xl font-medium text-white shadow-sm hover:bg-white/10"
					on:click={handleSecondary}
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
				class="mt-20 grid grid-cols-2 gap-10 md:grid-cols-4"
				use:pageLoad={{ delay: 400, stagger: true, staggerDelay: 100 }}
			>
				<div class="text-center">
					<div class="text-foreground text-4xl font-bold">40%</div>
					<div class="text-muted-foreground text-base">Cost Savings</div>
				</div>
				<div class="text-center">
					<div class="text-foreground text-4xl font-bold">100%</div>
					<div class="text-muted-foreground text-base">Custom Fit</div>
				</div>
				<div class="text-center">
					<div class="text-foreground text-4xl font-bold">24/7</div>
					<div class="text-muted-foreground text-base">Support</div>
				</div>
				<div class="text-center">
					<div class="text-foreground text-4xl font-bold">∞</div>
					<div class="text-muted-foreground text-base">Scalability</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-gradient {
		background: 
			/* Vibrant radial glow using the exact colors */
			radial-gradient(
				ellipse 80% 50% at 50% 100%,
				rgba(116, 51, 255, 0.4) 0%,
				rgba(51, 79, 255, 0.2) 40%,
				transparent 70%
			),
			/* Darkened base gradient using the same hues */
				linear-gradient(109deg, #0a0f2a 0%, #0d0a1f 30%, #150d2a 60%, #1a1035 100%);
	}

	.hero-heading {
		font-family: 'Poppins', sans-serif;
	}

	.cta-gradient {
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
	}

	.cta-gradient:hover {
		background: linear-gradient(109deg, #4560ff 13.24%, #8344ff 92.35%);
	}
</style>

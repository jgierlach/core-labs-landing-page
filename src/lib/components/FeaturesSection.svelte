<!-- FeaturesSection.svelte -->
<script lang="ts">
	import { scrollReveal } from '$lib/actions/scrollReveal.js';

	type Feature = {
		title: string;
		description: string;
		icon: string;
	};

	export let features: Feature[] = [
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
	];
</script>

<section id="features" class="features-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<h2 class="features-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
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
						class="feature-card card-animate group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
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

<style>
	.features-gradient {
		background: 
			/* Subtle side glows for depth */
			radial-gradient(
				ellipse 50% 80% at 0% 50%,
				rgba(51, 79, 255, 0.08) 0%,
				transparent 50%
			),
			radial-gradient(
				ellipse 50% 80% at 100% 50%,
				rgba(116, 51, 255, 0.08) 0%,
				transparent 50%
			),
			/* Dark base gradient - continues from hero */
			linear-gradient(180deg, #1a1035 0%, #0d0a1f 50%, #0a0f2a 100%);
	}

	.features-heading {
		font-family: 'Poppins', sans-serif;
	}

	.feature-card {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(255, 255, 255, 0.02) 100%
		);
	}
</style>

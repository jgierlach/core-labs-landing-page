<!-- PricingSection.svelte -->
<script lang="ts">
	import { scrollReveal } from '$lib/actions/scrollReveal.js';

	type Plan = {
		name: string;
		price: string;
		description: string;
		features: string[];
		cta: string;
		popular: boolean;
	};

	export let plans: Plan[] = [
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
	];
</script>

<section id="pricing" class="pricing-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<h2
				class="pricing-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
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
						class="pricing-card card-animate relative w-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
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
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4 text-[#7433ff]"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2"
											>
												<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										</span>
										<span class="text-white/90">{feature}</span>
									</li>
								{/each}
							</ul>
							<a
								href="/#intake-form"
								class="cta-button btn-animate group inline-flex w-full items-center justify-center gap-3 rounded-full py-3 pr-3 pl-6 text-lg font-medium text-white shadow-lg"
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
</section>

<style>
	.pricing-gradient {
		background: 
			/* Radial glow at center */
			radial-gradient(
				ellipse 60% 40% at 50% 50%,
				rgba(116, 51, 255, 0.2) 0%,
				rgba(51, 79, 255, 0.1) 40%,
				transparent 70%
			),
			/* Dark base gradient */
				linear-gradient(109deg, #0a0f2a 0%, #0d0a1f 30%, #150d2a 60%, #1a1035 100%);
	}

	.pricing-heading {
		font-family: 'Poppins', sans-serif;
	}

	.pricing-card {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(255, 255, 255, 0.02) 100%
		);
	}

	.popular-badge {
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
	}

	.cta-button {
		background: linear-gradient(109deg, #334fff 13.24%, #7433ff 92.35%);
	}

	.cta-button:hover {
		background: linear-gradient(109deg, #4560ff 13.24%, #8344ff 92.35%);
	}
</style>

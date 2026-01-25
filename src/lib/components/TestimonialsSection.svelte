<!-- TestimonialsSection.svelte -->
<script lang="ts">
	type Testimonial = {
		quote: string;
		author: string;
		title: string;
		company: string;
	};

	export let testimonials: Testimonial[] = [
		{
			quote:
				'We were paying $15K/month across 8 different SaaS tools. Core Labs built us a unified platform for a fraction of the cost. Game changer.',
			author: 'Sarah Chen',
			title: 'CEO, TechFlow Solutions',
			company: 'TechFlow'
		},
		{
			quote:
				"Finally, software that works exactly how our business works. No more workarounds or 'that's not how the system works' conversations.",
			author: 'Marcus Rodriguez',
			title: 'Operations Director',
			company: 'LogiCore'
		},
		{
			quote:
				'The ROI was immediate. What used to take our team hours now takes minutes. Plus, we own the platform - no more vendor lock-in.',
			author: 'Jennifer Walsh',
			title: 'Founder',
			company: 'DataSync Pro'
		}
	];

	const getInitials = (name: string) =>
		name
			.split(' ')
			.map((n) => n[0])
			.join('');
</script>

<section id="testimonials" class="bg-secondary/20 py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<h2 class="text-foreground text-balance text-3xl font-bold tracking-tight sm:text-4xl">
				Trusted by forward-thinking businesses
			</h2>
			<p class="text-muted-foreground mt-4 text-pretty text-lg">
				See how companies are breaking free from expensive SaaS subscriptions
			</p>
		</div>

		<div class="mx-auto mt-16 max-w-7xl">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each testimonials as testimonial}
					<div class="bg-card border-border rounded-lg border shadow-sm">
						<div class="p-8">
							<blockquote class="text-card-foreground mb-6 text-lg leading-relaxed">
								"{testimonial.quote}"
							</blockquote>
							<div class="flex items-center">
								<div
									class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20"
								>
									<span class="text-lg font-semibold text-accent">
										{getInitials(testimonial.author)}
									</span>
								</div>
								<div>
									<div class="text-card-foreground font-semibold">{testimonial.author}</div>
									<div class="text-muted-foreground text-sm">{testimonial.title}</div>
									<div class="text-sm text-accent">{testimonial.company}</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* Tailwind handles all styling */
</style>

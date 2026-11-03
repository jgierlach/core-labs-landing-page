<script>
	const columns = [
		{
			heading: 'Services',
			links: [
				{ label: 'Websites', href: '/#intake-form' },
				{ label: 'Custom Software', href: '/#intake-form' },
				{ label: 'Free Website Redesign', href: '/website-redesign' }
			]
		},
		{
			heading: 'Company',
			links: [
				{ label: 'Our work', href: '/#recent-work' },
				// { label: 'Pricing', href: '/#pricing' }, // hidden while homepage #pricing is commented out
				{ label: 'Contact', href: '/contact' },
				{ label: 'Start a project', href: '/#intake-form' }
			]
		}
	];
</script>

<footer class="footer-glow relative overflow-hidden">
	<div class="container mx-auto px-4 pt-20 pb-10 sm:px-6 sm:pt-28 lg:px-8">
		<div class="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
			<div>
				<a href="/" class="inline-flex items-center gap-4 sm:gap-5" aria-label="Core Labs home">
					<span
						class="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-brand-blue to-brand-violet shadow-[0_10px_40px_-8px_rgba(116,51,255,0.6)] sm:h-24 sm:w-24 sm:rounded-[1.75rem]"
					>
						<span class="text-2xl font-bold tracking-tight text-white sm:text-4xl">CL</span>
					</span>
					<span
						class="font-heading text-5xl font-medium tracking-tight text-white sm:text-7xl lg:text-8xl"
						>Core Labs</span
					>
				</a>
				<p class="mt-6 max-w-md leading-relaxed text-white/60">
					Custom software and websites that replace expensive SaaS subscriptions and work the way
					your business works.
				</p>
			</div>

			<div class="grid grid-cols-2 gap-8">
				{#each columns as column}
					<div>
						<p class="flex gap-6 font-mono text-xs tracking-widest text-white/50 uppercase">
							<span aria-hidden="true">/</span>{column.heading}
						</p>
						<ul class="mt-6 space-y-1">
							{#each column.links as link}
								<li>
									<a
										href={link.href}
										class="inline-flex min-h-11 items-center text-white/80 transition-colors hover:text-white"
										>{link.label}</a
									>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<div
			class="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 font-mono text-xs tracking-widest text-white/50 uppercase sm:flex-row sm:items-center sm:justify-between"
		>
			<p>© {new Date().getFullYear()} Core Labs. All rights reserved.</p>
			<div class="flex flex-wrap gap-x-8 gap-y-2">
				<a href="/privacy-policy" class="transition-colors hover:text-white">Privacy Policy</a>
				<a href="/terms-of-service" class="transition-colors hover:text-white">Terms of Service</a>
			</div>
			<p>
				Proudly made by <a href="https://www.corelabs.digital/" class="text-white/70 transition-colors hover:text-white">Core Labs</a>
			</p>
		</div>
	</div>
</footer>

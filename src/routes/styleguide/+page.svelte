<script>
	import Header from '$lib/components/Header.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import FeaturesSection from '$lib/components/FeaturesSection.svelte';
	import TestimonialsSection from '$lib/components/TestimonialsSection.svelte';
	import PricingSection from '$lib/components/PricingSection.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import IntakeForm from '$lib/components/IntakeForm.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const componentNotes = [
		{
			path: 'src/lib/components/Navbar.svelte',
			note: 'Wrapped in a relative dark preview area because the component is absolutely positioned.'
		},
		{
			path: 'src/lib/components/Header.svelte',
			note: 'Wrapped in a relative dark preview area because the component is absolutely positioned.'
		},
		{ path: 'src/lib/components/HeroSection.svelte', note: 'Rendered with its default props.' },
		{ path: 'src/lib/components/FeaturesSection.svelte', note: 'Rendered with its default props.' },
		{ path: 'src/lib/components/TestimonialsSection.svelte', note: 'Rendered with its default props.' },
		{ path: 'src/lib/components/PricingSection.svelte', note: 'Rendered with its default props.' },
		{ path: 'src/lib/components/CtaSection.svelte', note: 'Rendered with its default props.' },
		{ path: 'src/lib/components/ContactSection.svelte', note: 'Rendered with its default state.' },
		{ path: 'src/lib/components/IntakeForm.svelte', note: 'Rendered with its default state.' },
		{ path: 'src/lib/components/Footer.svelte', note: 'Rendered with its default markup.' }
	];

	const colorTokens = [
		{ name: 'background', value: 'var(--background)', className: 'bg-background' },
		{ name: 'foreground', value: 'var(--foreground)', className: 'bg-foreground' },
		{ name: 'card', value: 'var(--card)', className: 'bg-card' },
		{ name: 'card-foreground', value: 'var(--card-foreground)', className: 'bg-card-foreground' },
		{ name: 'primary', value: 'var(--primary)', className: 'bg-primary' },
		{ name: 'primary-foreground', value: 'var(--primary-foreground)', className: 'bg-primary-foreground' },
		{ name: 'secondary', value: 'var(--secondary)', className: 'bg-secondary' },
		{ name: 'secondary-foreground', value: 'var(--secondary-foreground)', className: 'bg-secondary-foreground' },
		{ name: 'muted', value: 'var(--muted)', className: 'bg-muted' },
		{ name: 'muted-foreground', value: 'var(--muted-foreground)', className: 'bg-muted-foreground' },
		{ name: 'accent', value: 'var(--accent)', className: 'bg-accent' },
		{ name: 'accent-foreground', value: 'var(--accent-foreground)', className: 'bg-accent-foreground' },
		{ name: 'destructive', value: 'var(--destructive)', className: 'bg-destructive' },
		{ name: 'border', value: 'var(--border)', className: 'bg-border' },
		{ name: 'input', value: 'var(--input)', className: 'bg-input' },
		{ name: 'ring', value: 'var(--ring)', className: 'bg-ring' }
	];

	const hardCodedColors = [
		{ name: '#7433ff', className: 'bg-[#7433ff]' },
		{ name: '#334fff', className: 'bg-[#334fff]' },
		{ name: '#4560ff', className: 'bg-[#4560ff]' },
		{ name: '#8344ff', className: 'bg-[#8344ff]' },
		{ name: '#0a0f2a', className: 'bg-[#0a0f2a]' },
		{ name: '#0d0a1f', className: 'bg-[#0d0a1f]' },
		{ name: '#150d2a', className: 'bg-[#150d2a]' },
		{ name: '#1a1035', className: 'bg-[#1a1035]' },
		{ name: '#0a0a14', className: 'bg-[#0a0a14]' },
		{ name: '#f0ebff', className: 'bg-[#f0ebff]' },
		{ name: '#8f5cff', className: 'bg-[#8f5cff]' }
	];

	const typeSamples = [
		{
			label: 'Hero h1',
			classes: 'font-heading text-foreground text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl',
			tag: 'h1',
			text: 'An agentic operating system for your business'
		},
		{
			label: 'Contact page h1',
			classes: 'font-heading text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl',
			tag: 'h1',
			text: 'Get in touch'
		},
		{
			label: 'Section h2',
			classes: 'font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl',
			tag: 'h2',
			text: 'What happens after you send the form'
		},
		{
			label: 'Card h3',
			classes: 'font-heading text-xl font-semibold text-balance text-white md:text-2xl',
			tag: 'h3',
			text: 'Internal operations platforms'
		},
		{
			label: 'Large body',
			classes: 'mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-balance text-white/80 sm:text-2xl',
			tag: 'p',
			text: 'It lacks the context and secure access to the systems your company relies on.'
		},
		{
			label: 'Section body',
			classes: 'mt-4 text-lg text-pretty text-white/70',
			tag: 'p',
			text: 'Five steps. The fifth one never really ends.'
		},
		{
			label: 'Standard body',
			classes: 'text-base leading-relaxed text-pretty text-white/60',
			tag: 'p',
			text: 'A branded place for the people you serve to check status, upload documents, approve work, and pay.'
		},
		{
			label: 'Small eyebrow',
			classes: 'text-xs font-semibold tracking-[0.22em] text-white/40 uppercase',
			tag: 'p',
			text: 'How it works'
		},
		{
			label: 'Small muted text',
			classes: 'text-sm text-white/50',
			tag: 'p',
			text: 'Free consultation • No commitment • Response within 24 hours'
		}
	];

	const spacingSamples = [
		{ label: 'Hero section padding', classes: 'pt-32 pb-20 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40' },
		{ label: 'Standard section padding', classes: 'py-20 sm:py-32' },
		{ label: 'Contact methods section padding', classes: 'py-12' },
		{ label: 'Contact form section padding', classes: 'py-20 sm:py-28' },
		{ label: 'Main container', classes: 'container mx-auto px-4 sm:px-6 lg:px-8' },
		{ label: 'Narrow text container', classes: 'mx-auto max-w-2xl text-center' },
		{ label: 'Medium container', classes: 'mx-auto max-w-4xl text-center' },
		{ label: 'Form container', classes: 'mx-auto max-w-5xl' },
		{ label: 'Wide content container', classes: 'mx-auto max-w-7xl' },
		{ label: 'Section heading to content gap', classes: 'mt-14, mt-16' },
		{ label: 'Card grid gaps', classes: 'gap-6, gap-8, gap-12, lg:gap-16' }
	];

	const sampleClassText = (classes) => classes;
</script>

<svelte:head>
	<title>Style Guide</title>
	<meta name="description" content="Internal visual reference for the current website styles." />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="content-gradient relative pt-32 pb-20 sm:pt-40 sm:pb-24">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Internal reference</p>
			<h1 class="font-heading mt-4 text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
				Style Guide
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-pretty text-white/70">
				This page records the current site styles by rendering the real component files and the class patterns already in use.
			</p>
		</div>
	</div>
</section>

<section class="faq-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Reusable components</p>
			<h2 class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
				Component directory
			</h2>
			<p class="mt-4 text-lg text-pretty text-white/70">
				Every component in <code class="text-white">src/lib/components</code>, imported and rendered directly.
			</p>
		</div>
	</div>
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<article class="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
			<div class="border-b border-white/10 p-4 sm:p-6">
				<p class="font-mono text-sm text-white">{componentNotes[0].path}</p>
				<p class="mt-2 text-sm text-white/50">{componentNotes[0].note}</p>
			</div>
			<div class="relative h-24 overflow-hidden bg-[#0d0a1f]">
				<Navbar />
			</div>
		</article>
	</div>
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<article class="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
			<div class="border-b border-white/10 p-4 sm:p-6">
				<p class="font-mono text-sm text-white">{componentNotes[1].path}</p>
				<p class="mt-2 text-sm text-white/50">{componentNotes[1].note}</p>
			</div>
			<div class="relative h-24 overflow-hidden bg-[#0d0a1f]">
				<Header />
			</div>
		</article>
	</div>
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
			<p class="font-mono text-sm text-white">{componentNotes[2].path}</p>
			<p class="mt-2 text-sm text-white/50">{componentNotes[2].note}</p>
		</div>
	</div>
	<HeroSection />
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
			<p class="font-mono text-sm text-white">{componentNotes[3].path}</p>
			<p class="mt-2 text-sm text-white/50">{componentNotes[3].note}</p>
		</div>
	</div>
	<FeaturesSection />
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
			<p class="font-mono text-sm text-white">{componentNotes[4].path}</p>
			<p class="mt-2 text-sm text-white/50">{componentNotes[4].note}</p>
		</div>
	</div>
	<TestimonialsSection />
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
			<p class="font-mono text-sm text-white">{componentNotes[5].path}</p>
			<p class="mt-2 text-sm text-white/50">{componentNotes[5].note}</p>
		</div>
	</div>
	<PricingSection />
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
			<p class="font-mono text-sm text-white">{componentNotes[6].path}</p>
			<p class="mt-2 text-sm text-white/50">{componentNotes[6].note}</p>
		</div>
	</div>
	<CtaSection />
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
			<p class="font-mono text-sm text-white">{componentNotes[7].path}</p>
			<p class="mt-2 text-sm text-white/50">{componentNotes[7].note}</p>
		</div>
	</div>
	<ContactSection />
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
			<p class="font-mono text-sm text-white">{componentNotes[8].path}</p>
			<p class="mt-2 text-sm text-white/50">{componentNotes[8].note}</p>
		</div>
	</div>
	<IntakeForm />
</section>

<section class="content-gradient relative py-12">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
			<p class="font-mono text-sm text-white">{componentNotes[9].path}</p>
			<p class="mt-2 text-sm text-white/50">{componentNotes[9].note}</p>
		</div>
	</div>
	<Footer />
</section>

<section class="faq-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Type scale</p>
			<h2 class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
				Typography in use
			</h2>
			<div class="mt-12 space-y-8">
				{#each typeSamples as sample}
					<div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
						<div class="mb-4 border-b border-white/10 pb-4">
							<p class="text-sm font-medium text-white">{sample.label}</p>
							<p class="mt-1 break-words font-mono text-xs text-white/45">{sample.tag} · {sample.classes}</p>
						</div>
						{#if sample.tag === 'h1'}
							<div class={sampleClassText(sample.classes)}>{sample.text}</div>
						{:else if sample.tag === 'h2'}
							<h2 class={sampleClassText(sample.classes)}>{sample.text}</h2>
						{:else if sample.tag === 'h3'}
							<h3 class={sampleClassText(sample.classes)}>{sample.text}</h3>
						{:else}
							<p class={sampleClassText(sample.classes)}>{sample.text}</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="content-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Palette</p>
			<h2 class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
				Colour tokens and values
			</h2>
			<h3 class="font-heading mt-12 text-xl font-semibold text-white sm:text-2xl">CSS variable tokens</h3>
			<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each colorTokens as color}
					<div class="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
						<div class="h-24 {color.className}"></div>
						<div class="p-4">
							<p class="font-mono text-sm text-white">{color.name}</p>
							<p class="mt-1 font-mono text-xs text-white/45">{color.value}</p>
						</div>
					</div>
				{/each}
			</div>

			<h3 class="font-heading mt-12 text-xl font-semibold text-white sm:text-2xl">Hard-coded values found in current styles</h3>
			<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each hardCodedColors as color}
					<div class="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
						<div class="h-24 {color.className}"></div>
						<div class="p-4">
							<p class="font-mono text-sm text-white">{color.name}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="faq-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Buttons and links</p>
			<h2 class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
				Variants and states in use
			</h2>
			<div class="mt-12 grid gap-6 lg:grid-cols-2">
				<div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
					<p class="font-mono text-sm text-white">btn-gradient btn-animate</p>
					<a href="/#intake-form" class="btn-gradient btn-animate group mt-5 inline-flex items-center gap-3 rounded-full py-4 pr-4 pl-7 text-xl font-medium text-white shadow-lg">
						Get Started
						<span class="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20">↗</span>
					</a>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
					<p class="font-mono text-sm text-white">btn-secondary-animate outline</p>
					<a href="/contact" class="btn-secondary-animate group mt-5 inline-flex items-center gap-3 rounded-full border border-white/30 bg-transparent py-4 pr-4 pl-7 text-xl font-medium text-white shadow-sm hover:bg-white/10">
						Contact Us
						<span class="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white/10">↗</span>
					</a>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
					<p class="font-mono text-sm text-white">nav-cta-gradient small CTA</p>
					<a href="/#intake-form" class="nav-cta-gradient btn-animate group mt-5 inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-5 text-sm font-medium text-white shadow-lg">
						Get Started
						<span class="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20">↗</span>
					</a>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
					<p class="font-mono text-sm text-white">disabled submit button</p>
					<button type="button" disabled class="btn-gradient btn-animate group mt-5 inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-6 text-base font-medium text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60">
						Send
						<span class="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20">↗</span>
					</button>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
					<p class="font-mono text-sm text-white">link-animate text-accent</p>
					<a href="mailto:hello@example.com" class="text-accent hover:text-accent/80 link-animate mt-5 inline-block font-medium transition-colors">hello@example.com</a>
				</div>
				<div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
					<p class="font-mono text-sm text-white">nav-link active/inactive</p>
					<div class="mt-5 flex flex-wrap gap-4">
						<a href="/" class="nav-link active px-3 py-2 text-sm font-medium text-white transition-colors hover:text-white">Home</a>
						<a href="/contact" class="nav-link px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white">Contact</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="content-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Form controls</p>
			<h2 class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
				Controls in use
			</h2>
			<div class="mt-12 grid gap-8 lg:grid-cols-2">
				<form class="glass-card rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div>
							<label for="styleguide-name" class="mb-2 block text-sm font-medium text-white">Full name</label>
							<input id="styleguide-name" type="text" class="input-animate w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition outline-none placeholder:text-white/40 focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]" placeholder="Jane Doe" />
						</div>
						<div>
							<label for="styleguide-email" class="mb-2 block text-sm font-medium text-white">Email</label>
							<input id="styleguide-email" type="email" class="input-animate w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition outline-none placeholder:text-white/40 focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]" placeholder="you@company.com" />
						</div>
						<div class="sm:col-span-2">
							<label for="styleguide-message" class="mb-2 block text-sm font-medium text-white">How can we help?</label>
							<textarea id="styleguide-message" rows="5" class="input-animate w-full resize-y rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white transition outline-none placeholder:text-white/40 focus:border-[#7433ff] focus:ring-1 focus:ring-[#7433ff]" placeholder="Tell us about your project, goals, and timeline..."></textarea>
						</div>
					</div>
				</form>

				<form class="intake-form-shadow rounded-2xl bg-white p-8 sm:p-12">
					<div class="mb-8 flex flex-wrap items-center gap-2 text-xl font-medium text-gray-800 sm:text-2xl">
						<span class="shrink-0">Hi! My name is</span>
						<label for="styleguide-inline-name" class="sr-only">Full name</label>
						<input id="styleguide-inline-name" type="text" placeholder="Type your full name" class="inline-input min-w-44 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400" />
					</div>
					<div class="mb-8 flex flex-wrap items-center gap-3 text-xl font-medium text-gray-800 sm:text-2xl">
						<span>I found Core Labs using</span>
						<button type="button" class="pill-button rounded-full border-2 border-[#7433ff] bg-[#f0ebff] px-4 py-2 text-base font-medium text-[#7433ff] transition-all">Google search</button>
						<button type="button" class="pill-button rounded-full border-2 border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-600 transition-all hover:border-gray-400">Word of mouth</button>
					</div>
					<div class="flex flex-wrap items-center gap-6 border-t border-gray-200 pt-6">
						<label for="styleguide-range" class="text-sm text-gray-600">Range input</label>
						<input id="styleguide-range" type="range" min="1" max="50" value="12" class="accent-[#7433ff]" />
					</div>
				</form>
			</div>
		</div>
	</div>
</section>

<section class="faq-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Spacing rhythm</p>
			<h2 class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
				Section padding and containers
			</h2>
			<div class="mt-12 grid gap-4 md:grid-cols-2">
				{#each spacingSamples as sample}
					<div class="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
						<p class="text-sm font-medium text-white">{sample.label}</p>
						<p class="mt-2 break-words font-mono text-xs text-white/45">{sample.classes}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

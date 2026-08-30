<script>
	import { onMount } from 'svelte';
	import { scrollReveal, pageLoad } from '$lib/actions/scrollReveal.js';

	// ===== Features Data =====
	// Commented out alongside the features section markup below.
	/*
	let features = $state([
		{
			title: 'Unified Platform',
			description: 'Replace multiple SaaS subscriptions with one comprehensive custom solution that handles all your business needs under one roof.',
			icon: '🏗️'
		},
		{
			title: '100% Custom Built',
			description: 'Every feature is built specifically for your business processes. No more settling for 60% functionality from off-the-shelf solutions.',
			icon: '⚡'
		},
		{
			title: 'Massive Cost Savings',
			description: 'Eliminate expensive monthly subscriptions. Our custom solutions typically cost 40% less than multiple vendor subscriptions.',
			icon: '💰'
		},
		{
			title: 'Evolves With You',
			description: 'Unlike static SaaS products, your custom platform grows and adapts as your business needs change over time.',
			icon: '🚀'
		}
	]);
	*/

	// ===== Stats Data =====
	let stats = $state([
		{ value: '40%', label: 'Cost Savings' },
		{ value: '100%', label: 'Custom Fit' },
		{ value: '24/7', label: 'Support' },
		{ value: '∞', label: 'Scalability' }
	]);

	// ===== Pricing Data =====
	let plans = $state([
		{
			name: 'Core Labs Platform',
			price: 'Priced to your business',
			description: 'One subscription for a platform that is built around you and keeps changing',
			features: [
				'A platform built for your business, not the market average',
				'Secure connections into the systems you already use',
				'Continued development — new features are included, not quoted',
				'Data migration from the tools you are replacing',
				'Hosting, maintenance, and monitoring',
				'Mobile and web',
				'Training and documentation',
				'Priority support'
			],
			cta: 'Book a call',
			popular: true
		}
	]);

	// Literal class strings so Tailwind's scanner generates these rotations.
	const ORBIT_PLACE = [
		'rotate-[0deg]',
		'rotate-[72deg]',
		'rotate-[144deg]',
		'rotate-[216deg]',
		'rotate-[288deg]'
	];
	const ORBIT_UNPLACE = [
		'rotate-[0deg]',
		'rotate-[-72deg]',
		'rotate-[-144deg]',
		'rotate-[-216deg]',
		'rotate-[-288deg]'
	];

	// ===== Why AI stalls: the systems Sven connects to =====
	let integrations = $state([
		{ name: 'QuickBooks', file: 'quickbooks.svg', role: 'Books and revenue' },
		{ name: 'Shopify', file: 'shopify.svg', role: 'Orders and catalog' },
		{ name: 'HubSpot', file: 'hubspot.svg', role: 'Pipeline and contacts' },
		{ name: 'Dropbox', file: 'dropbox.svg', role: 'Documents' },
		{ name: 'Meta', file: 'meta.svg', role: 'Ads and audiences' }
	]);

	// ===== Sven in action =====
	// Illustrative conversations. Figures are examples of the shape of an answer,
	// not results from a real account.
	let conversations = $state([
		{
			id: 'context',
			eyebrow: 'Context, not guesswork',
			title: 'It answers from your actual numbers',
			ask: 'How many unique visitors did we get to our website, and how would you gauge the success of our new Meta ads campaign?',
			reply:
				'4,812 unique visitors last week, up 18%. The Meta campaign brought 1,240 of them at $2.14 a click. Eleven converted, and Shopify puts their average order at $94 — so the campaign is close to break-even. The creative you launched on the 14th is converting four times better than the rest. I would move the budget onto it.'
		},
		{
			id: 'proactive',
			eyebrow: 'Proactive instead of reactive',
			title: 'It does the work before you ask twice',
			ask: 'Using all the knowledge you have of our business, can you generate a research report for me to review every week of new growth ideas?',
			reply:
				'Set. Every Monday at 7am I will pull revenue from QuickBooks, your catalog from Shopify, and pipeline from HubSpot, then send five ideas with the numbers behind each one. The first lands tomorrow. Do you want it as a doc in Dropbox or in your inbox?'
		},
		{
			id: 'learning',
			eyebrow: 'Self improving by design',
			title: 'It remembers how you like to work',
			ask: 'I liked the way you created that report. Can you make a note of it for next time?',
			reply:
				'Noted. From now on I will lead with the numbers, then the reasoning, then a single recommendation. I have saved that to your preferences and will use it for the weekly report and anything like it.'
		}
	]);

	// ===== What can Sven do today =====
	let capabilities = $state([
		{ label: 'Build a website', maps: 'Website' },
		{ label: 'Build custom software', maps: 'Custom Software' },
		{ label: 'Do your books', maps: 'Other' }
	]);

	let svenPrompt = $state('');

	function goToIntakeForm() {
		document.getElementById('intake-form')?.scrollIntoView({ behavior: 'smooth' });
	}

	function askSven(capability) {
		helpWith = capability.maps;
		goToIntakeForm();
	}

	// Carries whatever was typed here into the form's project-details field.
	function sendPromptToForm() {
		const prompt = svenPrompt.trim();
		if (!prompt) return;
		projectDetails = prompt;
		helpWith = helpWith || 'Other';
		goToIntakeForm();
		document.getElementById('intake-message')?.focus({ preventScroll: true });
	}

	// ===== What Sven built recently =====
	// TODO: swap `image` in for a real screenshot once one exists for each build.
	let recentBuilds = $state([
		{
			title: 'Crypto tax-loss harvesting platform',
			tag: 'Fintech',
			description:
				'Tracks positions across exchanges, finds harvestable losses before year end, and produces the filings an accountant can actually use.'
		},
		{
			title: 'Warehouse management platform',
			tag: 'Operations',
			description:
				'Receiving, putaway, picking, and cycle counts on one screen, wired to the systems that already hold the inventory.'
		},
		{
			title: 'Mission trip registration platform',
			tag: 'Nonprofit',
			description:
				'Applications, background checks, payments, and travel documents for hundreds of participants, without a spreadsheet in sight.'
		},
		{
			title: 'Recruiting platform',
			tag: 'Hiring',
			description:
				'Sourcing, screening, and scheduling in one pipeline, tuned to how this team hires rather than how a job board assumes they do.'
		},
		{
			title: 'And a lot of websites',
			tag: 'Web',
			description:
				'Fast, accessible marketing sites that rank and convert, with the application behind them when the site has to do more than describe the business.'
		}
	]);

	let railElement = $state(null);
	let railIndex = $state(0);

	// A snapping container cancels animated programmatic scrolls, so the arrows set the
	// position directly. Landing on the exact card offset means the snap agrees with it,
	// and touch swiping keeps native momentum and snapping untouched.
	function scrollRail(direction) {
		if (!railElement) return;
		const cards = railElement.querySelectorAll('[data-rail-card]');
		if (!cards.length) return;
		railIndex = Math.min(Math.max(railIndex + direction, 0), cards.length - 1);
		railElement.scrollLeft = cards[railIndex].offsetLeft - cards[0].offsetLeft;
	}

	// ===== What We Build =====
	let disciplines = $state([
		{
			name: 'Internal operations platforms',
			description:
				'The system your team lives in all day — orders, inventory, scheduling, approvals — built around how you actually work instead of how a vendor assumed you would.'
		},
		{
			name: 'Client and customer portals',
			description:
				'A branded place for the people you serve to check status, upload documents, approve work, and pay, without emailing your team for an update.'
		},
		{
			name: 'Integrations and data pipelines',
			description:
				'Your existing tools, connected properly. No more exporting a CSV out of one system every Monday to paste into another.'
		},
		{
			name: 'Marketing sites and web apps',
			description:
				'Fast, accessible sites that rank and convert — and the application behind them when the site needs to do more than describe the business.'
		}
	]);

	// ===== SaaS Teardown =====
	// Illustrative list rates the visitor adjusts; nothing here is presented as a client figure.
	let seats = $state(12);
	let stack = $state([
		{ name: 'CRM', unit: 'per seat', rate: 62, perSeat: true, on: true },
		{ name: 'Project management', unit: 'per seat', rate: 19, perSeat: true, on: true },
		{ name: 'Support desk', unit: 'per seat', rate: 65, perSeat: true, on: true },
		{ name: 'Reporting and BI', unit: 'per seat', rate: 70, perSeat: true, on: true },
		{ name: 'File storage and docs', unit: 'per seat', rate: 18, perSeat: true, on: true },
		{ name: 'Billing and invoicing', unit: 'flat rate', rate: 299, perSeat: false, on: true },
		{ name: 'Integration middleware', unit: 'flat rate', rate: 199, perSeat: false, on: true }
	]);

	const lineTotal = (tool) => (tool.perSeat ? tool.rate * seats : tool.rate);
	const money = (value) => value.toLocaleString('en-US');

	let stackMonthly = $derived(
		stack.reduce((sum, tool) => (tool.on ? sum + lineTotal(tool) : sum), 0)
	);
	let stackYearly = $derived(stackMonthly * 12);
	let activeCount = $derived(stack.filter((tool) => tool.on).length);

	function toggleTool(index) {
		stack[index].on = !stack[index].on;
	}

	// ===== Process =====
	let phases = $state([
		{
			title: 'Discovery',
			body: "We map your current stack — every tool, every seat, and the workflows that don't fit. You get the real number you're spending before we quote anything."
		},
		{
			title: 'Scope and plan',
			body: 'You get a written plan of what Sven builds first, what it connects to, and what it costs to run. You decide whether to start.'
		},
		{
			title: 'Build',
			body: 'Two-week increments. At the end of each one you get working software to click through, not a status report.'
		},
		{
			title: 'Launch and migration',
			body: "We move your data across and run the old tools alongside the new platform until you're confident enough to cancel them."
		},
		{
			title: 'It keeps evolving',
			body: 'Launch is the start, not the finish. Sven keeps building — new features, new workflows, new connections — as the business changes. That is what the subscription is for.'
		}
	]);

	let spineElement = $state(null);
	let spineDrawn = $state(false);

	// ===== FAQ =====
	// Answers are mirrored verbatim into FAQPage JSON-LD below — edit both together.
	let faqs = $state([
		{
			question: 'How long does a build take?',
			answer:
				'Most platforms reach launch in three to six months, depending on how many workflows they replace. You see working software every two weeks from the start, so you are never waiting months to find out what was built.'
		},
		{
			question: 'How is this different from the SaaS we already pay for?',
			answer:
				'Every SaaS product is built for the average of its market, so you bend your process to fit it. Sven is built around your process and keeps changing as you do. It is a subscription like theirs, to a product that is only yours.'
		},
		{
			question: 'What happens to the data in our current tools?',
			answer:
				'We migrate it. Before launch we move your records across and run the old tools in parallel until you are confident the new platform is correct, then you cancel the subscriptions.'
		},
		{
			question: 'What if our needs change after launch?',
			answer:
				'That is the whole point. Tell Sven what changed and it builds the change. Nothing about your platform is fixed at launch, and you are not filing a feature request with a vendor who may never build it.'
		},
		{
			question: 'What does the subscription include?',
			answer:
				'The platform itself, the connections into your existing systems, hosting and maintenance, and continued development. New features are part of the subscription rather than a separate project every time something changes.'
		},
	]);

	const faqJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: { '@type': 'Answer', text: faq.answer }
		}))
	};

	// Svelte renders <script> contents as raw text, so structured data has to be
	// injected as a string. The closing tag is split so it cannot terminate this block.
	const faqJsonLdTag =
		'<script type="application/ld+json">' + JSON.stringify(faqJsonLd) + '<' + '/script>';

	const CONTACT_FORM_SLUG = 'contact-c54421';
	const CONTACT_FORM_URL = 'https://api.corelabs.digital/api/forms/contact-c54421/submit';
	const HCAPTCHA_SITEKEY = '9f64291e-4d3a-4ae8-b4ee-5692268481b2';

	// ===== Intake Form State =====
	let fullName = $state('');
	let companyName = $state('');
	let email = $state('');
	let phone = $state('');
	let projectDetails = $state('');
	let foundUsVia = $state('');
	let helpWith = $state('');
	let utmSource = $state('');
	let selectedCountry = $state({ code: '+1', flag: '🇺🇸', name: 'United States' });
	let showCountryDropdown = $state(false);
	let formElement = $state(null);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let hcaptchaWidgetId = $state(null);
	let hcaptchaContainer = $state(null);

	let countries = $state([
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
	]);

	let foundUsOptions = $state(['Google search', 'Word of mouth', 'Ad', 'Other']);
	let helpWithOptions = $state(['Website', 'Custom Software', 'Other']);

	function loadHcaptcha() {
		if (typeof window === 'undefined') return;

		if (!window._hcaptchaLoader) {
			window._hcaptchaLoader = new Promise((resolve) => {
				window._hcaptchaOnLoad = () => resolve(window.hcaptcha);
				const script = document.createElement('script');
				script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=_hcaptchaOnLoad';
				script.async = true;
				document.head.append(script);
			});
		}

		window._hcaptchaLoader.then((hcaptcha) => {
			if (hcaptchaWidgetId === null && hcaptchaContainer) {
				hcaptchaWidgetId = hcaptcha.render(hcaptchaContainer, { sitekey: HCAPTCHA_SITEKEY });
			}
		});
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		utmSource = params.get('utm_source') || '';

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					observer.disconnect();
					loadHcaptcha();
				}
			},
			{ rootMargin: '300px', threshold: 0 }
		);

		if (formElement) observer.observe(formElement);
		formElement?.addEventListener('focusin', loadHcaptcha, { once: true });

		// Draw the process spine once the timeline scrolls into view.
		const spineObserver = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					spineDrawn = true;
					spineObserver.disconnect();
				}
			},
			{ threshold: 0.1 }
		);

		if (spineElement) spineObserver.observe(spineElement);

		return () => {
			observer.disconnect();
			spineObserver.disconnect();
		};
	});

	function selectCountry(country) {
		selectedCountry = country;
		showCountryDropdown = false;
	}

	function validateForm() {
		if (!fullName.trim()) return 'Please enter your name.';
		if (!foundUsVia) return 'Please select how you found us.';
		if (!helpWith) return 'Please select what you need help with.';
		if (!email.trim()) return 'Please enter your email.';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return 'Please enter a valid email address.';
		if (!projectDetails.trim()) return 'Please provide project details.';
		return '';
	}

	async function handleSubmit(event) {
		event.preventDefault();
		errorMessage = '';
		const validation = validateForm();
		if (validation) {
			errorMessage = validation;
			return;
		}

		const hcaptchaResponse =
			hcaptchaWidgetId === null ? '' : window.hcaptcha?.getResponse(hcaptchaWidgetId) || '';
		if (!hcaptchaResponse) {
			errorMessage = 'Please complete the CAPTCHA.';
			return;
		}

		isSubmitting = true;
		const data = new FormData(formElement);
		data.set('h-captcha-response', hcaptchaResponse);

		try {
			const response = await fetch(CONTACT_FORM_URL, {
				method: 'POST',
				body: new URLSearchParams(data)
			});
			const body = await response.json().catch(() => ({}));

			if (!response.ok) {
				errorMessage =
					body?.details?.map((detail) => detail.message).join(' ') ||
					body?.error ||
					'Something went wrong. Please try again.';
				isSubmitting = false;
				window.hcaptcha?.reset(hcaptchaWidgetId);
				return;
			}

			window.location.assign(
				`https://www.corelabs.digital/f/${CONTACT_FORM_SLUG}/success?sid=${body.submission_id}`
			);
		} catch {
			errorMessage = 'Something went wrong. Please try again.';
			isSubmitting = false;
			window.hcaptcha?.reset(hcaptchaWidgetId);
		}
	}

	function handleClickOutside() {
		if (showCountryDropdown) {
			showCountryDropdown = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<svelte:head>
	<title>Core Labs - Custom Software Solutions</title>
	<meta
		name="description"
		content="Replace expensive SaaS subscriptions with custom software built specifically for your business. Reduce costs by 70% with unified solutions."
	/>
	<link rel="canonical" href="https://www.corelabs.digital/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Core Labs" />
	<meta property="og:title" content="Core Labs - Custom Software Solutions" />
	<meta property="og:description" content="Replace expensive SaaS subscriptions with custom software built specifically for your business. Reduce costs by 70% with unified solutions." />
	<meta property="og:url" content="https://www.corelabs.digital/" />
	<meta property="og:image" content="https://www.corelabs.digital/logos/core-labs-full-logo.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Core Labs - Custom Software Solutions" />
	<meta name="twitter:description" content="Replace expensive SaaS subscriptions with custom software built specifically for your business. Reduce costs by 70% with unified solutions." />
	<meta name="twitter:image" content="https://www.corelabs.digital/logos/core-labs-full-logo.png" />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- built above from local literals, no user input -->
	{@html faqJsonLdTag}
</svelte:head>

<!-- section:hero {"type":"hero","id":"hero-1"} -->
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
				class="font-heading text-foreground text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
				use:pageLoad={{ delay: 100 }}
			>
				An agentic operating system for your <span class="text-accent">business</span>
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
					class="btn-gradient btn-animate group inline-flex items-center gap-3 rounded-full py-4 pr-4 pl-7 text-xl font-medium text-white shadow-lg"
				>
					Get Started
					<span
						class="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
						</svg>
					</span>
				</a>
				<a
					href="/contact"
					class="btn-secondary-animate group inline-flex items-center gap-3 rounded-full border border-white/30 bg-transparent py-4 pr-4 pl-7 text-xl font-medium text-white shadow-sm hover:bg-white/10"
				>
					Contact Us
					<span
						class="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white/10"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
						</svg>
					</span>
				</a>
			</div>

			<div
				class="mt-20 grid grid-cols-2 gap-10 md:grid-cols-4"
				use:pageLoad={{ delay: 400, stagger: true, staggerDelay: 100 }}
			>
				{#each stats as stat}
					<div class="text-center">
						<div class="text-foreground text-4xl font-bold">{stat.value}</div>
						<div class="text-muted-foreground text-base">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
<!-- /section:hero -->
<!-- The problem: AI without context -->
<section id="why-ai-stalls" class="hero-section-bg relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center" use:scrollReveal>
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">The problem</p>
			<h2
				class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				Why isn't AI improving your business?
			</h2>
			<p
				class="font-heading mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-balance text-white/80 sm:text-2xl"
			>
				It lacks the context and secure access to the systems your company relies on.
			</p>
		</div>

		<!-- Chat models sit outside everything that matters. Shown, not asserted. -->
		<div class="mx-auto mt-16 max-w-3xl" use:scrollReveal={{ delay: 120 }}>
			<div class="flex flex-wrap items-center justify-center gap-3">
				{#each integrations as integration}
					<span
						class="inline-flex items-center gap-2 rounded-full border border-dashed border-white/20 px-4 py-2 text-sm text-white/60"
					>
						<img
							src="/logos/integrations/{integration.file}"
							alt=""
							width="20"
							height="20"
							loading="lazy"
							decoding="async"
							class="h-5 w-5"
						/>
						{integration.name}
					</span>
				{/each}
			</div>
			<p class="mt-8 text-center text-base text-pretty text-white/50">
				A general chat model can write you a paragraph about your industry. It cannot see last
				week's orders, your ad spend, or what your accountant filed — so it guesses, and you check
				its work.
			</p>
		</div>
	</div>
</section>

<!-- The fix: secure connections into the systems that hold the context -->
<section id="connect" class="faq-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">The fix</p>
			<h2
				class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				Securely connect context to our system
			</h2>
			<p class="mt-4 text-lg text-pretty text-white/70">
				Sven reads from the tools your business already runs on, with scoped access you grant and
				can revoke.
			</p>
		</div>

		<div class="mx-auto mt-16 max-w-xl" use:scrollReveal={{ delay: 100 }}>
			<div class="relative mx-auto aspect-square w-full max-w-[30rem]">
				<!-- orbit tracks -->
				<div
					class="absolute inset-[18%] rounded-full border border-white/[0.08]"
					aria-hidden="true"
				></div>
				<div
					class="absolute inset-[30%] rounded-full border border-white/[0.06]"
					aria-hidden="true"
				></div>

				<!-- Core Labs at the centre -->
				<div class="absolute inset-0 z-10 flex items-center justify-center">
					<!-- Same mark as the navbar, scaled up. -->
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#334fff] to-[#7433ff] shadow-lg sm:h-20 sm:w-20 sm:rounded-[1.4rem]"
					>
						<span
							class="text-2xl font-bold tracking-tight text-white sm:text-3xl"
							aria-hidden="true">CL</span
						>
						<span class="sr-only">Core Labs</span>
					</div>
				</div>

				<!-- orbiting systems -->
				<div class="orbit-ring absolute inset-[18%]">
					{#each integrations as integration, index}
						<div class="absolute inset-0 {ORBIT_PLACE[index]}">
							<div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
								<div class={ORBIT_UNPLACE[index]}>
									<div class="orbit-counter">
										<span
											class="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-white/10 bg-[#0d0a1f] shadow-lg sm:h-20 sm:w-20"
										>
											<img
												src="/logos/integrations/{integration.file}"
												alt={integration.name}
												width="44"
												height="44"
												loading="lazy"
												decoding="async"
												class="h-10 w-10 sm:h-11 sm:w-11"
											/>
										</span>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- The orbit is decorative; this list is what a screen reader and a crawler get. -->
			<ul class="mt-12 grid gap-x-8 gap-y-3 sm:grid-cols-2">
				{#each integrations as integration}
					<li class="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
						<span class="text-sm font-medium text-white/80">{integration.name}</span>
						<span class="text-xs text-white/40">{integration.role}</span>
					</li>
				{/each}
			</ul>
			<p class="mt-6 text-center text-xs text-white/35">
				Connections are read-scoped by default and revocable from your side at any time.
			</p>
		</div>
	</div>
</section>

<!-- Sven in action -->
<section id="sven" class="hero-section-bg relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Sven in action</p>
			<h2
				class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				What that changes, in practice
			</h2>
		</div>

		<div class="mx-auto mt-16 max-w-5xl space-y-16 sm:space-y-24">
			{#each conversations as conversation}
				<div class="grid gap-8 md:grid-cols-12 md:gap-12" use:scrollReveal={{ delay: 60 }}>
					<div class="md:col-span-4">
						<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">
							{conversation.eyebrow}
						</p>
						<h3
							class="font-heading mt-3 text-2xl font-semibold text-balance text-white sm:text-3xl"
						>
							{conversation.title}
						</h3>
					</div>

					<div class="md:col-span-8">
						<div
							class="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
						>
							<div class="flex items-center gap-2 border-b border-white/10 px-5 py-3">
								<span class="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden="true"></span>
								<span class="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden="true"></span>
								<span class="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden="true"></span>
								<span class="ml-2 text-xs tracking-wide text-white/35">Sven</span>
							</div>

							<div class="space-y-5 p-5 sm:p-7">
								<!-- what you ask -->
								<div class="flex justify-end">
									<p
										class="max-w-[85%] rounded-2xl rounded-br-sm bg-white/10 px-4 py-3 text-sm text-pretty text-white/90 sm:text-base"
									>
										{conversation.ask}
									</p>
								</div>

								<!-- what comes back -->
								<div class="flex items-start gap-3">
									<span
										class="btn-gradient mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
										aria-hidden="true">S</span
									>
									<p
										class="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-pretty text-white/75 sm:text-base"
									>
										{conversation.reply}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<p class="mx-auto mt-14 max-w-2xl text-center text-xs text-white/35">
			Illustrative conversations. Figures show the shape of an answer, not results from a real
			account.
		</p>
	</div>
</section>

<!-- What can Sven do today -->
<section id="ask-sven" class="faq-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-3xl" use:scrollReveal>
			<div class="text-center">
				<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Get started</p>
				<h2
					class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
				>
					What can Sven do for you today?
				</h2>
			</div>

			<!-- Composer-styled entry point: pick one and it carries through to the form. -->
			<div
				class="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-7"
			>
				<div class="flex flex-wrap justify-center gap-3 sm:flex-nowrap">
					{#each capabilities as capability}
						<button
							type="button"
							onclick={() => askSven(capability)}
							class="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/80 transition-colors duration-200 hover:border-white/35 hover:bg-white/10 hover:text-white sm:text-base"
						>
							{capability.label}
						</button>
					{/each}
				</div>

				<form
					onsubmit={(event) => {
						event.preventDefault();
						sendPromptToForm();
					}}
					class="mt-6 flex items-center gap-3 rounded-full border border-white/10 bg-[#0d0a1f] py-2 pr-2 pl-5 focus-within:border-white/25"
				>
					<label for="sven-prompt" class="sr-only">Tell Sven what you need</label>
					<input
						id="sven-prompt"
						type="text"
						bind:value={svenPrompt}
						placeholder="…or tell Sven what you need"
						class="min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-sm text-white placeholder:text-white/35 focus:ring-0 focus:outline-none sm:text-base"
					/>
					<button
						type="submit"
						disabled={!svenPrompt.trim()}
						class="btn-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
						aria-label="Send this to the project form"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
						</svg>
					</button>
				</form>
			</div>
		</div>
	</div>
</section>

<!-- What Sven built recently -->
<section id="recent-work" class="hero-section-bg relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-wrap items-end justify-between gap-6" use:scrollReveal>
			<div class="max-w-2xl">
				<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Recent work</p>
				<h2
					class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
				>
					What Sven built recently
				</h2>
			</div>

			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => scrollRail(-1)}
					aria-label="Show previous projects"
					class="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5M11 18l-6-6 6-6" />
					</svg>
				</button>
				<button
					type="button"
					onclick={() => scrollRail(1)}
					aria-label="Show next projects"
					class="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Native scroll-snap rail: drags, swipes, and arrow-keys without hijacking the page scroll. -->
	<div class="container mx-auto mt-14 px-4 sm:px-6 lg:px-8">
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- A scrollable region has to be focusable, or keyboard users cannot scroll it. -->
		<div
			bind:this={railElement}
			class="rail-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
			tabindex="0"
			role="region"
			aria-label="Recent projects, scrollable"
		>
			{#each recentBuilds as build}
				<article data-rail-card class="group w-[19rem] shrink-0 snap-start sm:w-[23rem]">
				<!-- Placeholder canvas: swap for a real screenshot when there is one. -->
				<div
					class="glass-card relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl border border-white/10 p-6"
				>
					<div
						class="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#334fff]/25 via-transparent to-[#7433ff]/25"
						aria-hidden="true"
					></div>
					<span
						class="font-heading relative text-5xl font-bold text-white/10 tabular-nums select-none"
						aria-hidden="true"
					>
						{build.tag}
					</span>
				</div>

				<div class="mt-5">
					<h3 class="font-heading text-xl font-semibold text-balance text-white">
						{build.title}
					</h3>
					<p class="mt-2 text-sm leading-relaxed text-pretty text-white/60">
						{build.description}
					</p>
				</div>
				</article>
			{/each}
		</div>
	</div>
</section>


<!-- Features section commented out at the client's request.
     Re-enable together with the `features` array in the script block above. -->
<!--
<section id="features" class="features-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<h2 class="font-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
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
						class="glass-card card-animate group relative rounded-2xl border border-white/10 p-6 backdrop-blur-sm hover:border-white/20 hover:bg-white/10"
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
-->
<!-- What we build -->
<section id="what-we-build" class="faq-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<div class="max-w-2xl" use:scrollReveal>
				<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">What we build</p>
				<h2
					class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
				>
					Four examples
				</h2>
				<p class="mt-4 text-lg text-pretty text-white/70">
					These are things businesses have asked Sven for. The list is not the limit — it is four
					points on a range that has no edges.
				</p>
			</div>

			<div class="mt-14 border-t border-white/10" use:scrollReveal={{ stagger: true, staggerDelay: 90 }}>
				{#each disciplines as discipline}
					<div
						class="group grid gap-3 border-b border-white/10 py-8 transition-colors duration-300 hover:bg-white/[0.03] md:grid-cols-12 md:gap-8 md:py-10"
					>
						<h3
							class="font-heading text-xl font-semibold text-balance text-white md:col-span-5 md:text-2xl"
						>
							{discipline.name}
						</h3>
						<p class="text-base leading-relaxed text-pretty text-white/60 md:col-span-7">
							{discipline.description}
						</p>
					</div>
				{/each}
			</div>

			<p class="mt-8 text-base text-white/50" use:scrollReveal>
				…and whatever else your business actually runs on. If it is not on this list, that is the
				point — describe it and Sven builds it.
			</p>
		</div>
	</div>
</section>

<!-- SaaS teardown: the stack you already pay for, priced out -->
<section id="teardown" class="hero-section-bg relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">The math</p>
			<h2
				class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				You are already paying for this
			</h2>
			<p class="mt-4 text-lg text-pretty text-white/70">
				Set it to match your stack. Then count how many of those vendors will create a custom solution for your business
				this year.
			</p>
		</div>

		<div class="mx-auto mt-14 max-w-3xl" use:scrollReveal={{ delay: 100 }}>
			<div class="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
				<!-- Ledger header + seat control -->
				<div
					class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8"
				>
					<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">
						Your current stack
					</p>
					<div class="flex items-center gap-3">
						<label for="seat-count" class="text-sm whitespace-nowrap text-white/50">Team size</label>
						<span class="relative flex h-11 w-32 items-center sm:w-40">
							<span
								class="pointer-events-none absolute inset-x-0 h-1 rounded-full bg-white/15"
								aria-hidden="true"
							></span>
							<input
								id="seat-count"
								type="range"
								min="1"
								max="50"
								bind:value={seats}
								class="relative h-11 w-full cursor-pointer appearance-none bg-transparent accent-[#7433ff]"
							/>
						</span>
						<span
							class="w-[4.5rem] text-sm font-medium whitespace-nowrap text-white tabular-nums"
							>{seats} {seats === 1 ? 'seat' : 'seats'}</span
						>
					</div>
				</div>

				<!-- Line items: deliberately drab. Toggle a row off if you don't pay for it. -->
				<ul class="divide-y divide-white/[0.07]">
					{#each stack as tool, index}
						<li>
							<button
								type="button"
								aria-pressed={tool.on}
								onclick={() => toggleTool(index)}
								class="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors duration-200 hover:bg-white/[0.04] sm:gap-4 sm:px-8"
							>
								<span
									class="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-200 {tool.on
										? 'border-white/40 bg-white/15'
										: 'border-white/15'}"
								>
									{#if tool.on}
										<svg
											class="h-3 w-3 text-white/80"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="3"
											aria-hidden="true"
										>
											<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									{/if}
								</span>
								<span
									class="min-w-0 flex-1 truncate text-sm transition-colors duration-200 sm:text-base {tool.on
										? 'text-white/70'
										: 'text-white/25 line-through'}"
								>
									{tool.name}
								</span>
								<span
									class="hidden w-20 shrink-0 text-right text-xs tracking-wide transition-colors duration-200 sm:block {tool.on
										? 'text-white/30'
										: 'text-white/15'}"
								>
									{tool.unit}
								</span>
								<span
									class="w-24 shrink-0 text-right text-sm font-medium tabular-nums transition-colors duration-200 sm:text-base {tool.on
										? 'text-white/80'
										: 'text-white/20'}"
								>
									${money(lineTotal(tool))}
								</span>
							</button>
						</li>
					{/each}
				</ul>

				<!-- Subtotal -->
				<div class="border-t border-white/10 px-5 py-6 sm:px-8">
					<div class="flex items-baseline justify-between gap-4">
						<span class="text-sm text-white/50"
							>{activeCount} {activeCount === 1 ? 'subscription' : 'subscriptions'}, every month</span
						>
						<span class="font-heading text-3xl font-bold text-white tabular-nums sm:text-4xl"
							>${money(stackMonthly)}</span
						>
					</div>
					<div class="mt-2 flex items-baseline justify-between gap-4">
						<span class="text-sm text-white/40">Over a year</span>
						<span class="text-lg font-medium text-white/60 tabular-nums">${money(stackYearly)}</span>
					</div>
				</div>

				<!-- The one bright row: everything above, consolidated -->
				<div class="btn-gradient px-5 py-6 sm:px-8">
					<div class="grid items-baseline gap-x-6 gap-y-3 sm:grid-cols-[1fr_auto]">
						<div>
							<p class="text-xs font-semibold tracking-[0.22em] text-white/70 uppercase">
								One Core Labs platform
							</p>
							<p class="font-heading mt-2 text-xl font-semibold text-white sm:text-2xl">
								Everything above, in one system that keeps changing.
							</p>
						</div>
						<div class="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
							<span class="font-heading text-2xl font-bold text-white sm:text-3xl"
								>Priced to your business</span
							>
							<p class="text-sm whitespace-nowrap text-white/70">one subscription</p>
						</div>
					</div>

					<div class="mt-5 border-t border-white/25 pt-5">
						<p class="text-base text-white sm:text-lg">
							{#if activeCount > 0}
								That is <span class="font-semibold tabular-nums">${money(stackMonthly)}</span> a month
								to {activeCount}
								{activeCount === 1 ? 'vendor' : 'vendors'}, none of whom will build you anything you
								ask for. Sven is one subscription that will.
							{:else}
								Turn on the tools you pay for to see what the stack actually costs.
							{/if}
						</p>
						<a
							href="/#intake-form"
							class="group mt-5 inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/10 py-3 pr-3 pl-6 text-base font-medium text-white transition-colors hover:bg-white/20"
						>
							Get your number
							<span
								class="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition-colors group-hover:bg-white/20"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
								</svg>
							</span>
						</a>
					</div>
				</div>
			</div>

			<p class="mt-4 text-center text-xs text-white/35">
				Illustrative list prices, adjustable above — not a quote. Your real stack and your
				subscription are priced during discovery.
			</p>
		</div>
	</div>
</section>

<!-- How it works -->
<section id="process" class="faq-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">How it works</p>
			<h2
				class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				What happens after you send the form
			</h2>
			<p class="mt-4 text-lg text-pretty text-white/70">
				Five steps. The fifth one never really ends.
			</p>
		</div>

		<div class="relative mx-auto mt-16 max-w-3xl">
			<!-- The spine: the brand gradient doing structural work, drawn on scroll -->
			<div
				class="absolute top-2 bottom-2 left-[15px] w-px bg-white/10 md:left-[19px]"
				aria-hidden="true"
			></div>
			<div
				bind:this={spineElement}
				class="btn-gradient absolute top-2 bottom-2 left-[15px] w-px origin-top transition-transform duration-[1400ms] ease-out md:left-[19px] {spineDrawn
					? 'scale-y-100'
					: 'scale-y-0'}"
				aria-hidden="true"
			></div>

			<ol class="space-y-10 sm:space-y-12">
				{#each phases as phase, index}
					<li class="relative flex gap-5 sm:gap-7" use:scrollReveal={{ delay: index * 60 }}>
						<span
							class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#0d0a1f] text-sm font-semibold text-white/70 tabular-nums md:h-10 md:w-10 md:text-base"
						>
							{index + 1}
						</span>
						<div class="pt-1 md:pt-1.5">
							<h3 class="font-heading text-xl font-semibold text-white sm:text-2xl">
								{phase.title}
							</h3>
							<p class="mt-2 text-base leading-relaxed text-pretty text-white/60">
								{phase.body}
							</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>


<!-- section:pricing {"type":"pricing","id":"pricing-1"} -->
<section id="pricing" class="pricing-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<h2
				class="font-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				One subscription, no ceiling
			</h2>
			<p class="mt-4 text-lg text-pretty text-white/70">
				Priced against what your business needs and what it replaces. Every quote starts with a
				conversation, not a pricing table.
			</p>
		</div>

		<div class="mx-auto mt-16 max-w-lg" use:scrollReveal={{ delay: 100 }}>
			<div class="flex justify-center">
				{#each plans as plan}
					<div
						class="glass-card card-animate relative w-full rounded-2xl border border-white/10 p-8 backdrop-blur-sm"
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
							<p class="font-heading mt-3 text-3xl font-bold text-balance text-white">{plan.price}</p>
							<p class="mt-4 text-white/70">{plan.description}</p>
						</div>

						<div class="space-y-6">
							<ul class="space-y-4">
								{#each plan.features as feature}
									<li class="flex items-center">
										<span
											class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#334fff]/20"
										>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#7433ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										</span>
										<span class="text-white/90">{feature}</span>
									</li>
								{/each}
							</ul>
							<a
								href="/#intake-form"
								class="btn-gradient btn-animate group inline-flex w-full items-center justify-center gap-3 rounded-full py-3 pr-3 pl-6 text-lg font-medium text-white shadow-lg"
							>
								{plan.cta}
								<span
									class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
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
<!-- /section:pricing -->
<!-- FAQ: native details/summary — no JS, keyboard accessible by default -->
<section id="faq" class="faq-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center" use:scrollReveal>
			<p class="text-xs font-semibold tracking-[0.22em] text-white/40 uppercase">Questions</p>
			<h2
				class="font-heading mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
			>
				The things people ask before signing
			</h2>
		</div>

		<div class="mx-auto mt-14 max-w-3xl border-t border-white/10" use:scrollReveal={{ delay: 100 }}>
			{#each faqs as faq}
				<details class="group border-b border-white/10">
					<summary
						class="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left transition-colors duration-200 hover:text-white [&::-webkit-details-marker]:hidden"
					>
						<h3 class="font-heading text-lg font-medium text-balance text-white sm:text-xl">
							{faq.question}
						</h3>
						<span
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all duration-300 group-hover:border-white/40 group-open:rotate-45 group-open:border-white/40"
							aria-hidden="true"
						>
							<svg
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
							</svg>
						</span>
					</summary>
					<p class="max-w-2xl pb-6 text-base leading-relaxed text-pretty text-white/60">
						{faq.answer}
					</p>
				</details>
			{/each}
		</div>
	</div>
</section>


<!-- section:cta {"type":"cta","id":"cta-1"} -->
<section class="cta-section-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h2
				class="font-heading text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
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
					href="/#intake-form"
					class="btn-gradient btn-animate group inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-6 text-lg font-medium text-white shadow-lg"
				>
					Start a Project
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-colors group-hover:bg-white/20"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
						</svg>
					</span>
				</a>
				<a
					href="/contact"
					class="btn-secondary-animate group inline-flex items-center gap-3 rounded-full border border-white/30 bg-transparent py-3 pr-3 pl-6 text-lg font-medium text-white shadow-sm hover:bg-white/10"
				>
					Book a Call
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white/10"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
<!-- /section:cta -->

<!-- section:contact {"type":"contact","id":"contact-intake"} -->
<section id="intake-form" class="intake-section-gradient relative py-20 sm:py-32">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-5xl" use:scrollReveal>
			<form
				bind:this={formElement}
				class="intake-form-shadow rounded-2xl bg-white p-8 sm:p-12"
				method="POST"
				onsubmit={handleSubmit}
			>
				<input
					type="text"
					name="website"
					aria-hidden="true"
					aria-label="Leave this field empty"
					class="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
					tabindex="-1"
					autocomplete="off"
				/>

				<input type="hidden" name="utm_source" value={utmSource} />

					{#if errorMessage}
						<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
							{errorMessage}
						</div>
					{/if}

					<div
						class="mb-8 flex flex-wrap items-center gap-2 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span class="shrink-0">Hi! My name is</span>
						<div class="relative inline-flex min-w-44 flex-1 items-center">
							<label for="intake-name" class="sr-only">Full name</label>
							<input
								id="intake-name"
								type="text"
								name="name"
								bind:value={fullName}
								placeholder="Type your full name"
								required
								class="inline-input w-full border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400"
							/>
							<span class="ml-1 shrink-0 text-lg">👋</span>
						</div>
						<span class="shrink-0">and I work at</span>
						<label for="intake-company" class="sr-only">Company name</label>
						<input
							id="intake-company"
							type="text"
							name="company"
							bind:value={companyName}
							placeholder="Type a company name"
							class="inline-input min-w-44 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400"
						/>
					</div>

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
						<input type="hidden" name="how_did_you_find_us" value={foundUsVia} />
					</div>

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
						<input type="hidden" name="what_do_you_need_help_with" value={helpWith} />
					</div>

					<div
						class="mb-8 flex flex-wrap items-center gap-2 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span>Feel free to email me at</span>
						<label for="intake-email" class="sr-only">Email address</label>
						<input
							id="intake-email"
							type="email"
							name="email"
							bind:value={email}
							placeholder="Type your contact email"
							required
							class="inline-input w-52 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400 sm:w-60"
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
								<svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							{#if showCountryDropdown}
								<div
									class="absolute top-full left-0 z-50 mt-1 max-h-48 w-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
									role="listbox"
									tabindex="-1"
									onclick={(e) => e.stopPropagation()}
									onkeydown={(e) => e.stopPropagation()}
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
						<label for="intake-phone" class="sr-only">Phone number</label>
						<input
							id="intake-phone"
							type="tel"
							bind:value={phone}
							placeholder={selectedCountry.code}
							class="inline-input w-28 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-center text-gray-600 placeholder:text-gray-400"
						/>
						<input type="hidden" name="phone" value="{selectedCountry.code} {phone}" />
					</div>

					<div
						class="mb-8 flex flex-wrap items-start gap-2 text-xl font-medium text-gray-800 sm:text-2xl"
					>
						<span class="mt-2">Here is more information about the project:</span>
						<label for="intake-message" class="sr-only">Project details</label>
						<input
							id="intake-message"
							type="text"
							name="message"
							bind:value={projectDetails}
							placeholder="Type your project details"
							required
							class="inline-input min-w-64 flex-1 border-b-2 border-gray-300 bg-transparent px-2 py-1 text-gray-600 placeholder:text-gray-400"
						/>
					</div>

					<div
						class="flex flex-wrap items-center justify-center gap-6 border-t border-gray-200 pt-6"
					>
						<div bind:this={hcaptchaContainer} class="min-h-[78px]"></div>

						<button
							type="submit"
							disabled={isSubmitting}
							class="btn-gradient btn-animate group inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-6 text-base font-medium text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60 {isSubmitting ? 'btn-loading' : ''}"
						>
							<span class={isSubmitting ? 'opacity-0' : ''}>Send</span>
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 {isSubmitting ? 'opacity-0' : ''}"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
								</svg>
							</span>
						</button>
					</div>
			</form>
		</div>
	</div>
</section>
<!-- /section:contact -->

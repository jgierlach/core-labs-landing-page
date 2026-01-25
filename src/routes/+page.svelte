<script>
	import Header from '$lib/components/Header.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import FeaturesSection from '$lib/components/FeaturesSection.svelte';
	import TestimonialsSection from '$lib/components/TestimonialsSection.svelte';
	import PricingSection from '$lib/components/PricingSection.svelte';
	import CtaSection from '$lib/components/CtaSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import IntakeForm from '$lib/components/IntakeForm.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Core Labs - Custom Software Solutions</title>
	<meta
		name="description"
		content="Replace expensive SaaS subscriptions with custom software built specifically for your business. Reduce costs by 70% with unified solutions."
	/>
</svelte:head>

<HeroSection />
<FeaturesSection />
<!-- <TestimonialsSection /> -->
<PricingSection />
<CtaSection />
<IntakeForm />

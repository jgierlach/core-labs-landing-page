<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	let { children } = $props();

	$effect(() => {
		document.documentElement.style.scrollBehavior = 'smooth';
	});
</script>

<a
	href="#main-content"
	class="sr-only z-[60] rounded-full bg-white px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
	>Skip to content</a
>
<Navbar />
<main id="main-content">
	{@render children()}
</main>
<Footer />

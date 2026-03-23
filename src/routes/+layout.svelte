<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	let { children } = $props();

	$effect(() => {
		document.documentElement.style.scrollBehavior = 'smooth';
	});
</script>

<Navbar />
<main>
	{@render children()}
</main>
<Footer />

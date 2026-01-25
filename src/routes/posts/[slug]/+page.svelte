<script>
	export let data;
</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta name="description" content={data.post.description} />
	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.description} />
	{#if data.post.headerImage}
		<meta property="og:image" content={data.post.headerImage} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.post.title} />
	<meta name="twitter:description" content={data.post.description} />
	{#if data.post.headerImage}
		<meta name="twitter:image" content={data.post.headerImage} />
	{/if}
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	<article class="prose mx-auto lg:prose-xl dark:prose-invert">
		<h1>{data.post.title}</h1>
		<time class="mb-8 block text-sm text-gray-500 dark:text-gray-400">
			{new Date(data.post.date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</time>

		{@html data.post.html}
	</article>
</div>

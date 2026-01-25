<script>
	export let data;
</script>

<svelte:head>
	<title>Jan-Edward | Blog Posts</title>
	<meta
		name="description"
		content="Read the latest blog posts about technology, personal experiences, and interesting discoveries."
	/>
	<meta property="og:title" content="Blog Posts | Jan-Edward" />
	<meta
		property="og:description"
		content="Read the latest blog posts about technology, personal experiences, and interesting discoveries."
	/>
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Blog Posts | Jan-Edward" />
	<meta
		name="twitter:description"
		content="Read the latest blog posts about technology, personal experiences, and interesting discoveries."
	/>
</svelte:head>

<section
	class="bg-gradient-to-b from-gray-50 to-gray-100 py-20 dark:from-gray-900 dark:to-gray-800"
>
	<div class="container mx-auto px-6 text-center lg:px-12">
		<h2 class="mb-12 text-5xl font-bold text-gray-900 dark:text-white">📝 Blog Posts</h2>

		<!-- Blog Cards Grid -->
		<div class="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{#each data.posts as post}
				<div
					class="card bg-white shadow-xl transition-transform duration-300 hover:scale-105 dark:bg-gray-900"
				>
					<figure>
						<img
							src={post.headerImage ||
								'https://archive.org/download/placeholder-image/placeholder-image.jpg'}
							alt={post.title}
							class="h-48 w-full rounded-t-xl object-cover"
						/>
					</figure>
					<div class="card-body p-6">
						<h3 class="text-2xl font-semibold text-gray-800 dark:text-white">
							{post.title}
						</h3>
						<time class="mt-2 block text-sm text-gray-500 dark:text-gray-400">
							{new Date(post.date).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</time>
						<p class="mt-2 text-gray-600 dark:text-gray-300">
							{post.description}
						</p>
						<div class="mt-4">
							<a href="/posts/{post.slug}" class="btn btn-primary w-full">Read More 📖</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

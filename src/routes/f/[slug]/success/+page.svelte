<script>
	import { page } from '$app/stores';

	let submissionId = $derived($page.url.searchParams.get('sid'));
</script>

<section class="bg-base-200 flex min-h-[60vh] items-center justify-center px-4 py-16">
	<div class="w-full max-w-xl text-center">
		<div
			class="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-10 w-10"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12.75 11.25 15 15 9.75m5.25 2.25a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z"
				/>
			</svg>
		</div>

		<h1 class="mb-2 text-3xl font-bold">Thank you! Your submission was successful.</h1>

		<div
			class="border-base-300 bg-base-100 text-base-content/70 mt-4 rounded-xl border p-5 text-sm"
		>
			<span class="font-semibold"
				>Powered by <a href="/" class="text-accent link link-hover underline">Core Labs</a></span
			>
			— Scalable software for your business.
		</div>
	</div>
</section>

<script>
	import { page } from '$app/stores';

	let message = $derived(
		$page.url.searchParams.get('message') || 'Something went wrong while submitting the form.'
	);
</script>

<section class="bg-base-200 flex min-h-[60vh] items-center justify-center px-4 py-16">
	<div class="w-full max-w-xl text-center">
		<div
			class="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600"
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
					d="M12 9v3.75m0 3.75h.007v.008H12V16.5Zm9-4.125a8.625 8.625 0 1 1-17.25 0 8.625 8.625 0 0 1 17.25 0Z"
				/>
			</svg>
		</div>

		<h1 class="mb-2 text-3xl font-bold">We couldn't submit your form</h1>
		<p class="text-base-content/80 mb-4">{message}</p>
		<p class="text-base-content/70 mb-8">
			Please go back and try again. If the problem persists, contact support.
		</p>

		<div class="border-base-300 bg-base-100 text-base-content/70 rounded-xl border p-5 text-sm">
			<span class="font-semibold">Powered by Core Labs</span>
			— Scalable software for your business.
		</div>
	</div>
</section>

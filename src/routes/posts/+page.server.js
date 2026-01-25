import { getAllPosts } from '$lib/posts/utils';

export function load() {
	const posts = getAllPosts();

	return {
		posts
	};
}

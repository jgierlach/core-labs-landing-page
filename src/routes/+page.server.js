import { getAllPosts } from '$lib/posts/utils';

export function load() {
	const posts = getAllPosts();
	const latestPosts = posts.slice(0, 3); // Get 3 most recent posts

	return {
		latestPosts
	};
}

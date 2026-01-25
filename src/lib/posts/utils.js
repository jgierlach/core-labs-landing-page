import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export function getAllPosts() {
	const files = import.meta.glob('/src/lib/posts/*.md', { eager: true });

	// console.log('Bundled Posts:', files);

	return Object.entries(files)
		.map(([filePath, file]) => {
			// Ensure file has a default export
			if (!file || !file.default) {
				console.error(`Skipping ${filePath} due to missing default export`);
				return null;
			}

			const slug = filePath.split('/').pop().replace('.md', '');
			// console.log(`Processing ${slug} with default:`, file.default);

			try {
				let content;

				// If default is a file path (like in local dev)
				if (typeof file.default === 'string' && file.default.startsWith('/src/lib/posts/')) {
					try {
						// Try reading the file from the filesystem (for local dev)
						const localPath = path.resolve(file.default.slice(1)); // Remove leading slash
						content = fs.readFileSync(localPath, 'utf-8');
						console.log(`Read content from local file: ${localPath}`);
					} catch (fsError) {
						console.error(`Could not read local file: ${fsError.message}`);
						// If we can't read the file, the content might be inlined in the module
						if (file.default.includes('base64,')) {
							const base64Content = file.default.split('base64,')[1];
							content = Buffer.from(base64Content, 'base64').toString('utf-8');
							console.log(`Extracted content from base64 data URL`);
						} else {
							// If file.metadata exists, use that
							if (file.metadata && file.metadata.frontmatter) {
								content = file.metadata.frontmatter;
								console.log(`Using metadata from module`);
							} else {
								throw new Error(`Could not extract content for ${slug}`);
							}
						}
					}
				}
				// If default is a base64 data URL (like in production)
				else if (typeof file.default === 'string' && file.default.includes('base64,')) {
					const base64Content = file.default.split('base64,')[1];
					content = Buffer.from(base64Content, 'base64').toString('utf-8');
					console.log(`Extracted content from base64 data URL`);
				}
				// If content is directly available in the module
				else if (file.metadata && file.metadata.frontmatter) {
					content = file.metadata.frontmatter;
					console.log(`Using metadata from module`);
				}
				// Fallback - try to use default directly
				else {
					content = file.default;
					// console.log(`Using default directly`);
				}

				// Check if content was successfully retrieved
				if (!content) {
					throw new Error(`Could not extract content for ${slug}`);
				}

				// console.log(
				// 	`Content preview: ${typeof content === 'string' ? content.substring(0, 50) + '...' : 'Non-string content'}`
				// );

				// Process the content with gray-matter
				const { data, content: markdown } = matter(content);
				// console.log(`Extracted frontmatter:`, data);

				// Create a date object from the date string
				const date = data.date ? new Date(data.date) : new Date();

				// Convert markdown to HTML
				const html = marked(markdown);

				return {
					slug,
					html,
					...data,
					date
				};
			} catch (error) {
				console.error(`Error processing ${slug}:`, error);
				console.error(error.stack);
				// Return a minimal object for debugging
				return {
					slug,
					html: `<pre>Error processing markdown: ${error.message}</pre>`,
					title: `Error: ${slug}`,
					date: new Date(),
					errorDetails: error.message
				};
			}
		})
		.filter(Boolean)
		.sort((a, b) => {
			// Safely compare dates
			const dateA = a.date instanceof Date ? a.date : new Date(0);
			const dateB = b.date instanceof Date ? b.date : new Date(0);
			return dateB - dateA;
		});
}

export function getPost(slug) {
	const files = import.meta.glob('/src/lib/posts/*.md', { eager: true });
	const filePath = Object.keys(files).find((path) => path.endsWith(`${slug}.md`));

	if (!filePath || !files[filePath] || !files[filePath].default) {
		throw new Error(`Post with slug "${slug}" not found`);
	}

	const file = files[filePath];

	try {
		let content;

		// If default is a file path (like in local dev)
		if (typeof file.default === 'string' && file.default.startsWith('/src/lib/posts/')) {
			try {
				// Try reading the file from the filesystem (for local dev)
				const localPath = path.resolve(file.default.slice(1)); // Remove leading slash
				content = fs.readFileSync(localPath, 'utf-8');
			} catch (fsError) {
				console.error(`Could not read local file: ${fsError.message}`);
				// If we can't read the file, the content might be inlined in the module
				if (file.default.includes('base64,')) {
					const base64Content = file.default.split('base64,')[1];
					content = Buffer.from(base64Content, 'base64').toString('utf-8');
				} else {
					// If file.metadata exists, use that
					if (file.metadata && file.metadata.frontmatter) {
						content = file.metadata.frontmatter;
					} else {
						throw new Error(`Could not extract content for ${slug}`);
					}
				}
			}
		}
		// If default is a base64 data URL (like in production)
		else if (typeof file.default === 'string' && file.default.includes('base64,')) {
			const base64Content = file.default.split('base64,')[1];
			content = Buffer.from(base64Content, 'base64').toString('utf-8');
		}
		// If content is directly available in the module
		else if (file.metadata && file.metadata.frontmatter) {
			content = file.metadata.frontmatter;
		}
		// Fallback - try to use default directly
		else {
			content = file.default;
		}

		// Process the content with gray-matter
		const { data, content: markdown } = matter(content);

		// Create a date object from the date string
		const date = data.date ? new Date(data.date) : new Date();

		// Convert markdown to HTML
		const html = marked(markdown);

		return {
			slug,
			html,
			...data,
			date
		};
	} catch (error) {
		console.error(`Error processing post ${slug}:`, error);
		throw error;
	}
}

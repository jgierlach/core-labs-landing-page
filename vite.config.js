import { join } from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';


// Placeholder-SEO guard: example.com URLs in robots.txt/sitemap/llms.txt/page
// heads must never reach the launched site. Warn-only until a custom
// production domain is attached, then fail the build. URL form only —
// form-input hints like placeholder="you@example.com" are legitimate UI text.
const SEO_PLACEHOLDER = /:\/\/(www\.)?example\.com/;
const SEO_SCAN_EXTENSIONS = ['.svelte', '.js', '.ts', '.txt', '.xml', '.html'];

function scanForSeoPlaceholder(dir) {
	const hits = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) hits.push(...scanForSeoPlaceholder(path));
		else if (SEO_SCAN_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
			if (SEO_PLACEHOLDER.test(readFileSync(path, 'utf-8'))) hits.push(path);
		}
	}
	return hits;
}

function placeholderSeoGuard() {
	return {
		name: 'placeholder-seo-guard',
		apply: 'build',
		buildStart() {
			const hits = ['src', 'static'].flatMap((dir) => scanForSeoPlaceholder(dir));
			if (hits.length === 0) return;
			const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || '';
			const launched = productionUrl && !productionUrl.endsWith('.vercel.app');
			const message = `'example.com' placeholder URL still present in: ${hits.join(', ')} — replace with the site's real domain`;
			if (launched) throw new Error(`${message} (custom domain ${productionUrl} is attached)`);
			this.warn(message);
		}
	};
}

export default defineConfig({
	build: {
		// Lighthouse targets modern Chromium/WebKit/Firefox; avoid emitting legacy syntax
		// transforms/polyfills for Baseline JavaScript that these browsers already support.
		target: 'es2022',
		modulePreload: {
			polyfill: false
		}
	},
	plugins: [
		sveltekit(),
		placeholderSeoGuard(),
		{
			name: 'markdown-loader',
			transform(code, id) {
				if (id.endsWith('.md')) {
					const content = readFileSync(path.resolve(id), 'utf-8');
					return {
						code: `export default ${JSON.stringify(content)};`,
						map: null
					};
				}
			}
		}
	]
});

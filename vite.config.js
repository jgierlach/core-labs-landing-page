import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import path from 'path';

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

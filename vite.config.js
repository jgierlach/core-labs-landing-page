import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import path from 'path';

export default defineConfig({
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

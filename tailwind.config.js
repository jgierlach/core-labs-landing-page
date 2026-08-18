import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif']
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				border: 'var(--border)',
				ring: 'var(--ring)',
				brand: {
					purple: '#7433ff',
					blue: '#334fff',
					night: '#0d0a1f',
					navy: '#0a0f2a',
					surface: '#1a1035',
					violet: '#a78bfa',
					gold: '#ffb35f'
				}
			}
		}
	},

	plugins: [typography, forms, daisyui],

	// daisyUI config
	daisyui: {
		themes: ['dark'],
		base: true,
		styled: true,
		utils: true,
		prefix: '',
		logs: true,
		themeRoot: ':root'
	}
};

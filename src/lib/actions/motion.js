/**
 * Scroll-reveal motion actions (Nooks-style), dependency-free.
 *
 * - splitWords: headline words rise out of individual masks, staggered.
 * - scramble:   mono labels decode letter by letter with an accent flash.
 * - countUp:    numeric stats count up from zero once they're on screen.
 *
 * Every action is a no-op when the visitor prefers reduced motion, and the
 * server-rendered text is always the final text, so crawlers and no-JS
 * visitors see the real content. All triggers use IntersectionObserver.
 */

function reducedMotion() {
	return (
		typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

/**
 * Run `fn` once, the first time `node` scrolls into view.
 * @param {Element} node
 * @param {() => void} fn
 * @param {number} [threshold]
 */
function onceVisible(node, fn, threshold = 0.25) {
	const io = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				io.disconnect();
				fn();
			}
		},
		{ threshold, rootMargin: '0px 0px -8% 0px' }
	);
	io.observe(node);
	return io;
}

const GRADIENT_CLASS = 'text-gradient-purple';

/**
 * Split a heading's text into masked words that rise into place.
 * Nested inline elements are split too; a gradient-text span hands its
 * gradient class to each of its words (background-clip:text does not reach
 * through the transformed word boxes otherwise).
 * @param {HTMLElement} node
 * @param {{ stagger?: number }} [options]
 */
export function splitWords(node, options = {}) {
	if (reducedMotion()) return {};
	const stagger = options.stagger ?? 45;
	let index = 0;

	/** @param {Node} parent @param {boolean} gradient */
	function walk(parent, gradient) {
		for (const child of Array.from(parent.childNodes)) {
			if (child.nodeType === Node.TEXT_NODE) {
				const parts = (child.textContent ?? '').split(/(\s+)/);
				const frag = document.createDocumentFragment();
				for (const part of parts) {
					if (!part) continue;
					if (/^\s+$/.test(part)) {
						frag.append(document.createTextNode(part));
						continue;
					}
					const mask = document.createElement('span');
					mask.className = 'split-mask';
					const word = document.createElement('span');
					word.className = gradient ? `split-word ${GRADIENT_CLASS}` : 'split-word';
					word.style.setProperty('--i', String(index++));
					word.textContent = part;
					mask.append(word);
					frag.append(mask);
				}
				child.replaceWith(frag);
			} else if (child instanceof HTMLElement) {
				const isGradient = child.classList.contains(GRADIENT_CLASS);
				if (isGradient) child.classList.remove(GRADIENT_CLASS);
				walk(child, gradient || isGradient);
			}
		}
	}

	node.setAttribute('aria-label', node.textContent?.replace(/\s+/g, ' ').trim() ?? '');
	walk(node, false);
	node.style.setProperty('--split-stagger', `${stagger}ms`);
	node.classList.add('split-ready');

	const io = onceVisible(node, () => node.classList.add('split-in'), 0.3);
	return { destroy: () => io.disconnect() };
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#+*_';

/**
 * Decode a short mono label: each letter cycles through glyphs (in the accent
 * colour) before settling, left to right.
 * @param {HTMLElement} node
 * @param {{ duration?: number }} [options]
 */
export function scramble(node, options = {}) {
	if (reducedMotion()) return {};
	const duration = options.duration ?? 900;
	const finalText = node.textContent ?? '';
	let frame = 0;

	const io = onceVisible(node, () => {
		const chars = [...finalText].map((ch) => {
			const span = document.createElement('span');
			span.textContent = ch;
			return { ch, span };
		});
		node.replaceChildren(...chars.map((c) => c.span));
		const start = performance.now();
		const n = chars.length;

		/** @param {number} now */
		function tick(now) {
			const t = now - start;
			let done = true;
			chars.forEach(({ ch, span }, i) => {
				const settleAt = duration * 0.25 + (duration * 0.75 * i) / Math.max(n, 1);
				if (ch === ' ' || t >= settleAt) {
					span.textContent = ch;
					span.className = '';
				} else {
					done = false;
					span.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
					span.className = 'text-lilac';
				}
			});
			if (done) {
				node.textContent = finalText;
			} else {
				frame = requestAnimationFrame(tick);
			}
		}
		frame = requestAnimationFrame(tick);
	}, 0.5);

	return {
		destroy() {
			io.disconnect();
			cancelAnimationFrame(frame);
		}
	};
}

/**
 * Count a stat like "40%" or "100%" up from zero. Values that aren't a plain
 * leading integer ("24/7", "∞") are left alone.
 * @param {HTMLElement} node
 * @param {{ duration?: number }} [options]
 */
export function countUp(node, options = {}) {
	if (reducedMotion()) return {};
	const finalText = (node.textContent ?? '').trim();
	const match = finalText.match(/^(\d+)(\D*)$/);
	if (!match) return {};
	const target = Number(match[1]);
	const suffix = match[2];
	const duration = options.duration ?? 1400;
	let frame = 0;

	const io = onceVisible(node, () => {
		const start = performance.now();
		/** @param {number} now */
		function tick(now) {
			const p = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(2, -10 * p); // easeOutExpo
			node.textContent = `${p === 1 ? target : Math.round(target * eased)}${suffix}`;
			if (p < 1) frame = requestAnimationFrame(tick);
		}
		node.textContent = `0${suffix}`;
		frame = requestAnimationFrame(tick);
	}, 0.6);

	return {
		destroy() {
			io.disconnect();
			cancelAnimationFrame(frame);
		}
	};
}

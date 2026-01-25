/**
 * Scroll Reveal Action
 * Uses Intersection Observer to trigger fade-up animations when elements enter the viewport.
 * Elements animate once and don't repeat on scroll up.
 */

/**
 * @param {HTMLElement} node - The element to observe
 * @param {Object} options - Configuration options
 * @param {number} [options.threshold=0.15] - Visibility threshold (0-1) to trigger animation
 * @param {number} [options.delay=0] - Animation delay in milliseconds
 * @param {boolean} [options.stagger=false] - If true, applies stagger delay to children
 * @param {number} [options.staggerDelay=100] - Delay between staggered items in ms
 */
export function scrollReveal(node, options = {}) {
	const {
		threshold = 0.15,
		delay = 0,
		stagger = false,
		staggerDelay = 100
	} = options;

	// Apply initial hidden state
	if (stagger) {
		// For stagger mode, apply to children
		const children = node.children;
		Array.from(children).forEach((child, index) => {
			child.classList.add('scroll-reveal');
			child.style.transitionDelay = `${delay + index * staggerDelay}ms`;
		});
	} else {
		node.classList.add('scroll-reveal');
		if (delay > 0) {
			node.style.transitionDelay = `${delay}ms`;
		}
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (stagger) {
						// Reveal all children
						const children = node.children;
						Array.from(children).forEach((child) => {
							child.classList.add('scroll-reveal-visible');
						});
					} else {
						node.classList.add('scroll-reveal-visible');
					}
					// Stop observing after animation (animate once)
					observer.unobserve(node);
				}
			});
		},
		{
			threshold,
			rootMargin: '0px 0px -50px 0px'
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		},
		update(newOptions) {
			// Handle dynamic option updates if needed
		}
	};
}

/**
 * Page Load Animation Action
 * Triggers fade-up animation on page load with optional stagger delay.
 */
export function pageLoad(node, options = {}) {
	const { delay = 0, stagger = false, staggerDelay = 100 } = options;

	if (stagger) {
		const children = node.children;
		Array.from(children).forEach((child, index) => {
			child.classList.add('page-load');
			child.style.animationDelay = `${delay + index * staggerDelay}ms`;
			// Trigger animation
			requestAnimationFrame(() => {
				child.classList.add('page-load-visible');
			});
		});
	} else {
		node.classList.add('page-load');
		if (delay > 0) {
			node.style.animationDelay = `${delay}ms`;
		}
		// Trigger animation
		requestAnimationFrame(() => {
			node.classList.add('page-load-visible');
		});
	}

	return {
		destroy() {
			// Cleanup if needed
		}
	};
}

import { redirect, json } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { supabase } from '$lib/server/supabase.js';

/**
 * Public endpoint on marketing domain to accept client form submissions.
 * Proxies the submission to the public API domain (api.corelabs.digital) and redirects to pretty pages.
 */

/** Slugs for forms that automatically create deals */
const WEBSITE_REDESIGN_SLUG = '88cb8b1a-9ca0-4a91-8c99-abf67b402dd3';
const HOMEPAGE_INTAKE_SLUG = '042ede32-d0d7-41a3-9140-87f484cfc6aa';

/**
 * Resolve the deal_source label.
 * Uses utm_source when present; falls back to the self-reported foundVia value.
 * @param {string} [utmSource]
 * @param {string} [foundVia]
 * @returns {string}
 */
function resolveDealSource(utmSource, foundVia = '') {
	const src = (utmSource || '').toLowerCase().trim();
	if (src === 'facebook') return 'Facebook Ads';
	if (src === 'google') return 'Google Ads';
	if (src) return 'Unknown';
	// No UTM param — fall back to the form's "how did you find us" value
	return foundVia || 'Unknown';
}

/**
 * Fire-and-forget: insert a deal row into Supabase.
 * Errors are logged but never surface to the visitor.
 * @param {Record<string, unknown>} deal - A ready-to-insert deals row.
 */
function insertDeal(deal) {
	supabase
		.from('deals')
		.insert(deal)
		.then(({ error }) => {
			if (error) console.error('Supabase deal insert failed:', error);
		})
		.catch((err) => {
			console.error('Supabase deal insert rejected:', err);
		});
}

/**
 * Build a deal row from the website-redesign form fields.
 * @param {FormData} formData
 * @returns {Record<string, unknown>}
 */
function buildWebsiteRedesignDeal(formData) {
	const name = formData.get('name')?.toString() || '';
	return {
		contact_person: name,
		contact_email: formData.get('email')?.toString() || '',
		website: formData.get('current_website')?.toString() || null,
		notes: formData.get('creative_direction')?.toString() || null,
		title: `${name} Deal`,
		status: 'interest_shown',
		deal_source: resolveDealSource(formData.get('utm_source')?.toString())
	};
}

/**
 * Build a deal row from the homepage intake form fields.
 * @param {FormData} formData
 * @returns {Record<string, unknown>}
 */
function buildHomepageIntakeDeal(formData) {
	const name = formData.get('name')?.toString() || '';
	const company = formData.get('company')?.toString() || '';
	const helpWith = formData.get('help_with')?.toString() || '';
	const message = formData.get('message')?.toString() || '';
	const notes = [helpWith && `Looking for help with: ${helpWith}`, message]
		.filter(Boolean)
		.join('. ');

	return {
		contact_person: name,
		contact_email: formData.get('email')?.toString() || '',
		contact_phone_number: formData.get('phone')?.toString() || null,
		company_name: company || null,
		title: `${company || name} Deal`,
		status: 'interest_shown',
		notes: notes || null,
		deal_source: resolveDealSource(
			formData.get('utm_source')?.toString(),
			formData.get('found_via')?.toString()
		)
	};
}

/**
 * @param {string | null} origin
 */
function corsHeaders(origin) {
	const allowOrigin = origin || '*';
	/** @type {Record<string, string>} */
	const headers = {
		'Access-Control-Allow-Origin': allowOrigin,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With',
		'Access-Control-Max-Age': '86400'
	};
	if (origin) {
		headers.Vary = 'Origin';
	}
	return headers;
}

/**
 * @param {Request} request
 */
function wantsJson(request) {
	const accept = request.headers.get('accept') || '';
	const requestedWith = (request.headers.get('x-requested-with') || '').toLowerCase();
	const secFetchDest = request.headers.get('sec-fetch-dest') || '';
	return (
		accept.includes('application/json') ||
		requestedWith === 'fetch' ||
		requestedWith === 'xmlhttprequest' ||
		secFetchDest === 'empty'
	);
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	// No GET behavior needed for form submissions; send users to homepage
	throw redirect(302, '/');
}

/** @type {import('./$types').RequestHandler} */
export async function OPTIONS({ request }) {
	const origin = request.headers.get('origin');
	return new Response(null, {
		status: 204,
		headers: corsHeaders(origin)
	});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, fetch, url }) {
	const slug = params.slug;
	const apiBase = (PUBLIC_API_BASE_URL || 'https://api.corelabs.digital').replace(/\/$/, '');
	const target = `${apiBase}/api/forms/${encodeURIComponent(slug)}/submit`;

	const origin = request.headers.get('origin') || '';
	const referer = request.headers.get('referer') || '';
	const userAgent = request.headers.get('user-agent') || '';
	const contentType = (request.headers.get('content-type') || '').toLowerCase();
	const expectJson = wantsJson(request);

	// Capture deal row for Supabase insert when the slug matches a tracked form
	/** @type {Record<string, unknown> | null} */
	let dealRow = null;

	/** @type {Response} */
	let apiRes;
	try {
		if (contentType.includes('application/json')) {
			const payload = await request.json();
			apiRes = await fetch(target, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					origin,
					referer,
					'user-agent': userAgent
				},
				body: JSON.stringify(payload)
			});
		} else if (
			contentType.includes('application/x-www-form-urlencoded') ||
			contentType.includes('multipart/form-data')
		) {
			const formData = await request.formData();

			// Build a deal row if this is a tracked form
			if (slug === WEBSITE_REDESIGN_SLUG) {
				dealRow = buildWebsiteRedesignDeal(formData);
			} else if (slug === HOMEPAGE_INTAKE_SLUG) {
				dealRow = buildHomepageIntakeDeal(formData);
			}

			apiRes = await fetch(target, {
				method: 'POST',
				headers: {
					origin,
					referer,
					'user-agent': userAgent
				},
				body: formData
			});
		} else {
			// Default: try to treat as form data
			const formData = await request.formData().catch(() => null);
			if (formData) {
				apiRes = await fetch(target, {
					method: 'POST',
					headers: { origin, referer, 'user-agent': userAgent },
					body: formData
				});
			} else {
				// Fallback: forward raw body
				const raw = await request.text();
				apiRes = await fetch(target, {
					method: 'POST',
					headers: {
						'content-type': contentType || 'text/plain',
						origin,
						referer,
						'user-agent': userAgent
					},
					body: raw
				});
			}
		}
	} catch (e) {
		console.error('Error proxying form submission:', e);
		if (expectJson) {
			return json(
				{ error: 'Network error submitting form' },
				{ status: 502, headers: corsHeaders(origin || null) }
			);
		}
		throw redirect(
			303,
			`${url.origin}/f/${encodeURIComponent(slug)}/error?message=${encodeURIComponent('Network error submitting form')}`
		);
	}

	const raw = await apiRes.text();
	let result = null;
	if (raw) {
		try {
			result = JSON.parse(raw);
		} catch {
			// Non-JSON response – ignored for redirect flow
		}
	}

	if (expectJson) {
		if (apiRes.ok && result && result.submission_id) {
			if (dealRow) insertDeal(dealRow);
			return json(
				{ submission_id: result.submission_id },
				{ status: 200, headers: corsHeaders(origin || null) }
			);
		}
		const msg = (result && (result.error || result.message)) || 'Submission failed';
		return json(
			{ error: msg },
			{
				status: apiRes.status || 500,
				headers: corsHeaders(origin || null)
			}
		);
	}

	if (apiRes.ok && result && result.submission_id) {
		if (dealRow) insertDeal(dealRow);
		throw redirect(
			303,
			`${url.origin}/f/${encodeURIComponent(slug)}/success?sid=${encodeURIComponent(result.submission_id)}`
		);
	}

	const msg = (result && (result.error || result.message)) || 'Submission failed';
	throw redirect(
		303,
		`${url.origin}/f/${encodeURIComponent(slug)}/error?message=${encodeURIComponent(msg)}`
	);
}

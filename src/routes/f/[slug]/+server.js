import { redirect, json } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { supabase } from '$lib/server/supabase.js';

/**
 * Public endpoint on marketing domain to accept client form submissions.
 * Proxies the submission to the public API domain (api.corelabs.digital) and redirects to pretty pages.
 */

/** Slug for the website-redesign lead-gen form */
const WEBSITE_REDESIGN_SLUG = '88cb8b1a-9ca0-4a91-8c99-abf67b402dd3';

/**
 * Map a utm_source query-param value to a human-readable deal source.
 * @param {string} utmSource
 * @returns {string}
 */
function mapDealSource(utmSource) {
	const src = (utmSource || '').toLowerCase().trim();
	if (src === 'facebook') return 'Facebook Ads';
	if (src === 'google') return 'Google Ads';
	return 'Unknown';
}

/**
 * Fire-and-forget: insert a new deal row into Supabase.
 * Errors are logged but never surface to the visitor.
 * @param {Record<string, string>} fields
 */
function insertDeal(fields) {
	const contactPerson = fields.name || '';
	const dealSource = mapDealSource(fields.utm_source);

	supabase
		.from('deals')
		.insert({
			contact_person: contactPerson,
			contact_email: fields.email || '',
			website: fields.current_website || null,
			notes: fields.creative_direction || null,
			title: `${contactPerson} Deal`,
			status: 'interest_shown',
			deal_source: dealSource
		})
		.then(({ error }) => {
			if (error) console.error('Supabase deal insert failed:', error);
		})
		.catch((err) => {
			console.error('Supabase deal insert rejected:', err);
		});
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

	// Capture form fields for Supabase insert when this is the website-redesign form
	/** @type {Record<string, string> | null} */
	let dealFields = null;

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

			// Capture fields for Supabase if this is the website-redesign form
			if (slug === WEBSITE_REDESIGN_SLUG) {
				dealFields = {
					name: formData.get('name')?.toString() || '',
					email: formData.get('email')?.toString() || '',
					current_website: formData.get('current_website')?.toString() || '',
					creative_direction: formData.get('creative_direction')?.toString() || '',
					utm_source: formData.get('utm_source')?.toString() || ''
				};
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
			if (dealFields) insertDeal(dealFields);
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
		if (dealFields) insertDeal(dealFields);
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

import { redirect, json } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

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

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	throw redirect(302, '/');
}

/** @type {import('./$types').RequestHandler} */
export async function OPTIONS({ request }) {
	const origin = request.headers.get('origin');
	return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, fetch }) {
	const clientId = params.clientId;
	const apiBase = (PUBLIC_API_BASE_URL || 'https://api.corelabs.digital').replace(/\/$/, '');
	const target = `${apiBase}/api/mailing-lists/${encodeURIComponent(clientId)}/submit`;

	const origin = request.headers.get('origin') || '';
	const referer = request.headers.get('referer') || '';
	const userAgent = request.headers.get('user-agent') || '';
	const contentType = (request.headers.get('content-type') || '').toLowerCase();

	/** @type {Record<string, any>} */
	let payload = {};

	try {
		if (contentType.includes('application/json')) {
			payload = await request.json();
		} else {
			const formData = await request.formData();
			payload = Object.fromEntries(formData.entries());
		}
	} catch (err) {
		console.error('Failed to parse newsletter submission body', err);
		return json(
			{ error: 'Invalid submission' },
			{ status: 400, headers: corsHeaders(origin || null) }
		);
	}

	try {
		const apiRes = await fetch(target, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json',
				origin,
				referer,
				'user-agent': userAgent
			},
			body: JSON.stringify(payload)
		});

		const raw = await apiRes.text();
		let result = null;
		if (raw) {
			try {
				result = JSON.parse(raw);
			} catch {
				// ignore
			}
		}

		if (apiRes.ok) {
			return json(
				{
					message: result?.message || 'Thank you! You have been added to the list.',
					subscriber_id: result?.subscriber_id || null
				},
				{ status: 200, headers: corsHeaders(origin || null) }
			);
		}
		const msg = (result && (result.error || result.message)) || 'Subscription failed';
		return json(
			{ error: msg },
			{ status: apiRes.status || 500, headers: corsHeaders(origin || null) }
		);
	} catch (err) {
		console.error('Error proxying newsletter submission', err);
		return json(
			{ error: 'Network error submitting form' },
			{ status: 502, headers: corsHeaders(origin || null) }
		);
	}
}

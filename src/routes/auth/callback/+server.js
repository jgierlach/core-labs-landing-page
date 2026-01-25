import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const errorDescription = url.searchParams.get('error_description');
	const tokenHash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type');
	const impersonationId = url.searchParams.get('impersonation_id');

	if (errorDescription) {
		const message = encodeURIComponent(errorDescription);
		throw redirect(303, `/login?message=${message}`);
	}

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (error) {
			const message = encodeURIComponent(error.message ?? 'Authentication failed');
			throw redirect(303, `/login?message=${message}`);
		}
		if (impersonationId) {
			try {
				await fetch('/app/api/impersonations/mark-used', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ impersonationId })
				});
			} catch (_) {}
		}
		throw redirect(303, '/app');
	}

	if (tokenHash && type) {
		const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
		if (error) {
			const message = encodeURIComponent(error.message ?? 'Authentication failed');
			throw redirect(303, `/login?message=${message}`);
		}
		if (impersonationId) {
			try {
				await fetch('/app/api/impersonations/mark-used', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ impersonationId })
				});
			} catch (_) {}
		}
		throw redirect(303, '/app');
	}

	const message = encodeURIComponent('Invalid or expired login link');
	throw redirect(303, `/login?message=${message}`);
};

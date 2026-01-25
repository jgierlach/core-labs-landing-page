import { json } from '@sveltejs/kit';
import { SEND_GRID_API_KEY } from '$env/static/private';

const endpoint = 'https://api.sendgrid.com/v3/mail/send';

export async function POST({ request }) {
	try {
		const { name, email, message } = await request.json();

		// Validate required fields
		if (!name || !email || !message) {
			return json({ message: 'Name, Email, and Message fields are required.' }, { status: 400 });
		}

		// Basic HTML escaping to prevent HTML injection in the email
		const escapeHtml = (value) =>
			String(value)
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;')
				.replaceAll('"', '&quot;')
				.replaceAll("'", '&#39;');

		const safeName = escapeHtml(name);
		const safeEmail = escapeHtml(email);
		const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');

		// Prepare email data
		const emailData = {
			personalizations: [
				{
					to: [{ email: 'jan@hometown-industries.com' }],
					subject: 'Core Labs - Contact Form Submission'
				}
			],
			from: {
				email: 'info@life-metrics.com',
				name: 'Core Labs'
			},
			reply_to: {
				email: safeEmail,
				name: safeName
			},
			content: [
				{
					type: 'text/html',
					value: `
					<!doctype html>
					<html lang="en">
					<head>
						<meta charset="utf-8">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<title>Core Labs – Contact Form Submission</title>
					</head>
					<body style="margin:0;padding:24px;background:#0B0B0C;color:#E5E7EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';">
						<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:640px;margin:0 auto;">
							<tr>
								<td style="padding:0 0 16px 0;text-align:center;">
									<div style="display:inline-block;background:#7C3AED;color:#fff;padding:8px 12px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.3px;">New Contact</div>
								</td>
							</tr>
							<tr>
								<td style="padding:0 0 24px 0;text-align:center;">
									<h1 style="margin:0;color:#F9FAFB;font-size:20px;line-height:28px;font-weight:700;">Core Labs – Contact Form Submission</h1>
									<p style="margin:8px 0 0 0;color:#9CA3AF;font-size:14px;line-height:22px;">Someone submitted the contact form on your website.</p>
								</td>
							</tr>
							<tr>
								<td>
									<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0F1115;border:1px solid #1F2937;border-radius:12px;">
										<tr>
											<td style="padding:20px 20px 16px 20px;border-bottom:1px solid #1F2937;">
												<p style="margin:0;color:#9CA3AF;font-size:12px;letter-spacing:.3px;text-transform:uppercase;">From</p>
												<p style="margin:6px 0 0 0;color:#F3F4F6;font-size:16px;line-height:24px;"><strong style="font-weight:600;">${safeName}</strong> <span style="color:#9CA3AF">&lt;${safeEmail}&gt;</span></p>
											</td>
										</tr>
										<tr>
											<td style="padding:16px 20px;">
												<p style="margin:0 0 6px 0;color:#9CA3AF;font-size:12px;letter-spacing:.3px;text-transform:uppercase;">Message</p>
												<div style="color:#E5E7EB;font-size:15px;line-height:24px;">${safeMessage}</div>
											</td>
										</tr>
								</table>
							</td>
							</tr>
							<tr>
								<td style="padding:16px 0 0 0;text-align:center;color:#6B7280;font-size:12px;line-height:18px;">
									<p style="margin:0;">© ${new Date().getFullYear()} Core Labs</p>
								</td>
							</tr>
						</table>
					</body>
					</html>
					`
				}
			]
		};

		// Make the SendGrid API request
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SEND_GRID_API_KEY}`
			},
			body: JSON.stringify(emailData)
		});

		// Handle SendGrid API response
		if (!response.ok) {
			console.error('SendGrid API error:', await response.text());
			return json({ message: 'Failed to send email.' }, { status: response.status });
		}

		return json({ message: 'Contact form submission successful!' }, { status: 200 });
	} catch (error) {
		console.error('Server error:', error);
		return json(
			{ message: 'Error processing contact form.', error: error.message || 'Unknown error.' },
			{ status: 500 }
		);
	}
}

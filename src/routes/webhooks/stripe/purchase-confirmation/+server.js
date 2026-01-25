import { json } from '@sveltejs/kit';

import { SEND_GRID_API_KEY } from '$env/static/private';

export async function POST({ request, locals }) {
	try {
		const requestBody = await request.json();
		const sessionId = requestBody?.data?.object?.id; // Retrieve session ID from the webhook payload
		const customerEmail = requestBody?.data?.object?.customer_details?.email;
		const customerName = requestBody?.data?.object?.customer_details?.name;

		if (!customerEmail || !sessionId) {
			return json({ message: 'Email and Session ID are required.' }, { status: 400 });
		}

		console.log(`Customer Email: ${customerEmail}, Customer Name: ${customerName}`);

		// Send email notification for purchase
		try {
			const endpoint = 'https://api.sendgrid.com/v3/mail/send';
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${SEND_GRID_API_KEY}`
				},
				body: JSON.stringify({
					personalizations: [
						{
							to: [{ email: customerEmail }, { email: 'jan@corelabs.digital' }],
							subject: `You've booked a 1 hour coaching session with me`
						}
					],
					from: {
						email: 'info@sveltesaaskit.com',
						name: 'Core Labs Coaching'
					},
					content: [
						{
							type: 'text/html',
							value: `<body style="font-family: Arial, sans-serif; background-color: #F9FAFB; margin: 0; padding: 0;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <tr>
      <td style="background-color: #4f46e5; padding: 20px; text-align: center;">
        <h1 style="color: #FFFFFF; font-size: 24px; margin: 0;">1 Hour Coaching Call Confirmed!</h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 20px; text-align: left;">
        <p style="color: #4B5563; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
          Hi <strong>${customerName}</strong>,
        </p>
        <p style="color: #4B5563; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
          This email is a confirmation of your <strong>one hour</strong> coaching call with me.</p>
        <p style="color: #4B5563; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
          Please reply to this email with some dates and times that work for you, and we’ll schedule your session.
        </p>
        <p style="color: #4B5563; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
          In the meantime, please send over what topics and problems you want to discuss in our call. The more details the better!
        </p>
        <p style="color: #4B5563; font-size: 16px; line-height: 1.5; margin: 20px 0 0 0;">
          Looking forward to connecting with you!
        </p>
        <p style="color: #4B5563; font-size: 16px; line-height: 1.5; margin: 20px 0 0 0;">
          Cheers,<br>
          Jan-Edward
        </p>
      </td>
    </tr>
  </table>
</body>`
						}
					]
				})
			});

			// Handle SendGrid API response
			if (!response.ok) {
				console.error('SendGrid API error:', await response.text());
			}
		} catch (err) {
			// Just log the error. Don't want to crash the whole webhook if sending an email doesn't work.
			console.error('Purchase email notification failed', err);
		}

		// Return successful purchase and user creation
		return json(
			{
				message: `Coaching called booked! Confirmation email sent to ${customerEmail}.`
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error('Error fetching line items or processing webhook:', err);
		return json({ message: 'Error processing webhook.', error: err.message }, { status: 500 });
	}
}

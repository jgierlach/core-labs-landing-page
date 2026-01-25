import { json } from '@sveltejs/kit';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST({ request, locals }) {
	const reqestBody = await request.json();
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card', 'klarna', 'us_bank_account'],
		line_items: [
			{
				price: reqestBody.priceId,
				quantity: 1
			}
		],
		mode: 'payment',
		success_url: `${'https://www.corelabs.digital'}/checkout/success`,
		cancel_url: `${'https://www.corelabs.digital'}/checkout/failure`
	});

	return json({ sessionId: session.id });
}

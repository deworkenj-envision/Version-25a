import Stripe from 'stripe';

export async function POST(request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !webhookSecret) {
    return Response.json({ ok: true, mode: 'demo', message: 'Webhook route is live. Add Stripe secrets to verify signatures.' });
  }

  const stripe = new Stripe(secret);
  const signature = request.headers.get('stripe-signature');
  const payload = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return Response.json({ ok: true, type: event.type });
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
}

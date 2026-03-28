import Stripe from 'stripe';

export async function POST(request) {
  const body = await request.json();
  const secret = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!secret) {
    return Response.json({
      ok: true,
      mode: 'demo',
      message: `Demo checkout ready for ${body.product} — add STRIPE_SECRET_KEY to enable live payments.`
    });
  }

  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${appUrl}/dashboard?paid=1`,
    cancel_url: `${appUrl}/checkout?canceled=1`,
    customer_email: body.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(Number(body.total || 0) * 100),
          product_data: {
            name: `${body.product} Order`,
            description: body.notes || 'PrintLuxe order'
          }
        }
      }
    ],
    metadata: {
      customer: body.customer || '',
      product: body.product || '',
      quantity: String(body.quantity || ''),
      finish: body.finish || ''
    }
  });

  return Response.json({ ok: true, url: session.url });
}

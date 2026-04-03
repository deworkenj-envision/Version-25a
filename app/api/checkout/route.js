import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const { orderId, productName, quantity, price = 50 } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      return Response.json(
        { error: "Missing NEXT_PUBLIC_SITE_URL" },
        { status: 500 }
      );
    }

    if (!orderId) {
      return Response.json({ error: "Missing order ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName || "Print Order",
            },
            unit_amount: Math.round(Number(price) * 100),
          },
          quantity: quantity || 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?paid=true&order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order?cancelled=true`,
      metadata: {
        orderId,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout route error:", error);
    return Response.json(
      { error: error.message || "Stripe checkout failed" },
      { status: 500 }
    );
  }
}
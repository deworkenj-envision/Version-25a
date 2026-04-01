import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      orderId,
      productName,
      quantity,
      price = 50, // fallback price
    } = body;

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
            unit_amount: price * 100, // dollars → cents
          },
          quantity: quantity || 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?paid=true&order=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/uploads`,

      metadata: {
        orderId,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return Response.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}
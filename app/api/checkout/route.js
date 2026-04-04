import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      productName,
      quantity,
      total,
      customerName,
      customerEmail,
    } = body;

    if (!productName) {
      return NextResponse.json(
        { error: "Missing product name" },
        { status: 400 }
      );
    }

    if (!quantity || Number(quantity) < 1) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    if (total === undefined || total === null || Number(total) <= 0) {
      return NextResponse.json(
        { error: "Invalid total" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_SITE_URL" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: customerName
                ? `Order for ${customerName}`
                : "Print order",
            },
            unit_amount: Math.round((Number(total) / Number(quantity)) * 100),
          },
          quantity: Number(quantity),
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order`,
      metadata: {
        product_name: productName || "",
        quantity: String(quantity || ""),
        total: String(total || ""),
        customer_name: customerName || "",
        customer_email: customerEmail || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Something went wrong creating checkout session",
      },
      { status: 500 }
    );
  }
}
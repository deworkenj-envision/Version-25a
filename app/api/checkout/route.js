import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY in environment variables." },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_SITE_URL in environment variables." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const body = await req.json();

    const productName =
      body.productName || body.product || body.product_name || "";
    const quantity = Number(body.quantity || 1);
    const total = Number(body.total || body.amount || body.price || 0);
    const customerName =
      body.customerName || body.name || body.customer_name || "";
    const customerEmail =
      body.customerEmail || body.email || body.customer_email || "";

    if (!productName) {
      return NextResponse.json(
        { error: "Missing product name." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid quantity." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: "Invalid total." },
        { status: 400 }
      );
    }

    const unitAmount = Math.round((total / quantity) * 100);

    if (!Number.isFinite(unitAmount) || unitAmount < 50) {
      return NextResponse.json(
        { error: "Calculated Stripe amount is invalid." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
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
            unit_amount: unitAmount,
          },
          quantity,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/orders`,
      metadata: {
        product_name: productName,
        quantity: String(quantity),
        total: String(total),
        customer_name: customerName,
        customer_email: customerEmail,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      {
        error:
          error?.message || "Something went wrong creating checkout session.",
      },
      { status: 500 }
    );
  }
}
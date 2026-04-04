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
      artworkUrl,
      artworkPath,
      notes,
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

    const descriptionParts = [];

    if (customerName) descriptionParts.push(`Customer: ${customerName}`);
    if (customerEmail) descriptionParts.push(`Email: ${customerEmail}`);
    if (artworkPath) descriptionParts.push(`Artwork: ${artworkPath}`);
    if (notes) descriptionParts.push(`Notes: ${notes}`);

    const productData = {
      name: productName,
    };

    if (descriptionParts.length > 0) {
      productData.description = descriptionParts.join(" | ");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: productData,
            unit_amount: Math.round((Number(total) / Number(quantity)) * 100),
          },
          quantity: Number(quantity),
        },
      ],
      metadata: {
        productName: productName || "",
        quantity: String(quantity || ""),
        total: String(total || ""),
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        artworkUrl: artworkUrl || "",
        artworkPath: artworkPath || "",
        notes: notes || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
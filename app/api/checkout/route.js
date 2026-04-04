import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ARTWORK_BUCKET = "order-artwork";

function buildArtworkUrl(value) {
  if (!value || typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return "";

  return `${supabaseUrl}/storage/v1/object/public/${ARTWORK_BUCKET}/${trimmed}`;
}

export async function POST(req) {
  try {
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

    const body = await req.json();

    const {
      productName,
      quantity,
      total,
      customerName,
      customerEmail,
      artworkUrl,
      publicUrl,
      filePath,
      file_path,
      artwork,
      artwork_path,
    } = body;

    if (!productName || typeof productName !== "string") {
      return NextResponse.json(
        { error: "Missing product name" },
        { status: 400 }
      );
    }

    const parsedQuantity = Number(quantity);
    if (!parsedQuantity || parsedQuantity < 1) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    const parsedTotal = Number(total);
    if (!parsedTotal || parsedTotal <= 0) {
      return NextResponse.json(
        { error: "Invalid total" },
        { status: 400 }
      );
    }

    const finalArtworkUrl = buildArtworkUrl(
      artworkUrl ||
        publicUrl ||
        filePath ||
        file_path ||
        artwork ||
        artwork_path ||
        ""
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: parsedQuantity,
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
            },
            unit_amount: Math.round((parsedTotal * 100) / parsedQuantity),
          },
        },
      ],
      customer_email: customerEmail || undefined,
      metadata: {
        productName: String(productName || ""),
        quantity: String(parsedQuantity),
        total: String(parsedTotal),
        customerName: String(customerName || ""),
        customerEmail: String(customerEmail || ""),
        artworkUrl: finalArtworkUrl,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
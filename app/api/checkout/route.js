import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toCents(value) {
  return Math.round(toNumber(value) * 100);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const customerName = (body.customerName || "").trim();
    const customerEmail = (body.customerEmail || "").trim();
    const customerPhone = (body.customerPhone || "").trim();

    const productName = (body.productName || "Print Order").trim();
    const size = (body.size || "").trim();
    const paper = (body.paper || "").trim();
    const finish = (body.finish || "").trim();
    const sides = (body.sides || "").trim();
    const quantity = toNumber(body.quantity, 1);

    const subtotal = toNumber(body.subtotal, 0);
    const shipping = toNumber(body.shipping, 0);
    const total = toNumber(body.total, subtotal + shipping);

    const artworkUrl = (body.artworkUrl || "").trim();
    const fileName = (body.fileName || body.artworkFileName || "").trim();
    const notes = (body.notes || "").trim();

    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email is required." },
        { status: 400 }
      );
    }

    if (!productName) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity is required." },
        { status: 400 }
      );
    }

    if (!artworkUrl) {
      return NextResponse.json(
        { error: "Please upload artwork before proceeding to payment." },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SITE_URL is missing." },
        { status: 500 }
      );
    }

    const productDetails = [size, paper, finish, sides]
      .filter(Boolean)
      .join(" • ");

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            description: productDetails || undefined,
          },
          unit_amount: toCents(subtotal),
        },
        quantity: 1,
      },
    ];

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: "Shipping charge",
          },
          unit_amount: toCents(shipping),
        },
        quantity: 1,
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,

      success_url: `${siteUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,

      customer_email: customerEmail,
      customer_creation: "always",

      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        productName: productName || "",
        size: size || "",
        paper: paper || "",
        finish: finish || "",
        sides: sides || "",
        quantity: String(quantity),
        subtotal: String(subtotal),
        shipping: String(shipping),
        total: String(total),
        artworkUrl: artworkUrl || "",
        fileName: fileName || "",
        notes: notes || "",
      },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe checkout session error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Unable to create Stripe checkout session.",
      },
      { status: 500 }
    );
  }
}
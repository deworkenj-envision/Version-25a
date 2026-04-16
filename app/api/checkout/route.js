import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function toCents(value) {
  return Math.round(Number(value || 0) * 100);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      productName,
      size,
      paper,
      finish,
      sides,
      quantity,
      subtotal,
      shipping,
      total,
      notes,
      fileName,
      artworkUrl,
    } = body || {};

    if (!customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Missing customer name or email." },
        { status: 400 }
      );
    }

    if (!productName) {
      return NextResponse.json(
        { error: "Missing product name." },
        { status: 400 }
      );
    }

    if (!artworkUrl) {
      return NextResponse.json(
        { error: "Artwork upload is required before checkout." },
        { status: 400 }
      );
    }

    const parsedQuantity = Number(quantity || 0);
    const parsedSubtotal = Number(subtotal || 0);
    const parsedShipping = Number(shipping || 0);
    const parsedTotal = Number(total || 0);

    if (!parsedQuantity || parsedQuantity < 1) {
      return NextResponse.json(
        { error: "Invalid quantity." },
        { status: 400 }
      );
    }

    if (parsedSubtotal < 0 || parsedShipping < 0 || parsedTotal <= 0) {
      return NextResponse.json(
        { error: "Invalid pricing values." },
        { status: 400 }
      );
    }

    const expectedTotal = Number((parsedSubtotal + parsedShipping).toFixed(2));
    const submittedTotal = Number(parsedTotal.toFixed(2));

    if (expectedTotal !== submittedTotal) {
      return NextResponse.json(
        {
          error: `Price mismatch. Expected total ${expectedTotal.toFixed(
            2
          )} but received ${submittedTotal.toFixed(2)}.`,
        },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.envisiondirect.net";

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            description: [
              size ? `Size: ${size}` : null,
              paper ? `Paper: ${paper}` : null,
              finish ? `Finish: ${finish}` : null,
              sides ? `Sides: ${sides}` : null,
              parsedQuantity ? `Quantity: ${parsedQuantity}` : null,
            ]
              .filter(Boolean)
              .join(" • "),
        },
        unit_amount: toCents(parsedSubtotal),
      },
      quantity: 1,
    },
    ];

    if (parsedShipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: "Standard shipping",
          },
          unit_amount: toCents(parsedShipping),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${siteUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/order`,
      metadata: {
        customerName: String(customerName || ""),
        customerEmail: String(customerEmail || ""),
        productName: String(productName || ""),
        size: String(size || ""),
        paper: String(paper || ""),
        finish: String(finish || ""),
        sides: String(sides || ""),
        quantity: String(parsedQuantity || ""),
        subtotal: String(parsedSubtotal.toFixed(2)),
        shipping: String(parsedShipping.toFixed(2)),
        total: String(parsedTotal.toFixed(2)),
        notes: String(notes || ""),
        fileName: String(fileName || ""),
        artworkUrl: String(artworkUrl || ""),
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
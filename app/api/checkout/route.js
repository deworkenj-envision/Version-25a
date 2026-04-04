import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      size,
      paper,
      finish,
      sides,
      quantity,
      fileName,
      filePath,
      notes,
      total,
      printPrice,
      shippingPrice,
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

    if (!customerName) {
      return NextResponse.json(
        { error: "Missing customer name" },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Missing customer email" },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    const unitAmount = Math.round(Number(total) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${productName} Order`,
              description: [
                size ? `Size: ${size}` : null,
                paper ? `Paper: ${paper}` : null,
                finish ? `Finish: ${finish}` : null,
                sides ? `Sides: ${sides}` : null,
              ]
                .filter(Boolean)
                .join(" • "),
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/order?canceled=1`,
      metadata: {
        productName: String(productName || ""),
        size: String(size || ""),
        paper: String(paper || ""),
        finish: String(finish || ""),
        sides: String(sides || ""),
        quantity: String(quantity || ""),
        fileName: String(fileName || ""),
        filePath: String(filePath || ""),
        notes: String(notes || ""),
        total: String(total || ""),
        printPrice: String(printPrice || ""),
        shippingPrice: String(shippingPrice || ""),
        customerName: String(customerName || ""),
        customerEmail: String(customerEmail || ""),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      {
        error:
          error?.message || "Something went wrong while creating Stripe checkout.",
      },
      { status: 500 }
    );
  }
}
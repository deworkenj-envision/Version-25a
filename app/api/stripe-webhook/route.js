import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const metadata = session.metadata || {};

      const productName = metadata.productName || "";
      const quantity = metadata.quantity ? Number(metadata.quantity) : 0;
      const total = metadata.total ? Number(metadata.total) : 0;
      const customerName = metadata.customerName || "";
      const customerEmail =
        metadata.customerEmail || session.customer_details?.email || "";
      const artworkUrl = metadata.artworkUrl || "";
      const notes = metadata.notes || "";

      const insertPayload = {
        customer_name: customerName,
        customer_email: customerEmail,
        product_name: productName,
        quantity,
        total,
        status: "paid",
        artwork_url: artworkUrl,
        notes,
      };

      const { error } = await supabaseAdmin
        .from("orders")
        .insert([insertPayload]);

      if (error) {
        console.error("Supabase insert error from webhook:", error);
        return NextResponse.json(
          { error: "Failed to save paid order" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
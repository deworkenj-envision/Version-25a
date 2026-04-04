import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const metadata = session.metadata || {};

      const orderPayload = {
        stripe_session_id: session.id || null,
        customer_name: metadata.customerName || session.customer_details?.name || "",
        customer_email: metadata.customerEmail || session.customer_details?.email || "",
        product_name: metadata.productName || "",
        quantity: metadata.quantity ? Number(metadata.quantity) : 1,
        total: session.amount_total ? session.amount_total / 100 : 0,
        artwork_url: metadata.artworkUrl || "",
        status: "paid",
      };

      const { error } = await supabaseAdmin.from("orders").insert([orderPayload]);

      if (error) {
        console.error("Failed to save order to database:", error);
        return NextResponse.json(
          { error: "Failed to save order to database" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};

      const stripeSessionId = session.id;

      // Prevent duplicate orders
      const { data: existing } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("stripe_session_id", stripeSessionId)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ received: true });
      }

      const orderData = {
        stripe_session_id: stripeSessionId,

        product_name: metadata.productName || "",
        quantity: Number(metadata.quantity || 1),

        paper: metadata.paper || "",
        finish: metadata.finish || "",
        size: metadata.size || "",
        sides: metadata.sides || "",

        customer_name: metadata.customerName || "",
        customer_email:
          metadata.customerEmail ||
          session.customer_details?.email ||
          "",

        total: Number(metadata.total || 0),
        subtotal: Number(metadata.subtotal || 0),
        shipping: Number(metadata.shipping || 0),

        notes: metadata.notes || "",

        artwork_url: metadata.artworkUrl || "",
        file_name: metadata.fileName || "",

        status: "paid",
      };

      const { error } = await supabaseAdmin
        .from("orders")
        .insert([orderData]);

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook crash:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
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
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};

      const orderNumber = `ORD-${Date.now()}`;

      const payload = {
        order_number: orderNumber,
        stripe_session_id: session.id,
        payment_status: session.payment_status || "paid",
        status: "paid",
        customer_name:
          metadata.customerName || session.customer_details?.name || "",
        customer_email:
          metadata.customerEmail || session.customer_details?.email || "",
        product_name: metadata.productName || "",
        size: metadata.size || "",
        paper: metadata.paper || "",
        finish: metadata.finish || "",
        sides: metadata.sides || "",
        quantity: Number(metadata.quantity || 0),
        artwork_url: metadata.artworkUrl || "",
        artwork_path: metadata.artworkPath || "",
        notes: metadata.notes || "",
        print_price: Number(metadata.printPrice || 0),
        shipping_price: Number(metadata.shippingPrice || 0),
        total: Number(metadata.total || 0),
      };

      const { error } = await supabaseAdmin
        .from("orders")
        .upsert([payload], {
          onConflict: "stripe_session_id",
        });

      if (error) {
        console.error("Supabase order upsert error:", error);
        return NextResponse.json(
          { error: "Failed to save order to database" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
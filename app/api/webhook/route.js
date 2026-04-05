import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

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
  } catch (err) {
    console.error("Stripe webhook signature error:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const metadata = session.metadata || {};

      const productName = metadata.productName || metadata.product_name || "";
      const quantity = Number(metadata.quantity || 1);
      const paper = metadata.paper || "";
      const finish = metadata.finish || "";
      const customerName = metadata.customerName || metadata.customer_name || "";
      const customerEmail =
        metadata.customerEmail ||
        metadata.customer_email ||
        session.customer_details?.email ||
        "";

      const total =
        typeof metadata.total !== "undefined" && metadata.total !== null
          ? Number(metadata.total)
          : session.amount_total
          ? Number(session.amount_total) / 100
          : 0;

      const artworkUrl = metadata.artworkUrl || metadata.artwork_url || null;
      const artworkPath = metadata.artworkPath || metadata.artwork_path || null;
      const artworkFileName =
        metadata.artworkFileName || metadata.artwork_file_name || null;

      const stripeSessionId = session.id;
      const paymentStatus = session.payment_status || "paid";

      const { data: existingOrder, error: existingOrderError } =
        await supabaseAdmin
          .from("orders")
          .select("id")
          .eq("stripe_session_id", stripeSessionId)
          .maybeSingle();

      if (existingOrderError) {
        console.error("Supabase lookup error:", existingOrderError);
        return NextResponse.json(
          { error: "Failed to check existing order" },
          { status: 500 }
        );
      }

      if (!existingOrder) {
        const orderToInsert = {
          stripe_session_id: stripeSessionId,
          product_name: productName,
          quantity,
          paper,
          finish,
          customer_name: customerName,
          customer_email: customerEmail,
          total,
          payment_status: paymentStatus,
          status: "paid",
          artwork_url: artworkUrl,
          artwork_path: artworkPath,
          artwork_file_name: artworkFileName,
        };

        const { error: insertError } = await supabaseAdmin
          .from("orders")
          .insert([orderToInsert]);

        if (insertError) {
          console.error("Supabase insert error:", insertError);
          return NextResponse.json(
            { error: "Failed to save order to database" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: err.message || "Webhook handler failed" },
      { status: 500 }
    );
  }
}
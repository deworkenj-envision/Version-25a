import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function generateOrderNumber(count) {
  const base = 10000 + count + 1;
  return `EV-${base}`;
}

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

      const { data: existing, error: existingError } = await supabaseAdmin
        .from("orders")
        .select("id, order_number, status")
        .eq("stripe_session_id", stripeSessionId)
        .maybeSingle();

      if (existingError) {
        console.error("Supabase existing lookup error:", existingError);
        return NextResponse.json(
          { error: "Failed to look up existing order" },
          { status: 500 }
        );
      }

      let orderNumber = existing?.order_number || null;

      if (!orderNumber) {
        const { count, error: countError } = await supabaseAdmin
          .from("orders")
          .select("*", { count: "exact", head: true });

        if (countError) {
          console.error("Supabase count error:", countError);
          return NextResponse.json(
            { error: "Failed to generate order number" },
            { status: 500 }
          );
        }

        orderNumber = generateOrderNumber(count || 0);
      }

      const orderData = {
        order_number: orderNumber,
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

      if (existing) {
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update(orderData)
          .eq("id", existing.id);

        if (updateError) {
          console.error("Supabase update error:", updateError);
          return NextResponse.json(
            { error: updateError.message },
            { status: 500 }
          );
        }
      } else {
        const { error: insertError } = await supabaseAdmin
          .from("orders")
          .insert([orderData]);

        if (insertError) {
          console.error("Supabase insert error:", insertError);
          return NextResponse.json(
            { error: insertError.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook crash:", err);
    return NextResponse.json(
      { error: err.message || "Webhook failed" },
      { status: 500 }
    );
  }
}
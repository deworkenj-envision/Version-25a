import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // ✅ PAYMENT SUCCESS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("Missing orderId in metadata");
        return NextResponse.json({ received: true });
      }

      // ✅ UPDATE ORDER STATUS
      const { error } = await supabaseAdmin
        .from("orders")
        .update({ status: "paid" })
        .eq("order_number", orderId);

      if (error) {
        console.error("Failed to update order:", error);
      } else {
        console.log("Order marked as PAID:", orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 400 }
    );
  }
}
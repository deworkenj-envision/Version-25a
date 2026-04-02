import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderNumber = session.metadata?.orderId;

      if (!orderNumber) {
        return new Response("Missing orderId in metadata", { status: 400 });
      }

      const { data: existingOrder, error: findError } = await supabaseAdmin
        .from("orders")
        .select("id, order_number, status")
        .eq("order_number", orderNumber)
        .maybeSingle();

      if (findError) {
        console.error("Order lookup failed:", findError);
        return new Response("Order lookup failed", { status: 500 });
      }

      if (!existingOrder) {
        console.error("No order found for:", orderNumber);
        return new Response("No matching order found", { status: 404 });
      }

      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          stripe_session_id: session.id,
        })
        .eq("order_number", orderNumber)
        .select("id, order_number, status")
        .maybeSingle();

      if (updateError) {
        console.error("Order update failed:", updateError);
        return new Response("Database update failed", { status: 500 });
      }

      if (!updatedOrder) {
        console.error("Update returned no row for:", orderNumber);
        return new Response("Update returned no row", { status: 500 });
      }

      console.log("Order marked paid:", updatedOrder.order_number);
    }

    return new Response("WEBHOOK-V2", { status: 200 });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { error } = await supabase.from("orders").insert([
        {
          status: "paid",
          total: session.amount_total ? session.amount_total / 100 : 0,
          stripe_session_id: session.id,
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        return new Response(`Supabase Error: ${error.message}`, { status: 500 });
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook handler failed:", err);
    return new Response(`Server Error: ${err.message}`, { status: 500 });
  }
}
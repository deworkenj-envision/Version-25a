import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  // ✅ Supabase client (server safe)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 🎯 Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const { error } = await supabase.from("orders").insert([
      {
        user_id: null, // update later with auth if needed
        status: "paid",
        total: session.amount_total / 100,
        stripe_session_id: session.id,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
    }
  }

  return new Response("Success", { status: 200 });
}
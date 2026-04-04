import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function makeOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ED-${y}${m}${d}-${rand}`;
}

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return new Response("Missing NEXT_PUBLIC_SUPABASE_URL", { status: 500 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
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
      const metadata = session.metadata || {};

      const productName = metadata.productName || "";
      const size = metadata.size || "";
      const paper = metadata.paper || "";
      const finish = metadata.finish || "";
      const sides = metadata.sides || "";
      const quantity = metadata.quantity ? Number(metadata.quantity) : 0;
      const fileName = metadata.fileName || "";
      const filePath = metadata.filePath || "";
      const notes = metadata.notes || "";
      const customerName =
        metadata.customerName || session.customer_details?.name || "";
      const customerEmail =
        metadata.customerEmail || session.customer_details?.email || "";
      const subtotal = metadata.printPrice ? Number(metadata.printPrice) : 0;
      const shipping = metadata.shippingPrice
        ? Number(metadata.shippingPrice)
        : 0;
      const total =
        metadata.total && Number(metadata.total) > 0
          ? Number(metadata.total)
          : session.amount_total
          ? session.amount_total / 100
          : 0;

      const orderData = {
        status: "paid",
        total,
        stripe_session_id: session.id,
        order_number: makeOrderNumber(),
        customer_name: customerName,
        customer_email: customerEmail,
        product_name: productName,
        size,
        paper,
        finish,
        sides,
        quantity,
        file_name: fileName,
        notes,
        artwork_url: filePath,
        shipping,
        subtotal,
      };

      const { error } = await supabase.from("orders").insert([orderData]);

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
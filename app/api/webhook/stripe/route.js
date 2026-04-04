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

      const filePath = metadata.filePath || metadata.artworkPath || "";
      const fileName =
        metadata.fileName || (filePath ? filePath.split("/").pop() : "");

      const artworkUrl =
        metadata.artworkUrl ||
        (filePath && process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/order-artwork/${filePath}`
          : "");

      const payload = {
        order_number: orderNumber,
        stripe_session_id: session.id,
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

        file_name: fileName,
        artwork_url: artworkUrl,

        notes: metadata.notes || "",
        shipping: Number(metadata.shippingPrice || 0),
        subtotal: Number(metadata.printPrice || 0),
        total: Number(metadata.total || 0),
      };

      const { error } = await supabaseAdmin
        .from("orders")
        .upsert([payload], {
          onConflict: "stripe_session_id",
        });

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
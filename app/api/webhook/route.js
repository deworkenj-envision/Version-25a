import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { buildOrderConfirmationEmail } from "../../../lib/emailTemplates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const EMAIL_FROM =
  process.env.RESEND_FROM || "EnVision Direct <orders@envisiondirect.net>";

async function sendEmail({ to, subject, html }) {
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY is missing." };
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Email send failed." };
  }
}

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

async function generateOrderNumber() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("order_number")
    .not("order_number", "is", null);

  if (error) {
    throw new Error(error.message || "Failed to generate order number.");
  }

  let maxNumber = 10000;

  for (const row of data || []) {
    const match = String(row.order_number || "").match(/EV-(\d+)/i);
    if (match) {
      const num = Number(match[1]);
      if (num > maxNumber) maxNumber = num;
    }
  }

  return `EV-${maxNumber + 1}`;
}

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature." },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};

      const stripeSessionId = session.id;
      const customerName =
        metadata.customerName || session.customer_details?.name || "";
      const customerEmail =
        metadata.customerEmail || session.customer_details?.email || "";
      const productName = metadata.productName || "";
      const size = metadata.size || "";
      const paper = metadata.paper || "";
      const finish = metadata.finish || "";
      const sides = metadata.sides || "";
      const quantity = toNumber(metadata.quantity, 0);
      const subtotal = toNumber(metadata.subtotal, 0);
      const shipping = toNumber(metadata.shipping, 0);
      const total = toNumber(metadata.total, 0);
      const notes = metadata.notes || "";
      const fileName = metadata.fileName || "";
      const artworkUrl = metadata.artworkUrl || "";

      const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("stripe_session_id", stripeSessionId)
        .maybeSingle();

      let orderRecord = null;

      if (existingOrder) {
        const { data: updatedOrder, error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            status: "paid",
            customer_name: customerName,
            customer_email: customerEmail,
            product_name: productName,
            size,
            paper,
            finish,
            sides,
            quantity,
            subtotal,
            shipping,
            total,
            file_name: fileName,
            artwork_url: artworkUrl,
            notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingOrder.id)
          .select("*")
          .single();

        if (updateError) {
          throw new Error(updateError.message || "Failed to update order.");
        }

        orderRecord = updatedOrder;
      } else {
        const orderNumber = await generateOrderNumber();

        const { data: insertedOrder, error: insertError } = await supabaseAdmin
          .from("orders")
          .insert({
            order_number: orderNumber,
            stripe_session_id: stripeSessionId,
            status: "paid",
            customer_name: customerName,
            customer_email: customerEmail,
            product_name: productName,
            size,
            paper,
            finish,
            sides,
            quantity,
            subtotal,
            shipping,
            total,
            file_name: fileName,
            artwork_url: artworkUrl,
            notes,
          })
          .select("*")
          .single();

        if (insertError) {
          throw new Error(insertError.message || "Failed to insert order.");
        }

        orderRecord = insertedOrder;
      }

      if (orderRecord?.customer_email) {
        const confirmationEmail = buildOrderConfirmationEmail({
          orderNumber: orderRecord.order_number || orderRecord.id,
          customerName: orderRecord.customer_name,
          productName: orderRecord.product_name,
          size: orderRecord.size,
          paper: orderRecord.paper,
          finish: orderRecord.finish,
          sides: orderRecord.sides,
          quantity: orderRecord.quantity,
          subtotal: orderRecord.subtotal ?? orderRecord.total ?? 0,
          shipping: orderRecord.shipping ?? 0,
          total: orderRecord.total ?? 0,
          fileName: orderRecord.file_name,
        });

        await sendEmail({
          to: orderRecord.customer_email,
          subject: confirmationEmail.subject,
          html: confirmationEmail.html,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return NextResponse.json(
      { error: error.message || "Webhook error." },
      { status: 400 }
    );
  }
}
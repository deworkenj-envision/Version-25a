import Stripe from "stripe";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function generateTrackingToken() {
  return randomBytes(24).toString("hex");
}

function getBaseUrl(req) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    new URL(req.url).origin
  ).replace(/\/$/, "");
}

async function ensureTrackingToken(orderId, existingToken) {
  if (existingToken) return existingToken;

  const token = generateTrackingToken();

  await supabaseAdmin
    .from("orders")
    .update({ tracking_token: token })
    .eq("id", orderId);

  return token;
}

function buildOrderConfirmationEmailHtml(order, trackingUrl) {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Thank you for your order</h2>
      <p>Hello ${order.customer_name || "Customer"},</p>
      <p>Your order <strong>${order.order_number}</strong> has been received.</p>

      <p>
        <a href="${trackingUrl}" style="background:#2563eb;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;">
          Track Your Order
        </a>
      </p>
    </div>
  `;
}

async function sendOrderConfirmationEmail(req, order) {
  if (!resend || !order?.customer_email) return;

  const token = await ensureTrackingToken(order.id, order.tracking_token);
  const trackingUrl = `${getBaseUrl(req)}/track?token=${token}`;

  await resend.emails.send({
    from: "EnVision Direct <orders@envisiondirect.net>",
    to: order.customer_email,
    subject: `Order Confirmation ${order.order_number}`,
    html: buildOrderConfirmationEmailHtml(order, trackingUrl),
  });
}

async function findAndUpdateOrder(session) {
  const updates = {
    status: "paid",
    stripe_session_id: session.id,

    // ✅ KEEP YOUR ORIGINAL DATA (do NOT overwrite)
    customer_email:
      session.metadata?.customerEmail ||
      session.customer_details?.email ||
      null,
  };

  let order = null;

  if (session.metadata?.orderId) {
    const { data } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("id", session.metadata.orderId)
      .select("*")
      .maybeSingle();

    if (data) order = data;
  }

  if (!order) {
    const { data } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("stripe_session_id", session.id)
      .select("*")
      .maybeSingle();

    if (data) order = data;
  }

  return order;
}

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
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
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const order = await findAndUpdateOrder(session);

    if (order) {
      await sendOrderConfirmationEmail(req, order);
    }
  }

  return new Response("ok", { status: 200 });
}
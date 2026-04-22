import Stripe from "stripe";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

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

  const newToken = generateTrackingToken();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ tracking_token: newToken })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message || "Failed to create tracking token.");
  }

  return newToken;
}

function buildOrderConfirmationEmailHtml(order, trackingUrl) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Thank you for your order</h2>
      <p>Hello ${order.customer_name || "Customer"},</p>
      <p>We received your order <strong>${order.order_number || ""}</strong> and payment has been confirmed.</p>

      <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px;">
        <p style="margin: 0 0 8px;"><strong>Order Number:</strong> ${order.order_number || "—"}</p>
        <p style="margin: 0 0 8px;"><strong>Product:</strong> ${order.product_name || "—"}</p>
        <p style="margin: 0 0 8px;"><strong>Quantity:</strong> ${order.quantity || "—"}</p>
        <p style="margin: 0 0 8px;"><strong>Status:</strong> ${order.status || "paid"}</p>
        <p style="margin: 0;"><strong>Total:</strong> $${Number(order.total || 0).toFixed(2)}</p>
      </div>

      <p style="margin-top: 20px;">
        <a href="${trackingUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 700;">
          Track Your Order
        </a>
      </p>

      <p style="margin-top: 18px;">
        You can use the secure tracking link above anytime to check your order status.
      </p>

      <p>Thank you for choosing EnVision Direct.</p>
    </div>
  `;
}

async function sendOrderConfirmationEmail(req, order) {
  if (!resend) return;
  if (!order?.customer_email) return;

  const trackingToken = await ensureTrackingToken(order.id, order.tracking_token);
  const baseUrl = getBaseUrl(req);
  const trackingUrl = `${baseUrl}/track?token=${trackingToken}`;

  await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ||
      "EnVision Direct <orders@envisiondirect.net>",
    to: order.customer_email,
    subject: `Order Confirmation ${order.order_number || ""}`,
    html: buildOrderConfirmationEmailHtml(
      { ...order, tracking_token: trackingToken },
      trackingUrl
    ),
  });
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

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const sessionId = session.id;
      const metadata = session.metadata || {};
      const customerEmail =
        session.customer_details?.email ||
        metadata.customerEmail ||
        null;
      const customerName =
        session.customer_details?.name ||
        metadata.customerName ||
        null;

      const updates = {
        status: "paid",
      };

      if (customerEmail) updates.customer_email = customerEmail;
      if (customerName) updates.customer_name = customerName;
      if (sessionId) updates.stripe_session_id = sessionId;

      let updatedOrder = null;

      if (sessionId) {
        const { data, error } = await supabaseAdmin
          .from("orders")
          .update(updates)
          .eq("stripe_session_id", sessionId)
          .select("*")
          .maybeSingle();

        if (error) {
          console.error("Order update by stripe_session_id failed:", error.message);
        } else {
          updatedOrder = data;
        }
      }

      if (!updatedOrder && metadata.orderId) {
        const { data, error } = await supabaseAdmin
          .from("orders")
          .update(updates)
          .eq("id", metadata.orderId)
          .select("*")
          .maybeSingle();

        if (error) {
          console.error("Order update by metadata.orderId failed:", error.message);
        } else {
          updatedOrder = data;
        }
      }

      if (!updatedOrder && metadata.orderNumber) {
        const { data, error } = await supabaseAdmin
          .from("orders")
          .update(updates)
          .ilike("order_number", metadata.orderNumber)
          .select("*")
          .maybeSingle();

        if (error) {
          console.error("Order update by metadata.orderNumber failed:", error.message);
        } else {
          updatedOrder = data;
        }
      }

      if (updatedOrder) {
        try {
          await sendOrderConfirmationEmail(req, updatedOrder);
        } catch (emailError) {
          console.error("Confirmation email failed:", emailError.message);
        }
      } else {
        console.error("No matching order found for completed checkout session:", sessionId);
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
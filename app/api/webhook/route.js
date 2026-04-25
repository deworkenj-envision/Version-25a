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

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
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
  const shippingLine2 = order.shipping_address_line2
    ? `<div>${order.shipping_address_line2}</div>`
    : "";

  return `
    <div style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;padding:28px 18px;">
        <div style="background:#0f172a;border-radius:22px;padding:28px;text-align:center;color:white;">
          <div style="display:inline-block;background:white;color:#0f172a;border-radius:14px;padding:12px 16px;font-weight:900;font-size:20px;letter-spacing:-1px;">
            EV
          </div>
          <div style="margin-top:16px;color:#22d3ee;font-size:12px;font-weight:700;letter-spacing:4px;text-transform:uppercase;">
            EnVision Direct
          </div>
          <h1 style="margin:14px 0 0;font-size:30px;line-height:1.2;">
            Order Confirmed
          </h1>
          <p style="margin:12px 0 0;color:#cbd5e1;font-size:15px;">
            Thank you, ${order.customer_name || "Customer"}. We received your order and payment.
          </p>
        </div>

        <div style="margin-top:18px;background:white;border:1px solid #e2e8f0;border-radius:22px;padding:24px;">
          <h2 style="margin:0 0 16px;font-size:22px;">Order Summary</h2>

          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tr>
              <td style="padding:10px 0;color:#64748b;">Order Number</td>
              <td style="padding:10px 0;text-align:right;font-weight:700;">${order.order_number || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#64748b;">Product</td>
              <td style="padding:10px 0;text-align:right;font-weight:700;">${order.product_name || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#64748b;">Quantity</td>
              <td style="padding:10px 0;text-align:right;font-weight:700;">${order.quantity || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#64748b;">Size</td>
              <td style="padding:10px 0;text-align:right;font-weight:700;">${order.size || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#64748b;">Paper</td>
              <td style="padding:10px 0;text-align:right;font-weight:700;">${order.paper || "—"}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#64748b;">Finish</td>
              <td style="padding:10px 0;text-align:right;font-weight:700;">${order.finish || "—"}</td>
            </tr>
            <tr>
              <td style="padding:14px 0 0;color:#0f172a;font-size:18px;font-weight:800;border-top:1px solid #e2e8f0;">Total</td>
              <td style="padding:14px 0 0;text-align:right;color:#0f172a;font-size:22px;font-weight:900;border-top:1px solid #e2e8f0;">${money(order.total)}</td>
            </tr>
          </table>

          <div style="margin-top:24px;text-align:center;">
            <a href="${trackingUrl}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:800;font-size:15px;">
              Track Your Order
            </a>
          </div>
        </div>

        <div style="margin-top:18px;display:block;background:white;border:1px solid #e2e8f0;border-radius:22px;padding:24px;">
          <h2 style="margin:0 0 16px;font-size:22px;">Customer Information</h2>
          <div style="font-size:15px;line-height:1.7;">
            <div><strong>Name:</strong> ${order.customer_name || "—"}</div>
            <div><strong>Email:</strong> ${order.customer_email || "—"}</div>
            <div><strong>Phone:</strong> ${order.customer_phone || "—"}</div>
          </div>
        </div>

        <div style="margin-top:18px;display:block;background:white;border:1px solid #e2e8f0;border-radius:22px;padding:24px;">
          <h2 style="margin:0 0 16px;font-size:22px;">Shipping Information</h2>
          <div style="font-size:15px;line-height:1.7;">
            <div><strong>Ship To:</strong> ${order.shipping_name || "—"}</div>
            <div>${order.shipping_address_line1 || "—"}</div>
            ${shippingLine2}
            <div>${order.shipping_city || "—"}, ${order.shipping_state || "—"} ${order.shipping_postal_code || ""}</div>
            <div>${order.shipping_country || "US"}</div>
          </div>
        </div>

        ${
          order.notes
            ? `<div style="margin-top:18px;background:white;border:1px solid #e2e8f0;border-radius:22px;padding:24px;">
                <h2 style="margin:0 0 16px;font-size:22px;">Order Notes</h2>
                <div style="white-space:pre-wrap;font-size:15px;line-height:1.7;color:#334155;">${order.notes}</div>
              </div>`
            : ""
        }

        <p style="margin:20px 0 0;text-align:center;color:#64748b;font-size:13px;line-height:1.6;">
          You can use the secure tracking link above anytime to check your order status.<br/>
          Thank you for choosing EnVision Direct.
        </p>
      </div>
    </div>
  `;
}

async function sendOrderConfirmationEmail(req, order) {
  if (!resend || !order?.customer_email) return;

  const token = await ensureTrackingToken(order.id, order.tracking_token);
  const trackingUrl = `${getBaseUrl(req)}/track?token=${token}`;

  await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ||
      "EnVision Direct <orders@envisiondirect.net>",
    to: order.customer_email,
    subject: `Order Confirmation ${order.order_number || ""}`,
    html: buildOrderConfirmationEmailHtml(order, trackingUrl),
  });
}

async function findAndUpdateOrder(session) {
  const updates = {
    status: "paid",
    stripe_session_id: session.id,
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

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const order = await findAndUpdateOrder(session);

      if (order) {
        try {
          await sendOrderConfirmationEmail(req, order);
        } catch (emailError) {
          console.error("Confirmation email failed:", emailError.message);
        }
      }
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
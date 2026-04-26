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

function buildOrderConfirmationEmailHtml(order, trackingUrl, baseUrl) {
  const logoUrl = `${baseUrl}/images/logo-hero.png`;

  const shippingLine2 = order.shipping_address_line2
    ? `<div>${order.shipping_address_line2}</div>`
    : "";

  const artworkFile = order.file_name || "Uploaded artwork file";

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
        <div style="background:#ffffff;border:1px solid #dbe6f3;border-radius:24px;overflow:hidden;box-shadow:0 16px 40px rgba(15,43,82,0.12);">

          <div style="background:linear-gradient(135deg,#2457f5,#0e98ff);padding:30px 24px;text-align:center;color:white;">
            <img
              src="${logoUrl}"
              alt="EnVision Direct"
              width="290"
              style="display:block;margin:0 auto 18px;max-width:290px;width:100%;height:auto;border-radius:8px;"
            />

            <div style="width:54px;height:54px;margin:0 auto 14px;border-radius:50%;background:#16a34a;color:white;font-size:34px;font-weight:900;line-height:54px;">
              ✓
            </div>

            <h1 style="margin:0;font-size:32px;line-height:1.2;color:#ffffff;">
              Order Confirmed
            </h1>

            <p style="margin:12px 0 0;color:#eaf2ff;font-size:15px;line-height:1.6;">
              Thank you, ${order.customer_name || "Customer"}. We received your payment and artwork.
            </p>
          </div>

          <div style="padding:26px 24px;">
            <div style="background:#f8fbff;border:1px solid #dbe6f3;border-radius:18px;padding:18px;text-align:center;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">
                Order Number
              </div>
              <div style="margin-top:6px;font-size:28px;font-weight:900;color:#071b3a;">
                ${order.order_number || "Order Confirmed"}
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr;gap:16px;">
              <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;">
                <h2 style="margin:0 0 14px;font-size:20px;color:#071b3a;">Order Summary</h2>

                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr>
                    <td style="padding:9px 0;color:#64748b;">Product</td>
                    <td style="padding:9px 0;text-align:right;font-weight:700;">${order.product_name || "—"}</td>
                  </tr>
                  <tr>
                    <td style="padding:9px 0;color:#64748b;">Quantity</td>
                    <td style="padding:9px 0;text-align:right;font-weight:700;">${order.quantity || "—"}</td>
                  </tr>
                  <tr>
                    <td style="padding:9px 0;color:#64748b;">Size</td>
                    <td style="padding:9px 0;text-align:right;font-weight:700;">${order.size || "—"}</td>
                  </tr>
                  <tr>
                    <td style="padding:9px 0;color:#64748b;">Paper</td>
                    <td style="padding:9px 0;text-align:right;font-weight:700;">${order.paper || "—"}</td>
                  </tr>
                  <tr>
                    <td style="padding:9px 0;color:#64748b;">Finish</td>
                    <td style="padding:9px 0;text-align:right;font-weight:700;">${order.finish || "—"}</td>
                  </tr>
                  <tr>
                    <td style="padding:9px 0;color:#64748b;">Sides</td>
                    <td style="padding:9px 0;text-align:right;font-weight:700;">${order.sides || "—"}</td>
                  </tr>
                  <tr>
                    <td style="padding:14px 0 0;color:#0f172a;font-size:18px;font-weight:800;border-top:1px solid #e2e8f0;">Total</td>
                    <td style="padding:14px 0 0;text-align:right;color:#0f172a;font-size:22px;font-weight:900;border-top:1px solid #e2e8f0;">${money(order.total)}</td>
                  </tr>
                </table>
              </div>

              <div style="border:1px solid #bfdbfe;background:#eff6ff;border-radius:18px;padding:18px;">
                <h2 style="margin:0 0 10px;font-size:20px;color:#071b3a;">Artwork Received</h2>
                <p style="margin:0;color:#334155;font-size:15px;line-height:1.6;">
                  Your uploaded artwork file has been attached to your order.
                </p>
                <div style="margin-top:12px;background:white;border:1px solid #dbeafe;border-radius:14px;padding:12px;font-weight:800;color:#0f172a;word-break:break-word;">
                  ${artworkFile}
                </div>
              </div>

              <div style="border:1px solid #dcfce7;background:#f0fdf4;border-radius:18px;padding:18px;">
                <h2 style="margin:0 0 10px;font-size:20px;color:#166534;">What Happens Next</h2>
                <div style="font-size:15px;line-height:1.8;color:#166534;font-weight:700;">
                  <div>✓ Artwork received</div>
                  <div>✓ Order is being reviewed</div>
                  <div>✓ Email updates will be sent as your order progresses</div>
                </div>
              </div>

              <div style="text-align:center;margin:8px 0 4px;">
                <a href="${trackingUrl}" style="display:inline-block;background:#0b5cff;color:white;text-decoration:none;padding:15px 24px;border-radius:14px;font-weight:900;font-size:15px;">
                  Track Your Order
                </a>
              </div>

              <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;">
                <h2 style="margin:0 0 14px;font-size:20px;">Customer Information</h2>
                <div style="font-size:15px;line-height:1.7;">
                  <div><strong>Name:</strong> ${order.customer_name || "—"}</div>
                  <div><strong>Email:</strong> ${order.customer_email || "—"}</div>
                  <div><strong>Phone:</strong> ${order.customer_phone || "—"}</div>
                </div>
              </div>

              <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;">
                <h2 style="margin:0 0 14px;font-size:20px;">Shipping Information</h2>
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
                  ? `<div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;">
                      <h2 style="margin:0 0 14px;font-size:20px;">Order Notes</h2>
                      <div style="white-space:pre-wrap;font-size:15px;line-height:1.7;color:#334155;">${order.notes}</div>
                    </div>`
                  : ""
              }
            </div>

            <p style="margin:24px 0 0;text-align:center;color:#64748b;font-size:13px;line-height:1.6;">
              You can use the secure tracking link anytime to check your order status.<br/>
              Thank you for choosing EnVision Direct.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function sendOrderConfirmationEmail(req, order) {
  if (!resend || !order?.customer_email) return;

  const baseUrl = getBaseUrl(req);
  const token = await ensureTrackingToken(order.id, order.tracking_token);
  const trackingUrl = `${baseUrl}/track?token=${token}`;

  await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ||
      "EnVision Direct <orders@envisiondirect.net>",
    to: order.customer_email,
    subject: `Order Confirmed - ${order.order_number || "EnVision Direct"}`,
    html: buildOrderConfirmationEmailHtml(order, trackingUrl, baseUrl),
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
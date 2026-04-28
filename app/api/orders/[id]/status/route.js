import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ALLOWED_STATUSES = ["pending", "paid", "printing", "shipped", "delivered"];

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

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCarrierTrackingLink(carrier, trackingNumber) {
  if (!trackingNumber) return "";

  const num = encodeURIComponent(trackingNumber.trim());
  const normalized = (carrier || "").toLowerCase();

  if (normalized === "ups") return `https://www.ups.com/track?tracknum=${num}`;
  if (normalized === "usps") return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`;
  if (normalized === "fedex") return `https://www.fedex.com/fedextrack/?trknbr=${num}`;

  return "";
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

/* =========================
   BRANDED EMAIL SYSTEM
========================= */

function primaryButton(label, url, color = "#0b5cff") {
  if (!url) return "";

  return `
    <a href="${url}" style="
      display:inline-block;
      background:${color};
      color:#ffffff;
      text-decoration:none;
      padding:15px 24px;
      border-radius:14px;
      font-weight:900;
      font-size:15px;
      margin:8px 6px;
    ">
      ${label}
    </a>
  `;
}

function orderSummaryCard(order) {
  return `
    <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;background:#ffffff;">
      <h2 style="margin:0 0 14px;font-size:20px;color:#071b3a;">Order Summary</h2>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:9px 0;color:#64748b;">Order Number</td>
          <td style="padding:9px 0;text-align:right;font-weight:800;color:#0f172a;">${escapeHtml(order.order_number || "—")}</td>
        </tr>
        <tr>
          <td style="padding:9px 0;color:#64748b;">Status</td>
          <td style="padding:9px 0;text-align:right;font-weight:800;color:#0f172a;text-transform:capitalize;">${escapeHtml(order.status || "—")}</td>
        </tr>
        <tr>
          <td style="padding:9px 0;color:#64748b;">Product</td>
          <td style="padding:9px 0;text-align:right;font-weight:800;color:#0f172a;">${escapeHtml(order.product_name || "—")}</td>
        </tr>
        <tr>
          <td style="padding:9px 0;color:#64748b;">Quantity</td>
          <td style="padding:9px 0;text-align:right;font-weight:800;color:#0f172a;">${escapeHtml(order.quantity || "—")}</td>
        </tr>
        <tr>
          <td style="padding:9px 0;color:#64748b;">Size</td>
          <td style="padding:9px 0;text-align:right;font-weight:800;color:#0f172a;">${escapeHtml(order.size || "—")}</td>
        </tr>
        <tr>
          <td style="padding:9px 0;color:#64748b;">Paper</td>
          <td style="padding:9px 0;text-align:right;font-weight:800;color:#0f172a;">${escapeHtml(order.paper || "—")}</td>
        </tr>
        <tr>
          <td style="padding:9px 0;color:#64748b;">Finish</td>
          <td style="padding:9px 0;text-align:right;font-weight:800;color:#0f172a;">${escapeHtml(order.finish || "—")}</td>
        </tr>
        <tr>
          <td style="padding:9px 0;color:#64748b;">Sides</td>
          <td style="padding:9px 0;text-align:right;font-weight:800;color:#0f172a;">${escapeHtml(order.sides || "—")}</td>
        </tr>
        <tr>
          <td style="padding:14px 0 0;color:#0f172a;font-size:18px;font-weight:900;border-top:1px solid #e2e8f0;">Total</td>
          <td style="padding:14px 0 0;text-align:right;color:#0f172a;font-size:22px;font-weight:900;border-top:1px solid #e2e8f0;">${money(order.total)}</td>
        </tr>
      </table>
    </div>
  `;
}

function brandedEmail({
  baseUrl,
  color = "#2457f5",
  badge = "✓",
  title,
  subtitle,
  customerName,
  content,
}) {
  const logoUrl = `${baseUrl}/images/logo-hero.png`;

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
        <div style="background:#ffffff;border:1px solid #dbe6f3;border-radius:24px;overflow:hidden;box-shadow:0 16px 40px rgba(15,43,82,0.12);">

          <div style="background:linear-gradient(135deg,${color},#0e98ff);padding:30px 24px;text-align:center;color:white;">
            <img src="${logoUrl}" alt="EnVision Direct" width="290" style="display:block;margin:0 auto 18px;max-width:290px;width:100%;height:auto;border-radius:8px;" />

            <div style="width:54px;height:54px;margin:0 auto 14px;border-radius:50%;background:rgba(255,255,255,0.22);color:white;font-size:30px;font-weight:900;line-height:54px;">
              ${badge}
            </div>

            <h1 style="margin:0;font-size:32px;line-height:1.2;color:#ffffff;">
              ${title}
            </h1>

            <p style="margin:12px 0 0;color:#eaf2ff;font-size:15px;line-height:1.6;">
              Hello ${escapeHtml(customerName || "Customer")}, ${subtitle}
            </p>
          </div>

          <div style="padding:26px 24px;">
            ${content}

            <p style="margin:24px 0 0;text-align:center;color:#64748b;font-size:13px;line-height:1.6;">
              Thank you for choosing EnVision Direct.<br/>
              Premium Printing • Fast Turnaround • Trusted Quality
            </p>
          </div>

        </div>
      </div>
    </div>
  `;
}

/* =========================
   SPECIFIC EMAILS
========================= */

function buildPrintingEmail(order, trackingUrl, baseUrl) {
  return brandedEmail({
    baseUrl,
    color: "#f59e0b",
    badge: "🖨",
    title: "Printing Started",
    subtitle: "your order is now in production.",
    customerName: order.customer_name,
    content: `
      <div style="border:1px solid #fef3c7;background:#fffbeb;border-radius:18px;padding:18px;margin-bottom:18px;">
        <h2 style="margin:0 0 10px;font-size:20px;color:#92400e;">Your artwork is approved</h2>
        <p style="margin:0;color:#92400e;font-size:15px;line-height:1.7;font-weight:700;">
          Your order has moved into production. We’ll email you again when it ships.
        </p>
      </div>

      ${orderSummaryCard(order)}

      <div style="text-align:center;margin-top:22px;">
        ${primaryButton("Track Order Progress", trackingUrl, "#0b5cff")}
      </div>
    `,
  });
}

function buildShippedEmail(order, trackingUrl, carrierLink, baseUrl) {
  return brandedEmail({
    baseUrl,
    color: "#2563eb",
    badge: "🚚",
    title: "Your Order Has Shipped",
    subtitle: "your order is on the way.",
    customerName: order.customer_name,
    content: `
      <div style="border:1px solid #bfdbfe;background:#eff6ff;border-radius:18px;padding:18px;margin-bottom:18px;">
        <h2 style="margin:0 0 10px;font-size:20px;color:#1e3a8a;">Tracking Information</h2>
        <p style="margin:0 0 8px;color:#1e3a8a;font-size:15px;line-height:1.7;">
          <strong>Carrier:</strong> ${escapeHtml(order.tracking_carrier || "—")}
        </p>
        <p style="margin:0;color:#1e3a8a;font-size:15px;line-height:1.7;">
          <strong>Tracking Number:</strong> ${escapeHtml(order.tracking_number || "—")}
        </p>
      </div>

      ${orderSummaryCard(order)}

      <div style="text-align:center;margin-top:22px;">
        ${primaryButton("View Order Status", trackingUrl, "#0b5cff")}
        ${carrierLink ? primaryButton("Track With Carrier", carrierLink, "#16a34a") : ""}
      </div>
    `,
  });
}

function buildDeliveredEmail(order, trackingUrl, baseUrl) {
  return brandedEmail({
    baseUrl,
    color: "#16a34a",
    badge: "✓",
    title: "Your Order Was Delivered",
    subtitle: "your order has been marked as delivered.",
    customerName: order.customer_name,
    content: `
      <div style="border:1px solid #bbf7d0;background:#f0fdf4;border-radius:18px;padding:18px;margin-bottom:18px;">
        <h2 style="margin:0 0 10px;font-size:20px;color:#166534;">Delivered Successfully</h2>
        <p style="margin:0;color:#166534;font-size:15px;line-height:1.7;font-weight:700;">
          We hope everything looks great. Your order details are below.
        </p>
      </div>

      ${orderSummaryCard(order)}

      <div style="text-align:center;margin-top:22px;">
        ${primaryButton("View Order Status", trackingUrl, "#0b5cff")}
      </div>
    `,
  });
}

function buildReviewEmail(order, baseUrl) {
  const reviewUrl = `${baseUrl}/review?order=${encodeURIComponent(
    order.order_number || ""
  )}`;

  return brandedEmail({
    baseUrl,
    color: "#f59e0b",
    badge: "★",
    title: "How Did We Do?",
    subtitle: "we’d love your feedback.",
    customerName: order.customer_name,
    content: `
      <div style="border:1px solid #fef3c7;background:#fffbeb;border-radius:18px;padding:18px;margin-bottom:18px;text-align:center;">
        <h2 style="margin:0 0 10px;font-size:22px;color:#92400e;">Thank you for your order</h2>
        <p style="margin:0;color:#92400e;font-size:15px;line-height:1.7;">
          Your feedback helps us improve and helps other customers choose EnVision Direct.
        </p>
      </div>

      ${orderSummaryCard(order)}

      <div style="text-align:center;margin-top:22px;">
        ${primaryButton("Leave a Review", reviewUrl, "#f59e0b")}
      </div>
    `,
  });
}

/* =========================
   SEND EMAIL LOGIC
========================= */

async function sendStatusEmail(req, order, status) {
  if (!resend || !order?.customer_email) return;

  const token = await ensureTrackingToken(order.id, order.tracking_token);
  const baseUrl = getBaseUrl(req);
  const trackingUrl = `${baseUrl}/track/${encodeURIComponent(token)}`;
  const carrierLink = getCarrierTrackingLink(
    order.tracking_carrier,
    order.tracking_number
  );

  const from =
    process.env.RESEND_FROM_EMAIL ||
    "EnVision Direct <orders@envisiondirect.net>";

  if (status === "printing") {
    await resend.emails.send({
      from,
      to: order.customer_email,
      subject: `Your order ${order.order_number} is printing`,
      html: buildPrintingEmail(order, trackingUrl, baseUrl),
    });
  }

  if (status === "shipped") {
    await resend.emails.send({
      from,
      to: order.customer_email,
      subject: `Your order ${order.order_number} has shipped`,
      html: buildShippedEmail(order, trackingUrl, carrierLink, baseUrl),
    });
  }

  if (status === "delivered") {
    await resend.emails.send({
      from,
      to: order.customer_email,
      subject: `Your order ${order.order_number} was delivered`,
      html: buildDeliveredEmail(order, trackingUrl, baseUrl),
    });

    await resend.emails.send({
      from,
      to: order.customer_email,
      subject: `How was your order?`,
      html: buildReviewEmail(order, baseUrl),
    });
  }
}

/* =========================
   API ROUTE
========================= */

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const status = (body?.status || "").toLowerCase().trim();
    const tracking_number = body?.tracking_number || null;
    const tracking_carrier = body?.tracking_carrier || null;

    if (!id) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        tracking_number,
        tracking_carrier,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      await sendStatusEmail(req, order, status);
    } catch (e) {
      console.error("Email error:", e);
    }

    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
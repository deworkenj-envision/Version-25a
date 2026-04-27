import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

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

async function ensureTrackingToken(order) {
  if (order?.tracking_token) return order.tracking_token;

  const token = generateTrackingToken();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ tracking_token: token })
    .eq("id", order.id);

  if (error) {
    throw new Error(error.message || "Failed to create tracking token.");
  }

  return token;
}

async function addOrderEvent(orderId, eventType, eventLabel, eventNote = null) {
  try {
    await supabaseAdmin.from("order_events").insert({
      order_id: orderId,
      event_type: eventType,
      event_label: eventLabel,
      event_note: eventNote,
    });
  } catch (err) {
    console.error("Failed to add order event:", err?.message || err);
  }
}

/* =========================
   EMAIL DESIGN SYSTEM
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
      <h2 style="margin:0 0 14px;font-size:20px;">Order Summary</h2>

      <p><strong>Order:</strong> ${escapeHtml(order.order_number)}</p>
      <p><strong>Status:</strong> ${escapeHtml(order.status)}</p>
      <p><strong>Product:</strong> ${escapeHtml(order.product_name)}</p>
      <p><strong>Quantity:</strong> ${escapeHtml(order.quantity)}</p>
      <p><strong>Total:</strong> ${money(order.total)}</p>
    </div>
  `;
}

function brandedEmail({
  baseUrl,
  title,
  subtitle,
  customerName,
  content,
}) {
  const logoUrl = `${baseUrl}/images/logo-hero.png`;

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:720px;margin:auto;padding:28px 16px;">
        <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- CLEAN HEADER -->
          <div style="padding:24px;text-align:center;border-bottom:1px solid #e5e7eb;">
            <img src="${logoUrl}" style="max-width:200px;" />
          </div>

          <!-- BODY -->
          <div style="padding:26px 24px;">

            <div style="text-align:center;margin-bottom:20px;">
              <h1 style="margin:0;font-size:24px;color:#111827;">
                ${title}
              </h1>
              <p style="margin-top:8px;color:#6b7280;">
                Hello ${escapeHtml(customerName || "Customer")}, ${subtitle}
              </p>
            </div>

            ${content}

            <p style="margin-top:30px;text-align:center;color:#6b7280;font-size:13px;">
              Thank you for choosing EnVision Direct.
            </p>

          </div>

        </div>
      </div>
    </div>
  `;
}

/* =========================
   EMAIL TYPES
========================= */

function buildShippedEmailHtml(order, trackingUrl, carrierLink, baseUrl) {
  return brandedEmail({
    baseUrl,
    title: "Your Order Has Shipped",
    subtitle: "your order is on the way.",
    customerName: order.customer_name,
    content: `
      ${orderSummaryCard(order)}

      <div style="text-align:center;margin-top:20px;">
        ${primaryButton("Track Order", trackingUrl)}
        ${carrierLink ? primaryButton("Carrier Tracking", carrierLink, "#16a34a") : ""}
      </div>
    `,
  });
}

function buildDeliveredEmailHtml(order, trackingUrl, baseUrl) {
  return brandedEmail({
    baseUrl,
    title: "Your Order Was Delivered",
    subtitle: "your order has been delivered.",
    customerName: order.customer_name,
    content: `
      ${orderSummaryCard(order)}

      <div style="text-align:center;margin-top:20px;">
        ${primaryButton("View Order", trackingUrl)}
      </div>
    `,
  });
}

/* =========================
   SEND EMAIL
========================= */

async function sendStatusEmail(req, order, status) {
  if (!resend || !order?.customer_email) return;

  const token = await ensureTrackingToken(order);
  const baseUrl = getBaseUrl(req);
  const trackingUrl = `${baseUrl}/track?token=${token}`;

  const carrierLink = getCarrierTrackingLink(
    order.tracking_carrier,
    order.tracking_number
  );

  if (status === "shipped") {
    await resend.emails.send({
      from: "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number} has shipped`,
      html: buildShippedEmailHtml(order, trackingUrl, carrierLink, baseUrl),
    });
  }

  if (status === "delivered") {
    await resend.emails.send({
      from: "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number} was delivered`,
      html: buildDeliveredEmailHtml(order, trackingUrl, baseUrl),
    });
  }
}

/* =========================
   API ROUTE
========================= */

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const status = String(body?.status || "").toLowerCase().trim();
    const tracking_number = body?.tracking_number || null;
    const tracking_carrier = body?.tracking_carrier || null;

    const { data: order } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        tracking_number,
        tracking_carrier,
      })
      .eq("id", id)
      .select("*")
      .single();

    await sendStatusEmail(req, order, status);

    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
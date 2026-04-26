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
   EMAIL BUILDERS
========================= */

function emailWrapper(title, subtitle, content, baseUrl, color = "#2457f5") {
  const logoUrl = `${baseUrl}/images/logo-hero.png`;

  return `
    <div style="font-family:Arial;background:#f4f7fb;padding:20px;">
      <div style="max-width:720px;margin:auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

        <div style="background:${color};color:white;padding:30px;text-align:center;">
          <img src="${logoUrl}" style="max-width:240px;margin-bottom:10px;" />
          <h1 style="margin:0;">${title}</h1>
          <p style="margin-top:10px;">${subtitle}</p>
        </div>

        <div style="padding:24px;">
          ${content}
        </div>

      </div>
    </div>
  `;
}

function actionButtons(trackingUrl, carrierLink) {
  return `
    <div style="text-align:center;margin-top:28px;">

      <a href="${trackingUrl}" style="
        display:inline-block;
        background:#2563eb;
        color:white;
        padding:14px 22px;
        border-radius:12px;
        text-decoration:none;
        font-weight:bold;
        margin:8px;
      ">
        Track Order Progress
      </a>

      ${
        carrierLink
          ? `<a href="${carrierLink}" style="
              display:inline-block;
              background:#16a34a;
              color:white;
              padding:14px 22px;
              border-radius:12px;
              text-decoration:none;
              font-weight:bold;
              margin:8px;
            ">
              Track With Carrier
            </a>`
          : ""
      }

    </div>
  `;
}

/* =========================
   SPECIFIC EMAILS
========================= */

function buildPrintingEmail(order, trackingUrl, baseUrl) {
  return emailWrapper(
    "Printing Started",
    `${order.customer_name || "Customer"}, your order is now in production.`,
    `
      <p><strong>Order:</strong> ${order.order_number}</p>
      <p>Your artwork has been approved and is now being printed.</p>
      ${actionButtons(trackingUrl)}
    `,
    baseUrl,
    "#f59e0b"
  );
}

function buildShippedEmail(order, trackingUrl, carrierLink, baseUrl) {
  return emailWrapper(
    "Your Order Has Shipped",
    `${order.customer_name || "Customer"}, your order is on the way.`,
    `
      <p><strong>Order:</strong> ${order.order_number}</p>
      <p><strong>Carrier:</strong> ${order.tracking_carrier || "—"}</p>
      <p><strong>Tracking:</strong> ${order.tracking_number || "—"}</p>
      ${actionButtons(trackingUrl, carrierLink)}
    `,
    baseUrl,
    "#2563eb"
  );
}

function buildDeliveredEmail(order, trackingUrl, baseUrl) {
  return emailWrapper(
    "Order Delivered",
    `Your order has been delivered.`,
    `
      <p><strong>Order:</strong> ${order.order_number}</p>
      <p><strong>Total:</strong> $${Number(order.total || 0).toFixed(2)}</p>
      ${actionButtons(trackingUrl)}
    `,
    baseUrl,
    "#16a34a"
  );
}

function buildReviewEmail(order, baseUrl) {
  return emailWrapper(
    "How did we do?",
    "We’d love your feedback.",
    `
      <p>Thanks again for your order <strong>${order.order_number}</strong>.</p>
      <p>If you have a moment, please leave us a review.</p>

      <div style="text-align:center;margin-top:20px;">
        <a href="${baseUrl}" style="
          display:inline-block;
          background:#f59e0b;
          color:white;
          padding:14px 20px;
          border-radius:12px;
          text-decoration:none;
          font-weight:bold;
        ">
          Leave a Review
        </a>
      </div>
    `,
    baseUrl,
    "#f59e0b"
  );
}

/* =========================
   SEND EMAIL LOGIC
========================= */

async function sendStatusEmail(req, order, status) {
  if (!resend || !order?.customer_email) return;

  const token = await ensureTrackingToken(order.id, order.tracking_token);
  const baseUrl = getBaseUrl(req);
  const trackingUrl = `${baseUrl}/track?token=${token}`;
  const carrierLink = getCarrierTrackingLink(
    order.tracking_carrier,
    order.tracking_number
  );

  if (status === "printing") {
    await resend.emails.send({
      from: "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number} is printing`,
      html: buildPrintingEmail(order, trackingUrl, baseUrl),
    });
  }

  if (status === "shipped") {
    await resend.emails.send({
      from: "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number} has shipped`,
      html: buildShippedEmail(order, trackingUrl, carrierLink, baseUrl),
    });
  }

  if (status === "delivered") {
    await resend.emails.send({
      from: "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number} was delivered`,
      html: buildDeliveredEmail(order, trackingUrl, baseUrl),
    });

    // 🔥 send review email AFTER delivery
    await resend.emails.send({
      from: "EnVision Direct <orders@envisiondirect.net>",
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
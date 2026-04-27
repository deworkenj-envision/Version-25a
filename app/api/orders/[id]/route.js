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

function getReorderUrl(baseUrl, order) {
  if (!order?.product_name) return "";

  const params = new URLSearchParams({
    product: order.product_name || "",
    size: order.size || "",
    paper: order.paper || "",
    finish: order.finish || "",
    sides: order.sides || "",
    quantity: String(order.quantity || ""),
  });

  return `${baseUrl}/order?${params.toString()}`;
}

async function ensureTrackingToken(order) {
  if (order?.tracking_token) return order.tracking_token;

  const token = generateTrackingToken();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ tracking_token: token })
    .eq("id", order.id);

  if (error) throw new Error(error.message || "Failed to create tracking token.");

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

function primaryButton(label, url, color = "#0b5cff") {
  if (!url) return "";

  return `
    <a href="${url}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;padding:15px 24px;border-radius:14px;font-weight:900;font-size:15px;margin:8px 6px;">
      ${label}
    </a>
  `;
}

function orderSummaryCard(order) {
  return `
    <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;background:#ffffff;">
      <h2 style="margin:0 0 14px;font-size:20px;color:#071b3a;">Order Summary</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:9px 0;color:#64748b;">Order Number</td><td style="padding:9px 0;text-align:right;font-weight:800;">${escapeHtml(order.order_number || "—")}</td></tr>
        <tr><td style="padding:9px 0;color:#64748b;">Status</td><td style="padding:9px 0;text-align:right;font-weight:800;text-transform:capitalize;">${escapeHtml(order.status || "—")}</td></tr>
        <tr><td style="padding:9px 0;color:#64748b;">Product</td><td style="padding:9px 0;text-align:right;font-weight:800;">${escapeHtml(order.product_name || "—")}</td></tr>
        <tr><td style="padding:9px 0;color:#64748b;">Quantity</td><td style="padding:9px 0;text-align:right;font-weight:800;">${escapeHtml(order.quantity || "—")}</td></tr>
        <tr><td style="padding:9px 0;color:#64748b;">Size</td><td style="padding:9px 0;text-align:right;font-weight:800;">${escapeHtml(order.size || "—")}</td></tr>
        <tr><td style="padding:9px 0;color:#64748b;">Paper</td><td style="padding:9px 0;text-align:right;font-weight:800;">${escapeHtml(order.paper || "—")}</td></tr>
        <tr><td style="padding:9px 0;color:#64748b;">Finish</td><td style="padding:9px 0;text-align:right;font-weight:800;">${escapeHtml(order.finish || "—")}</td></tr>
        <tr><td style="padding:9px 0;color:#64748b;">Sides</td><td style="padding:9px 0;text-align:right;font-weight:800;">${escapeHtml(order.sides || "—")}</td></tr>
        <tr><td style="padding:14px 0 0;font-size:18px;font-weight:900;border-top:1px solid #e2e8f0;">Total</td><td style="padding:14px 0 0;text-align:right;font-size:22px;font-weight:900;border-top:1px solid #e2e8f0;">${money(order.total)}</td></tr>
      </table>
    </div>
  `;
}

function brandedEmail({ baseUrl, title, subtitle, customerName, content }) {
  const logoUrl = `${baseUrl}/images/logo-hero.png`;

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
        <div style="background:#ffffff;border:1px solid #dbe6f3;border-radius:24px;overflow:hidden;box-shadow:0 16px 40px rgba(15,43,82,0.12);">
          <div style="padding:24px;text-align:center;border-bottom:1px solid #e5e7eb;background:#ffffff;">
            <img src="${logoUrl}" alt="EnVision Direct" style="max-width:200px;width:100%;height:auto;" />
          </div>

          <div style="padding:26px 24px;">
            <div style="text-align:center;margin-bottom:20px;">
              <h1 style="margin:0;font-size:24px;color
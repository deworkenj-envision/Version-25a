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

async function ensureTrackingToken(order) {
  if (order?.tracking_token) return order.tracking_token;

  const token = generateTrackingToken();

  await supabaseAdmin
    .from("orders")
    .update({ tracking_token: token })
    .eq("id", order.id);

  return token;
}

async function sendEmail(req, order, status) {
  if (!resend || !order?.customer_email) return;

  const token = await ensureTrackingToken(order);
  const baseUrl = getBaseUrl(req);

  const trackingUrl = `${baseUrl}/track/${token}`;
  const carrierLink = getCarrierTrackingLink(
    order.tracking_carrier,
    order.tracking_number
  );

  if (status === "shipped") {
    await resend.emails.send({
      from: "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number} has shipped`,
      html: `
        <h2>Your order has shipped</h2>
        <p>Order: ${order.order_number}</p>
        <p><a href="${trackingUrl}">Track your order</a></p>
        ${
          carrierLink
            ? `<p><a href="${carrierLink}">Carrier tracking</a></p>`
            : ""
        }
      `,
    });
  }

  if (status === "delivered") {
    await resend.emails.send({
      from: "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number} was delivered`,
      html: `
        <h2>Your order was delivered</h2>
        <p>Order: ${order.order_number}</p>
        <p><a href="${trackingUrl}">View order</a></p>
      `,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const orderIds = Array.isArray(body?.orderIds) ? body.orderIds : [];
    const status = typeof body?.status === "string"
      ? body.status.trim().toLowerCase()
      : "";

    if (!orderIds.length) {
      return NextResponse.json({ error: "No order IDs provided." }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    // Get full order data
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("*")
      .in("id", orderIds);

    // Update orders
    await supabaseAdmin
      .from("orders")
      .update({ status })
      .in("id", orderIds);

    // Send emails
    if (status === "shipped" || status === "delivered") {
      for (const order of orders || []) {
        await sendEmail(req, order, status);
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount: orders?.length || 0,
    });
  } catch (error) {
    console.error("Bulk status error:", error);
    return NextResponse.json(
      { error: "Bulk update failed." },
      { status: 500 }
    );
  }
}
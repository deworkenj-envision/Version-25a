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

function getCarrierTrackingLink(carrier, trackingNumber) {
  if (!trackingNumber) return "";

  const num = encodeURIComponent(trackingNumber.trim());
  const normalized = (carrier || "").toLowerCase();

  if (normalized === "ups") {
    return `https://www.ups.com/track?tracknum=${num}`;
  }

  if (normalized === "usps") {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`;
  }

  if (normalized === "fedex") {
    return `https://www.fedex.com/fedextrack/?trknbr=${num}`;
  }

  return "";
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

function buildShippedEmailHtml(order, trackingUrl, carrierLink) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Your order has shipped</h2>
      <p>Hello ${order.customer_name || "Customer"},</p>
      <p>Your order <strong>${order.order_number || ""}</strong> has been shipped.</p>

      <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px;">
        <p style="margin: 0 0 8px;"><strong>Order Number:</strong> ${order.order_number || "—"}</p>
        <p style="margin: 0 0 8px;"><strong>Status:</strong> shipped</p>
        <p style="margin: 0 0 8px;"><strong>Product:</strong> ${order.product_name || "—"}</p>
        <p style="margin: 0 0 8px;"><strong>Carrier:</strong> ${order.tracking_carrier || "—"}</p>
        <p style="margin: 0;"><strong>Tracking Number:</strong> ${order.tracking_number || "—"}</p>
      </div>

      <p style="margin-top: 20px;">
        <a href="${trackingUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 700;">
          Track Your Order
        </a>
      </p>

      ${
        carrierLink
          ? `<p style="margin-top: 14px;"><a href="${carrierLink}" style="color: #2563eb;">Open carrier tracking</a></p>`
          : ""
      }

      <p style="margin-top: 18px;">You can also use the secure tracking link above anytime.</p>
      <p>Thank you for choosing EnVision Direct.</p>
    </div>
  `;
}

function buildDeliveredEmailHtml(order, trackingUrl) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Your order was delivered</h2>
      <p>Hello ${order.customer_name || "Customer"},</p>
      <p>Your order <strong>${order.order_number || ""}</strong> has been marked as delivered.</p>

      <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px;">
        <p style="margin: 0 0 8px;"><strong>Order Number:</strong> ${order.order_number || "—"}</p>
        <p style="margin: 0 0 8px;"><strong>Status:</strong> delivered</p>
        <p style="margin: 0 0 8px;"><strong>Product:</strong> ${order.product_name || "—"}</p>
        <p style="margin: 0;"><strong>Total:</strong> $${Number(order.total || 0).toFixed(2)}</p>
      </div>

      <p style="margin-top: 20px;">
        <a href="${trackingUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 700;">
          View Order Status
        </a>
      </p>

      <p style="margin-top: 18px;">Thank you for your business.</p>
      <p>We appreciate your order with EnVision Direct.</p>
    </div>
  `;
}

async function sendStatusEmail(req, order, status) {
  if (!resend) return;
  if (!order?.customer_email) return;

  const trackingToken = await ensureTrackingToken(order.id, order.tracking_token);
  const baseUrl = getBaseUrl(req);
  const trackingUrl = `${baseUrl}/track?token=${trackingToken}`;
  const carrierLink = getCarrierTrackingLink(
    order.tracking_carrier,
    order.tracking_number
  );

  if (status === "shipped") {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number || ""} has shipped`,
      html: buildShippedEmailHtml(
        { ...order, status: "shipped", tracking_token: trackingToken },
        trackingUrl,
        carrierLink
      ),
    });
  }

  if (status === "delivered") {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number || ""} was delivered`,
      html: buildDeliveredEmailHtml(
        { ...order, status: "delivered", tracking_token: trackingToken },
        trackingUrl
      ),
    });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const status = (body?.status || "").toLowerCase().trim();
    const tracking_number =
      typeof body?.tracking_number === "string" && body.tracking_number.trim()
        ? body.tracking_number.trim()
        : null;
    const tracking_carrier =
      typeof body?.tracking_carrier === "string" && body.tracking_carrier.trim()
        ? body.tracking_carrier.trim()
        : null;

    if (!id) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const updatePayload = {
      status,
      tracking_number,
      tracking_carrier,
    };

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to update order." },
        { status: 500 }
      );
    }

    try {
      if (status === "shipped" || status === "delivered") {
        await sendStatusEmail(req, updatedOrder, status);
      }
    } catch (emailError) {
      return NextResponse.json(
        {
          order: updatedOrder,
          warning:
            emailError.message || "Order updated, but email failed to send.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
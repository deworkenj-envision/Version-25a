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
  if (status !== "shipped" && status !== "delivered") return;

  const trackingToken = await ensureTrackingToken(order);
  const baseUrl = getBaseUrl(req);

  const trackingUrl = `${baseUrl}/track/${encodeURIComponent(trackingToken)}`;

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

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to load order." },
        { status: 500 }
      );
    }

    const { data: events } = await supabaseAdmin
      .from("order_events")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      order: {
        ...data,
        events: events || [],
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const status = String(body?.status || "").toLowerCase().trim();
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

    if (status === "shipped" && (!tracking_number || !tracking_carrier)) {
      return NextResponse.json(
        {
          error:
            "Tracking carrier and tracking number are required before marking an order as shipped.",
        },
        { status: 400 }
      );
    }

    const { data: beforeOrder } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

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

    if (beforeOrder?.status !== updatedOrder.status) {
      await addOrderEvent(
        id,
        "status_change",
        `Status changed to ${updatedOrder.status}`,
        `Previous status: ${beforeOrder?.status || "none"}`
      );
    }

    const trackingChanged =
      (beforeOrder?.tracking_number || "") !==
        (updatedOrder?.tracking_number || "") ||
      (beforeOrder?.tracking_carrier || "") !==
        (updatedOrder?.tracking_carrier || "");

    if (
      trackingChanged &&
      (updatedOrder?.tracking_number || updatedOrder?.tracking_carrier)
    ) {
      await addOrderEvent(
        id,
        "tracking_update",
        "Tracking information updated",
        `${updatedOrder?.tracking_carrier || "Carrier"} ${
          updatedOrder?.tracking_number || ""
        }`.trim()
      );
    }

    try {
      if (status === "shipped" || status === "delivered") {
        await sendStatusEmail(req, updatedOrder, status);
        await addOrderEvent(
          id,
          "email_sent",
          `${status === "shipped" ? "Shipped" : "Delivered"} email sent`,
          `Sent to ${updatedOrder.customer_email || "customer"}`
        );
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

    const { data: events } = await supabaseAdmin
      .from("order_events")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      order: {
        ...updatedOrder,
        events: events || [],
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
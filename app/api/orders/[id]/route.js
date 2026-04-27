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
              <h1 style="margin:0;font-size:24px;color:#111827;">${title}</h1>
              <p style="margin-top:8px;color:#6b7280;font-size:14px;">
                Hello ${escapeHtml(customerName || "Customer")}, ${subtitle}
              </p>
            </div>

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

function buildShippedEmailHtml(order, trackingUrl, carrierLink, baseUrl) {
  return brandedEmail({
    baseUrl,
    title: "Your Order Has Shipped",
    subtitle: "your order is on the way.",
    customerName: order.customer_name,
    content: `
      <div style="border:1px solid #bfdbfe;background:#eff6ff;border-radius:18px;padding:18px;margin-bottom:18px;">
        <h2 style="margin:0 0 10px;font-size:20px;color:#1e3a8a;">Tracking Information</h2>
        <p style="margin:0 0 8px;color:#1e3a8a;font-size:15px;line-height:1.7;"><strong>Carrier:</strong> ${escapeHtml(order.tracking_carrier || "—")}</p>
        <p style="margin:0;color:#1e3a8a;font-size:15px;line-height:1.7;"><strong>Tracking Number:</strong> ${escapeHtml(order.tracking_number || "—")}</p>
      </div>

      ${orderSummaryCard(order)}

      <div style="text-align:center;margin-top:22px;">
        ${primaryButton("View Order Status", trackingUrl, "#0b5cff")}
        ${carrierLink ? primaryButton("Track With Carrier", carrierLink, "#16a34a") : ""}
      </div>
    `,
  });
}

function buildDeliveredEmailHtml(order, trackingUrl, baseUrl) {
  return brandedEmail({
    baseUrl,
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

async function sendStatusEmail(req, order, status) {
  if (!resend) return;
  if (!order?.customer_email) return;
  if (status !== "shipped" && status !== "delivered") return;

  const trackingToken = await ensureTrackingToken(order);
  const baseUrl = getBaseUrl(req);
  const trackingUrl = `${baseUrl}/track?token=${encodeURIComponent(trackingToken)}`;

  const carrierLink = getCarrierTrackingLink(
    order.tracking_carrier,
    order.tracking_number
  );

  const from =
    process.env.RESEND_FROM_EMAIL ||
    "EnVision Direct <orders@envisiondirect.net>";

  if (status === "shipped") {
    await resend.emails.send({
      from,
      to: order.customer_email,
      subject: `Your order ${order.order_number || ""} has shipped`,
      html: buildShippedEmailHtml(
        { ...order, status: "shipped", tracking_token: trackingToken },
        trackingUrl,
        carrierLink,
        baseUrl
      ),
    });
  }

  if (status === "delivered") {
    await resend.emails.send({
      from,
      to: order.customer_email,
      subject: `Your order ${order.order_number || ""} was delivered`,
      html: buildDeliveredEmailHtml(
        { ...order, status: "delivered", tracking_token: trackingToken },
        trackingUrl,
        baseUrl
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

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        tracking_number,
        tracking_carrier,
      })
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
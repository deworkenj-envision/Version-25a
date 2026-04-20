import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildTrackingUrl(carrier, trackingNumber) {
  const number = encodeURIComponent((trackingNumber || "").trim());
  if (!number) return "";

  switch ((carrier || "").toLowerCase()) {
    case "ups":
      return `https://www.ups.com/track?tracknum=${number}`;
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${number}`;
    case "fedex":
      return `https://www.fedex.com/fedextrack/?trknbr=${number}`;
    default:
      return "";
  }
}

async function sendShippedEmail(order) {
  if (!process.env.RESEND_API_KEY) return;
  if (!order?.customer_email) return;

  const trackingUrl =
    order.tracking_url ||
    buildTrackingUrl(order.carrier || order.tracking_carrier, order.tracking_number);

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "EnVision Direct <orders@envisiondirect.net>";

  const subject = `Your EnVision Direct order ${order.order_number} has shipped`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <h2 style="margin-bottom:8px;">Your order has shipped</h2>
      <p>Hi ${order.customer_name || "Customer"},</p>
      <p>Your order <strong>${order.order_number || ""}</strong> has shipped.</p>

      <div style="margin:16px 0;padding:16px;border:1px solid #e5e7eb;border-radius:12px;">
        <p style="margin:0 0 8px;"><strong>Product:</strong> ${order.product_name || "-"}</p>
        <p style="margin:0 0 8px;"><strong>Quantity:</strong> ${order.quantity || "-"}</p>
        <p style="margin:0 0 8px;"><strong>Carrier:</strong> ${order.carrier || order.tracking_carrier || "N/A"}</p>
        <p style="margin:0;"><strong>Tracking Number:</strong> ${order.tracking_number || "N/A"}</p>
      </div>

      ${
        trackingUrl
          ? `<p><a href="${trackingUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;">Track Your Package</a></p>`
          : ""
      }

      <p>Thank you for your order.</p>
      <p>EnVision Direct</p>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    subject,
    html,
  });
}

async function sendDeliveredEmail(order) {
  if (!process.env.RESEND_API_KEY) return;
  if (!order?.customer_email) return;

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "EnVision Direct <orders@envisiondirect.net>";

  const subject = `Your EnVision Direct order ${order.order_number} was delivered`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <h2 style="margin-bottom:8px;">Your order was delivered</h2>
      <p>Hi ${order.customer_name || "Customer"},</p>
      <p>Your order <strong>${order.order_number || ""}</strong> has been marked as delivered.</p>

      <div style="margin:16px 0;padding:16px;border:1px solid #e5e7eb;border-radius:12px;">
        <p style="margin:0 0 8px;"><strong>Product:</strong> ${order.product_name || "-"}</p>
        <p style="margin:0 0 8px;"><strong>Quantity:</strong> ${order.quantity || "-"}</p>
        <p style="margin:0;"><strong>Status:</strong> Delivered</p>
      </div>

      <p>Thank you for your order and for choosing EnVision Direct.</p>
      <p>EnVision Direct</p>
    </div>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: order.customer_email,
    subject,
    html,
  });
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const { data: existingOrder, error: existingOrderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (existingOrderError) {
      return NextResponse.json(
        { error: existingOrderError.message || "Order not found" },
        { status: 500 }
      );
    }

    const nextStatus = body.status || existingOrder.status || "pending";
    const nextCarrier = body.carrier ?? existingOrder.carrier ?? "";
    const nextTrackingNumber =
      body.tracking_number ?? existingOrder.tracking_number ?? "";
    const nextTrackingUrl =
      body.tracking_url ||
      existingOrder.tracking_url ||
      buildTrackingUrl(nextCarrier, nextTrackingNumber);

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: nextStatus,
        carrier: nextCarrier,
        tracking_carrier: nextCarrier,
        tracking_number: nextTrackingNumber,
        tracking_url: nextTrackingUrl,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to update order" },
        { status: 500 }
      );
    }

    try {
      const previousStatus = (existingOrder.status || "").toLowerCase();
      const currentStatus = (updatedOrder.status || "").toLowerCase();

      if (currentStatus === "shipped" && previousStatus !== "shipped") {
        await sendShippedEmail(updatedOrder);
      }

      if (currentStatus === "delivered" && previousStatus !== "delivered") {
        await sendDeliveredEmail(updatedOrder);
      }
    } catch (emailError) {
      console.error("Order status email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order status update error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
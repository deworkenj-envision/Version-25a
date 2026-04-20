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

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const nextStatus = body.status || "pending";
    const nextCarrier = body.carrier || "";
    const nextTrackingNumber = body.tracking_number || "";
    const nextTrackingUrl =
      body.tracking_url || buildTrackingUrl(nextCarrier, nextTrackingNumber);

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

    if (nextStatus === "shipped") {
      try {
        await sendShippedEmail(updatedOrder);
      } catch (emailError) {
        console.error("Shipped email failed:", emailError);
      }
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
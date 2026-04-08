import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function buildTrackingUrl(carrier, trackingNumber) {
  const cleanCarrier = String(carrier || "").trim().toLowerCase();
  const cleanTracking = encodeURIComponent(String(trackingNumber || "").trim());

  if (!cleanTracking) return "";

  if (cleanCarrier === "ups") {
    return `https://www.ups.com/track?tracknum=${cleanTracking}`;
  }

  if (cleanCarrier === "usps") {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${cleanTracking}`;
  }

  if (cleanCarrier === "fedex") {
    return `https://www.fedex.com/fedextrack/?trknbr=${cleanTracking}`;
  }

  return "";
}

async function sendShipmentEmail(order) {
  if (!resend || !order?.customer_email) return;

  const trackingBlock = order.tracking_url
    ? `<p><a href="${order.tracking_url}" target="_blank" rel="noopener noreferrer">Track your package</a></p>`
    : "";

  await resend.emails.send({
    from: "Envision Direct <orders@envisiondirect.net>",
    to: [order.customer_email],
    subject: `Your order ${order.order_number} has shipped`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Your order has shipped</h2>
        <p>Hi ${order.customer_name || "there"},</p>
        <p>Your order <strong>${order.order_number}</strong> is now on the way.</p>
        <p><strong>Carrier:</strong> ${order.carrier || "-"}</p>
        <p><strong>Tracking Number:</strong> ${order.tracking_number || "-"}</p>
        ${trackingBlock}
        <p>You can also track your order on our website anytime.</p>
        <p>Thank you,<br />Envision Direct</p>
      </div>
    `,
  });
}

async function sendDeliveredEmail(order) {
  if (!resend || !order?.customer_email) return;

  await resend.emails.send({
    from: "Envision Direct <orders@envisiondirect.net>",
    to: [order.customer_email],
    subject: `Your order ${order.order_number} was delivered`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Your order was delivered</h2>
        <p>Hi ${order.customer_name || "there"},</p>
        <p>Your order <strong>${order.order_number}</strong> has been marked as delivered.</p>
        <p>We appreciate your business and hope everything looks great.</p>
        <p>Thank you,<br />Envision Direct</p>
      </div>
    `,
  });
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const body = await req.json();

    const status = body?.status ?? "pending";
    const carrier = body?.carrier ?? "";
    const tracking_number = body?.tracking_number ?? "";
    const incomingTrackingUrl = body?.tracking_url ?? "";
    const tracking_url =
      incomingTrackingUrl || buildTrackingUrl(carrier, tracking_number);

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        carrier,
        tracking_number,
        tracking_url,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update order." },
        { status: 500 }
      );
    }

    try {
      if (status === "shipped") {
        await sendShipmentEmail(data);
      }

      if (status === "delivered") {
        await sendDeliveredEmail(data);
      }
    } catch (emailError) {
      console.error("Email send error:", emailError);

      return NextResponse.json({
        success: true,
        message: `Order ${data?.order_number || id} updated, but email failed.`,
        order: data,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Order ${data?.order_number || id} updated successfully.`,
      order: data,
    });
  } catch (err) {
    console.error("Order status update server error:", err);
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
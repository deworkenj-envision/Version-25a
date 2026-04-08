import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function getTrackingUrl(carrier, trackingNumber) {
  if (!carrier || !trackingNumber) return null;

  const c = String(carrier).toLowerCase();

  if (c.includes("ups")) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(trackingNumber)}`;
  }

  if (c.includes("usps")) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(
      trackingNumber
    )}`;
  }

  if (c.includes("fedex")) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(
      trackingNumber
    )}`;
  }

  return null;
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

async function sendShipmentEmail(order) {
  if (!resend) {
    return "Shipment email skipped: missing RESEND_API_KEY.";
  }

  if (!order?.customer_email) {
    return "Shipment email skipped: missing customer email.";
  }

  const carrier = order.tracking_carrier || order.carrier || "";
  const trackingNumber = order.tracking_number || "";
  const trackingUrl =
    order.tracking_url || getTrackingUrl(carrier, trackingNumber);

  const subject = `Your order ${order.order_number || ""} has shipped`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Your order has shipped</h2>
      <p>Hello ${order.customer_name || "Customer"},</p>
      <p>Your order <strong>${order.order_number || ""}</strong> is now on the way.</p>

      <div style="margin: 20px 0; padding: 16px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <p style="margin: 0 0 8px;"><strong>Product:</strong> ${order.product_name || "Order"}</p>
        <p style="margin: 0 0 8px;"><strong>Status:</strong> ${order.status || "Shipped"}</p>
        <p style="margin: 0 0 8px;"><strong>Carrier:</strong> ${carrier || "Not assigned"}</p>
        <p style="margin: 0;"><strong>Tracking Number:</strong> ${trackingNumber || "Not available"}</p>
      </div>

      ${
        trackingUrl
          ? `<p><a href="${trackingUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:10px;">Track Shipment</a></p>`
          : ""
      }

      <p>You can also track your order anytime on our order tracking page.</p>
      <p>Thank you for choosing Envision Direct.</p>
    </div>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Envision Direct <orders@envisiondirect.net>",
    to: order.customer_email,
    subject,
    html,
  });

  return null;
}

async function sendDeliveredEmail(order) {
  if (!resend) {
    return "Delivered email skipped: missing RESEND_API_KEY.";
  }

  if (!order?.customer_email) {
    return "Delivered email skipped: missing customer email.";
  }

  const subject = `Your order ${order.order_number || ""} was delivered`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Your order was delivered</h2>
      <p>Hello ${order.customer_name || "Customer"},</p>
      <p>Your order <strong>${order.order_number || ""}</strong> has been marked as <strong>delivered</strong>.</p>

      <div style="margin: 20px 0; padding: 16px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <p style="margin: 0 0 8px;"><strong>Product:</strong> ${order.product_name || "Order"}</p>
        <p style="margin: 0 0 8px;"><strong>Total:</strong> ${money(order.total)}</p>
        <p style="margin: 0;"><strong>Status:</strong> Delivered</p>
      </div>

      <p>We appreciate your business and hope everything looks great.</p>
      <p>If you need another run of this same product, we’d love to help with your next order.</p>
      <p>Thank you for choosing Envision Direct.</p>
    </div>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Envision Direct <orders@envisiondirect.net>",
    to: order.customer_email,
    subject,
    html,
  });

  return null;
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const normalizedStatus = body.status ? String(body.status).toLowerCase() : undefined;
    const trackingCarrier = body.tracking_carrier ?? body.carrier ?? null;
    const trackingNumber = body.tracking_number ?? null;
    const trackingUrl = body.tracking_url || getTrackingUrl(trackingCarrier, trackingNumber);

    const { data: existingOrder, error: existingError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      console.error("Load existing order error:", existingError);
      return NextResponse.json(
        { error: "Failed to load existing order." },
        { status: 500 }
      );
    }

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const updatePayload = {
      ...(normalizedStatus ? { status: normalizedStatus } : {}),
      tracking_carrier: trackingCarrier,
      carrier: trackingCarrier,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (updateError) {
      console.error("Update order error:", updateError);
      return NextResponse.json(
        { error: "Failed to update order." },
        { status: 500 }
      );
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order updated, but could not reload record." },
        { status: 500 }
      );
    }

    let shipmentEmailError = null;
    let deliveredEmailError = null;

    const previousStatus = String(existingOrder.status || "").toLowerCase();
    const newStatus = String(updatedOrder.status || "").toLowerCase();

    if (newStatus === "shipped" && previousStatus !== "shipped" && previousStatus !== "delivered") {
      try {
        shipmentEmailError = await sendShipmentEmail(updatedOrder);
      } catch (err) {
        console.error("Shipment email failed:", err);
        shipmentEmailError = err?.message || "Shipment email failed.";
      }
    }

    if (newStatus === "delivered" && previousStatus !== "delivered") {
      try {
        deliveredEmailError = await sendDeliveredEmail(updatedOrder);
      } catch (err) {
        console.error("Delivered email failed:", err);
        deliveredEmailError = err?.message || "Delivered email failed.";
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message:
        shipmentEmailError || deliveredEmailError
          ? "Order updated, but one or more emails failed."
          : "Order updated successfully.",
      shipmentEmailError,
      deliveredEmailError,
    });
  } catch (error) {
    console.error("Order update route error:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating the order." },
      { status: 500 }
    );
  }
}
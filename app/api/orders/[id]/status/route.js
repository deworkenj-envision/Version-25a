import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const EMAIL_FROM =
  process.env.RESEND_FROM || "EnVision Direct <orders@envisiondirect.net>";

function normalizeCarrier(value) {
  return String(value || "").trim();
}

function normalizeTrackingNumber(value) {
  return String(value || "").trim();
}

function buildTrackingUrl(carrier, trackingNumber) {
  const cleanCarrier = normalizeCarrier(carrier).toUpperCase();
  const cleanTracking = normalizeTrackingNumber(trackingNumber);

  if (!cleanCarrier || !cleanTracking) return "";

  const encoded = encodeURIComponent(cleanTracking);

  if (cleanCarrier === "UPS") {
    return `https://www.ups.com/track?tracknum=${encoded}`;
  }

  if (cleanCarrier === "USPS") {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encoded}`;
  }

  if (cleanCarrier === "FEDEX") {
    return `https://www.fedex.com/fedextrack/?trknbr=${encoded}`;
  }

  return "";
}

async function sendEmail({ to, subject, html }) {
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY is missing." };
  }

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Email send failed." };
  }
}

function buildShipmentEmail(order, trackingUrl) {
  const orderNumber = order.order_number || order.id || "Your Order";
  const customerName = order.customer_name || "Customer";
  const carrier = order.carrier || "Carrier";
  const trackingNumber = order.tracking_number || "";
  const productName = order.product_name || "your order";

  return {
    subject: `Your EnVision Direct order ${orderNumber} has shipped`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Your order has shipped</h2>
        <p>Hello ${customerName},</p>
        <p>Your order <strong>${orderNumber}</strong> for <strong>${productName}</strong> has shipped.</p>
        <p><strong>Carrier:</strong> ${carrier}<br />
        <strong>Tracking Number:</strong> ${trackingNumber}</p>
        ${
          trackingUrl
            ? `<p><a href="${trackingUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">Track Package</a></p>`
            : ""
        }
        <p>Thank you for choosing EnVision Direct.</p>
      </div>
    `,
  };
}

export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams?.id;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order id." }, { status: 400 });
    }

    const body = await req.json();

    const status = String(body?.status || "pending").trim();
    const carrier = normalizeCarrier(body?.carrier);
    const trackingNumber = normalizeTrackingNumber(body?.tracking_number);
    const trackingUrl =
      typeof body?.tracking_url === "string" && body.tracking_url.trim()
        ? body.tracking_url.trim()
        : buildTrackingUrl(carrier, trackingNumber);

    const { data: existingOrder, error: existingError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (existingError || !existingOrder) {
      return NextResponse.json(
        { error: existingError?.message || "Order not found." },
        { status: 404 }
      );
    }

    const updates = {
      status,
      carrier,
      tracking_carrier: carrier,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to update order." },
        { status: 500 }
      );
    }

    const becameShipped =
      existingOrder.status !== "shipped" && updatedOrder.status === "shipped";

    if (
      becameShipped &&
      updatedOrder.customer_email &&
      updatedOrder.tracking_number
    ) {
      const shipmentEmail = buildShipmentEmail(updatedOrder, updatedOrder.tracking_url);

      await sendEmail({
        to: updatedOrder.customer_email,
        subject: shipmentEmail.subject,
        html: shipmentEmail.html,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Order ${updatedOrder.order_number || updatedOrder.id} updated successfully.`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order status update error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to update order." },
      { status: 500 }
    );
  }
}
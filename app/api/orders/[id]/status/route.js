import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function getTrackingLink(carrier, trackingNumber) {
  const c = (carrier || "").toUpperCase();
  const n = encodeURIComponent(trackingNumber || "");

  if (!n) return "";

  if (c === "UPS") {
    return `https://www.ups.com/track?tracknum=${n}`;
  }

  if (c === "USPS") {
    return `https://tools.usps.com/go/TrackAction?tLabels=${n}`;
  }

  if (c === "FEDEX") {
    return `https://www.fedex.com/fedextrack/?trknbr=${n}`;
  }

  return "";
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const status = body?.status || "";
    const tracking_number = body?.tracking_number || "";
    const tracking_carrier = body?.tracking_carrier || "";

    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        tracking_number,
        tracking_carrier,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Order update failed:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    let message = "Order updated";

    if (status === "shipped" && order.customer_email) {
      const trackingLink = getTrackingLink(tracking_carrier, tracking_number);

      if (!resend) {
        message = "Order updated, but shipment email failed: missing RESEND_API_KEY";
      } else {
        try {
          await resend.emails.send({
            from: "Envision Direct <orders@envisiondirect.net>",
            to: order.customer_email,
            subject: `Your order ${order.order_number} has shipped`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
                <h2 style="margin-bottom: 16px;">Your order has shipped</h2>
                <p style="margin: 0 0 12px;">Hi ${order.customer_name || "there"},</p>
                <p style="margin: 0 0 16px;">
                  Good news — your order is on the way.
                </p>

                <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 0 0 8px;"><strong>Order Number:</strong> ${order.order_number || "-"}</p>
                  <p style="margin: 0 0 8px;"><strong>Product:</strong> ${order.product_name || "-"}</p>
                  <p style="margin: 0 0 8px;"><strong>Carrier:</strong> ${tracking_carrier || "-"}</p>
                  <p style="margin: 0;"><strong>Tracking Number:</strong> ${tracking_number || "-"}</p>
                </div>

                ${
                  trackingLink
                    ? `
                  <p style="margin: 20px 0;">
                    <a href="${trackingLink}" style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:10px; font-weight:600;">
                      Track Your Shipment
                    </a>
                  </p>
                `
                    : ""
                }

                <p style="margin-top: 24px;">Thank you for your order.</p>
                <p style="margin-top: 8px;">Envision Direct</p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Shipment email failed:", emailError);
          message = `Order updated, but shipment email failed: ${
            emailError?.message || "unknown email error"
          }`;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("PUT order status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
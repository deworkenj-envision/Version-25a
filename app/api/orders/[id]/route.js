import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { status, tracking_number, tracking_carrier } = body;

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
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // 🚀 SEND SHIPMENT EMAIL
    if (status === "shipped" && order.customer_email) {
      const trackingLink = getTrackingLink(
        tracking_carrier,
        tracking_number
      );

      try {
        await resend.emails.send({
          from: "Envision Direct <orders@envisiondirect.net>",
          to: order.customer_email,
          subject: `Your order ${order.order_number} has shipped!`,
          html: `
            <div style="font-family: Arial; max-width: 600px;">
              <h2>Your order has shipped 🚚</h2>

              <p><strong>Order Number:</strong> ${order.order_number}</p>
              <p><strong>Product:</strong> ${order.product_name}</p>

              <hr />

              <p><strong>Carrier:</strong> ${tracking_carrier || "-"}</p>
              <p><strong>Tracking Number:</strong> ${tracking_number || "-"}</p>

              ${
                trackingLink
                  ? `<p><a href="${trackingLink}" style="background:#2563eb;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;">Track Your Shipment</a></p>`
                  : ""
              }

              <hr />

              <p>Thank you for your order!</p>
              <p>Envision Direct</p>
            </div>
          `,
        });

        console.log("Shipment email sent");
      } catch (emailError) {
        console.error("Shipment email failed:", emailError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order updated",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
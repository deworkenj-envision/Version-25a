import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

function getTrackingLink(carrier, trackingNumber) {
  const c = (carrier || "").toUpperCase();
  const n = encodeURIComponent(trackingNumber || "");

  if (!n) return "";

  if (c === "UPS") {
    return `https://www.ups.com/track?loc=en_US&tracknum=${n}`;
  }

  if (c === "USPS") {
    return `https://tools.usps.com/go/TrackAction?tLabels=${n}`;
  }

  if (c === "FEDEX") {
    return `https://www.fedex.com/fedextrack/?trknbr=${n}`;
  }

  return "";
}

async function sendShipmentEmail(order) {
  const customerName = order.customer_name || "Customer";
  const orderNumber = order.order_number || "Your Order";
  const customerEmail = order.customer_email;
  const carrier = order.tracking_carrier || "";
  const trackingNumber = order.tracking_number || "";
  const trackingLink = getTrackingLink(carrier, trackingNumber);

  if (!customerEmail) {
    console.log("Shipment email skipped: missing customer email.");
    return;
  }

  const subject = `Your order ${orderNumber} has shipped`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Your order has shipped</h2>
      <p>Hi ${customerName},</p>
      <p>Your order <strong>${orderNumber}</strong> is now on the way.</p>

      <div style="margin: 20px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc;">
        <p style="margin: 0 0 8px;"><strong>Carrier:</strong> ${carrier || "-"}</p>
        <p style="margin: 0 0 8px;"><strong>Tracking Number:</strong> ${trackingNumber || "-"}</p>
        <p style="margin: 0;"><strong>Order Number:</strong> ${orderNumber}</p>
      </div>

      ${
        trackingLink
          ? `
            <p style="margin-top: 20px;">
              <a
                href="${trackingLink}"
                style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 700;"
              >
                Track Shipment
              </a>
            </p>
          `
          : ""
      }

      <p style="margin-top: 24px;">Thank you for your order.</p>
    </div>
  `;

  const text = [
    `Hi ${customerName},`,
    ``,
    `Your order ${orderNumber} has shipped.`,
    `Carrier: ${carrier || "-"}`,
    `Tracking Number: ${trackingNumber || "-"}`,
    trackingLink ? `Track Shipment: ${trackingLink}` : "",
    ``,
    `Thank you for your order.`,
  ]
    .filter(Boolean)
    .join("\n");

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    "Envision Direct <onboarding@resend.dev>";

  if (!resendApiKey) {
    console.log("=== SIMULATED SHIPMENT EMAIL ===");
    console.log("To:", customerEmail);
    console.log("From:", fromEmail);
    console.log("Subject:", subject);
    console.log(text);
    console.log("=== END SIMULATED SHIPMENT EMAIL ===");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [customerEmail],
      subject,
      html,
      text,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Resend shipment email error:", data || response.statusText);
    throw new Error("Failed to send shipment email.");
  }

  console.log("Shipment email sent:", data);
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const status = (body.status || "").trim().toLowerCase();
    const trackingCarrier = (body.trackingCarrier || "").trim().toUpperCase();
    const trackingNumber = (body.trackingNumber || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "Missing order id." },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "pending",
      "paid",
      "printing",
      "shipped",
      "delivered",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    const allowedCarriers = ["", "UPS", "USPS", "FEDEX"];

    if (!allowedCarriers.includes(trackingCarrier)) {
      return NextResponse.json(
        { error: "Invalid tracking carrier." },
        { status: 400 }
      );
    }

    const { data: existingOrder, error: existingError } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        status,
        tracking_carrier,
        tracking_number
      `)
      .eq("id", id)
      .single();

    if (existingError || !existingOrder) {
      console.error("Fetch existing order error:", existingError);
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const updateData = {
      status: status || existingOrder.status || "pending",
      tracking_carrier: trackingCarrier || null,
      tracking_number: trackingNumber || null,
    };

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        product_name,
        quantity,
        total,
        shipping,
        status,
        artwork_url,
        file_name,
        notes,
        tracking_carrier,
        tracking_number,
        created_at
      `)
      .single();

    if (updateError) {
      console.error("Order status update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update order." },
        { status: 500 }
      );
    }

    const justChangedToShipped =
      existingOrder.status !== "shipped" && updatedOrder.status === "shipped";

    const hasTrackingInfo =
      !!updatedOrder.tracking_carrier && !!updatedOrder.tracking_number;

    let emailNotice = null;

    if (justChangedToShipped && hasTrackingInfo) {
      try {
        await sendShipmentEmail(updatedOrder);
        emailNotice = "Shipment email sent.";
      } catch (emailError) {
        console.error("Shipment email failed:", emailError);
        emailNotice = "Order updated, but shipment email failed.";
      }
    }

    if (justChangedToShipped && !hasTrackingInfo) {
      emailNotice =
        "Order updated to shipped, but no shipment email was sent because carrier or tracking number is missing.";
    }

    return NextResponse.json(
      {
        success: true,
        order: updatedOrder,
        emailNotice,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Order status route error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
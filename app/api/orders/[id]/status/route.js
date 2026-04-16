import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";
import {
  buildDeliveredEmail,
  buildShippedEmail,
} from "../../../../../lib/emailTemplates";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const EMAIL_FROM =
  process.env.RESEND_FROM || "EnVision Direct <orders@envisiondirect.net>";

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

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const nextStatus = body?.status || null;
    const trackingNumber = body?.tracking_number || body?.trackingNumber || "";
    const trackingCarrier = body?.tracking_carrier || body?.trackingCarrier || "";

    if (!id) {
      return NextResponse.json({ error: "Missing order id." }, { status: 400 });
    }

    const { data: existingOrder, error: existingError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (existingError || !existingOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const updatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (nextStatus) updatePayload.status = nextStatus;
    if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber;
    if (trackingCarrier !== undefined) updatePayload.tracking_carrier = trackingCarrier;

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError || !updatedOrder) {
      return NextResponse.json(
        { error: updateError?.message || "Failed to update order." },
        { status: 500 }
      );
    }

    let emailMessage = "";

    const customerEmail = updatedOrder.customer_email;
    const customerName = updatedOrder.customer_name;
    const orderNumber = updatedOrder.order_number || updatedOrder.id;
    const productName = updatedOrder.product_name;

    if (
      nextStatus === "shipped" &&
      customerEmail &&
      trackingNumber &&
      trackingCarrier
    ) {
      const shippedEmail = buildShippedEmail({
        orderNumber,
        customerName,
        productName,
        carrier: trackingCarrier,
        trackingNumber,
      });

      const emailResult = await sendEmail({
        to: customerEmail,
        subject: shippedEmail.subject,
        html: shippedEmail.html,
      });

      emailMessage = emailResult.success
        ? " Shipment email sent."
        : ` Shipment email failed: ${emailResult.error}`;
    }

    if (nextStatus === "delivered" && customerEmail) {
      const deliveredEmail = buildDeliveredEmail({
        orderNumber,
        customerName,
        productName,
      });

      const emailResult = await sendEmail({
        to: customerEmail,
        subject: deliveredEmail.subject,
        html: deliveredEmail.html,
      });

      emailMessage = emailResult.success
        ? " Delivered email sent."
        : ` Delivered email failed: ${emailResult.error}`;
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderNumber} updated.${emailMessage}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order status update error:", error);

    return NextResponse.json(
      { error: error.message || "Server error." },
      { status: 500 }
    );
  }
}
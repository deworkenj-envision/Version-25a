import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PUT(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing order ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const status = body?.status ?? "pending";
    const carrier = body?.carrier ?? "";
    const tracking_number = body?.tracking_number ?? "";
    const tracking_url = body?.tracking_url ?? "";

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

    // 🔥 SEND EMAIL WHEN SHIPPED
    if (status === "shipped") {
      try {
        await resend.emails.send({
          from: "orders@envisiondirect.net",
          to: data.customer_email,
          subject: `Your order ${data.order_number} has shipped`,
          html: `
            <h2>Your order has shipped!</h2>
            <p><strong>Order:</strong> ${data.order_number}</p>
            <p><strong>Carrier:</strong> ${carrier}</p>
            <p><strong>Tracking Number:</strong> ${tracking_number}</p>
            ${
              tracking_url
                ? `<p><a href="${tracking_url}">Track your package</a></p>`
                : ""
            }
          `,
        });
      } catch (emailError) {
        console.error("Email failed:", emailError);
      }
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
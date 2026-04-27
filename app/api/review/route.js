import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req) {
  try {
    const body = await req.json();

    const orderNumber = body?.orderNumber || null;
    const orderId = body?.orderId || null;
    const rating = Number(body?.rating || 0);
    const comments = body?.comments || "";

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating is required." },
        { status: 400 }
      );
    }

    let order = null;

    if (orderId) {
      const { data } = await supabaseAdmin
        .from("orders")
        .select("id, order_number, customer_name, customer_email")
        .eq("id", orderId)
        .maybeSingle();

      order = data || null;
    }

    const { error: reviewError } = await supabaseAdmin.from("reviews").insert({
      order_id: order?.id || orderId || null,
      order_number: order?.order_number || orderNumber || null,
      rating,
      comments,
      customer_name: order?.customer_name || null,
      customer_email: order?.customer_email || null,
      is_approved: true,
    });

    if (reviewError) {
      return NextResponse.json(
        { error: reviewError.message },
        { status: 500 }
      );
    }

    if (resend) {
      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "EnVision Direct <orders@envisiondirect.net>",
        to: "orders@envisiondirect.net",
        subject: "A Customer Left a Review!",
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f7fb;padding:24px;color:#111827;">
            <div style="max-width:640px;margin:auto;background:white;border-radius:18px;padding:24px;border:1px solid #e5e7eb;">
              <h1 style="margin-top:0;">A Customer Left a Review!</h1>

              <p><strong>Order Number:</strong> ${escapeHtml(order?.order_number || orderNumber || "—")}</p>
              <p><strong>Order ID:</strong> ${escapeHtml(order?.id || orderId || "—")}</p>
              <p><strong>Customer:</strong> ${escapeHtml(order?.customer_name || "—")}</p>
              <p><strong>Email:</strong> ${escapeHtml(order?.customer_email || "—")}</p>
              <p><strong>Rating:</strong> ${rating} / 5</p>

              <div style="margin-top:16px;">
                <strong>Comments:</strong>
                <div style="margin-top:8px;background:#f9fafb;padding:14px;border-radius:12px;border:1px solid #e5e7eb;">
                  ${escapeHtml(comments || "No comments provided.")}
                </div>
              </div>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to save review." },
      { status: 500 }
    );
  }
}
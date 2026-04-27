import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      orderNumber,
      orderId,
      rating,
      comments,
    } = body;

    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "EnVision Direct <orders@envisiondirect.net>",
      to: "orders@envisiondirect.net",
      subject: "A Customer Left a Review!",
      html: `
        <div style="font-family:Arial;padding:24px;">
          <h1 style="color:#111827;">A Customer Left a Review!</h1>

          <p><strong>Order Number:</strong> ${orderNumber || "—"}</p>
          <p><strong>Order ID:</strong> ${orderId || "—"}</p>
          <p><strong>Rating:</strong> ${rating} / 5</p>

          <div style="margin-top:16px;">
            <strong>Comments:</strong>
            <p style="margin-top:8px;background:#f9fafb;padding:12px;border-radius:10px;">
              ${comments || "No comments provided."}
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to send review." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, name, orderNumber, status } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Missing email" },
        { status: 400 }
      );
    }

    let subject = "";
    let message = "";

    if (status === "printing") {
      subject = `Your order ${orderNumber} is now printing`;
      message = `Hi ${name}, your order ${orderNumber} is now in production.`;
    }

    if (status === "shipped") {
      subject = `Your order ${orderNumber} has shipped`;
      message = `Hi ${name}, your order ${orderNumber} has been shipped.`;
    }

    const data = await resend.emails.send({
      from: "Envision Direct <onboarding@resend.dev>", // temp sender
      to: email,
      subject,
      html: `<p>${message}</p>`,
    });

    console.log("REAL EMAIL SENT:", data);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
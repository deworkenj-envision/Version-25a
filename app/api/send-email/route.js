import { NextResponse } from "next/server";

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

    console.log("📧 EMAIL SENT:");
    console.log({
      to: email,
      name,
      orderNumber,
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Email simulated (check console)",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Email failed" },
      { status: 500 }
    );
  }
}
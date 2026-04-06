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

    console.log("EMAIL STATUS UPDATE");
    console.log({
      to: email,
      name,
      orderNumber,
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Email simulated successfully",
    });
  } catch (error) {
    console.error("Send email error:", error);

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
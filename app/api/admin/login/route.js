import { NextResponse } from "next/server";
import { getAdminCookieName } from "../../../../lib/adminAuth";

export async function POST(req) {
  try {
    const body = await req.json();
    const password = String(body?.password || "");
    const expected = process.env.ADMIN_PASSWORD || "";

    if (!expected) {
      return NextResponse.json(
        { success: false, error: "ADMIN_PASSWORD is not set." },
        { status: 500 }
      );
    }

    if (password !== expected) {
      return NextResponse.json(
        { success: false, error: "Invalid password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: getAdminCookieName(),
      value: expected,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Login failed." },
      { status: 500 }
    );
  }
}
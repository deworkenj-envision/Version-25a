import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const orderNumber = String(searchParams.get("orderNumber") || "")
      .trim()
      .toUpperCase();

    const email = String(searchParams.get("email") || "")
      .trim()
      .toLowerCase();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, error: "Missing order number or email." },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, customer_email, tracking_token")
      .eq("order_number", orderNumber)
      .ilike("customer_email", email)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "Database error." },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    if (!order.tracking_token) {
      return NextResponse.json(
        { success: false, error: "Tracking not available yet." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        token: order.tracking_token,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Server error.",
      },
      { status: 500 }
    );
  }
}
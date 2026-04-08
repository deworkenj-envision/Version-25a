import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = (searchParams.get("orderNumber") || "").trim();
    const email = (searchParams.get("email") || "").trim().toLowerCase();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        "order_number, customer_email, customer_name, product_name, status, carrier, tracking_number, tracking_url, created_at"
      )
      .eq("order_number", orderNumber)
      .eq("customer_email", email)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (err) {
    console.error("Track order GET error:", err);
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
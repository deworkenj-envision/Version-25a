import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const token = (searchParams.get("token") || "").trim();
    const orderNumber = (searchParams.get("orderNumber") || "").trim().toUpperCase();
    const email = (searchParams.get("email") || "").trim().toLowerCase();

    if (token) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("tracking_token", token)
        .limit(1)
        .maybeSingle();

      if (error) {
        return NextResponse.json(
          { error: error.message || "Failed to look up order." },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: "Order not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({ order: data });
    }

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .ilike("order_number", orderNumber)
      .ilike("customer_email", email)
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to look up order." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
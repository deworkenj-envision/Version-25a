import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = (searchParams.get("session_id") || "").trim();
    const orderId = (searchParams.get("order_id") || "").trim();

    if (!sessionId && !orderId) {
      return NextResponse.json(
        { error: "session_id or order_id is required." },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("orders").select("*").limit(1);

    if (sessionId) {
      query = query.eq("stripe_session_id", sessionId);
    } else {
      query = query.eq("id", orderId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to load order." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Order not found yet." },
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
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("orderNumber") || searchParams.get("q") || "";

    const lookup = raw.trim();

    if (!lookup) {
      return NextResponse.json(
        { error: "Missing order number" },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("orders").select("*").limit(1);

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        lookup
      );

    if (isUuid) {
      query = query.eq("id", lookup);
    } else {
      query = query.eq("order_number", lookup.toUpperCase());
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error("Track order error:", err);
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}
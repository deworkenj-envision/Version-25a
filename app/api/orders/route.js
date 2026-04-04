import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/orders error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to load orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err) {
    console.error("GET /api/orders unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
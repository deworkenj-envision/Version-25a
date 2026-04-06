import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing order id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Fetch order error:", error);
      return NextResponse.json(
        { error: error.message || "Order not found" },
        { status: 500 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error("GET order error:", err);
    return NextResponse.json(
      { error: err?.message || "Server error fetching order" },
      { status: 500 }
    );
  }
}
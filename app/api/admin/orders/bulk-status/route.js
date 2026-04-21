import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

const ALLOWED_STATUSES = ["pending", "paid", "printing", "shipped", "delivered"];

export async function POST(req) {
  try {
    const body = await req.json();
    const orderIds = Array.isArray(body?.orderIds) ? body.orderIds : [];
    const status = String(body?.status || "").toLowerCase().trim();

    if (!orderIds.length) {
      return NextResponse.json(
        { error: "No order IDs provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    const cleanIds = orderIds
      .map((id) => String(id).trim())
      .filter(Boolean);

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .in("id", cleanIds)
      .select("id, order_number, status");

    if (error) {
      console.error("Bulk status update error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update orders." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updatedCount: data?.length || 0,
      orders: data || [],
    });
  } catch (error) {
    console.error("Bulk status route error:", error);
    return NextResponse.json(
      { error: error?.message || "Server error." },
      { status: 500 }
    );
  }
}
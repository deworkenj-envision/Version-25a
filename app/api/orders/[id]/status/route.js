import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

const ALLOWED_STATUSES = [
  "pending",
  "paid",
  "printing",
  "shipped",
  "completed",
  "cancelled",
];

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = String(body?.status || "").toLowerCase().trim();

    if (!id) {
      return NextResponse.json(
        { error: "Missing order id" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Missing status" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Status update error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id]/status error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
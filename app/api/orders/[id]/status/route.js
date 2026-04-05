import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
    const id = params.id; // ✅ FIXED (no await)

    const body = await request.json();
    const status = String(body?.status || "").toLowerCase().trim();

    if (!id) {
      return NextResponse.json(
        { error: "Missing order id" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });

  } catch (err) {
    console.error("STATUS UPDATE CRASH:", err);
    return NextResponse.json(
      { error: "Server error updating order status" },
      { status: 500 }
    );
  }
}
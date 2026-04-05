import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

const ALLOWED_STATUSES = ["paid", "printing", "shipped", "cancelled"];

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const status = String(body?.status || "").toLowerCase().trim();

    if (!id) {
      return NextResponse.json(
        { error: "Missing order id" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`,
        },
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
      console.error("Supabase update order status error:", error);
      return NextResponse.json(
        { error: "Failed to update order status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: data }, { status: 200 });
  } catch (error) {
    console.error("Order status PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating order status" },
      { status: 500 }
    );
  }
}
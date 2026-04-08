import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PUT(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing order ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const status = body?.status ?? "pending";
    const carrier = body?.carrier ?? "";
    const tracking_number = body?.tracking_number ?? "";
    const tracking_url = body?.tracking_url ?? "";

    console.log("Updating order:", {
      id,
      status,
      carrier,
      tracking_number,
      tracking_url,
    });

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        carrier,
        tracking_number,
        tracking_url,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update order." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order ${data?.order_number || id} updated successfully.`,
      order: data,
    });
  } catch (err) {
    console.error("Order status update server error:", err);
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
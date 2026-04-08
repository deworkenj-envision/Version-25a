import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const status = body.status ?? null;
    const carrier = body.carrier ?? "";
    const trackingNumber = body.trackingNumber ?? "";
    const trackingUrl = body.trackingUrl ?? "";

    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const updateData = {
      status,
      carrier,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Order status update error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: data,
    });
  } catch (error) {
    console.error("PUT /api/orders/[id]/status error:", error);
    return NextResponse.json(
      { error: "Server error updating order" },
      { status: 500 }
    );
  }
}
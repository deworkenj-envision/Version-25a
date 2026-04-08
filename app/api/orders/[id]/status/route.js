import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const status = body.status ?? "pending";
    const carrier = body.carrier ?? "";
    const trackingNumber = body.trackingNumber ?? "";
    const trackingUrl = body.trackingUrl ?? "";

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
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update order." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order ${data?.order_number || ""} updated successfully.`,
      order: data,
    });
  } catch (err) {
    console.error("PUT order status route error:", err);
    return NextResponse.json(
      { error: err.message || "Server error updating order." },
      { status: 500 }
    );
  }
}
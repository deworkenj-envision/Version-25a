import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, { params }) {
  try {
    const token = params?.token;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing reorder token" },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        product_name,
        size,
        paper,
        finish,
        sides,
        quantity,
        notes
      `)
      .eq("tracking_token", token)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reorder: {
        product_name: order.product_name || "",
        size: order.size || "",
        paper: order.paper || "",
        finish: order.finish || "",
        sides: order.sides || "",
        quantity: order.quantity || "",
        notes: order.notes || "",
        original_order_number: order.order_number || "",
      },
    });
  } catch (err) {
    console.error("Reorder route error:", err);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
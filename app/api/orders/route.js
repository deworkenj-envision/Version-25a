import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        user_id,
        status,
        total,
        stripe_session_id,
        created_at,
        order_number,
        customer_name,
        customer_email,
        product_name,
        size,
        paper,
        finish,
        sides,
        quantity,
        file_name,
        notes,
        shipping,
        artwork_url,
        subtotal
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch orders error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: data || [],
    });
  } catch (error) {
    console.error("Orders route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
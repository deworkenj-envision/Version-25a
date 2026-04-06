import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        product_name,
        quantity,
        total,
        shipping,
        status,
        artwork_url,
        file_name,
        notes,
        tracking_carrier,
        tracking_number,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders fetch error:", error);
      return NextResponse.json(
        { error: "Failed to load orders." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { orders: data || [] },
      { status: 200 }
    );
  } catch (err) {
    console.error("Orders route error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
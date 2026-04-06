import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const orderNumber = (body.orderNumber || "").trim();
    const email = (body.email || "").trim().toLowerCase();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required." },
        { status: 400 }
      );
    }

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
        created_at
      `)
      .eq("order_number", orderNumber)
      .ilike("customer_email", email)
      .maybeSingle();

    if (error) {
      console.error("Track order lookup error:", error);
      return NextResponse.json(
        { error: "Failed to look up order." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No matching order found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data }, { status: 200 });
  } catch (err) {
    console.error("Track order API error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
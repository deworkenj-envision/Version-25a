import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const product_name = searchParams.get("product_name");
    const quantity = Number(searchParams.get("quantity") || 0);

    if (!product_name) {
      return NextResponse.json(
        { error: "Missing product_name." },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid quantity." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("shipping_rules")
      .select("*")
      .eq("active", true)
      .eq("product_name", product_name)
      .lte("min_quantity", quantity)
      .gte("max_quantity", quantity)
      .order("sort_order", { ascending: true })
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to load shipping." },
        { status: 500 }
      );
    }

    const match = data?.[0] || null;

    return NextResponse.json({
      success: true,
      shipping: match ? Number(match.shipping_price) : null,
      shippingRule: match,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error." },
      { status: 500 }
    );
  }
}
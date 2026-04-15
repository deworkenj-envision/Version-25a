import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const product_name = searchParams.get("product_name");
    const size = searchParams.get("size");
    const paper = searchParams.get("paper");
    const finish = searchParams.get("finish");
    const sides = searchParams.get("sides");
    const quantity = searchParams.get("quantity");

    let query = supabaseAdmin
      .from("pricing")
      .select("*")
      .eq("active", true);

    if (product_name) query = query.eq("product_name", product_name);
    if (size) query = query.eq("size", size);
    if (paper) query = query.eq("paper", paper);
    if (finish) query = query.eq("finish", finish);
    if (sides) query = query.eq("sides", sides);
    if (quantity) query = query.eq("quantity", Number(quantity));

    query = query
      .order("sort_order", { ascending: true })
      .order("quantity", { ascending: true });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to load pricing" },
        { status: 500 }
      );
    }

    const rows = data || [];

    const exactMatch =
      product_name &&
      size &&
      paper &&
      finish &&
      sides &&
      quantity
        ? rows[0] || null
        : null;

    return NextResponse.json({
      success: true,
      pricing: rows,
      exactPrice: exactMatch ? Number(exactMatch.price) : null,
      exactMatch,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
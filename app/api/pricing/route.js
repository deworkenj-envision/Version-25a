import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function clean(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " "); // remove double spaces
}

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

    // 🔥 CLEAN + NORMALIZE ALL FIELDS
    const rows = (data || []).map((row) => ({
      ...row,
      product_name: clean(row.product_name),
      size: clean(row.size),
      paper: clean(row.paper),
      finish: clean(row.finish),
      sides: clean(row.sides),
      quantity: Number(row.quantity),
      your_cost: Number(row.your_cost ?? 0),
      markup_percent: Number(row.markup_percent ?? 0),
      shipping_cost: Number(row.shipping_cost ?? 0),
    }));

    const exactMatch =
      product_name &&
      size &&
      paper &&
      finish &&
      sides &&
      quantity
        ? rows.find(
            (r) =>
              r.product_name === product_name &&
              r.size === size &&
              r.paper === paper &&
              r.finish === finish &&
              r.sides === sides &&
              r.quantity === Number(quantity)
          ) || null
        : null;

    return NextResponse.json({
      success: true,
      pricing: rows,
      exactPrice: exactMatch
        ? exactMatch.your_cost * (1 + exactMatch.markup_percent / 100)
        : null,
      exactMatch,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
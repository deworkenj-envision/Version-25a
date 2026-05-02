import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const { product_name, size } = await req.json();

    if (!product_name || !size) {
      return NextResponse.json(
        { success: false, error: "Missing product or size" },
        { status: 400 }
      );
    }

    const { data: rows, error } = await supabaseAdmin
      .from("pricing")
      .select("*")
      .eq("product_name", product_name)
      .eq("size", size)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No rows found to duplicate" },
        { status: 400 }
      );
    }

    const { data: maxRows, error: maxError } = await supabaseAdmin
      .from("pricing")
      .select("sort_order")
      .eq("product_name", product_name);

    if (maxError) throw maxError;

    const maxSort =
      Math.max(...(maxRows || []).map((r) => Number(r.sort_order || 0))) || 0;

    const newRows = rows.map((row, index) => ({
      product_name: row.product_name,
      size: row.size,
      paper: row.paper,
      finish: row.finish,
      sides: row.sides,
      quantity: row.quantity,
      your_cost: row.your_cost,
      markup_percent: row.markup_percent,
      shipping_cost: row.shipping_cost,
      sort_order: maxSort + index + 1,
      active: row.active,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("pricing")
      .insert(newRows);

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      count: newRows.length,
    });
  } catch (err) {
    console.error("DUPLICATE PRICING SET ERROR:", err);

    return NextResponse.json(
      { success: false, error: err.message || "Duplicate failed" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("id, order_number, rating, comments, customer_name, created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to load reviews." },
      { status: 500 }
    );
  }
}
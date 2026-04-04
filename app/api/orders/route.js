import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch orders error:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: data || [] }, { status: 200 });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching orders" },
      { status: 500 }
    );
  }
}

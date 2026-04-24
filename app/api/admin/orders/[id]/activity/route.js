import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../../lib/supabaseAdmin";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams?.id;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("order_activity")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to load activity." },
        { status: 500 }
      );
    }

    return NextResponse.json({ activity: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error loading activity." },
      { status: 500 }
    );
  }
}
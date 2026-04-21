import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids") || "";

    const ids = idsParam
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (!ids.length) {
      return NextResponse.json({ orders: [] });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .in("id", ids)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Packing slips fetch error:", error);
      return NextResponse.json(
        { error: "Failed to load packing slips." },
        { status: 500 }
      );
    }

    const map = new Map((data || []).map((order) => [order.id, order]));
    const ordered = ids.map((id) => map.get(id)).filter(Boolean);

    return NextResponse.json({ orders: ordered });
  } catch (error) {
    console.error("Packing slips API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
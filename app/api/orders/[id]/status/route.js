import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing order ID" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Missing status" },
        { status: 400 }
      );
    }

    // ✅ IMPORTANT: id is already a UUID string — do NOT modify it
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (err) {
    console.error("Route error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
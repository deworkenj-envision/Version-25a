import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PUT(req, context) {
  try {
    // ✅ FIX: pull params safely
    const id = context?.params?.id;

    const body = await req.json();
    const { status } = body;

    console.log("PARAM ID:", id);
    console.log("STATUS:", status);

    if (!id) {
      return NextResponse.json(
        { error: "Missing order ID (params not passed)" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Missing status" },
        { status: 400 }
      );
    }

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

    console.log("UPDATED ORDER:", data);

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (error) {
    console.error("Status route error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
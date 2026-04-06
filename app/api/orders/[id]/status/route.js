import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split("/").filter(Boolean);

    // /api/orders/:id/status  -> ["api", "orders", ":id", "status"]
    const id = pathnameParts[2];

    const body = await req.json();
    const { status } = body;

    console.log("STATUS ROUTE URL:", req.url);
    console.log("PATH PARTS:", pathnameParts);
    console.log("ORDER ID FROM URL:", id);
    console.log("NEW STATUS:", status);

    if (!id) {
      return NextResponse.json(
        { error: "Missing order ID (could not read from URL)" },
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
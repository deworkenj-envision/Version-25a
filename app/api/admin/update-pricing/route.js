import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();

    const { id, field, value } = body;

    if (!id || !field) {
      return NextResponse.json(
        { success: false, error: "Missing id or field" },
        { status: 400 }
      );
    }

    // Only allow safe fields to be updated
    const allowedFields = ["price", "active", "sort_order"];

    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { success: false, error: "Invalid field" },
        { status: 400 }
      );
    }

    const updateData = {
      [field]:
        field === "price"
          ? Number(value)
          : field === "active"
          ? Boolean(value)
          : value,
    };

    const { error } = await supabaseAdmin
      .from("pricing")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
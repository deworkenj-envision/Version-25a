import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { isAdminAuthenticated } from "../../../../lib/adminAuth";

export async function POST(req) {
  try {
    const authed = await isAdminAuthenticated();

    if (!authed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, field, value } = body;

    if (!id || !field) {
      return NextResponse.json(
        { success: false, error: "Missing id or field" },
        { status: 400 }
      );
    }

    // ✅ UPDATED FIELDS
    const allowedFields = [
      "your_cost",
      "markup_percent",
      "shipping_cost",
      "active",
      "sort_order",
      "price" // keep for backward compatibility
    ];

    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { success: false, error: "Invalid field" },
        { status: 400 }
      );
    }

    // ✅ HANDLE TYPES CORRECTLY
    let cleanValue;

    if (field === "active") {
      cleanValue = Boolean(value);
    } else if (
      field === "your_cost" ||
      field === "markup_percent" ||
      field === "shipping_cost" ||
      field === "price"
    ) {
      cleanValue = Number(value);
    } else if (field === "sort_order") {
      cleanValue = Number(value);
    } else {
      cleanValue = value;
    }

    const updateData = {
      [field]: cleanValue,
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
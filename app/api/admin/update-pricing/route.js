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

    const allowedFields = [
      "product_name",
      "size",
      "paper",
      "finish",
      "sides",
      "quantity",
      "your_cost",
      "markup_percent",
      "shipping_cost",
      "active",
      "sort_order",
      "price",
    ];

    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { success: false, error: `Invalid field: ${field}` },
        { status: 400 }
      );
    }

    const numericFields = [
      "quantity",
      "your_cost",
      "markup_percent",
      "shipping_cost",
      "sort_order",
      "price",
    ];

    let cleanValue;

    if (field === "active") {
      cleanValue = Boolean(value);
    } else if (numericFields.includes(field)) {
      cleanValue = Number(value || 0);
    } else {
      cleanValue = String(value || "");
    }

    const { data, error } = await supabaseAdmin
      .from("pricing")
      .update({ [field]: cleanValue })
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data?.id) {
      return NextResponse.json(
        { success: false, error: "Pricing row not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      field,
      value: cleanValue,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
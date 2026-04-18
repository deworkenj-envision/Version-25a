import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { isAdminAuthenticated } from "../../../../lib/adminAuth";

function escapeCsvValue(value) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export async function GET() {
  try {
    const authed = await isAdminAuthenticated();

    if (!authed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("pricing")
      .select(
        "product_name,size,paper,finish,sides,quantity,price,sort_order,active"
      )
      .order("product_name", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("quantity", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "Export failed." },
        { status: 500 }
      );
    }

    const headers = [
      "product_name",
      "size",
      "paper",
      "finish",
      "sides",
      "quantity",
      "price",
      "sort_order",
      "active",
    ];

    const lines = [
      headers.join(","),
      ...(data || []).map((row) =>
        headers.map((header) => escapeCsvValue(row[header])).join(",")
      ),
    ];

    const csv = lines.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="pricing-export.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
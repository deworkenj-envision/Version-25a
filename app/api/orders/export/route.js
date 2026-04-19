import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function escapeCsv(value) {
  const str = String(value ?? "");
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildAddress(order) {
  return [
    order.shipping_address_line1,
    order.shipping_address_line2,
    `${order.shipping_city || ""} ${order.shipping_state || ""} ${order.shipping_postal_code || ""}`.trim(),
    order.shipping_country,
  ]
    .filter(Boolean)
    .join(", ");
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const status = (searchParams.get("status") || "all").trim().toLowerCase();
    const sort = (searchParams.get("sort") || "newest").trim().toLowerCase();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to load orders." },
        { status: 500 }
      );
    }

    let orders = Array.isArray(data) ? data : [];

    if (status !== "all") {
      orders = orders.filter(
        (order) => String(order.status || "pending").toLowerCase() === status
      );
    }

    if (search) {
      orders = orders.filter((order) => {
        const searchable = [
          order.order_number,
          order.customer_name,
          order.customer_email,
          order.customer_phone,
          order.product_name,
          order.file_name,
          order.id,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(search);
      });
    }

    orders.sort((a, b) => {
      const aDate = new Date(a.created_at || 0).getTime() || 0;
      const bDate = new Date(b.created_at || 0).getTime() || 0;
      const aTotal = Number(a.total || 0) || 0;
      const bTotal = Number(b.total || 0) || 0;
      const aName = String(a.customer_name || "");
      const bName = String(b.customer_name || "");

      switch (sort) {
        case "oldest":
          return aDate - bDate;
        case "highest_total":
          return bTotal - aTotal;
        case "lowest_total":
          return aTotal - bTotal;
        case "customer_az":
          return aName.localeCompare(bName, undefined, { sensitivity: "base" });
        case "customer_za":
          return bName.localeCompare(aName, undefined, { sensitivity: "base" });
        case "newest":
        default:
          return bDate - aDate;
      }
    });

    const headers = [
      "order_number",
      "status",
      "created_at",
      "customer_name",
      "customer_email",
      "customer_phone",
      "product_name",
      "size",
      "paper",
      "finish",
      "sides",
      "quantity",
      "subtotal",
      "shipping",
      "total",
      "file_name",
      "artwork_url",
      "shipping_name",
      "shipping_address",
      "carrier",
      "tracking_number",
      "tracking_url",
      "notes",
      "id",
    ];

    const rows = orders.map((order) => [
      order.order_number || "",
      order.status || "",
      order.created_at || "",
      order.customer_name || "",
      order.customer_email || "",
      order.customer_phone || "",
      order.product_name || "",
      order.size || "",
      order.paper || "",
      order.finish || "",
      order.sides || "",
      order.quantity ?? "",
      order.subtotal ?? "",
      order.shipping ?? "",
      order.total ?? "",
      order.file_name || "",
      order.artwork_url || "",
      order.shipping_name || "",
      buildAddress(order),
      order.carrier || order.tracking_carrier || "",
      order.tracking_number || "",
      order.tracking_url || "",
      order.notes || "",
      order.id || "",
    ]);

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const filename = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Orders export error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to export orders." },
      { status: 500 }
    );
  }
}
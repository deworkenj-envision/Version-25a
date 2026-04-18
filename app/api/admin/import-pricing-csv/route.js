import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { isAdminAuthenticated } from "../../../../lib/adminAuth";

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map((value) => value.trim());
}

function parseBoolean(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  return normalized === "true" || normalized === "1" || normalized === "yes";
}

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
    const csvText = String(body?.csvText || "").trim();
    const replaceExisting = Boolean(body?.replaceExisting);

    if (!csvText) {
      return NextResponse.json(
        { success: false, error: "CSV content is empty." },
        { status: 400 }
      );
    }

    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "CSV must include a header row and at least one data row.",
        },
        { status: 400 }
      );
    }

    const headers = parseCsvLine(lines[0]);
    const requiredHeaders = [
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

    for (const header of requiredHeaders) {
      if (!headers.includes(header)) {
        return NextResponse.json(
          { success: false, error: `Missing required CSV column: ${header}` },
          { status: 400 }
        );
      }
    }

    const rowsToInsert = [];

    for (let i = 1; i < lines.length; i += 1) {
      const values = parseCsvLine(lines[i]);

      if (values.length !== headers.length) {
        return NextResponse.json(
          {
            success: false,
            error: `Row ${i + 1} has ${values.length} columns but expected ${headers.length}.`,
          },
          { status: 400 }
        );
      }

      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      const insertRow = {
        product_name: String(row.product_name || "").trim(),
        size: String(row.size || "").trim(),
        paper: String(row.paper || "").trim(),
        finish: String(row.finish || "").trim(),
        sides: String(row.sides || "").trim(),
        quantity: Number(row.quantity),
        price: Number(row.price),
        sort_order: row.sort_order === "" ? 0 : Number(row.sort_order),
        active: parseBoolean(row.active),
      };

      if (
        !insertRow.product_name ||
        !insertRow.size ||
        !insertRow.paper ||
        !insertRow.finish ||
        !insertRow.sides ||
        !insertRow.quantity ||
        Number.isNaN(insertRow.quantity) ||
        Number.isNaN(insertRow.price) ||
        Number.isNaN(insertRow.sort_order)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid data in CSV row ${i + 1}.`,
          },
          { status: 400 }
        );
      }

      rowsToInsert.push(insertRow);
    }

    if (replaceExisting) {
      const { error: deleteError } = await supabaseAdmin
        .from("pricing")
        .delete()
        .neq("id", 0);

      if (deleteError) {
        return NextResponse.json(
          {
            success: false,
            error: deleteError.message || "Failed to clear existing pricing.",
          },
          { status: 500 }
        );
      }
    }

    const { error } = await supabaseAdmin.from("pricing").insert(rowsToInsert);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || "CSV import failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      insertedCount: rowsToInsert.length,
      replacedExisting: replaceExisting,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
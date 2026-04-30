import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { isAdminAuthenticated } from "../../../../lib/adminAuth";

export async function POST() {
  try {
    const authed = await isAdminAuthenticated();

    if (!authed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { data: rows, error: fetchError } = await supabaseAdmin
      .from("pricing")
      .select("id, product_name, sort_order, quantity, size, paper, finish, sides")
      .order("product_name", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("quantity", { ascending: true });

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    const grouped = {};

    for (const row of rows || []) {
      const product = row.product_name || "Unknown";
      if (!grouped[product]) grouped[product] = [];
      grouped[product].push(row);
    }

    let updatedCount = 0;

    for (const productName of Object.keys(grouped)) {
      const productRows = grouped[productName];

      for (let i = 0; i < productRows.length; i++) {
        const row = productRows[i];
        const newSortOrder = i + 1;

        if (Number(row.sort_order) !== newSortOrder) {
          const { error: updateError } = await supabaseAdmin
            .from("pricing")
            .update({ sort_order: newSortOrder })
            .eq("id", row.id);

          if (updateError) {
            return NextResponse.json(
              { success: false, error: updateError.message },
              { status: 500 }
            );
          }

          updatedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Renumbered pricing sort order by product.`,
      updatedCount,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

const ALLOWED_STATUSES = ["paid", "printing", "shipped", "cancelled"];

export async function PATCH(req, { params }) {
  try {
    const routeId = params?.id;
    const body = await req.json();
    const status = String(body?.status || "").toLowerCase().trim();

    if (!routeId) {
      return NextResponse.json(
        { error: "Missing order id" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    let updatedOrder = null;

    const { data: byId, error: byIdError } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", routeId)
      .select()
      .maybeSingle();

    if (byIdError) {
      console.error("Supabase update by id error:", byIdError);
    }

    if (byId) {
      updatedOrder = byId;
    } else {
      const { data: byOrderNumber, error: byOrderNumberError } =
        await supabaseAdmin
          .from("orders")
          .update({ status })
          .eq("order_number", routeId)
          .select()
          .maybeSingle();

      if (byOrderNumberError) {
        console.error(
          "Supabase update by order_number error:",
          byOrderNumberError
        );
        return NextResponse.json(
          { error: "Failed to update order status" },
          { status: 500 }
        );
      }

      updatedOrder = byOrderNumber;
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order status PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating order status" },
      { status: 500 }
    );
  }
}
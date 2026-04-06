import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

const ALLOWED_STATUSES = [
  "pending",
  "paid",
  "printing",
  "shipped",
  "completed",
  "cancelled",
];

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value || ""
  );
}

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

async function getParam(context) {
  const resolvedParams = await context.params;
  return resolvedParams?.id || "";
}

async function findOrderByParam(param) {
  const useId = isUuid(param);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq(useId ? "id" : "order_number", param)
    .maybeSingle();

  return { data, error, useId };
}

export async function GET(_req, context) {
  try {
    const param = await getParam(context);

    if (!param) {
      return NextResponse.json(
        { error: "Missing order identifier" },
        { status: 400 }
      );
    }

    const { data: order, error } = await findOrderByParam(param);

    if (error) {
      console.error("Order lookup error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch order" },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (err) {
    console.error("GET status route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function POST(req, context) {
  try {
    const param = await getParam(context);

    if (!param) {
      return NextResponse.json(
        { error: "Missing order identifier" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const status = normalizeStatus(body?.status);

    if (!status) {
      return NextResponse.json(
        { error: "Missing status" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const { data: existingOrder, error: findError, useId } =
      await findOrderByParam(param);

    if (findError) {
      console.error("Order lookup error:", findError);
      return NextResponse.json(
        { error: findError.message || "Failed to find order" },
        { status: 500 }
      );
    }

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq(useId ? "id" : "order_number", param)
      .select("*")
      .single();

    if (updateError) {
      console.error("Order update error:", updateError);
      return NextResponse.json(
        { error: updateError.message || "Failed to update status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST status route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}
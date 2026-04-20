import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function PUT(request) {
  try {
    const body = await request.json();

    const orderIds = Array.isArray(body?.orderIds) ? body.orderIds : [];
    const status = body?.status || "";

    if (!orderIds.length) {
      return NextResponse.json(
        { error: "No orders selected." },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "No status selected." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .in("id", orderIds)
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update orders." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${data?.length || orderIds.length} order(s) updated to ${status}.`,
      orders: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to bulk update orders." },
      { status: 500 }
    );
  }
}
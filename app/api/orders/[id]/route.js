import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Order not found" },
        { status: 500 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to load order" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const updateData = {
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.tracking_carrier !== undefined
        ? { tracking_carrier: body.tracking_carrier }
        : {}),
      ...(body.tracking_number !== undefined
        ? { tracking_number: body.tracking_number }
        : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
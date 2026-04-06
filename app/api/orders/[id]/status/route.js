import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const status = (body.status || "").trim().toLowerCase();
    const trackingCarrier = (body.trackingCarrier || "").trim().toUpperCase();
    const trackingNumber = (body.trackingNumber || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "Missing order id." },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "pending",
      "paid",
      "printing",
      "shipped",
      "delivered",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    const allowedCarriers = ["", "UPS", "USPS", "FEDEX"];

    if (!allowedCarriers.includes(trackingCarrier)) {
      return NextResponse.json(
        { error: "Invalid tracking carrier." },
        { status: 400 }
      );
    }

    const updateData = {
      status: status || "pending",
      tracking_carrier: trackingCarrier || null,
      tracking_number: trackingNumber || null,
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        product_name,
        quantity,
        total,
        shipping,
        status,
        artwork_url,
        file_name,
        notes,
        tracking_carrier,
        tracking_number,
        created_at
      `)
      .single();

    if (error) {
      console.error("Order status update error:", error);
      return NextResponse.json(
        { error: "Failed to update order." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, order: data },
      { status: 200 }
    );
  } catch (err) {
    console.error("Order status route error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
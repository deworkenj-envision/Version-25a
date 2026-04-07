import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const rawOrderNumber = body?.orderNumber || "";
    const rawEmail = body?.email || "";

    const orderNumber = String(rawOrderNumber).trim().toUpperCase();
    const email = String(rawEmail).trim().toLowerCase();

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required." },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from("orders")
      .select("*")
      .ilike("order_number", orderNumber)
      .limit(1);

    if (email) {
      query = query.ilike("customer_email", email);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Track order lookup error:", error);
      return NextResponse.json(
        { error: "Failed to look up order." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No order found. Please check your order number and email." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: data.id,
        order_number: data.order_number,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        product_name: data.product_name,
        size: data.size,
        paper: data.paper,
        finish: data.finish,
        sides: data.sides,
        quantity: data.quantity,
        total: data.total,
        shipping: data.shipping,
        status: data.status,
        created_at: data.created_at,
        artwork_url: data.artwork_url,
        file_name: data.file_name,
        tracking_number: data.tracking_number || "",
        carrier: data.carrier || "",
      },
    });
  } catch (error) {
    console.error("Track order route error:", error);
    return NextResponse.json(
      { error: "Something went wrong while tracking the order." },
      { status: 500 }
    );
  }
}
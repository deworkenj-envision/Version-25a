import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const orderNumber = (body.orderNumber || "").trim().toUpperCase();

    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: "Email and order number are required." },
        { status: 400 }
      );
    }

    const { data: matchingOrder, error: matchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .ilike("customer_email", email)
      .ilike("order_number", orderNumber)
      .maybeSingle();

    if (matchError) {
      console.error("Customer order match error:", matchError);
      return NextResponse.json(
        { error: "Failed to verify order." },
        { status: 500 }
      );
    }

    if (!matchingOrder) {
      return NextResponse.json(
        { error: "No matching order found for that email and order number." },
        { status: 404 }
      );
    }

    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .ilike("customer_email", email)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Customer orders fetch error:", ordersError);
      return NextResponse.json(
        { error: "Failed to load customer orders." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: {
        email,
        name: matchingOrder.customer_name || "",
      },
      orders: orders || [],
    });
  } catch (error) {
    console.error("Customer orders route error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
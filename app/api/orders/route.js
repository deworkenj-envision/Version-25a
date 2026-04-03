import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

function createOrderNumber() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);

  return `PL-${year}${month}${day}-${random}`;
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/orders error:", error);
      return NextResponse.json(
        { error: "Failed to load orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders: data || [] });
  } catch (error) {
    console.error("GET /api/orders unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const customerName = String(body.customerName || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const productName = String(body.productName || "").trim();
    const size = String(body.size || "").trim();
    const paper = String(body.paper || "").trim();
    const finish = String(body.finish || "").trim();
    const sides = String(body.sides || "").trim();
    const quantity = Number(body.quantity || 0);
    const artworkUrl = String(body.fileName || "").trim();
    const notes = String(body.notes || "").trim();
    const printPrice = Number(body.printPrice || 0);
    const shippingPrice = Number(body.shippingPrice || 0);
    const total = Number(body.total || 0);

    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email is required." },
        { status: 400 }
      );
    }

    if (!productName) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!quantity) {
      return NextResponse.json(
        { error: "Quantity is required." },
        { status: 400 }
      );
    }

    const orderNumber = createOrderNumber();

    const insertPayload = {
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      product_name: productName,
      size,
      paper,
      finish,
      sides,
      quantity,
      artwork_url: artworkUrl,
      notes,
      subtotal: printPrice,
      shipping: shippingPrice,
      total,
      status: "pending_payment",
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([insertPayload])
      .select("*")
      .single();

    if (error) {
      console.error("POST /api/orders insert error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create order." },
        { status: 500 }
      );
    }

    return NextResponse.json({ order: data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}
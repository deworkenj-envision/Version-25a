import { supabaseAdmin } from "../../lib/supabaseAdmin";

function makeOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const rand = Math.floor(100 + Math.random() * 900);
  return `PL-${stamp}${rand}`;
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET error:", error);
      return Response.json(
        { error: "Failed to load orders." },
        { status: 500 }
      );
    }

    return Response.json({ orders: data || [] }, { status: 200 });
  } catch (error) {
    console.error("Orders GET route error:", error);
    return Response.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      productName,
      size,
      paper,
      finish,
      sides,
      quantity,
      fileName,
      notes,
    } = body;

    if (!customerName?.trim()) {
      return Response.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!customerEmail?.trim()) {
      return Response.json(
        { error: "Customer email is required." },
        { status: 400 }
      );
    }

    if (!productName?.trim()) {
      return Response.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!size?.trim() || !paper?.trim() || !finish?.trim() || !sides?.trim()) {
      return Response.json(
        { error: "Print options are required." },
        { status: 400 }
      );
    }

    if (!quantity || Number(quantity) <= 0) {
      return Response.json(
        { error: "Quantity must be greater than 0." },
        { status: 400 }
      );
    }

    if (!fileName?.trim()) {
      return Response.json(
        { error: "Artwork file is required." },
        { status: 400 }
      );
    }

    const orderNumber = makeOrderNumber();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          product_name: productName.trim(),
          size: size.trim(),
          paper: paper.trim(),
          finish: finish.trim(),
          sides: sides.trim(),
          quantity: Number(quantity),
          file_name: fileName.trim(),
          notes: notes?.trim() || null,
          status: "pending_review",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase POST error:", error);
      return Response.json(
        { error: "Failed to create order." },
        { status: 500 }
      );
    }

    return Response.json({ success: true, order: data }, { status: 201 });
  } catch (error) {
    console.error("Orders POST route error:", error);
    return Response.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return Response.json(
        { error: "Order id is required." },
        { status: 400 }
      );
    }

    if (!status?.trim()) {
      return Response.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status: status.trim() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PATCH error:", error);
      return Response.json(
        { error: "Failed to update status." },
        { status: 500 }
      );
    }

    return Response.json({ success: true, order: data }, { status: 200 });
  } catch (error) {
    console.error("Orders PATCH route error:", error);
    return Response.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
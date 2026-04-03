import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { sendOrderEmails } from "../../lib/sendOrderEmails";
import { calculatePrice } from "../../lib/pricing";
import { calculateShipping } from "../../lib/shipping";

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

    const ordersWithLinks = await Promise.all(
      (data || []).map(async (order) => {
        if (!order.file_name) return order;

        const { data: signedData } = await supabaseAdmin.storage
          .from("order-artwork")
          .createSignedUrl(order.file_name, 60 * 60);

        return {
          ...order,
          artwork_url: signedData?.signedUrl || null,
        };
      })
    );

    return Response.json({ orders: ordersWithLinks }, { status: 200 });
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

    const orderNumber = makeOrderNumber();

    // 🔥 CALCULATE PRICE + SHIPPING
    const total = calculatePrice({
      productName,
      quantity,
      paper,
      finish,
      sides,
    });

    const shipping = calculateShipping({
      productName,
      quantity,
    });

    const grandTotal = total + shipping;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          product_name: productName,
          size,
          paper,
          finish,
          sides,
          quantity: Number(quantity),
          file_name: fileName,
          notes,
          status: "pending_review",
          total: grandTotal,
          shipping, // ✅ saved
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return Response.json(
        { error: "Failed to create order." },
        { status: 500 }
      );
    }

    try {
      await sendOrderEmails(data);
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    return Response.json({ success: true, order: data });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Unexpected error." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: "Failed to update status." },
        { status: 500 }
      );
    }

    return Response.json({ success: true, order: data });
  } catch (error) {
    return Response.json(
      { error: "Unexpected error." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { isAdminAuthenticated } from "../../../../lib/adminAuth";

export async function POST(req) {
  try {
    const authed = await isAdminAuthenticated();

    if (!authed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const payload = {
      product_name: String(body.product_name || "").trim(),
      size: String(body.size || "").trim(),
      paper: String(body.paper || "").trim(),
      finish: String(body.finish || "").trim(),
      sides: String(body.sides || "").trim(),
      quantity: Number(body.quantity || 0),
      your_cost: Number(body.your_cost || 0),
      markup_percent: Number(body.markup_percent || 0),
      shipping_cost: Number(body.shipping_cost || 0),
      sort_order: Number(body.sort_order || 0),
      active: Boolean(body.active),
    };

    if (
      !payload.product_name ||
      !payload.size ||
      !payload.paper ||
      !payload.finish ||
      !payload.sides ||
      !payload.quantity
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required pricing fields." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("pricing")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pricing: data,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
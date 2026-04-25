import { NextResponse } from "next/server";
import Stripe from "stripe";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getBaseUrl(req) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    new URL(req.url).origin
  ).replace(/\/$/, "");
}

function generateTrackingToken() {
  return randomBytes(24).toString("hex");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

async function generateNextOrderNumber() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("order_number")
    .like("order_number", "EV-%")
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    throw new Error(error.message || "Failed to generate order number.");
  }

  let maxNumber = 10000;

  for (const row of data || []) {
    const match = String(row.order_number || "").match(/^EV-(\d+)$/i);
    if (match) {
      const parsed = Number(match[1]);
      if (Number.isFinite(parsed) && parsed > maxNumber) {
        maxNumber = parsed;
      }
    }
  }

  return `EV-${maxNumber + 1}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const baseUrl = getBaseUrl(req);

    const orderId = clean(body.orderId);

    const customer_name = clean(body.customerName || body.customer_name);
    const customer_email = clean(body.customerEmail || body.customer_email).toLowerCase();
    const customer_phone = clean(body.customerPhone || body.customer_phone);

    const shipping_name = clean(body.shippingName || body.shipping_name);
    const shipping_address_line1 = clean(body.shippingAddressLine1 || body.shipping_address_line1);
    const shipping_address_line2 = clean(body.shippingAddressLine2 || body.shipping_address_line2);
    const shipping_city = clean(body.shippingCity || body.shipping_city);
    const shipping_state = clean(body.shippingState || body.shipping_state);
    const shipping_postal_code = clean(body.shippingPostalCode || body.shipping_postal_code);
    const shipping_country = clean(body.shippingCountry || body.shipping_country || "US");

    const product_name = clean(body.productName || body.product_name);
    const size = clean(body.size);
    const paper = clean(body.paper);
    const finish = clean(body.finish);
    const sides = clean(body.sides);
    const quantity = toNumber(body.quantity, 0);
    const subtotal = toNumber(body.subtotal, 0);
    const shipping = toNumber(body.shipping, 0);
    const total = toNumber(body.total, subtotal + shipping);
    const notes = clean(body.notes);
    const file_name = clean(body.fileName || body.file_name);
    const artwork_url = clean(body.artworkUrl || body.artwork_url);

    if (!customer_name) {
      return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
    }

    if (!isValidEmail(customer_email)) {
      return NextResponse.json({ error: "A valid customer email is required." }, { status: 400 });
    }

    if (!customer_phone) {
      return NextResponse.json({ error: "Customer phone number is required." }, { status: 400 });
    }

    if (!shipping_name) {
      return NextResponse.json({ error: "Ship-to name is required." }, { status: 400 });
    }

    if (
      !shipping_address_line1 ||
      !shipping_city ||
      !shipping_state ||
      !shipping_postal_code ||
      !shipping_country
    ) {
      return NextResponse.json({ error: "Complete shipping address is required." }, { status: 400 });
    }

    if (!product_name) {
      return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    }

    if (!quantity || total <= 0) {
      return NextResponse.json({ error: "Quantity and total must be valid." }, { status: 400 });
    }

    if (!artwork_url) {
      return NextResponse.json({ error: "Artwork upload is required before checkout." }, { status: 400 });
    }

    const orderPayload = {
      customer_name,
      customer_email,
      customer_phone,
      shipping_name,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      product_name,
      size,
      paper,
      finish,
      sides,
      quantity,
      subtotal,
      shipping,
      total,
      notes,
      file_name,
      artwork_url,
    };

    let order = null;

    if (orderId) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .update(orderPayload)
        .eq("id", orderId)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json(
          { error: error.message || "Failed to update order before checkout." },
          { status: 500 }
        );
      }

      order = data;
    } else {
      const order_number = await generateNextOrderNumber();

      const { data, error } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number,
          ...orderPayload,
          status: "pending",
          tracking_token: generateTrackingToken(),
        })
        .select("*")
        .single();

      if (error) {
        return NextResponse.json(
          { error: error.message || "Failed to create order before checkout." },
          { status: 500 }
        );
      }

      order = data;
    }

    const successUrl = `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${encodeURIComponent(order.id)}`;
    const cancelUrl = `${baseUrl}/checkout`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email,
      billing_address_collection: "auto",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(total * 100),
            product_data: {
              name: product_name,
              description: [
                size || null,
                paper || null,
                finish || null,
                sides || null,
                quantity ? `Qty ${quantity}` : null,
              ]
                .filter(Boolean)
                .join(" • "),
            },
          },
        },
      ],
      metadata: {
        orderId: order.id,
        orderNumber: order.order_number || "",
        customerName: customer_name,
        customerEmail: customer_email,
        customerPhone: customer_phone,
        shippingName: shipping_name,
        shippingAddressLine1: shipping_address_line1,
        shippingAddressLine2: shipping_address_line2,
        shippingCity: shipping_city,
        shippingState: shipping_state,
        shippingPostalCode: shipping_postal_code,
        shippingCountry: shipping_country,
        productName: product_name,
        quantity: String(quantity),
        total: String(total),
      },
    });

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", order.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to save Stripe session." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      sessionUrl: session.url,
      checkoutUrl: session.url,
      sessionId: session.id,
      orderId: order.id,
      orderNumber: order.order_number,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Checkout session creation failed." },
      { status: 500 }
    );
  }
}
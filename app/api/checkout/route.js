import { NextResponse } from "next/server";
import Stripe from "stripe";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

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

async function sendOrderConfirmationEmail(order, baseUrl) {
  if (!process.env.RESEND_API_KEY || !order?.customer_email) {
    return;
  }

  const trackUrl = order?.tracking_token
    ? `${baseUrl}/track/${order.tracking_token}`
    : `${baseUrl}/track`;

  const total = Number(order?.total || 0);
  const formattedTotal = Number.isFinite(total) ? `$${total.toFixed(2)}` : "Unavailable";

  const html = `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
        <div style="background:#ffffff;border:1px solid #dbe6f3;border-radius:24px;overflow:hidden;box-shadow:0 16px 40px rgba(15,43,82,0.10);">
          <div style="background:linear-gradient(135deg,#2457f5,#0e98ff);padding:28px 24px;text-align:center;color:#ffffff;">
            <h1 style="margin:0;font-size:30px;line-height:1.2;font-weight:900;">Order Confirmed</h1>
            <p style="margin:10px 0 0;font-size:15px;color:#eaf2ff;">Thank you for your order with EnVision Direct.</p>
          </div>

          <div style="padding:26px 24px;">
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
              Hi ${order.customer_name || "there"},
            </p>

            <p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#334155;">
              We received your order and artwork. Your confirmation number is:
            </p>

            <div style="border:1px solid #dbe6f3;background:#f8fbff;border-radius:18px;padding:18px;margin-bottom:22px;text-align:center;">
              <div style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">Order Number</div>
              <div style="margin-top:6px;font-size:28px;font-weight:900;color:#071b3a;">
                ${order.order_number || "Order Confirmed"}
              </div>
            </div>

            <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;margin-bottom:18px;">
              <h2 style="margin:0 0 14px;font-size:18px;color:#071b3a;">Order Details</h2>

              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:8px 0;color:#64748b;">Product</td>
                  <td style="padding:8px 0;text-align:right;font-weight:700;color:#0f172a;">${order.product_name || "Unavailable"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;">Size</td>
                  <td style="padding:8px 0;text-align:right;font-weight:700;color:#0f172a;">${order.size || "Unavailable"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;">Paper</td>
                  <td style="padding:8px 0;text-align:right;font-weight:700;color:#0f172a;">${order.paper || "Unavailable"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;">Finish</td>
                  <td style="padding:8px 0;text-align:right;font-weight:700;color:#0f172a;">${order.finish || "Unavailable"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;">Sides</td>
                  <td style="padding:8px 0;text-align:right;font-weight:700;color:#0f172a;">${order.sides || "Unavailable"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;">Quantity</td>
                  <td style="padding:8px 0;text-align:right;font-weight:700;color:#0f172a;">${order.quantity || "Unavailable"}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0;color:#64748b;border-top:1px solid #e2e8f0;">Total</td>
                  <td style="padding:12px 0 0;text-align:right;font-weight:900;color:#0f172a;border-top:1px solid #e2e8f0;">${formattedTotal}</td>
                </tr>
              </table>
            </div>

            <div style="border:1px solid #dbeafe;background:#eff6ff;border-radius:18px;padding:18px;margin-bottom:22px;">
              <h2 style="margin:0 0 10px;font-size:18px;color:#071b3a;">Artwork Received</h2>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;">
                ${order.file_name || "Uploaded artwork file"}
              </p>
            </div>

            <div style="text-align:center;margin:26px 0;">
              <a href="${trackUrl}" style="display:inline-block;background:#0b5cff;color:#ffffff;text-decoration:none;font-weight:900;padding:15px 24px;border-radius:14px;font-size:15px;">
                Track Your Order
              </a>
            </div>

            <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
              We will notify you when your order moves into production and again when it ships.
            </p>
          </div>
        </div>

        <p style="text-align:center;margin:18px 0 0;font-size:12px;color:#64748b;">
          EnVision Direct
        </p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "EnVision Direct <orders@envisiondirect.net>",
    to: order.customer_email,
    subject: `Order Confirmed - ${order.order_number || "EnVision Direct"}`,
    html,
  });
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
        .update({
          ...orderPayload,
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
        })
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

    await sendOrderConfirmationEmail(order, baseUrl);

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
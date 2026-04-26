import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const ALLOWED_STATUSES = ["pending", "paid", "printing", "shipped", "delivered"];

function generateTrackingToken() {
  return randomBytes(24).toString("hex");
}

function getCarrierTrackingLink(carrier, trackingNumber) {
  if (!trackingNumber) return "";

  const num = encodeURIComponent(trackingNumber.trim());
  const normalized = (carrier || "").toLowerCase();

  if (normalized === "ups") {
    return `https://www.ups.com/track?tracknum=${num}`;
  }

  if (normalized === "usps") {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${num}`;
  }

  if (normalized === "fedex") {
    return `https://www.fedex.com/fedextrack/?trknbr=${num}`;
  }

  return "";
}

function getBaseUrl(req) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    new URL(req.url).origin
  ).replace(/\/$/, "");
}

async function ensureTrackingToken(orderId, existingToken) {
  if (existingToken) return existingToken;

  const newToken = generateTrackingToken();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ tracking_token: newToken })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message || "Failed to create tracking token.");
  }

  return newToken;
}

function buildShippedEmailHtml(order, trackingUrl, carrierLink, baseUrl) {
  const logoUrl = `${baseUrl}/images/logo-hero.png`;

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
        <div style="background:#ffffff;border:1px solid #dbe6f3;border-radius:24px;overflow:hidden;box-shadow:0 16px 40px rgba(15,43,82,0.12);">
          <div style="background:linear-gradient(135deg,#2457f5,#0e98ff);padding:30px 24px;text-align:center;color:white;">
            <img
              src="${logoUrl}"
              alt="EnVision Direct"
              width="290"
              style="display:block;margin:0 auto 18px;max-width:290px;width:100%;height:auto;border-radius:8px;"
            />

            <h1 style="margin:0;font-size:32px;line-height:1.2;color:#ffffff;">
              Your Order Has Shipped
            </h1>

            <p style="margin:12px 0 0;color:#eaf2ff;font-size:15px;line-height:1.6;">
              ${order.customer_name || "Customer"}, your order is on the way.
            </p>
          </div>

          <div style="padding:26px 24px;">
            <div style="background:#f8fbff;border:1px solid #dbe6f3;border-radius:18px;padding:18px;text-align:center;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">
                Order Number
              </div>
              <div style="margin-top:6px;font-size:28px;font-weight:900;color:#071b3a;">
                ${order.order_number || "Order Shipped"}
              </div>
            </div>

            <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;margin-bottom:18px;">
              <h2 style="margin:0 0 14px;font-size:20px;color:#071b3a;">Shipment Details</h2>

              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:9px 0;color:#64748b;">Product</td>
                  <td style="padding:9px 0;text-align:right;font-weight:700;">${order.product_name || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;color:#64748b;">Carrier</td>
                  <td style="padding:9px 0;text-align:right;font-weight:700;">${order.tracking_carrier || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;color:#64748b;">Tracking Number</td>
                  <td style="padding:9px 0;text-align:right;font-weight:700;">${order.tracking_number || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;color:#64748b;">Status</td>
                  <td style="padding:9px 0;text-align:right;font-weight:700;color:#2563eb;">Shipped</td>
                </tr>
              </table>
            </div>

            <div style="border:1px solid #dcfce7;background:#f0fdf4;border-radius:18px;padding:18px;margin-bottom:22px;">
              <h2 style="margin:0 0 10px;font-size:20px;color:#166534;">What Happens Next</h2>
              <div style="font-size:15px;line-height:1.8;color:#166534;font-weight:700;">
                <div>✓ Your order has shipped</div>
                <div>✓ Tracking information is available</div>
                <div>✓ Delivery updates will depend on the carrier</div>
              </div>
            </div>

            <div style="text-align:center;margin:24px 0 8px;">
              <a href="${trackingUrl}" style="display:inline-block;background:#0b5cff;color:white;text-decoration:none;padding:15px 24px;border-radius:14px;font-weight:900;font-size:15px;">
                Track Your Order
              </a>
            </div>

            ${
              carrierLink
                ? `<div style="text-align:center;margin-top:12px;">
                    <a href="${carrierLink}" style="color:#2563eb;font-weight:800;text-decoration:none;">
                      Track directly with carrier
                    </a>
                  </div>`
                : ""
            }

            <p style="margin:24px 0 0;text-align:center;color:#64748b;font-size:13px;line-height:1.6;">
              You can use the secure tracking link anytime to check your order status.<br/>
              Thank you for choosing EnVision Direct.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildDeliveredEmailHtml(order, trackingUrl, baseUrl) {
  const logoUrl = `${baseUrl}/images/logo-hero.png`;

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
        <div style="background:#ffffff;border:1px solid #dbe6f3;border-radius:24px;overflow:hidden;box-shadow:0 16px 40px rgba(15,43,82,0.12);">
          <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:30px 24px;text-align:center;color:white;">
            <img
              src="${logoUrl}"
              alt="EnVision Direct"
              width="290"
              style="display:block;margin:0 auto 18px;max-width:290px;width:100%;height:auto;border-radius:8px;"
            />

            <div style="width:54px;height:54px;margin:0 auto 14px;border-radius:50%;background:#ffffff;color:#16a34a;font-size:34px;font-weight:900;line-height:54px;">
              ✓
            </div>

            <h1 style="margin:0;font-size:32px;line-height:1.2;color:#ffffff;">
              Order Delivered
            </h1>

            <p style="margin:12px 0 0;color:#ecfdf5;font-size:15px;line-height:1.6;">
              ${order.customer_name || "Customer"}, your order has been marked as delivered.
            </p>
          </div>

          <div style="padding:26px 24px;">
            <div style="background:#f8fbff;border:1px solid #dbe6f3;border-radius:18px;padding:18px;text-align:center;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">
                Order Number
              </div>
              <div style="margin-top:6px;font-size:28px;font-weight:900;color:#071b3a;">
                ${order.order_number || "Order Delivered"}
              </div>
            </div>

            <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;margin-bottom:18px;">
              <h2 style="margin:0 0 14px;font-size:20px;color:#071b3a;">Delivery Summary</h2>

              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:9px 0;color:#64748b;">Product</td>
                  <td style="padding:9px 0;text-align:right;font-weight:700;">${order.product_name || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:9px 0;color:#64748b;">Status</td>
                  <td style="padding:9px 0;text-align:right;font-weight:700;color:#16a34a;">Delivered</td>
                </tr>
                <tr>
                  <td style="padding:14px 0 0;color:#0f172a;font-size:18px;font-weight:800;border-top:1px solid #e2e8f0;">Total</td>
                  <td style="padding:14px 0 0;text-align:right;color:#0f172a;font-size:22px;font-weight:900;border-top:1px solid #e2e8f0;">
                    $${Number(order.total || 0).toFixed(2)}
                  </td>
                </tr>
              </table>
            </div>

            <div style="border:1px solid #dcfce7;background:#f0fdf4;border-radius:18px;padding:18px;margin-bottom:22px;text-align:center;">
              <h2 style="margin:0 0 10px;font-size:20px;color:#166534;">Thank You For Your Business</h2>
              <p style="margin:0;color:#166534;font-size:15px;line-height:1.7;font-weight:700;">
                We appreciate your order with EnVision Direct.
              </p>
            </div>

            <div style="text-align:center;margin:24px 0 8px;">
              <a href="${trackingUrl}" style="display:inline-block;background:#0b5cff;color:white;text-decoration:none;padding:15px 24px;border-radius:14px;font-weight:900;font-size:15px;">
                View Order Status
              </a>
            </div>

            <p style="margin:24px 0 0;text-align:center;color:#64748b;font-size:13px;line-height:1.6;">
              Thank you for choosing EnVision Direct.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function sendStatusEmail(req, order, status) {
  if (!resend) return;
  if (!order?.customer_email) return;

  const trackingToken = await ensureTrackingToken(order.id, order.tracking_token);
  const baseUrl = getBaseUrl(req);
  const trackingUrl = `${baseUrl}/track?token=${trackingToken}`;
  const carrierLink = getCarrierTrackingLink(
    order.tracking_carrier,
    order.tracking_number
  );

  if (status === "shipped") {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number || ""} has shipped`,
      html: buildShippedEmailHtml(
        { ...order, status: "shipped", tracking_token: trackingToken },
        trackingUrl,
        carrierLink,
        baseUrl
      ),
    });
  }

  if (status === "delivered") {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "EnVision Direct <orders@envisiondirect.net>",
      to: order.customer_email,
      subject: `Your order ${order.order_number || ""} was delivered`,
      html: buildDeliveredEmailHtml(
        { ...order, status: "delivered", tracking_token: trackingToken },
        trackingUrl,
        baseUrl
      ),
    });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const status = (body?.status || "").toLowerCase().trim();
    const tracking_number =
      typeof body?.tracking_number === "string" && body.tracking_number.trim()
        ? body.tracking_number.trim()
        : null;
    const tracking_carrier =
      typeof body?.tracking_carrier === "string" && body.tracking_carrier.trim()
        ? body.tracking_carrier.trim()
        : null;

    if (!id) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const updatePayload = {
      status,
      tracking_number,
      tracking_carrier,
    };

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to update order." },
        { status: 500 }
      );
    }

    try {
      if (status === "shipped" || status === "delivered") {
        await sendStatusEmail(req, updatedOrder, status);
      }
    } catch (emailError) {
      return NextResponse.json(
        {
          order: updatedOrder,
          warning:
            emailError.message || "Order updated, but email failed to send.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
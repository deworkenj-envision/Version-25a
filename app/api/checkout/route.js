import { NextResponse } from "next/server";
import Stripe from "stripe";
import { calculatePrice } from "../../../lib/pricing";
import { calculateShipping } from "../../../lib/shipping";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ARTWORK_BUCKET = "order-artwork";

function toSafeString(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function toSafeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function buildArtworkUrl(value) {
  if (!value || typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return "";

  return `${supabaseUrl}/storage/v1/object/public/${ARTWORK_BUCKET}/${trimmed}`;
}

function getFileNameFromPath(value) {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  const clean = trimmed.split("?")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || "";
}

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_SITE_URL" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const productName = toSafeString(body.productName);
    const quantity = toSafeNumber(body.quantity, 0);

    const customerName = toSafeString(body.customerName);
    const customerEmail = toSafeString(body.customerEmail);

    const paper = toSafeString(body.paper);
    const finish = toSafeString(body.finish);
    const size = toSafeString(body.size);
    const sides = toSafeString(body.sides);
    const notes = toSafeString(body.notes);

    const rawArtworkPath =
      toSafeString(body.filePath) ||
      toSafeString(body.file_path) ||
      toSafeString(body.artwork_path) ||
      toSafeString(body.artwork);

    const rawArtworkUrl =
      toSafeString(body.artworkUrl) ||
      toSafeString(body.publicUrl) ||
      rawArtworkPath;

    const finalArtworkUrl = buildArtworkUrl(rawArtworkUrl);

    const fileName =
      toSafeString(body.fileName) ||
      getFileNameFromPath(rawArtworkPath) ||
      getFileNameFromPath(finalArtworkUrl);

    if (!finalArtworkUrl) {
      return NextResponse.json(
        { error: "Artwork upload is required before checkout." },
        { status: 400 }
      );
    }

    if (!productName) {
      return NextResponse.json(
        { error: "Missing product name" },
        { status: 400 }
      );
    }

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    const priceData = calculatePrice({
      productName,
      quantity,
      paper,
      finish,
      sides,
    });

    const subtotal = Number(priceData.subtotal || 0);
    const shipping = Number(calculateShipping(productName, quantity) || 0);
    const total = Number((subtotal + shipping).toFixed(2));

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: "Invalid total" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: `${productName} Order`,
              description: [
                `Quantity: ${quantity}`,
                paper ? `Paper: ${paper}` : null,
                finish ? `Finish: ${finish}` : null,
                size ? `Size: ${size}` : null,
                sides ? `Sides: ${sides}` : null,
              ]
                .filter(Boolean)
                .join(" • "),
            },
            unit_amount: Math.round(total * 100),
          },
        },
      ],
      metadata: {
        productName: toSafeString(productName),
        quantity: toSafeString(quantity),
        total: toSafeString(total),
        subtotal: toSafeString(subtotal),
        shipping: toSafeString(shipping),

        customerName: toSafeString(customerName),
        customerEmail: toSafeString(customerEmail),

        paper: toSafeString(paper),
        finish: toSafeString(finish),
        size: toSafeString(size),
        sides: toSafeString(sides),
        notes: toSafeString(notes),

        artworkUrl: toSafeString(finalArtworkUrl),
        fileName: toSafeString(fileName),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error?.message || null,
      },
      { status: 500 }
    );
  }
}
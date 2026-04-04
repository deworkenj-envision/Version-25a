import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      productName,
      quantity,
      total,
      customerName,
      customerEmail,
      artworkUrl,
      artworkPath,
      notes,
    } = body;

    if (!productName) {
      return NextResponse.json(
        { error: "Missing product name" },
        { status: 400 }
      );
    }

    if (!quantity || Number(quantity) < 1) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    if (total === undefined || total === null || Number(total) <= 0) {
      return NextResponse.json(
        { error: "Invalid total" },
        { status: 400 }
      );
    }

    // ✅ SAVE ORDER TO DATABASE FIRST
    const { error: insertError } = await supabaseAdmin.from("orders").insert([
      {
        product_name: productName,
        quantity: Number(quantity),
        total: Number(total),
        customer_name: customerName,
        customer_email: customerEmail,
        artwork_url: artworkUrl || "",
        artwork_path: artworkPath || "",
        notes: notes || "",
        status: "pending",
      },
    ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    // ✅ STRIPE SESSION
    const productData = {
      name: productName,
    };

    if (notes && notes.trim() !== "") {
      productData.description = notes.trim();
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: productData,
            unit_amount: Math.round((Number(total) / Number(quantity)) * 100),
          },
          quantity: Number(quantity),
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
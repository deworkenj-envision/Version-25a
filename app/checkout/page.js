"use client";

import { useState } from "react";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  return toNumber(value).toFixed(2);
}

export default function CheckoutPage({ searchParams }) {
  const params = searchParams;

  const productName = params?.productName || "Business Cards";
  const quantity = params?.quantity || "100";
  const size = params?.size || "—";
  const paper = params?.paper || "Standard";
  const finish = params?.finish || "Matte";
  const sides = params?.sides || "Front Only";

  const notes = params?.notes || "";
  const artworkUrl = params?.artworkUrl || "";
  const fileName = params?.fileName || "";
  const productImage = params?.productImage || "";

  const subtotal = toNumber(params?.subtotal);
  const shipping = 12.95;
  const total = subtotal + shipping;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!customerName || !customerEmail) {
      setError("Please enter your name and email.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          productName,
          size,
          paper,
          finish,
          sides,
          quantity,
          subtotal,
          shipping,
          total,
          notes,
          fileName,
          artworkUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed.");
      }

      // 🔥 redirect to Stripe
      window.location.href = data.url;

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-6 text-4xl font-bold">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

          {/* LEFT */}
          <div className="bg-white p-6 rounded-xl shadow">

            {productImage && (
              <img
                src={productImage}
                className="mb-6 h-40 w-full object-cover rounded"
              />
            )}

            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

            <div className="space-y-2 text-sm">
              <p><b>Product:</b> {productName}</p>
              <p><b>Size:</b> {size}</p>
              <p><b>Paper:</b> {paper}</p>
              <p><b>Finish:</b> {finish}</p>
              <p><b>Sides:</b> {sides}</p>
              <p><b>Quantity:</b> {quantity}</p>
            </div>

            {/* CUSTOMER FORM */}
            <h2 className="mt-8 text-xl font-semibold">Your Info</h2>

            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border p-3 rounded"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border p-3 rounded"
              />
            </div>

            {error && (
              <p className="mt-4 text-red-500 text-sm">{error}</p>
            )}
          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-semibold mb-4">Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${formatMoney(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${formatMoney(shipping)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>${formatMoney(total)}</span>
              </div>
            </div>

            {/* 🔥 STRIPE BUTTON */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Redirecting..." : "Pay Securely"}
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}